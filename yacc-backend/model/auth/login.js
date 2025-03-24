const express = require("express");
const router = express.Router();

const mysqlDB = require("../database/databaseInfo.js");
const security = require("../utils/passHashSecurity.js");

const {
    isValidEmail,
    isValidPassword,
    // 필요한 validator가 있으면 import
} = require("./signUpValidators.js");

// 로그인 API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // 필수 값 체크
    if (!email || !password) {
        return res.send({
            result: "login_fail",
            message: "Email and password are required",
        });
    }

    // 유효성 검사 (선택적으로 적용)
    if (!isValidEmail(email)) {
        return res.send({
            result: "UnMatchData",
            message: "Invalid email format",
        });
    }

    try {
        // DB에서 해당 email의 사용자 조회
        const sql = "SELECT * FROM user WHERE email = ?";
        const rows = await new Promise((resolve, reject) => {
            mysqlDB.query(sql, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        // 이메일 존재 여부 체크
        if (rows.length === 0) {
            return res.send({
                result: "login_fail",
                message: "Email not found",
            });
        }

        const user = rows[0];

        // 비밀번호 비교 (pepper + bcrypt)
        const isMatch = await security.comparePassword(password, user.password);
        if (!isMatch) {
            return res.send({
                result: "login_fail",
                message: "Incorrect password",
            });
        }

        // 세션에 사용자 정보 저장
        req.session.userId = user.user_id;
        req.session.username = user.username;
        req.session.email = user.email;

        // 로그인 성공
        return res.send({
            result: "login_success",
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        // DB나 기타 처리 중 오류
        const errorMap = {
            ER_DUP_ENTRY: { result: "already_exist" },
            ER_DATA_TOO_LONG: { result: "data_too_long" },
            ER_TRUNCATED_WRONG_VALUE: { result: "truncated_wrong_value" },
            ER_NO_DEFAULT_FOR_FIELD: { result: "no_default_for_field" },
            ER_BAD_NULL_ERROR: { result: "bad_null_error" },
        };

        return res.send(
            errorMap[err.code] || {
                result: "login_fail",
                message: err.message,
            }
        );
    }
});

module.exports = router;
