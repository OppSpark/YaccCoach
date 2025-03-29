const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../service/authMiddleWare.js');

router.post("/verifyUser", isLoggedIn, (req, res) => {
    const clientUserId = parseInt(req.body.user_id, 10); 

    if (clientUserId === req.session.userId) {
        res.json({ 
            result: "valid_user",
            message: "사용자가 일치합니다."
        });
    } else {
        res.status(403).json({ 
            result: "invalid_user",
            message: "사용자가 일치하지 않습니다."
        });
    }
});

module.exports = router;