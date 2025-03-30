const express = require("express");
const router = express.Router();
const mysqlDB = require("../database/databaseInfo.js");
const security = require("../utils/passHashSecurity.js");

const { isValidPassword } = require("./signUpValidators.js");

router.put("/changePassword", async (req, res) => {
    const { user_id, current_password, new_password } = req.body;

    if (!user_id || !current_password || !new_password)
        return res.status(400).json({ result: "missing_required_fields", message: "All fields are required." });

    if (!isValidPassword(new_password))
        return res.status(400).json({ result: "invalid_password_format", message: "Invalid password format" });

    if (current_password === new_password)
        return res.status(400).json({ result: "same_as_current_password", message: "New password cannot be the same as current password" });

    try {
        const selectSQL = `SELECT password FROM user WHERE user_id = ?`;
        const [rows] = await new Promise((resolve, reject) => {
            mysqlDB.query(selectSQL, [user_id], (err, rows) => (err ? reject(err) : resolve([rows])));
        });

        if (!rows.length)
            return res.status(404).json({ result: "user_not_found", message: "User not found" });

        const hashedCurrentPassword = rows[0].password;

        const isMatch = await security.comparePassword(current_password, hashedCurrentPassword);
        if (!isMatch)
            return res.status(401).json({ result: "incorrect_current_password", message: "Current password is incorrect" });

        const hashedNewPassword = await security.hashPassword(new_password);
        const updateSQL = `UPDATE user SET password = ? WHERE user_id = ?`;
        const updateResult = await new Promise((resolve, reject) => {
            mysqlDB.query(updateSQL, [hashedNewPassword, user_id], (err, result) => (err ? reject(err) : resolve(result)));
        });

        if (updateResult.affectedRows === 0)
            return res.status(404).json({ result: "password_update_failed", message: "Password update failed" });

        return res.status(200).json({ result: "password_change_success", message: "Password changed successfully" });

    } catch (err) {
        console.error("비밀번호 변경 오류:", err);
        return res.status(500).json({ result: "password_change_fail", message: err.message });
    }
});

module.exports = router;