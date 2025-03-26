const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

// 사용자 선호도 정보 수정 API
router.put("/preference", (req, res) => {
    const { id, user_id, company_name } = req.body;

    // 필수 파라미터 검증
    if (!id || !user_id || !company_name) {
        return res.status(400).json({
            result: "parameters_required",
            message: "id, user_id and company_name are required"
        });
    }

    const updatePreferenceSQL = `
        UPDATE user_preference
        SET company_name = ?
        WHERE id = ? AND user_id = ?;
    `;

    mysqlDB.query(updatePreferenceSQL, [company_name, id, user_id], (err, result) => {
        if (err) {
            console.error("Database update error:", err);
            return res.status(500).json({ error: "Database update failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                result: "no_data_updated",
                message: "No matching preference data found to update"
            });
        }

        return res.status(200).json({
            result: "success",
            message: "Preference data updated successfully"
        });
    });
});

module.exports = router;