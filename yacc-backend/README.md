# ⚙️ YaccCoach 백엔드 설정 가이드

**최종 수정일**: 2025-04-20

---

## 📁 1. `.env` 환경 변수 설정

루트 디렉터리에 `.env` 파일을 생성하고 아래 항목을 입력하세요:

```
OPENAI_API_KEY=your_openai_key=
OPENAPI_API_KEY=your_publicdata_key=

PHARMACY_API_KEY=
KAKAO_REST_API_KEY=

DB_HOST=your_db_host=
DB_USER=your_db_user=
DB_PW=your_db_password=
DB_PORT=3306
DB_NAME=yacccoach

PEPPER_SECRET=your_pepper_string
PEPPER_VERSION=1

SESSION_SECRET=your_session_secret
NODE_ENV=production
```

> ⚠️ `.env` 파일은 `.gitignore`에 반드시 포함하세요.

---

## 📦 2. 의존성 설치

```bash
npm install
```

> 프로젝트 루트에서 위 명령어 실행

---

## 🚀 3. 백엔드 서버 실행

```bash
node index
```

> 실행 시 `.env` 기반으로 포트가 설정됨 (기본값: 3330)

---

## 🔒 인증 및 보안 구조

- `express-session` + `express-mysql-session`으로 세션 인증 구현
- `PEPPER_SECRET`로 비밀번호 이중 암호화 적용
- OpenAI 및 공공데이터포털 API 키 사용

---

## 🔧 주요 API

- `/login` - 로그인 및 세션 생성
- `/logout` - 로그아웃 및 세션 파기
- `/search` - 증상 기반 약 추천 (OpenAI 연동)
- `/drugInfo` - 의약품 상세 조회
- `/storeInfo` - 공공데이터 약국 검색
- `/reverseGeocode` - 좌표 기반 주소 변환

---

## ✅ 배포 체크리스트

- [ ] `.env` 작성 완료
- [ ] `npm install` 완료
- [ ] `MySQL` 연결 확인
- [ ] `node index` 서버 실행 정상 확인
- [ ] Nginx SSL 프록시 설정 완료

---

## 📂 파일 구조 (일부)

```
├── index.js
├── /routes
│   ├── search.js
│   ├── drugInfo.js
│   ├── storeInfo.js
│   └── ...
├── /database
│   └── databaseInfo.js
├── /middleware
├── .env
└── package.json
```

---

## 🐛 디버깅 팁

- 에러 발생 시 `console.log`, `.catch` 또는 `logs/` 로그를 참고
- 세션 문제는 쿠키 설정 및 CORS 정책 확인
- API 실패는 `.env` 키 또는 외부 서버 응답 확인

---

© 2025 YaccCoach Project. All rights reserved.

