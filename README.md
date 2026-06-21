# 🛍️ MIRU 온라인 스토어

> 오더베이스 위탁판매 | 재고 제로 | 마진 30%+ 보장 | 자본금 ₩5,000,000

**일상의 아름다움을 발견하는 라이프스타일 스토어**

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 브랜드명 | MIRU (미루) |
| 판매 방식 | 오더베이스 위탁판매 (재고 0) |
| 소싱처 | 오너클랜, 도매꾹 |
| 자본금 한도 | ₩5,000,000 |
| 판매 채널 | 자체몰(GitHub Pages) + 네이버 스마트스토어 + 쿠팡 |
| 타겟 고객 | 20~35세 여성, 프리미엄 라이프스타일 지향 |
| 마진 목표 | 30%+ (현 평균 **48.4%** 달성) |
| 시작일 | 2026-06-21 |
| 현재 상태 | 스토어 구축 완료 / GitHub Pages 배포 대기 |

---

## 제품 구성 (220개+)

| 섹터 | 제품 수 | 평균 마진 | 대표 제품 |
|------|---------|-----------|-----------|
| 💄 뷰티 | 55개 | 49.1% | LED 마스크, 페이셜 롤러, 갈바닉 EMS 마사지기 |
| 🏡 라이프스타일 | 55개 | 49.1% | 아이스 넥쿨러, 목걸이 선풍기, 아로마 디퓨저 |
| 🐾 반려동물 | 55개 | 47.3% | 자동 급수기, 자동 급식기, GPS 위치 추적기 |
| ⚽ 스포츠 | 55개 | 48.0% | 요가매트, 저항 밴드, 근막 마사지 건 |
| **합계** | **220개** | **48.4%** | 전 제품 마진 30%+ 통과 |

---

## 디자인 시스템

**컨셉:** Dark Premium + Glassmorphism

| 토큰 | 값 |
|------|-----|
| 배경색 | `#07070A` |
| 골드 액센트 | `#C8A96B` |
| 서피스 | `rgba(255,255,255,0.045)` |
| 폰트 | Pretendard Variable |
| 블러 | `backdrop-filter: blur(28px)` |
| 반응형 | 모바일 퍼스트, 600px 브레이크포인트 |

---

## 채널별 수익성 분석

| 채널 | 수수료 | 넥쿨러 ₩22,900 기준 마진 |
|------|--------|--------------------------|
| 자체몰 (GitHub Pages) | 3.0% | **43.9%** |
| 네이버 스마트스토어 | 5.85% | ~41% |
| 쿠팡 | 10.5% | ~36% |

> 자체몰 중심 전략 → 마진 극대화

---

## 산출 파일 목록

### HTML 페이지 (14개)
- `index.html` — 메인 스토어 홈 (4섹터 카드 + 카테고리 네비)
- `beauty.html` — 뷰티 카테고리 (55개 제품)
- `lifestyle.html` — 라이프스타일 카테고리 (55개 제품)
- `pet.html` — 반려동물 카테고리 (55개 제품)
- `sports.html` — 스포츠 카테고리 (55개 제품)
- `product-led-mask.html` / `product-neck-cooler.html` / `product-pet-fountain.html`
- `product-fan.html` / `product-grooming.html` / `product-facial-roller.html`
- `product-ringlight.html` / `landing-redesign-mistyco.html` / `store-index.html`

### 지원 파일
- `products.json` — 220개 제품 마스터 DB (59KB)
- `manifest.json` — PWA 앱 정의
- `sw.js` — 서비스워커 (캐시 퍼스트 전략)
- `sitemap.xml` — SEO 사이트맵
- `robots.txt` — 검색엔진 크롤링 규칙
- `og-miru.svg` — OG 이미지 (1200×630)
- `deploy_to_github.sh` — GitHub Pages 원클릭 배포 스크립트

---

## GitHub Pages 배포 방법

1. GitHub Personal Access Token 발급
   - Settings → Developer settings → Personal access tokens → `repo` 권한 체크
2. 터미널에서 실행:
   ```bash
   bash deploy_to_github.sh
   ```
3. 토큰과 GitHub 사용자명 입력
4. 자동으로 레포 생성 + 파일 업로드 + Pages 활성화
5. 완료 후 접속: `https://[사용자명].github.io/miru-store/`

---

## Claude Cowork 연결 방법

이 폴더는 Claude Cowork와 연결된 miru 프로젝트 워크스페이스입니다.

**폴더 구조:**
```
miru 프로젝트/
├── README.md          ← 이 파일 (스토어 설명 + 연결 방법)
├── .gitignore
├── data/              ← miru 참조·갱신 데이터 (products.json 등)
└── reports/           ← 일일 리포트 산출물
```

**Claude에게 요청할 수 있는 작업:**
- 제품 데이터 업데이트 및 마진 분석
- 일일/주간 판매 리포트 생성 (`reports/` 폴더)
- 마케팅 전략 분석 및 SNS 콘텐츠 작성
- 신규 제품 소싱 리서치
- HTML 스토어 파일 수정 및 기능 추가

---

## 다음 단계 액션 아이템

- [ ] GitHub Pages 배포 (`deploy_to_github.sh` 실행)
- [ ] 인스타그램 계정 개설 (@miru.lifestyle 또는 @miru_kr)
- [ ] GA4 측정 ID 발급 및 HTML 파일 내 교체
- [ ] Facebook Pixel ID 발급 및 교체
- [ ] 오너클랜/도매꾹에서 실제 소싱가 확인
- [ ] 쿨 트리오 에디션 공지 포스팅 발행
- [ ] 네이버 스마트스토어 입점 신청
- [ ] 카카오 SDK 키 발급 (SNS 공유 기능)

---

## 마케팅 전략 (루메나 분석 기반)

**즉시 실행 가능 전략:**
1. **쿨 트리오 에디션 한정판** — 넥쿨러+선풍기+쿨링롤러 3종 세트 100개 한정 ₩54,900
2. **D-day 카운트다운** — 출시 전 긴박감 마케팅
3. **인스타그램 계정 개설** — @miru.lifestyle 또는 @miru_kr

**월간 드롭 캘린더:**

| 월 | 에디션 | 제품 |
|----|--------|------|
| 7월 | 쿨 서머 에디션 | 쿨링 3종 세트 |
| 9월 | 가을 스킨케어 에디션 | LED 마스크 + 롤러 세트 |
| 11월 | 겨울 홈케어 에디션 | 가습기 + 아로마 세트 |
| 2월 | 발렌타인 뷰티 에디션 | 페이셜 케어 2종 |
| 4월 | 봄 라이프 에디션 | 반려동물 + 홈 소품 |

---

*MIRU 프로젝트 — Claude Cowork 에이전트 | 2026-06-21*
