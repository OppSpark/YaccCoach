require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getMedicineRecommendations = async (symptom) => {
    const model = "gpt-4o";
    const systemContent = `
        사용자의 증상을 입력받으면, 해당 증상에 맞는 한국에서 판매되는 일반의약품 3가지를 추천하세요. 
        각 약품명은 띄어쓰기 없이 제공하며, JSON 형식으로 출력합니다. 
        openAPI에 검색하기 때문에 약품 이름이 너무 정확하면 검색이 안될 수 있습니다. 예시) "타이레놀정500mg" -> "타이레놀" , "모드콜에스" -> "모드콜"
        예를 들어, {\"items\": [\"약품명1\", \"약품명2\", \"약품명3\"]}. 
        만약 예외나 이상한 입력이 들어오면, {\"error\": \"su00\"} 형식으로 출력합니다.
    `;

    try {
        const completion = await openai.chat.completions.create({
            model,
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: symptom },
            ],
            response_format: { type: "json_object" },
            max_tokens: 100,
        });

        const parsed = JSON.parse(completion.choices[0].message.content);
        return parsed; // ✅ 여기 중요! 기존처럼 그대로 반환해야 프론트 오류 안 남
    } catch (error) {
        console.error("OpenAI API 호출 오류:", error);
        throw error;
    }
};

module.exports = { getMedicineRecommendations };
