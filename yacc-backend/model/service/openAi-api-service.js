require('dotenv').config();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const getMedicineRecommendations = async (symptom) => {
    const model = "gpt-4o";
    const systemContent = `
        사용자의 증상을 입력받으면, 해당 증상에 맞는 한국에서 판매되는 일반의약품 3가지를 추천하세요.
        각 약품명은 띄어쓰기 없이 제공하며, JSON 형식으로 출력합니다.
        예: {"items": ["약품명1", "약품명2", "약품명3"]}.
        이상하거나 예외적인 입력은 {"error": "su00"}로 응답합니다.
    `;

    try {
        const completion = await openai.chat.completions.create({
            model,
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: symptom }
            ],
            response_format: { type: "json_object" },
            max_tokens: 50
        });

        const parsed = JSON.parse(completion.choices[0].message.content);
        return parsed; // ✅ 여기 중요! 기존처럼 그대로 반환해야 프론트 오류 안 남

    } catch (error) {
        console.error("OpenAI API 호출 오류:", error);
        throw error;
    }
};

module.exports = { getMedicineRecommendations };