const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");

router.delete("/disease", (req, res) => {
    const { disease_id } = req.body;

    if (!disease_id)
        return res.status(400).json({ result: "missing_disease_id", message: "disease_id is required" }); // disease_id 누락

    const diseaseSQL = "DELETE FROM user_disease_info WHERE disease_id = ?";
    const params = [disease_id];

    mysqlDB.query(diseaseSQL, params, (err, result) => {
        if (err) {
            console.error("DB 삭제 오류:", err);
            const errorMap = {
                ER_NO_REFERENCED_ROW_2: { result: "disease_not_found" }, // 외래키 제약조건 위반 (존재하지 않는 disease_id)
                ER_ROW_IS_REFERENCED_2: { result: "disease_delete_fail" } // 삭제 실패 (다른 테이블에서 참조 중)
            };
            return res.status(500).json(errorMap[err.code] || {
                result: "disease_delete_fail", // 삭제 실패
                message: err.message
            });
        }

        // 삭제 대상 없음 (영향받은 행이 0개)
        if (result.affectedRows === 0)
            return res.status(404).json({ result: "disease_not_found", message: "No matching disease_id" }); // 존재하지 않는 disease_id

        return res.json({ result: "disease_delete_success" }); // 삭제 성공
    });
});

module.exports = router;