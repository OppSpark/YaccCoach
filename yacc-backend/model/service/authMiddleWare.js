const isLoggedIn = (req, res, next) => {
    // 세션에 userId가 존재하는지 확인
    if (req.session.userId) {
        console.log('✅ 로그인 됨');
        // userId가 존재하면 다음 미들웨어로 진행
        next();
    } else {
        console.log('❌ 로그인 안됨');
        res.status(401).json({ 
            result: "unauthorized", 
            message: "로그인이 필요합니다."
        });
    }
};

module.exports = { isLoggedIn };