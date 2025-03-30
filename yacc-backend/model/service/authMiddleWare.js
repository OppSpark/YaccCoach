const isLoggedIn = (req, res, next) => {
    // 세션에 userId가 존재하는지 확인
    if (req.session.userId) {
        console.log('isLoggedIn :' + req.session.userId);
        return next(); // 로그인 되어 있으면 다음으로
    }

    console.log('로그인 상태 아님');
    return res.status(401).json({
        result: "unauthorized", // 인증 실패
        message: "로그인이 필요합니다."
    });
};

module.exports = { isLoggedIn };