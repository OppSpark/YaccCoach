const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");
const security = require("../utils/security"); // security.js 임포트

router.get("/signUp", (req, res) => {
    const { username, password } = req.body;

    //테스트 용도
    /*
    {
        "username": "username",
        "password": "password"
    }
    */
    if (username === "username" && password === "password") {
        req.session.loggedIn = true;
        res.send("로그인 성공");
    } else {
        res.send("로그인 실패");
    
    }
});

module.exports = router;
