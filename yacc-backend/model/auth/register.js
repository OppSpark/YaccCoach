const express = require("express");
const router = express.Router();
const mysqlDB = require('../database/databaseInfo.js');
const security = require('../utils/security'); // security.js 임포트

const {
    isValidEmail,
    isValidPassword,
    isValidTel,
    isValidAddress,
    isValidAgreed,
} = require("../utils/validators");

// 회원가입 API
router.post("/signUp", async (req, res) => {
    const { username, email, password, tel_number, address, agreed_personal } = req.body;

    // 유효성 검사 로직 유지
    if (!username || !email || !password || !tel_number || !address || !agreed_personal) {
        return res.send({ result: "register_fail" });
    }

    if (!isValidEmail(email)) return res.send({ result: "UnMatchData", message: "Invalid email format" });
    if (!isValidPassword(password)) return res.send({ result: "UnMatchData", message: "Invalid password format" });
    if (!isValidTel(tel_number)) return res.send({ result: "UnMatchData", message: "Invalid phone number format" });
    if (!isValidAddress(address)) return res.send({ result: "UnMatchData", message: "Address too long" });
    if (!isValidAgreed(agreed_personal)) return res.send({ result: "UnMatchData", message: "Invalid agreement value" });

    try {
        //security.js의 비동기 해시 함수
        const hashedPassword = await security.hashPassword(password);

        const signUpSQL = `INSERT INTO user (username, email, password, tel_number, address, agreed_personal) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [
            username,
            email,
            hashedPassword, // 해시된 비밀번호
            tel_number,
            address,
            agreed_personal,
        ];

        // DB 쿼리
        await new Promise((resolve, reject) => {
            mysqlDB.query(signUpSQL, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        return res.send({ result: "register_success" });

    } catch (err) {
        // 에러 처리
        const errorMap = {
            ER_DUP_ENTRY: { result: "already_exist" },
            ER_DATA_TOO_LONG: { result: "data_too_long" },
            ER_TRUNCATED_WRONG_VALUE: { result: "truncated_wrong_value" },
            ER_NO_DEFAULT_FOR_FIELD: { result: "no_default_for_field" },
            ER_BAD_NULL_ERROR: { result: "bad_null_error" }
        };

        return res.send(errorMap[err.code] || { 
            result: "register_fail",
            message: err.message 
        });
    }
});

module.exports = router;
