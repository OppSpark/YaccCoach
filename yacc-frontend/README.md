
# ⚛️ 약코치 프론트엔드 설정 가이드 (YaccCoach Frontend Setup Guide)

이 문서는 **약코치(YaccCoach)** 프로젝트의 프론트엔드 개발 환경 구성 및 실행 방법을 설명합니다.

---

## 📁 1. 프로젝트 구조 개요

```
yacc-frontend/
├── public/
├── src/
│   ├── components/
│   ├── config/
│   ├── index.css
│   └── App.jsx
├── .env
├── package.json
└── README.md
```

---

## ⚙️ 2. 필수 환경 변수 설정

`public/index.html`과 루트 `.env`에 환경변수를 설정합니다.

### `.env` 예시
```env
REACT_APP_API_URL=http://dev.api.yacccoach.oppspark.net
```

> 🔒 `.env`는 Git에 포함되지 않도록 `.gitignore` 처리되어야 합니다.

---

## 📦 3. 의존성 설치

```bash
npm install
```

> React, React Router, Axios 외에 Kakao Map API, OpenAI API 호출용 config 등이 포함됩니다.

---

## 🚀 4. 개발 서버 실행

```bash
npm start
```

기본 포트는 `3000`이며, `.env` 설정에 따라 프록시된 API 주소로 요청이 전달됩니다.

---

## 🧪 5. 주요 기능 구성

| 페이지         | 설명                                  |
|----------------|---------------------------------------|
| `/`           | 메인페이지                            |
| `/login`      | 로그인 페이지                         |
| `/signup`     | 회원가입 페이지                       |
| `/drugInfo`   | 의약품 이름 기반 검색                |
| `/symptom-checker` | AI 기반 증상 입력 → 약 추천 |
| `/storeInfo`  | 약국 정보 검색 (GPS, 주소 기반)       |
| `/mypage`     | 내 정보 확인 및 로그아웃              |
| `/disease`    | 질병 등록 / 수정 / 삭제               |
| `/preference` | 선호 제약사 검색 / 등록               |

---

## 📱 6. UI/UX 구성

- **모바일 퍼스트** 레이아웃
- Toss 스타일 기반 카드형 UI
- 하단 `Footer` 탭 메뉴 고정 (홈, 의약품, 약국, 마이페이지)
- 애니메이션 효과 (`fade-in`, `shake`, `loading`, 등)
- 에러 메시지, 모달, 로딩 등 전반적인 UX 강화

---

## 🧰 7. 유틸 및 컴포넌트

- Axios 요청 → `/config/axiosConfig.js`
- 공통 컴포넌트: Header, Footer, LoadingModal, ConfirmModal 등
- 상태 관리: React useState, useEffect, useRef 기반

---

## 🌐 8. 배포 (Nginx 예시)

```nginx
server {
    listen 80;
    server_name yacccoach.oppspark.net;

    root /경로/YaccCoach/yacc-frontend/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

---

## ✅ 체크리스트

- [ ] `.env` 설정 완료
- [ ] `npm install` 완료
- [ ] `npm start` 또는 `npm run build` 성공
- [ ] 모바일 UI 테스트 완료
- [ ] API 연동 테스트 완료

---

> 🙋 프로젝트 협업 중 오류 발생 시 `console.log`, `Network 탭`, `.env`, `Nginx 설정`을 우선 확인하세요.
