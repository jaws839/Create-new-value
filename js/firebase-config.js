// ──────────────────────────────────────────────────────────
//  MIRU Firebase 설정
//  1. https://console.firebase.google.com 에서 프로젝트 생성
//  2. 프로젝트 설정 > 앱 추가 > 웹 앱 > 아래 값으로 교체
//  3. Authentication > 로그인 방법 > 이메일/비밀번호, Google 활성화
//  4. Firestore Database > 데이터베이스 만들기 (프로덕션 모드)
//  5. Firestore 규칙 아래 내용으로 교체
// ──────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyA-0D07ctDzrLWxLAmgPJ-OfOaDBaJOeno",
  authDomain:        "miru-3806d.firebaseapp.com",
  projectId:         "miru-3806d",
  storageBucket:     "miru-3806d.firebasestorage.app",
  messagingSenderId: "958166030740",
  appId:             "1:958166030740:web:b5dc0bc7dbfff534335781",
  measurementId:     "G-X9H839X893"
};

// ── Toss Payments 클라이언트 키 ───────────────────────────
//  https://developers.tosspayments.com 에서 발급
//  테스트: test_ck_... / 라이브: live_ck_...
const TOSS_CLIENT_KEY = "test_ck_YOUR_CLIENT_KEY";

// ── 관리자 이메일 목록 ────────────────────────────────────
const ADMIN_EMAILS = ["jaws839@gmail.com"];

// ── 스토어 URL ────────────────────────────────────────────
const STORE_BASE_URL = "https://jaws839.github.io/Create-new-value";

export { FIREBASE_CONFIG, TOSS_CLIENT_KEY, ADMIN_EMAILS, STORE_BASE_URL };
