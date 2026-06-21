// ──────────────────────────────────────────────────────────
//  MIRU Core — Firebase 초기화 + Auth + Cart + Toast
//  모든 페이지에서 <script src="js/miru-core.js" type="module"> 로 로드
// ──────────────────────────────────────────────────────────
import { FIREBASE_CONFIG, ADMIN_EMAILS } from './firebase-config.js';

// Firebase SDK (CDN compat mode)
const _loadScript = src => new Promise(r => {
  const s = document.createElement('script'); s.src = src; s.onload = r;
  document.head.appendChild(s);
});

async function initFirebase() {
  if (window.firebase) return;
  await _loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
  await _loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js');
  await _loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js');
  firebase.initializeApp(FIREBASE_CONFIG);
}

export async function getFirebase() {
  await initFirebase();
  return { auth: firebase.auth(), db: firebase.firestore() };
}

// ── AUTH STATE ──────────────────────────────────────────
export function onAuthReady(cb) {
  initFirebase().then(() => firebase.auth().onAuthStateChanged(cb));
}

export async function signOut() {
  await initFirebase();
  return firebase.auth().signOut();
}

export function isAdmin(user) {
  return user && ADMIN_EMAILS.includes(user.email);
}

// ── CART (sessionStorage) ────────────────────────────────
export const Cart = {
  get()      { return JSON.parse(sessionStorage.getItem('miru_cart') || '[]'); },
  save(c)    { sessionStorage.setItem('miru_cart', JSON.stringify(c)); },
  add(name, price, qty = 1) {
    const c = this.get();
    const i = c.findIndex(x => x.name === name);
    if (i >= 0) c[i].qty = (c[i].qty || 1) + qty;
    else c.push({ name, price, qty });
    this.save(c); return c;
  },
  remove(i)  { const c = this.get(); c.splice(i, 1); this.save(c); return c; },
  clear()    { sessionStorage.removeItem('miru_cart'); },
  total()    { return this.get().reduce((s, i) => s + i.price * (i.qty || 1), 0); },
  count()    { return this.get().reduce((s, i) => s + (i.qty || 1), 0); }
};

// ── TOAST ────────────────────────────────────────────────
export function toast(msg, type = 'info') {
  let el = document.getElementById('miru-toast');
  if (!el) {
    el = document.createElement('div'); el.id = 'miru-toast';
    el.style.cssText = `position:fixed;bottom:2rem;right:1.5rem;padding:.7rem 1.2rem;
      border-radius:12px;font-size:.83rem;z-index:9999;transition:.3s;
      transform:translateY(120px);opacity:0;font-family:inherit;max-width:280px;line-height:1.4`;
    document.body.appendChild(el);
  }
  const colors = { info:'rgba(200,169,107,.95)', success:'rgba(76,175,146,.95)', error:'rgba(229,115,115,.95)' };
  el.style.background = colors[type] || colors.info;
  el.style.color = type === 'info' ? '#000' : '#fff';
  el.textContent = msg;
  el.style.transform = 'translateY(0)'; el.style.opacity = '1';
  clearTimeout(el._t); el._t = setTimeout(() => {
    el.style.transform = 'translateY(120px)'; el.style.opacity = '0';
  }, 2800);
}

// ── UPDATE NAV CART BADGE ─────────────────────────────────
export function updateNavCart() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = n || '';
    el.style.display = n ? 'inline-flex' : 'none';
  });
}
