require('dotenv').config();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const getMedicineRecommendations = async (symptom) => {
    const model = "gpt-4o";
    const systemContent = "사용자의 증상을 입력받으면, 해당 증상에 맞는 한국에서 판매되는 일반의약품 3가지를 추천하세요. 각 약품명은 띄어쓰기 없이 제공하며, JSON 형식으로 출력합니다. 예를 들어, {\"items\": [\"약품명1\", \"약품명2\", \"약품명3\"]}. 만약 예외나 이상한 입력이 들어오면, {\"error\": \"su00\"} 형식으로 출력합니다.";

    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: symptom }
            ],
            response_format: { type: "json_object" },
            max_tokens: 50
        });

        const result = JSON.parse(completion.choices[0].message.content);
        return result;

    } catch (error) {
        console.error("OpenAI API 호출 오류:", error);
        throw error;
    }
};

module.exports = { getMedicineRecommendations };