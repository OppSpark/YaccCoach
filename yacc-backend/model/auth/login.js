// model/auth/login.js
const express = require("express");
const router = express.Router();
const dbPool = require("../database/databaseInfo.js");
const passHashSecurity = require("../utils/passHashSecurity.js");

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 필수 값 체크
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "이메일과 비밀번호를 입력하세요." });
        }

        // ★ pool.promise()를 사용해 Promise 기반 메서드로 전환
        const promisePool = dbPool.promise();

        // 이메일로 사용자 찾기
        const [rows] = await promisePool.query(
            "SELECT * FROM user WHERE email = ?",
            [email]
        );

        // 이메일 존재 여부 체크
        if (rows.length === 0) {
            return res
                .status(400)
                .json({ message: "등록되지 않은 이메일입니다." });
        }

        const user = rows[0];

        // pepper + bcrypt 비교
        const isMatch = await passHashSecurity.comparePassword(
            password,
            user.password
        );
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "비밀번호가 일치하지 않습니다." });
        }

        // 세션 저장 (express-session 사용 중이라고 가정)
        req.session.userId = user.user_id;
        req.session.username = user.username;
        req.session.email = user.email;

        // 성공 응답
        return res.status(200).json({
            message: "로그인 성공",
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("로그인 오류:", error);
        return res.status(500).json({ message: "서버 오류" });
    }
});

module.exports = router;
