const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

// 사용자 선호도 정보 추가 API
router.post("/preference", (req, res) => {
    const { user_id, company_name } = req.body;

    // 필수 파라미터 검증
    if (!user_id || !company_name) {
        return res.status(400).json({
            result: "parameters_required",
            message: "user_id and company_name are required"
        });
    }

    const insertPreferenceSQL = `
        INSERT INTO user_preference (user_id, company_name)
        VALUES (?, ?);
    `;

    mysqlDB.query(insertPreferenceSQL, [user_id, company_name], (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            return res.status(500).json({ error: "Database insertion failed" });
        }

        return res.status(201).json({
            result: "success",
            message: "Preference data added successfully",
            insertId: result.insertId
        });
    });
});

module.exports = router;