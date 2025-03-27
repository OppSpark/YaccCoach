const express = require("express");
const router = express.Router();
const { getMedicineRecommendations } = require("../service/openAi-api-service");
const { getDrugInfo } = require("../service/openApi-service");
const { getUserPreference } = require("../service/preference_get-service");
const { getDisease } = require("../service/disease_get-service");

router.get("/search", async (req, res) => {
    const { user_id, symptom } = req.body;
    const reqPage = req.query.reqPage || 1;

    if (!user_id || !symptom) {
        return res.status(400).json({
            result: "parameters_required",
            message: "user_id와 symptom은 필수입니다.",
        });
    }

    try {
        // OpenAI 호출
        const openAiResult = await getMedicineRecommendations(symptom);
        console.log("openAi API 응답:", openAiResult);

        // 질병정보 DB 호출
        const diseaseResult = await getDisease(user_id, reqPage);
        console.log("disease DB 응답:", diseaseResult);

        const userPreference = await getUserPreference(user_id);
        console.log("userPreference DB 응답:", userPreference);

        // 의약품 상세정보 API 호출 (첫 번째 추천 약품 기준)
        
        let entpNameResult = "";
        let atpnQesitmResult = "";
        let intrcQesitmResult = "";
        let seQesitmResult = "";
        let drugInfoResult = null;


        if (openAiResult.items && openAiResult.items.length > 0) {
            drugInfoResult = await getDrugInfo({
              itemName: openAiResult.items[0],
              entpName: entpNameResult,
              atpnQesitm:  atpnQesitmResult,
              intrcQesitm: intrcQesitmResult,
              seQesitm:   seQesitmResult,
              
            });
            console.log("drugInfo API 응답:", drugInfoResult);
        }

        // 모든 결과를 한 번에 응답으로 보냄
        res.json({ openAiResult, userPreference, diseaseResult, drugInfoResult });

    } catch (error) {
        console.error("API 호출 중 에러 발생:", error);
        res.status(500).json({ error: "내부 서버 오류" });
    }
});

module.exports = router;