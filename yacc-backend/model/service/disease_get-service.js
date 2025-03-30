const mysqlDB = require("../database/databaseInfo.js");

const getDisease = (user_id, pageNo = 1) => {
    return new Promise((resolve, reject) => {
        if (!user_id) {
            return reject(new Error("user_id_required")); // user_id 누락
        }

        if (isNaN(pageNo) || pageNo < 1) {
            return reject(new Error("invalid_page_number")); // 잘못된 페이지 번호
        }

        const offset = (pageNo - 1) * 5;
        const sql = `
            SELECT * FROM user_disease_info
            WHERE user_id = ?
            ORDER BY user_id DESC
            LIMIT ? OFFSET ?;
        `;

        mysqlDB.query(sql, [user_id, 5, offset], (err, result) => {
            if (err) {
                console.error("DB 오류:", err);
                return reject(new Error("disease_query_fail")); // DB 오류
            }

            return resolve(result); // result는 배열
        });
    });
};

module.exports = { getDisease };