const mysqlDB = require("../database/databaseInfo.js");

const getDisease = (user_id, pageNo = 1) => {
    const diseaseSQL = `
        SELECT * FROM user_disease_info
        WHERE user_id = ?
        ORDER BY user_id DESC
        LIMIT ? OFFSET ?;
    `;
    const offset = (pageNo - 1) * 5;

    return new Promise((resolve, reject) => {
        mysqlDB.query(diseaseSQL, [user_id, 5, offset], (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                return reject(err);
            }
            if (result.length === 0) {
                return resolve(null);
            }
            resolve(result);
        });
    });
};

module.exports = { getDisease };

module.exports = { getDisease };