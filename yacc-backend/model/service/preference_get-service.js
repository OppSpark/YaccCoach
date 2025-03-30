const mysqlDB = require("../database/databaseInfo.js");

const getUserPreference = (user_id, pageNo = 1, limit = 5) => {
    return new Promise((resolve, reject) => {
        if (!user_id || isNaN(pageNo) || pageNo < 1) {
            return resolve([]); // 빈 배열로 리턴하면 프론트에서 .map() 에러 안 남
        }

        const offset = (pageNo - 1) * limit;

        const sql = `
            SELECT * FROM user_preference
            WHERE user_id = ?
            ORDER BY user_id DESC
            LIMIT ? OFFSET ?;
        `;

        mysqlDB.query(sql, [user_id, limit, offset], (err, result) => {
            if (err) {
                console.error("DB 오류:", err);
                return resolve([]); // 오류 발생 시에도 빈 배열 반환
            }

            return resolve(result);
        });
    });
};

module.exports = { getUserPreference };