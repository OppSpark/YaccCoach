const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

// 사용자 선호도 정보 조회 API
router.get("/preference", (req, res) => {
    const { user_id } = req.body;
    const pageNo = parseInt(req.query.reqPage) || 1; // 기본 페이지 1
    const limit = 5;
    const offset = (pageNo - 1) * limit;

    // 필수 파라미터 확인
    if (!user_id) {
        return res.status(400).json({
            result: "user_id_required",
            message: "user_id is required"
        });
    }

    const preferenceSQL = `
        SELECT * FROM user_preference
        WHERE user_id = ?
        ORDER BY user_id DESC
        LIMIT ? OFFSET ?;
    `;

    mysqlDB.query(preferenceSQL, [user_id, limit, offset], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }

        if (result.length === 0) {
            return res.status(404).json({ result: "null_to_data" });
        }

        return res.json(result);
    });
});

module.exports = router;