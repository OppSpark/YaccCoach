const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

// 사용자 선호도 정보 수정 API
router.put("/preference", (req, res) => {
    const { id, user_id, company_name } = req.body;

    if (!id || !user_id || !company_name)
        return res.status(400).json({
            result: "missing_required_fields", // id, user_id 또는 company_name 누락
            message: "id, user_id and company_name are required"
        });

    const updatePreferenceSQL = `
        UPDATE user_preference
        SET company_name = ?
        WHERE id = ? AND user_id = ?
    `;

    mysqlDB.query(updatePreferenceSQL, [company_name, id, user_id], (err, result) => {
        if (err) {
            console.error("Database update error:", err);
            const errorMap = {
                ER_DUP_ENTRY: { result: "duplicate_company_name" },      // 중복된 회사명
                ER_DATA_TOO_LONG: { result: "data_too_long" },           // 데이터 길이 초과
                ER_TRUNCATED_WRONG_VALUE: { result: "invalid_value" },   // 잘못된 값
                ER_NO_DEFAULT_FOR_FIELD: { result: "missing_default" },  // 기본값 누락
                ER_BAD_NULL_ERROR: { result: "null_value_error" }        // NULL 허용되지 않는 필드 누락
            };
            return res.status(500).json(errorMap[err.code] || {
                result: "preference_update_fail", // 기타 업데이트 실패
                message: err.message
            });
        }

        if (result.affectedRows === 0)
            return res.status(404).json({
                result: "preference_not_found", // 수정할 데이터 없음
                message: "No matching preference data found to update"
            });

        return res.status(200).json({
            result: "preference_update_success", // 수정 성공
            message: "Preference data updated successfully"
        });
    });
});

module.exports = router;