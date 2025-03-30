const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleWare");

router.post("/verifyUser", isLoggedIn, (req, res) => {
    const { user_id } = req.body;

    // user_id가 없는 경우
    if (!user_id) {
        return res.status(400).json({
            result: "missing_user_id", // user_id 파라미터 누락
            message: "user_id is required.",
        });
    }

    const clientUserId = parseInt(user_id, 10);

    // 숫자로 변환 불가능한 경우
    if (isNaN(clientUserId)) {
        return res.status(400).json({
            result: "invalid_user_id_format", // user_id가 숫자 형식이 아님
            message: "user_id must be a valid number.",
        });
    }

    if (clientUserId === req.session.userId) {
        return res.json({
            result: "valid_user", // 인증된 사용자
            message: "사용자가 일치합니다.",
        });
    } else {
        return res.status(403).json({
            result: "invalid_user", // 사용자 불일치
            message: "사용자가 일치하지 않습니다.",
        });
    }
});

module.exports = router;
