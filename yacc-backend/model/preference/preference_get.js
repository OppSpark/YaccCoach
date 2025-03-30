const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

// 사용자 선호도 정보 조회 API
router.get("/preference", (req, res) => {
    const { user_id } = req.body; // 필요 시 req.query.user_id 또는 req.session.userId로 변경 가능
    const pageNo = parseInt(req.query.reqPage) || 1;
    const limit = 5;
    const offset = (pageNo - 1) * limit;

    if (!user_id)
        return res.status(400).json({
            result: "user_id_required", // user_id 누락
            message: "user_id is required"
        });

    if (isNaN(pageNo) || pageNo < 1)
        return res.status(400).json({
            result: "invalid_page_number", // 페이지 번호가 숫자가 아님 또는 0 이하
            message: "reqPage must be a positive integer"
        });

    const preferenceSQL = `
        SELECT * FROM user_preference
        WHERE user_id = ?
        ORDER BY user_id DESC
        LIMIT ? OFFSET ?;
    `;

    mysqlDB.query(preferenceSQL, [user_id, limit, offset], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({
                result: "preference_query_fail", // DB 쿼리 실패
                message: "Database query failed"
            });
        }

        if (result.length === 0)
            return res.status(404).json({
                result: "preference_not_found", // 데이터 없음
                message: "No preference data found"
            });

        return res.status(200).json({
            result: "preference_fetch_success", // 조회 성공
            data: result
        });
    });
});

module.exports = router;