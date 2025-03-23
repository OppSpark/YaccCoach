require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

// DB 연결(pool) 불러오기
const conn = require('./model/database/databaseInfo.js'); 

const app = express();

app.use(express.json());
app.use(cookieParser());

// ----------------------------------------
// 1) CORS 설정
// ----------------------------------------
// ★주의★: subdomain 간 쿠키 사용 시 sameSite='none' & secure=true(HTTPS)
app.use(
  cors({
    origin: 'http://dev.yacccoach.oppspark.net', 
    credentials: true, // 쿠키/세션 허용
  })
);

// ----------------------------------------
// 2) 세션 설정
// ----------------------------------------
const sessionStore = new MySQLStore({}, conn);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'my-secret-key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      sameSite: 'none', // subdomain 간 쿠키를 쓰려면 'none' 이어야 함.
      // secure: true,     // HTTPS 환경이면 true 권장
      maxAge: 1000 * 60 * 60, // 1시간
    },
  })
);

// ----------------------------------------
// 3) 라우트들
// ----------------------------------------
app.get('/', (req, res) => {
  res.send('Welcome to YaccCoach API');
});

const routes = require("./model/routes/routes.js");
app.use("/", routes);


// ----------------------------------------
// 4) 서버 실행
// ----------------------------------------
const PORT = process.env.PORT || 3330;
app.listen(PORT, () => {
  console.log(`${PORT} 포트에서 서버가 동작`);
});