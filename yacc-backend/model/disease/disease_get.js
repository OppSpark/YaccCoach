const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

router.get("/disease", (req, res) => {
    const { user_id } = req.body;
    const diseaseSQL = "SELECT * FROM user_disease_info WHERE user_id = ? ORDER BY user_id DESC LIMIT ? OFFSET ?;"; 
    const pageNo = req.query.reqPage;
    const offset = (pageNo - 1) * 5;

    if (!user_id) {
        return res.status(400).send({
            result: "user_id_required",
            message: "user_id is required"
        });
    }
    
    mysqlDB.query(diseaseSQL, [user_id, 5, offset], (err, result) => { 
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
