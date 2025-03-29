const express = require("express");
const router = express.Router();

const mysqlDB = require("../database/databaseInfo.js");
const security = require("../utils/passHashSecurity.js");
const { isValidEmail } = require("./signUpValidators.js");

// 로그인 API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // 필수 값 체크
    if (!email || !password) {
        return res.status(400).json({ // 명확한 상태 코드
            result: "login_fail",
            message: "Email and password are required",
        });
    }

    // 유효성 검사
    if (!isValidEmail(email)) {
        return res.status(400).json({
            result: "UnMatchData",
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

        if (rows.length === 0) {
            return res.status(404).json({ // 404 상태코드 명확히 설정
                result: "login_fail",
                message: "Email not found",
            });
        }

        const user = rows[0];

        const isMatch = await security.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ // 401 Unauthorized 상태 코드
                result: "login_fail",
                message: "Incorrect password",
            });
        }

        // 세션에 사용자 정보 저장
        req.session.userId = user.user_id;
        req.session.username = user.username;
        req.session.email = user.email;

        // 세션 저장 후 명시적으로 save
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ result: "login_fail", message: "Session error" });
            }

            res.cookie

            // 로그인 성공 응답 전송 (상태 코드 명확히)
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
        const errorMap = {
            ER_DUP_ENTRY: { result: "already_exist" },
            ER_DATA_TOO_LONG: { result: "data_too_long" },
            ER_TRUNCATED_WRONG_VALUE: { result: "truncated_wrong_value" },
            ER_NO_DEFAULT_FOR_FIELD: { result: "no_default_for_field" },
            ER_BAD_NULL_ERROR: { result: "bad_null_error" },
        };

        return res.status(500).json(
            errorMap[err.code] || {
                result: "login_fail",
                message: err.message,
            }
        );
    }
});

module.exports = router;