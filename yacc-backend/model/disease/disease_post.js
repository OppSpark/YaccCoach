const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

router.post("/disease", (req, res) => {
    const { user_id, disease_name } = req.body;

    if (!user_id || !disease_name) {
        return res.status(400).send({
            result: "user_id_disease_name_required",
            message: "user_id and disease_name is required",
        });
    }
    try {
        const diseaseSQL = "INSERT INTO user_disease_info (user_id, disease_name) VALUES (? , ?);";
        const params = [user_id, disease_name];

        mysqlDB.query(diseaseSQL, params, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database query failed" });
            }
            
            if(result.affectedRows === 0) {
                return res.status(404).json({ result: "null_to_data" });
            }
            return res.json({ result: "disease_insert_success" });
        });

    } catch (e) {
        const errorMap = {
            ER_DUP_ENTRY: { result: "already_exist" },
            ER_DATA_TOO_LONG: { result: "data_too_long" },
            ER_TRUNCATED_WRONG_VALUE: { result: "truncated_wrong_value" },
            ER_NO_DEFAULT_FOR_FIELD: { result: "no_default_for_field" },
            ER_BAD_NULL_ERROR: { result: "bad_null_error" }
        };
        return res.send(errorMap[err.code] || { 
            result: "insert_fail",
            message: err.message 
        });
    }
});

module.exports = router;
