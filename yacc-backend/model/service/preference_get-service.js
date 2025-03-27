const mysqlDB = require("../database/databaseInfo.js");

const getUserPreference = (user_id, pageNo = 1, limit = 5) => {
    const offset = (pageNo - 1) * limit;

    const preferenceSQL = `
        SELECT * FROM user_preference
        WHERE user_id = ?
        ORDER BY user_id DESC
        LIMIT ? OFFSET ?;
    `;

    return new Promise((resolve, reject) => {
        mysqlDB.query(preferenceSQL, [user_id, limit, offset], (err, result) => {
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

module.exports = { getUserPreference };