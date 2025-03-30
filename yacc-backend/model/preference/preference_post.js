const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

// 사용자 선호도 정보 추가 API
router.post("/preference", (req, res) => {
    const { user_id, company_name } = req.body;

    if (!user_id || !company_name)
        return res.status(400).json({
            result: "missing_user_id_or_company", // user_id 또는 company_name 누락
            message: "user_id and company_name are required"
        });

    const insertPreferenceSQL = `
        INSERT INTO user_preference (user_id, company_name)
        VALUES (?, ?)
    `;

    mysqlDB.query(insertPreferenceSQL, [user_id, company_name], (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            const errorMap = {
                ER_DUP_ENTRY: { result: "preference_already_exists" },   // 중복된 선호도 등록
                ER_DATA_TOO_LONG: { result: "data_too_long" },           // 데이터 길이 초과
                ER_TRUNCATED_WRONG_VALUE: { result: "invalid_value" },   // 잘못된 값
                ER_NO_DEFAULT_FOR_FIELD: { result: "missing_default" },  // 기본값 누락
                ER_BAD_NULL_ERROR: { result: "null_value_error" }        // NULL 허용되지 않음
            };
            return res.status(500).json(errorMap[err.code] || {
                result: "preference_insert_fail", // 기타 삽입 실패
                message: err.message
            });
        }

        return res.status(201).json({
            result: "preference_insert_success", // 선호도 등록 성공
            message: "Preference data added successfully",
            insertId: result.insertId
        });
    });
});

module.exports = router;