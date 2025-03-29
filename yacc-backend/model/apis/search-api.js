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
            result: "parameters_required",
            message: "symptom은 필수입니다.",
        });
    }

    // 세션에서 user_id를 자동으로 가져옴
    const user_id = req.session.userId;

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
        res.status(500).json({ error: "내부 서버 오류" });
    }
});

module.exports = router;