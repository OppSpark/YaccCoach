
# ⚙️ 약코치 백엔드 설정 방법 (YaccCoach Backend Setup)

이 문서는 약코치(YaccCoach) 프로젝트의 **백엔드 서버 실행 방법**을 안내합니다.

---

## 📁 1. `.env` 환경 변수 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 입력하세요:

```
OPENAI_API_KEY=your_openai_key
OPENAPI_API_KEY=your_publicdata_key

DB_HOST=your_db_host
DB_USER=your_db_user
DB_PW=your_db_password
DB_PORT=3306
DB_NAME=yacccoach

PEPPER_SECRET=your_pepper_string
PEPPER_VERSION=1

SESSION_SECRET=your_session_secret
NODE_ENV=production
```

> ⚠️ 실제 서비스 환경에서는 `.env` 파일을 `.gitignore`에 추가하여 Git에 노출되지 않도록 주의하세요.

---

## 📦 2. 의존성 설치

아래 파일에 명시된 패키지들을 설치합니다:

📄 [requirements.txt (npm 패키지 목록)](https://github.com/OppSpark/YaccCoach/blob/main/requirements.txt)

### 설치 명령어:
```bash
npm install
```

---

## 🚀 3. 백엔드 서버 실행

아래 명령어로 백엔드 서버를 실행합니다:

```bash
node index
```

> 서버가 정상적으로 실행되면 포트(`process.env.PORT` 또는 기본값 3330)에서 대기 상태가 됩니다.

---

## 📝 참고 사항

- 백엔드는 `Express.js`로 작성되어 있으며, `MySQL` 데이터베이스를 사용합니다.
- `express-session` + `express-mysql-session`을 사용하여 **세션 기반 인증**을 구현하고 있습니다.
- API Key는 OpenAI, 공공데이터포털 약품 API가 필요하며, `.env`에 반드시 포함되어야 합니다.
- 프록시 환경(Nginx 등)에서 배포할 경우 SSL 및 포트 포워딩 설정이 필요합니다.

---

## ✅ 완료 후 확인 체크리스트

- [ ] `.env` 파일 작성 완료
- [ ] `npm install` 완료
- [ ] `MySQL DB` 접속 가능 여부 확인
- [ ] `node index` 실행 시 오류 없이 서버가 뜨는지 확인

---

> 👨‍💻 문제 발생 시 `logs/` 폴더 또는 콘솔 에러 메시지를 참고하여 디버깅하세요.  

