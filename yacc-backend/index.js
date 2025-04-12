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
    origin: true ,
    credentials: true, // 쿠키/세션 허용
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept' ], // 허용할 헤더
  })
);
app.options('*', cors());
// app.use(cors()); // 모든 도메인 허용

// OPTIONS preflight 대응 추가 설정

// ----------------------------------------
// 2) 세션 설정
// ----------------------------------------
const sessionStore = new MySQLStore({}, conn);

// 개발환경(HTTP)의 정확한 세션 설정 (반드시 이렇게!)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: false,      // HTTP 환경에서는 반드시 false
    sameSite: 'lax',    // 반드시 lax로 설정
    domain: 'yacccoach.oppspark.net', // 도메인 설정
    maxAge: 1000 * 60 * 60 * 72, // 3일
  },
}));

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
const PORT = process.env.PORT || 3331;
app.listen(PORT, () => {
  console.log(`${PORT} 포트에서 서버가 동작`);
});
