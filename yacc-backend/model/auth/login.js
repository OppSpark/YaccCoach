const express = require("express");
const router = express.Router();

const mysqlDB = require("../database/databaseInfo.js");
const security = require("../utils/passHashSecurity.js");
const { isValidEmail } = require("./signUpValidators.js");

// 로그인 API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // 필수 값 누락 체크
    if (!email || !password) {
        return res.status(400).json({
            result: "missing_credentials", // 이메일 또는 비밀번호 누락
            message: "Email and password are required",
        });
    }

    // 이메일 형식 유효성 검사
    if (!isValidEmail(email)) {
        return res.status(400).json({
            result: "invalid_email_format", // 이메일 형식이 올바르지 않음
            message: "Invalid email format",
        });
    }

    try {
        const sql = "SELECT * FROM user WHERE email = ?";
        const rows = await new Promise((resolve, reject) => {
            mysqlDB.query(sql, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        // 이메일에 해당하는 유저 없음
        if (rows.length === 0) {
            return res.status(404).json({
                result: "email_not_found", // 존재하지 않는 이메일
                message: "Email not found",
            });
        }

        const user = rows[0];

        const isMatch = await security.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                result: "incorrect_password", // 비밀번호 불일치
                message: "Incorrect password",
            });
        }

        // 세션 설정
        req.session.userId = user.user_id;
        req.session.username = user.username;
        req.session.email = user.email;

        // 세션 저장 시 에러 처리
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({
                    result: "session_save_error", // 세션 저장 중 오류
                    message: "Session error",
                });
            }

            return res.status(200).json({
                result: "login_success",
                name: user.username,
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                },
            });
        });

    } catch (err) {
        console.error("Login error:", err);

        // MySQL 관련 에러 코드 맵핑
        const errorMap = {
            ER_DUP_ENTRY: { result: "db_duplicate_entry" },         // 중복된 값 (ex. UNIQUE 제약 위반)
            ER_DATA_TOO_LONG: { result: "db_data_too_long" },       // 데이터 길이 초과
            ER_TRUNCATED_WRONG_VALUE: { result: "db_wrong_value" }, // 잘못된 값 입력
            ER_NO_DEFAULT_FOR_FIELD: { result: "db_missing_default" }, // 기본값 누락
            ER_BAD_NULL_ERROR: { result: "db_null_error" },         // NULL 허용되지 않는 필드 누락
        };

        return res.status(500).json(
            errorMap[err.code] || {
                result: "login_server_error", // 로그인 처리 중 서버 에러
                message: err.message,
            }
        );
    }
});

module.exports = router;