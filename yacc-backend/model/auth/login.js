const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");
const security = require("../utils/passHashSecurity.js");

router.post("/signIn", (req, res) => {
    //const { username, password } = req.body;
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ result: "bad_null_error" });  // ID 또는 PW 가 안들어옴
    }

    const signUpCheckUserSQL =
        "SELECT username, password FROM user WHERE email = ?";

    mysqlDB.query(signUpCheckUserSQL, email, async (err, users) => {
        if (err) {
            console.error("데이터베이스 쿼리 오류:", err);
            return res.status(500).json({ result: "db_query_error" });  // 데이터베이스 에러
        }

        // email 조회 했는데 없는 경우
        if (users.length === 0) {
            return res.status(401).json({ result: "AUTH_FAILED" });  // 계정이 없음
        }

        const user = users[0];

        console.log(password)

        // password 복호화
        const hashPassword = await security.hashPassword(password)

        const isValid = await security.comparePassword(password, hashPassword);


        //아 시발 고쳤다
        //console.log(isValid + "     2211111111111");
        console.log(isValid)

        if (!isValid) {
            return res.json({ result: "su" });
        } else {
            return res.json({ result: "ssss" });
        }
    });

    //const signInSQL = 'SELECT * FROM user WHERE email = ? AND password = ?';

    //테스트 용도
    /*
    {
        "email": "email",
        "password": "password"
    }
    */

    /*
    if (email === "email" && password === "password") {
        req.session.loggedIn = true;
        res.send("로그인 성공");
    } else {
        res.send("로그인 실패");
        req.session.id = "hello";
    }
    */
});

module.exports = router;
