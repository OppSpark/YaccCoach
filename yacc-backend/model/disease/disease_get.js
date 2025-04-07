const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

router.post("/disease/list", (req, res) => {
    const { user_id } = req.body;
    const pageNo = parseInt(req.query.reqPage || "1", 10);
    const offset = (pageNo - 1) * 5;

    if (!user_id){
	console.log(user_id);
        return res.status(400).json({ result: "user_id_required", message: "user_id is required" }); // user_id 누락
    }
    if (isNaN(pageNo) || pageNo < 1)
        return res.status(400).json({ result: "invalid_page_number", message: "reqPage must be a positive integer" }); // 페이지 번호 유효하지 않음

    const diseaseSQL = "SELECT * FROM user_disease_info WHERE user_id = ? ORDER BY user_id DESC LIMIT ? OFFSET ?";

    mysqlDB.query(diseaseSQL, [user_id, 5, offset], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ result: "disease_query_fail", message: "Database query failed" }); // DB 쿼리 오류
        }

        if (result.length === 0)
            return res.status(404).json({ result: "no_disease_data", message: "No disease records found" }); // 질병 정보 없음

        return res.status(200).json({ result: "disease_fetch_success", data: result }); // 조회 성공
    });
});

module.exports = router;
