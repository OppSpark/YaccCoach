const express = require("express");
const router = express.Router();
const mysqlDB = require('../database/databaseInfo.js');
const security = require('../utils/passHashSecurity.js');

const {
    isValidEmail,
    isValidPassword,
    isValidTel,
    isValidAddress,
    isValidAgreed,
} = require("./signUpValidators.js");

// 회원가입 API
router.post("/signUp", async (req, res) => {
    const { username, email, password, tel_number, address, agreed_personal } = req.body;

    if (!username || !email || !password || !tel_number || !address || agreed_personal === undefined)
        return res.status(400).json({ result: "missing_required_fields", message: "All fields are required." }); // 필수 항목 누락

    if (!isValidEmail(email))
        return res.status(400).json({ result: "invalid_email_format", message: "Invalid email format" }); // 이메일 형식 오류

    if (!isValidPassword(password))
        return res.status(400).json({ result: "invalid_password_format", message: "Invalid password format" }); // 비밀번호 형식 오류

    if (!isValidTel(tel_number))
        return res.status(400).json({ result: "invalid_phone_format", message: "Invalid phone number format" }); // 전화번호 형식 오류

    if (!isValidAddress(address))
        return res.status(400).json({ result: "invalid_address", message: "Address too long" }); // 주소 유효성 실패

    if (!isValidAgreed(agreed_personal))
        return res.status(400).json({ result: "invalid_agreement_value", message: "Invalid agreement value" }); // 개인정보 동의 값 오류

    try {
        const hashedPassword = await security.hashPassword(password);
        const signUpSQL = `INSERT INTO user (username, email, password, tel_number, address, agreed_personal) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [username, email, hashedPassword, tel_number, address, agreed_personal];

        await new Promise((resolve, reject) => {
            mysqlDB.query(signUpSQL, params, (err, rows) => (err ? reject(err) : resolve(rows)));
        });

        return res.status(201).json({ result: "register_success" }); // 회원가입 성공

    } catch (err) {
        console.error("회원가입 오류:", err);
        const errorMap = {
            ER_DUP_ENTRY: { result: "email_already_exists" },       // 이메일 중복
            ER_DATA_TOO_LONG: { result: "data_too_long" },          // 데이터 길이 초과
            ER_TRUNCATED_WRONG_VALUE: { result: "wrong_value" },    // 잘못된 값
            ER_NO_DEFAULT_FOR_FIELD: { result: "missing_default" }, // DB 필드 기본값 없음
            ER_BAD_NULL_ERROR: { result: "null_value_error" }       // NULL 허용 안 되는 필드 누락
        };
        return res.status(500).json(errorMap[err.code] || { result: "register_fail", message: err.message });
    }
});

module.exports = router;