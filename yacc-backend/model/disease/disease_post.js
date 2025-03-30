const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

router.post("/disease", (req, res) => {
    const { user_id, disease_name } = req.body;

    if (!user_id || !disease_name)
        return res.status(400).json({
            result: "missing_user_id_or_disease", // user_id 또는 disease_name 누락
            message: "user_id and disease_name are required"
        });

    const diseaseSQL = "INSERT INTO user_disease_info (user_id, disease_name) VALUES (?, ?)";
    const params = [user_id, disease_name];

    mysqlDB.query(diseaseSQL, params, (err, result) => {
        if (err) {
            console.error("DB 삽입 오류:", err);
            const errorMap = {
                ER_DUP_ENTRY: { result: "disease_already_exists" },       // 중복된 질병명
                ER_DATA_TOO_LONG: { result: "data_too_long" },            // 데이터 길이 초과
                ER_TRUNCATED_WRONG_VALUE: { result: "invalid_value" },    // 잘못된 값 형식
                ER_NO_DEFAULT_FOR_FIELD: { result: "missing_default" },   // 필드 기본값 없음
                ER_BAD_NULL_ERROR: { result: "null_value_error" },        // NULL 허용 안되는 필드 누락
            };
            return res.status(500).json(errorMap[err.code] || {
                result: "disease_insert_fail", // 기타 삽입 실패
                message: err.message
            });
        }

        if (result.affectedRows === 0)
            return res.status(500).json({
                result: "no_rows_inserted", // 삽입 실패 (영향 받은 행 없음)
                message: "No row was inserted"
            });

        return res.status(201).json({ result: "disease_insert_success" }); // 삽입 성공
    });
});

module.exports = router;