const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

// 사용자 선호도 정보 삭제 API
router.delete("/preference", (req, res) => {
    const { id, user_id } = req.body;

    // 필수 파라미터 검증
    if (!id || !user_id) {
        return res.status(400).json({
            result: "parameters_required",
            message: "id and user_id are required"
        });
    }

    const deletePreferenceSQL = `
        DELETE FROM user_preference
        WHERE id = ? AND user_id = ?;
    `;

    mysqlDB.query(deletePreferenceSQL, [id, user_id], (err, result) => {
        if (err) {
            console.error("Database delete error:", err);
            return res.status(500).json({ error: "Database deletion failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                result: "no_data_deleted",
                message: "No matching preference data found to delete"
            });
        }

        return res.status(200).json({
            result: "success",
            message: "Preference data deleted successfully"
        });
    });
});

module.exports = router;