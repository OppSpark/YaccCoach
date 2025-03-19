/* 
메모 알아볼것들
express-validator 라이브러리를 사용하면 입력 값의 유효성을 검사 가능함
bcrypt 라이브러리를 사용하면 비밀번호를 해싱 관련 찾아볼것

mysql 연동 필요 디비 설계하고 할듯
*/
const express = require("express");
const router = express.Router();
const mysqlDB = require('../database/databaseInfo.js');

const {
    isValidEmail,
    isValidPassword,
    isValidTel,
    isValidAddress,
    isValidAgreed,
} = require("../utils/validators"); // 추가된 import
const { connect } = require("../database/databaseInfo");


// 회원가입 API
router.post("/signUp", (req, res) => {
    const { username, email, password, tel_number, address, agreed_personal } = req.body;
    
    console.log(req.body);

    if (
        !username ||
        !email ||
        !password ||
        !tel_number ||
        !address ||
        !agreed_personal
    ) {
        return res.send({ result: "register_fail" });
    }

    // 유효성 검사
    if (!isValidEmail(email))
        return res.send({
            result: "UnMatchData", message: "Invalid email format",
        });
    if (!isValidPassword(password))
        return res.send({
            result: "UnMatchData", message: "Invalid password format",
        });
    if (!isValidTel(tel_number))
        return res.send({
            result: "UnMatchData",message: "Invalid phone number format",
        });
    if (!isValidAddress(address))
        return res.send({ result: "UnMatchData", message: "Address too long" });
    if (!isValidAgreed(agreed_personal))
        return res.send({
            result: "UnMatchData", message: "Invalid agreement value",
        });

    const signUpSQL = `INSERT INTO user (username, email, password, tel_number, address, agreed_personal) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
        username,
        email,
        password,
        tel_number,
        address,
        agreed_personal,
    ];

    mysqlDB.query(signUpSQL, params, (err, rows) => {
        const errorMap = {
            ER_DUP_ENTRY: { result: "already_exist" }, // 중복된 이메일
            ER_DATA_TOO_LONG: { result: "data_too_long" }, // 데이터 길이 초과
            ER_TRUNCATED_WRONG_VALUE: { result: "truncated_wrong_value" }, // 데이터 형식 오류
            ER_NO_DEFAULT_FOR_FIELD: { result: "no_default_for_field" }, // 필수 값 누락
            ER_BAD_NULL_ERROR: { result: "bad_null_error" }, // null 값이 들어옴
        };

        if (err) {
            return res.send(errorMap[err.code] || { result: "register_fail" }); // 기타 오류
        }
        return res.send({ result: "register_success" }); // 회원가입 성공
    });
});

module.exports = router;
