const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

// 사용자 선호도 정보 삭제 API
router.delete("/preference", (req, res) => {
    const { id, user_id } = req.body;

    if (!id || !user_id)
        return res.status(400).json({
            result: "missing_id_or_user_id", // id 또는 user_id 누락
            message: "id and user_id are required"
        });

    const deletePreferenceSQL = `
        DELETE FROM user_preference
        WHERE preference_id = ? AND user_id = ?
    `;

    mysqlDB.query(deletePreferenceSQL, [id, user_id], (err, result) => {
        if (err) {
            console.error("Database delete error:", err);
            const errorMap = {
                ER_ROW_IS_REFERENCED_2: { result: "foreign_key_constraint" }, // 외래키 제약으로 삭제 실패
                ER_DATA_TOO_LONG: { result: "data_too_long" },               // 데이터 길이 초과
                ER_TRUNCATED_WRONG_VALUE: { result: "invalid_value" },       // 잘못된 값
            };
            return res.status(500).json(errorMap[err.code] || {
                result: "preference_delete_fail", // 일반적인 삭제 실패
                message: err.message
            });
        }

        if (result.affectedRows === 0)
            return res.status(404).json({
                result: "preference_not_found", // 삭제할 데이터 없음
                message: "No matching preference data found to delete"
            });

        return res.status(200).json({
            result: "preference_delete_success", // 삭제 성공
            message: "Preference data deleted successfully"
        });
    });
});

module.exports = router;