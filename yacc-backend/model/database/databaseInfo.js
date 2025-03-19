const mysql = require('mysql');
require('dotenv').config();

const conn = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
});

// 연결 상태 확인을 위한 테스트 쿼리 실행
conn.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
        console.error('데이터베이스 연결 실패:', err);
    } else {
        console.log('데이터베이스 연결 성공:', results[0].result === 2);
    }
});

module.exports = conn;