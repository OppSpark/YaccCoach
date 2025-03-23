const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
    // 세션이 없는 경우
    if (!req.session) {
        return res.send({
            result: "logout_fail",
            message: "No active session.",
        });
    }

    // 세션 파기
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.send({
                result: "logout_fail",
                message: "Server error.",
            });
        }
        // 쿠키 제거
        res.clearCookie("connect.sid");
        return res.send({
            result: "logout_success",
            message: "Logged out successfully.",
        });
    });
});

module.exports = router;
