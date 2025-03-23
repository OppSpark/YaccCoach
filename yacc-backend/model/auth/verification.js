const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");
const security = require("../utils/passHashSecurity.js"); // security.js 임포트






router.post("/signIn", (req, res) => {
    const { email, password } = req.body;


    //테스트 용도
    /*
    {
        "email": "email",
        "password": "password"
    }
    */
    if (email === "email" && password === "password") {
        req.session.loggedIn = true;
        res.send("로그인 성공");
    } else {
        res.send("로그인 실패");
        req.session.id = "hello";
    }
});

module.exports = router;
