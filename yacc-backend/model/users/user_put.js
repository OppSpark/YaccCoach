const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

const {
    isValidEmail,
    isValidTel,
    isValidAddress,
    isValidAgreed,
} = require("../auth/signUpValidators.js");


router.put("/user", (req, res) => {
    const { user_id, username, email, tel_number, address, agreed_personal } = req.body;

    if (!user_id) return res.status(400).json({ result: "user_id_required", message: "user_id is required" }); // 유저 아이디 없음

    if (!username || !email || !tel_number || !address || agreed_personal === undefined)
        return res.status(400).json({ result: "user_info_required", message: "All user information is required" }); // 유저 정보 없음

    if (!isValidEmail(email))
        return res.status(400).json({ result: "invalid_email", message: "Invalid email format" }); // 이메일 형식 확인
    if (!isValidTel(tel_number))
        return res.status(400).json({ result: "invalid_tel_number", message: "Invalid telephone number format" }); /// 전화번호 형식 확인
    if (!isValidAddress(address))
        return res.status(400).json({ result: "invalid_address", message: "Invalid address format" }); // 주소 형식 확인
    if (!isValidAgreed(agreed_personal))
        return res.status(400).json({ result: "invalid_agreed_personal", message: "Invalid personal agreement format" }); // 동의 여부 형식 확인
    
    const sql = `
        UPDATE user
        SET username = ?, email = ?, tel_number = ?, address = ?, agreed_personal = ?
        WHERE user_id = ?
    `;

    new Promise((resolve, reject) => {
        mysqlDB.query(sql, [username, email, tel_number, address, agreed_personal, user_id], (err, result) => err ? reject(err) : resolve(result));
    })
        .then((result) => {
            if (result.affectedRows === 0)
                return res.status(404).json({ result: "no_user_data", message: "No user records found" }); // 유저 정보 없음
            // unique 검증 이미 사용중인 이메일, 전화번호, 주소가 있을 경우
            if (result.changedRows === 0)
                return res.status(409).json({ result: "user_update_fail", message: "User information update failed" }); // 유저 정보 업데이트 실패
            // unique 검증 이미 사용중인 이메일, 전화번호, 주소가 있을 경우 mysql     
            return res.status(200).json({ result: "user_update_success", message: "User information updated successfully" });
        })
        .catch((err) => {
            console.error("Database query error:", err);

            // MySQL 에러 코드에 따라 처리
            if (err.code === 'ER_BAD_FIELD_ERROR') {
                return res.status(400).json({ result: "invalid_field", message: "Invalid field in the request" }); // 잘못된 필드
            }
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(404).json({ result: "no_user_data", message: "No user records found" }); // 유저 정보 없음
            }
            if (err.code === 'ER_DATA_TOO_LONG') {
                return res.status(400).json({ result: "data_too_long", message: "Data too long for one or more fields" }); // 데이터 길이 초과
            }
            if (err.code === 'ER_PARSE_ERROR') {
                return res.status(400).json({ result: "parse_error", message: "Error parsing the request" }); // 파싱 에러
            }
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    result: "duplicate_entry", // 닉네임, 이메일, 전화번호중 중복된 항목이 있음
                    message: "Email or phone number already in use"
                });
            }

            return res.status(500).json({ result: "user_query_fail", message: "Database query failed" });  // DB 쿼리 실패
        });
}
);


module.exports = router;