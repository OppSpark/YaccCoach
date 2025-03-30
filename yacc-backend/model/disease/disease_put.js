const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

router.put("/disease", (req, res) => {
    const { disease_id, user_id, disease_name } = req.body;

    if (!user_id || !disease_name || !disease_id)
        return res.status(400).json({
            result: "missing_required_fields", // user_id, disease_name, disease_id 중 누락
            message: "user_id, disease_name, and disease_id are required"
        });

    const diseaseSQL = `
        UPDATE user_disease_info 
        SET disease_name = ? 
        WHERE user_id = ? AND disease_id = ?
    `;
    const params = [disease_name, user_id, disease_id];

    mysqlDB.query(diseaseSQL, params, (err, result) => {
        if (err) {
            console.error("DB 수정 오류:", err);
            const errorMap = {
                ER_DUP_ENTRY: { result: "duplicate_disease_name" },     // 중복된 이름
                ER_DATA_TOO_LONG: { result: "data_too_long" },          // 입력 데이터 길이 초과
                ER_TRUNCATED_WRONG_VALUE: { result: "invalid_value" },  // 잘못된 값 입력
                ER_NO_DEFAULT_FOR_FIELD: { result: "missing_default" }, // 기본값 누락
                ER_BAD_NULL_ERROR: { result: "null_value_error" }       // NULL 허용되지 않음
            };
            return res.status(500).json(errorMap[err.code] || {
                result: "disease_update_fail", // 그 외 DB 에러
                message: err.message
            });
        }

        if (result.affectedRows === 0)
            return res.status(404).json({ result: "disease_not_found", message: "No matching disease found" }); // 조건에 맞는 데이터 없음

        if (result.changedRows === 0)
            return res.status(200).json({ result: "no_change", message: "No data was changed" }); // 변경된 내용 없음

        return res.status(200).json({ result: "disease_update_success" }); // 업데이트 성공
    });
});

module.exports = router;