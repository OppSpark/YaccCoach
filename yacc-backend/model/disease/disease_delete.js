const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

router.delete("/disease", (req, res) => {
    const { disease_id } = req.body;

    if (!disease_id) {
        return res.status(400).send({
            result: "disease_id_disease_name_required",
            message: "disease_id is required",
        });
    }

    try {
        const diseaseSQL = "DELETE FROM user_disease_info WHERE disease_id = ?";
        const params = [disease_id];

        mysqlDB.query(diseaseSQL, params, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database query failed" });
            }

            return res.json({ result: "disease_delete_success" });
        });
    } catch (e) {
        const errorMap = {
            ER_DUP_ENTRY: { result: "already_exist" },
            ER_DATA_TOO_LONG: { result: "data_too_long" },
            ER_TRUNCATED_WRONG_VALUE: { result: "truncated_wrong_value" },
            ER_NO_DEFAULT_FOR_FIELD: { result: "no_default_for_field" },
            ER_BAD_NULL_ERROR: { result: "bad_null_error" },
        };
        return res.send(
            errorMap[err.code] || {
                result: "insert_fail",
                message: err.message,
            }
        );
    }
});

module.exports = router;
