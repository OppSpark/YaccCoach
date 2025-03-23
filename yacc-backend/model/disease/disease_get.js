const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

router.get("/disease", (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).send({
            result: "",
            message: "user_id is required",
        });
    }

    const diseaseSQL = "SELECT * FROM user_disease_info WHERE user_id = ?"; 

    mysqlDB.query(diseaseSQL, [user_id], (err, result) => { 
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
