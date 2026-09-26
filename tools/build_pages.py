#!/usr/bin/env python3
"""Generate MIRU category pages, the product detail page and legacy redirects.

Run from the repo root:  python3 tools/build_pages.py
Every generated page shares css/miru.css and js/miru-ui.js, so a design change
is made once in those files or in the templates below.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

HEAD = """<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#000000">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="manifest" href="manifest.json">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap">
<link rel="stylesheet" href="css/miru.css">
<script>document.documentElement.classList.add('js');if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');</script>
</head>"""

CATEGORIES = [
    ("beauty", "뷰티", "피부 루틴을 완성하는 홈케어 디바이스와 스킨케어."),
    ("men", "맨즈", "매일의 자기관리를 완성하는 남성 셀프케어."),
    ("lifestyle", "라이프", "매일의 공간을 가볍게 바꾸는 생활 아이템."),
    ("pet", "반려동물", "함께 사는 매일을 더 편하게 만드는 반려 용품."),
    ("sports", "스포츠", "집에서도 꾸준하게, 몸을 위한 운동 도구."),
]

CATEGORY_BODY = """
<body data-page="{key}">
<main>
  <header class="wrap cat-head">
    <p class="crumb"><a href="index.html">홈</a> › {name}</p>
    <h1 class="h1" style="margin-top:14px">{name}</h1>
    <p class="lead" style="margin-top:12px">{tagline} <span class="tnum" id="catCount"></span></p>
  </header>

  <div class="filterbar">
    <div class="wrap">
      <div class="chips scroll" role="group" aria-label="가격대">
        <button class="chip" type="button" data-price="all" aria-pressed="true">전체</button>
        <button class="chip" type="button" data-price="u20" aria-pressed="false">2만원 미만</button>
        <button class="chip" type="button" data-price="u50" aria-pressed="false">2~5만원</button>
        <button class="chip" type="button" data-price="o50" aria-pressed="false">5만원 이상</button>
      </div>
      <div class="right">
        <label for="q" style="position:absolute;left:-9999px">상품 검색</label>
        <input class="search" id="q" type="search" placeholder="{name} 상품 검색">
        <label for="sort" style="position:absolute;left:-9999px">정렬</label>
        <select class="select" id="sort">
          <option value="rec">추천순</option>
          <option value="low">낮은 가격순</option>
          <option value="high">높은 가격순</option>
          <option value="name">이름순</option>
        </select>
      </div>
    </div>
  </div>

  <section class="section" style="padding-top:40px" aria-label="{name} 상품 목록">
    <div class="wrap">
      <div class="pgrid" id="grid" aria-live="polite"></div>
      <div class="more"><button class="btn btn-ghost" type="button" id="more" hidden>더 보기</button></div>
    </div>
  </section>
</main>

<script src="js/miru-ui.js"></script>
<script>
(function(){{
  const {{loadProducts, cardHTML}} = window.MIRU;
  const CAT = '{key}', STEP = 12;
  const grid = document.getElementById('grid'), more = document.getElementById('more'), count = document.getElementById('catCount');
  const q = document.getElementById('q'), sort = document.getElementById('sort');
  const inPrice = {{all:()=>true, u20:p=>p.price<20000, u50:p=>p.price>=20000&&p.price<50000, o50:p=>p.price>=50000}};
  const sorters = {{rec:(a,b)=>(b.badge==='BEST')-(a.badge==='BEST')||(b.badge==='NEW')-(a.badge==='NEW'), low:(a,b)=>a.price-b.price, high:(a,b)=>b.price-a.price, name:(a,b)=>a.name.localeCompare(b.name,'ko')}};
  let all = [], price = 'all', shown = STEP;
  function draw(){{
    const term = q.value.trim().toLowerCase();
    const list = all.filter(p => inPrice[price](p) && (!term || p.name.toLowerCase().includes(term))).sort(sorters[sort.value]);
    grid.innerHTML = list.length ? list.slice(0, shown).map(cardHTML).join('') : '<p class="sub" style="grid-column:1/-1;padding:48px 0;text-align:center">조건에 맞는 상품이 없습니다.</p>';
    more.hidden = list.length <= shown;
    more.textContent = '더 보기 (' + Math.min(shown, list.length) + '/' + list.length + ')';
  }}
  document.querySelector('.filterbar .chips').addEventListener('click', e => {{
    const b = e.target.closest('[data-price]'); if (!b) return;
    price = b.dataset.price; shown = STEP;
    document.querySelectorAll('[data-price]').forEach(x => x.setAttribute('aria-pressed', x === b));
    draw();
  }});
  q.addEventListener('input', () => {{ shown = STEP; draw(); }});
  sort.addEventListener('change', draw);
  more.addEventListener('click', () => {{ shown += STEP; draw(); }});
  loadProducts().then(ps => {{ all = ps.filter(p => p.category === CAT); count.textContent = '· ' + all.length + '종'; draw(); }})
    .catch(() => {{ grid.innerHTML = '<p class="sub">상품을 불러오지 못했습니다. 새로고침해 주세요.</p>'; }});
}})();
</script>
</body>
</html>
"""

PRODUCT_BODY = """
<body data-page="product">
<main>
  <div class="wrap">
    <div class="pdp" id="pdp">
      <div class="gallery"><div class="main pimg" id="gMain"></div></div>
      <div class="info" id="info">
        <p class="crumb" id="crumb"><a href="index.html">홈</a></p>
        <p class="eyebrow" id="eyebrow">MIRU</p>
        <h1 class="h2" id="pName">상품을 불러오는 중…</h1>
        <p class="price-lg tnum" id="pPrice"></p>
        <div class="facts" id="facts"></div>
        <p class="sub" id="pDesc" style="max-width:52ch"></p>
        <div class="divider"></div>
        <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
          <div class="qty" role="group" aria-label="수량">
            <button type="button" id="minus" aria-label="수량 줄이기">−</button>
            <output id="qtyOut" aria-live="polite">1</output>
            <button type="button" id="plus" aria-label="수량 늘리기">+</button>
          </div>
          <span class="total tnum" id="pTotal"></span>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary btn-lg" type="button" id="buyNow" style="flex:1">구매하기</button>
          <button class="btn btn-ghost btn-lg" type="button" id="addCart">장바구니</button>
        </div>
        <p class="caption">토스페이먼츠 안전결제 · 결제 후 3~5 영업일 내 공급사 직배송</p>
      </div>
    </div>
  </div>

  <section class="dark" aria-label="브랜드 약속">
    <div class="split" style="gap:0">
      <div class="media" style="border-radius:0;aspect-ratio:4/3"><img src="assets/img/mood-clean.jpg" alt="" loading="lazy" width="1600" height="1200"></div>
      <div class="stack-lg" style="padding:clamp(40px,6vw,96px)">
        <p class="eyebrow">The MIRU Way</p>
        <h2 class="h2">과함 없이,<br>매일 쓰게 되는 것.</h2>
        <p class="lead">수많은 제품 중 일상에서 꾸준히 쓰게 되는 것만 고릅니다. 재고 없이 공급사에서 바로 보내 가격을 합리적으로 유지합니다.</p>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="infoTitle">
    <div class="wrap">
      <h2 class="h3" id="infoTitle">구매 전 확인하세요</h2>
      <table class="info-table" style="margin-top:20px">
        <tr><th>배송</th><td>결제 후 3~5 영업일 내 공급사에서 직접 발송합니다.</td></tr>
        <tr><th>결제</th><td>토스페이먼츠 (카드 · 간편결제)</td></tr>
        <tr><th>판매 방식</th><td>오더베이스 위탁판매 — 주문 확인 후 공급사에서 출고합니다.</td></tr>
        <tr><th>청약 철회</th><td>상품 수령 후 7일 이내 교환·반품을 신청할 수 있습니다(전자상거래법 기준).</td></tr>
      </table>
    </div>
  </section>

  <section class="section bg-panel" aria-labelledby="relTitle">
    <div class="wrap">
      <h2 class="h2" id="relTitle">함께 보면 좋은 상품</h2>
      <div class="pgrid" id="related" style="margin-top:32px"></div>
    </div>
  </section>
</main>

<div class="buybar" id="bar" aria-hidden="true">
  <div class="wrap">
    <span class="name" id="barName"></span>
    <span class="price tnum" id="barPrice"></span>
    <button class="btn btn-primary" type="button" id="barBuy">구매하기</button>
  </div>
</div>

<script src="js/miru-ui.js"></script>
<script>
(function(){
  const {Cart, CATS, won, esc, loadProducts, cardHTML, imageHTML} = window.MIRU;
  const slug = new URLSearchParams(location.search).get('slug');
  const $ = id => document.getElementById(id);
  let product, qty = 1;
  function setQty(n){ qty = Math.max(1, Math.min(99, n)); $('qtyOut').textContent = qty; $('pTotal').textContent = '총 ' + won(product.price * qty); }
  function buy(){ Cart.add(product.name, product.price, qty); location.href = 'checkout.html'; }
  loadProducts().then(all => {
    product = all.find(p => p.slug === slug);
    if (!product) {
      $('pName').textContent = '상품을 찾을 수 없습니다';
      $('pDesc').innerHTML = '<a class="link" href="index.html">홈으로 돌아가기</a>';
      document.querySelectorAll('#info .qty, #info .btn-row, #info .caption').forEach(el => el.hidden = true);
      return;
    }
    const cat = CATS.find(c => c.key === product.category);
    document.title = product.name + ' — MIRU';
    document.body.dataset.page = product.category;
    $('crumb').innerHTML = '<a href="index.html">홈</a> › <a href="' + cat.href + '">' + cat.name + '</a>';
    $('eyebrow').textContent = (product.badge ? product.badge + ' · ' : '') + cat.name;
    $('pName').textContent = product.name;
    $('pPrice').textContent = won(product.price);
    $('gMain').innerHTML = imageHTML(product);
    $('facts').innerHTML = ['공급사 직배송', '3~5 영업일', '토스페이먼츠'].map(f => '<span class="fact">' + f + '</span>').join('');
    $('pDesc').textContent = product.desc || '상세 사양은 공급사 정보 확인 후 업데이트됩니다.';
    $('barName').innerHTML = esc(product.name) + '<small>' + cat.name + '</small>';
    $('barPrice').textContent = won(product.price);
    setQty(1);
    $('related').innerHTML = all.filter(p => p.category === product.category && p.slug !== product.slug)
      .sort((a,b) => (b.badge==='BEST') - (a.badge==='BEST')).slice(0,4).map(cardHTML).join('');
    // sticky buy bar once the buy box scrolls away
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => {
      const off = !e.isIntersecting && e.boundingClientRect.top < 0;
      $('bar').classList.toggle('show', off); $('bar').setAttribute('aria-hidden', !off);
    }).observe(document.querySelector('#info .btn-row'));
  }).catch(() => { $('pName').textContent = '상품 정보를 불러오지 못했습니다'; });
  $('minus').addEventListener('click', () => setQty(qty - 1));
  $('plus').addEventListener('click', () => setQty(qty + 1));
  $('addCart').addEventListener('click', () => Cart.add(product.name, product.price, qty));
  $('buyNow').addEventListener('click', buy);
  $('barBuy').addEventListener('click', buy);
})();
</script>
</body>
</html>
"""

# old static product pages -> new template (file slug -> products.json slug)
LEGACY = {
    "led-mask": "led-mask", "facial-roller": "facial-roller", "neck-cooler": "neck-cooler",
    "fan": "neck-fan", "grooming": "grooming-brush", "pet-fountain": "pet-fountain",
    "ringlight": "ringlight",
}

REDIRECT = """<!DOCTYPE html>
<html lang="ko"><head><meta charset="UTF-8">
<title>MIRU</title>
<link rel="canonical" href="product.html?slug={slug}">
<meta http-equiv="refresh" content="0; url=product.html?slug={slug}">
<script>location.replace('product.html?slug={slug}'+location.hash);</script>
</head><body><a href="product.html?slug={slug}">상품 페이지로 이동</a></body></html>
"""


def main():
    for key, name, tagline in CATEGORIES:
        html = HEAD.format(title=f"{name} — MIRU", desc=f"MIRU {name} · {tagline}") + CATEGORY_BODY.format(key=key, name=name, tagline=tagline)
        (ROOT / f"{key}.html").write_text(html, encoding="utf-8")
    (ROOT / "product.html").write_text(HEAD.format(title="상품 — MIRU", desc="MIRU 상품 상세") + PRODUCT_BODY, encoding="utf-8")
    for old, slug in LEGACY.items():
        (ROOT / f"product-{old}.html").write_text(REDIRECT.format(slug=slug), encoding="utf-8")
    print("built", len(CATEGORIES), "category pages, product.html,", len(LEGACY), "redirects")


if __name__ == "__main__":
    main()
