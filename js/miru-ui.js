/* ──────────────────────────────────────────────────────────
   MIRU UI 2.0 — shared nav, footer, cart drawer, product cards
   Cart format stays {name, price, qty} in sessionStorage('miru_cart')
   so checkout.html keeps working unchanged.
   ────────────────────────────────────────────────────────── */
(function () {
  const CATS = [
    { key: 'beauty', name: '뷰티', href: 'beauty.html' },
    { key: 'men', name: '맨즈', href: 'men.html' },
    { key: 'lifestyle', name: '라이프', href: 'lifestyle.html' },
    { key: 'pet', name: '반려동물', href: 'pet.html' },
    { key: 'sports', name: '스포츠', href: 'sports.html' },
  ];
  const page = document.body.dataset.page || '';

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const won = n => '₩' + Number(n).toLocaleString('ko-KR');

  /* ── cart ── */
  const Cart = {
    get() { try { return JSON.parse(sessionStorage.getItem('miru_cart') || '[]'); } catch (e) { return []; } },
    save(c) { try { sessionStorage.setItem('miru_cart', JSON.stringify(c)); } catch (e) {} render(); },
    add(name, price, qty = 1) {
      const c = this.get(); const i = c.findIndex(x => x.name === name);
      if (i >= 0) c[i].qty = (c[i].qty || 1) + qty; else c.push({ name, price, qty });
      this.save(c); toast('장바구니에 담았습니다');
    },
    setQty(i, q) { const c = this.get(); if (!c[i]) return; c[i].qty = Math.max(1, q); this.save(c); },
    remove(i) { const c = this.get(); c.splice(i, 1); this.save(c); },
    count() { return this.get().reduce((s, i) => s + (i.qty || 1), 0); },
    total() { return this.get().reduce((s, i) => s + i.price * (i.qty || 1), 0); },
  };

  /* ── chrome: nav, mobile menu, footer, drawer, toast, modal ── */
  function chrome() {
    const nav = document.createElement('nav');
    nav.className = 'gnav'; nav.setAttribute('aria-label', '주요 메뉴');
    nav.innerHTML = `<div class="wrap">
      <a class="logo" href="index.html" aria-label="MIRU 홈">MIRU</a>
      <div class="menu">${CATS.map(c => `<a href="${c.href}"${page === c.key ? ' aria-current="page"' : ''}>${c.name}</a>`).join('')}</div>
      <div class="tools">
        <a class="icon-btn" href="${page === 'home' ? '#news' : 'index.html#news'}">뉴스레터</a>
        <button class="icon-btn" type="button" data-open-cart aria-label="장바구니 열기">장바구니 <span class="cart-count" data-cart-count></span></button>
        <button class="icon-btn menu-toggle" type="button" aria-label="메뉴" aria-expanded="false" data-menu-toggle>메뉴</button>
      </div></div>`;
    const mm = document.createElement('div');
    mm.className = 'mobile-menu'; mm.innerHTML = CATS.map(c => `<a href="${c.href}">${c.name}</a>`).join('') + '<a href="index.html#news">뉴스레터</a>';
    document.body.prepend(mm); document.body.prepend(nav);

    const foot = document.createElement('footer');
    foot.className = 'footer';
    foot.innerHTML = `<div class="wrap">
      <div class="logo">MIRU</div>
      <div class="cols">
        <div><h5>쇼핑</h5>${CATS.map(c => `<a href="${c.href}">${c.name}</a>`).join('')}</div>
        <div><h5>고객지원</h5><a href="mypage.html">주문 조회</a><a href="checkout.html">결제</a><a href="auth.html">로그인</a></div>
        <div><h5>MIRU</h5><a href="index.html#story">브랜드 스토리</a><a href="index.html#news">뉴스레터</a></div>
      </div>
      <p class="legal">© 2026 MIRU · 오더베이스 위탁판매 · 토스페이먼츠 결제<br>상품 이미지는 공급사 실사진 등록 전까지 준비중으로 표시됩니다.</p>
    </div>`;
    document.body.append(foot);

    const shell = document.createElement('div');
    shell.innerHTML = `
      <div class="scrim" data-close-cart></div>
      <aside class="drawer" role="dialog" aria-modal="true" aria-label="장바구니">
        <header><h3>장바구니</h3><button class="x" type="button" data-close-cart aria-label="닫기">✕</button></header>
        <div class="items" data-cart-items></div>
        <footer><div class="sum"><span>합계</span><b data-cart-total>₩0</b></div>
          <a class="btn btn-primary btn-block btn-lg" href="checkout.html" data-checkout>결제하기</a></footer>
      </aside>
      <div class="modal" data-modal role="dialog" aria-modal="true"><div class="box">
        <p class="eyebrow">COMING SOON</p><h3 class="h3" style="margin-top:10px" data-modal-title>시연 영상 준비중</h3>
        <p data-modal-body>AI 모델이 실제 루틴을 보여주는 15초 시연 영상을 제작하고 있습니다.</p>
        <button class="btn btn-primary" type="button" data-close-modal>닫기</button></div></div>
      <div class="toast" role="status" aria-live="polite" data-toast></div>`;
    document.body.append(...shell.children);

    document.addEventListener('click', e => {
      const t = e.target.closest('[data-open-cart],[data-close-cart],[data-menu-toggle],[data-close-modal],[data-open-modal],[data-add],[data-qty],[data-rm],[data-checkout]');
      if (!t) return;
      if (t.matches('[data-open-cart]')) openCart(true);
      else if (t.matches('[data-close-cart]')) openCart(false);
      else if (t.matches('[data-menu-toggle]')) { const o = mm.classList.toggle('open'); t.setAttribute('aria-expanded', o); }
      else if (t.matches('[data-open-modal]')) document.querySelector('[data-modal]').classList.add('open');
      else if (t.matches('[data-close-modal]')) document.querySelector('[data-modal]').classList.remove('open');
      else if (t.matches('[data-add]')) { e.preventDefault(); Cart.add(t.dataset.name, +t.dataset.price, +(t.dataset.qty || 1)); }
      else if (t.matches('[data-qty]')) { const i = +t.dataset.i; const c = Cart.get(); Cart.setQty(i, (c[i].qty || 1) + (+t.dataset.qty)); }
      else if (t.matches('[data-rm]')) Cart.remove(+t.dataset.i);
      else if (t.matches('[data-checkout]') && !Cart.count()) { e.preventDefault(); toast('장바구니가 비어 있습니다'); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { openCart(false); document.querySelector('[data-modal]')?.classList.remove('open'); } });
  }

  function openCart(open) {
    document.querySelector('.drawer').classList.toggle('open', open);
    document.querySelector('.scrim').classList.toggle('open', open);
  }

  function render() {
    const n = Cart.count();
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = n; el.classList.toggle('show', n > 0); });
    const box = document.querySelector('[data-cart-items]'); if (!box) return;
    const c = Cart.get();
    box.innerHTML = c.length ? c.map((it, i) => `<div class="citem">
        <span class="n">${esc(it.name)}</span><span class="p">${won(it.price * (it.qty || 1))}</span>
        <span class="ctl"><button type="button" data-qty="-1" data-i="${i}" aria-label="수량 줄이기">−</button>${it.qty || 1}<button type="button" data-qty="1" data-i="${i}" aria-label="수량 늘리기">+</button></span>
        <button class="rm" type="button" data-rm data-i="${i}">삭제</button></div>`).join('')
      : '<div class="empty">장바구니가 비어 있습니다</div>';
    document.querySelector('[data-cart-total]').textContent = won(Cart.total());
  }

  let tt;
  function toast(msg) {
    const el = document.querySelector('[data-toast]'); if (!el) return;
    el.textContent = msg; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ── products ── */
  let _products;
  function loadProducts() {
    if (!_products) _products = fetch('data/products.json').then(r => r.json()).then(d => d.products);
    return _products;
  }
  // Only real supplier photos are shown; generated/stock placeholders are treated as "no photo yet".
  const hasPhoto = p => p.image && !/picsum\.photos/.test(p.image);
  function imageHTML(p) {
    return hasPhoto(p)
      ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">`
      : `<div class="ph"><span><b>MIRU</b>이미지 준비중</span></div>`;
  }
  function cardHTML(p) {
    const url = `product.html?slug=${encodeURIComponent(p.slug)}`;
    return `<article class="pcard">
      <a class="pimg" href="${url}">${imageHTML(p)}${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}</a>
      <a class="pname" href="${url}">${esc(p.name)}</a>
      <span class="pprice">${won(p.price)}</span>
      <button class="btn btn-ghost add" type="button" data-add data-name="${esc(p.name)}" data-price="${p.price}">담기</button>
    </article>`;
  }

  /* ── reveal ── */
  function reveal() {
    const els = document.querySelectorAll('.rise');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    els.forEach(e => io.observe(e));
    setTimeout(() => els.forEach(e => e.classList.add('in')), 1800); // never leave content hidden
  }

  chrome(); render(); reveal();
  window.MIRU = { Cart, CATS, won, esc, toast, loadProducts, cardHTML, imageHTML, hasPhoto, openCart };
})();
