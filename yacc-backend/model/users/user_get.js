const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

router.get("/user", (req, res) => {
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ result: "user_id_required", message: "user_id is required" });

    const sql = `
        SELECT user_id, username, email, tel_number, address, agreed_personal
        FROM user
        WHERE user_id = ?
    `;

    new Promise((resolve, reject) => {
        mysqlDB.query(sql, [user_id], (err, result) => err ? reject(err) : resolve(result));
    })
        .then((result) => {
            if (!result?.length)
                return res.status(404).json({ result: "no_user_data", message: "No user records found" }); // 유저 정보 없음

            return res.status(200).json({ result: "user_fetch_success", data: result[0] });
        })
        .catch((err) => {
            console.error("Database query error:", err);
            return res.status(500).json({ result: "user_query_fail", message: "Database query failed" });  // DB 쿼리 실패
        });
});

module.exports = router;