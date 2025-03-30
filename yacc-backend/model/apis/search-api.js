const express = require("express");
const router = express.Router();
const { getMedicineRecommendations } = require("../service/openAi-api-service");
const { getUserPreference } = require("../service/preference_get-service");
const { getDisease } = require("../service/disease_get-service");
const { isLoggedIn } = require("../service/authMiddleWare");

router.post("/search", isLoggedIn, async (req, res) => {
    const { symptom } = req.body;
    const reqPage = req.query.reqPage || 1;

    if (!symptom) {
        return res.status(400).json({
            result: "parameters_required", // 필수 파라미터 누락 오류
            message: "symptom은 필수입니다.",
        });
    }

    const user_id = req.session.userId;

    if (!user_id) {
        return res.status(401).json({
            result: "unauthorized", // 로그인 인증 정보 없음
            message: "로그인이 필요합니다.",
        });
    }

    console.log("세션 user_id:", user_id);
    console.log("symptom:", symptom);
    console.log("reqPage:", reqPage);

    try {
        const openAiResult = await getMedicineRecommendations(symptom);
        const diseaseResult = await getDisease(user_id, reqPage);
        const userPreference = await getUserPreference(user_id);

        res.json({ openAiResult, userPreference, diseaseResult });

    } catch (error) {
        console.error("API 호출 중 에러 발생:", error);

        if (error.message.includes("OpenAI")) {
            return res.status(500).json({ result: "openai_service_error" }); // OpenAI 서비스 호출 실패
        }

        if (error.message.includes("preference")) {
            return res.status(500).json({ result: "user_preference_error" }); // 사용자 선호도 정보 조회 실패
        }

        if (error.message.includes("disease")) {
            return res.status(500).json({ result: "disease_info_error" }); // 질병 정보 조회 실패
        }

        return res.status(500).json({ result: "internal_server_error" }); // 그 외 서버 내부 오류
    }
});

module.exports = router;