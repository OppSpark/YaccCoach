require('dotenv').config();
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.post("/openAi", async (req, res) => {
    const model = "gpt-4o";
    const content = `사용자의 증상을 입력받으면, 해당 증상에 맞는 한국에서 판매되는 일반의약품 3가지를 추천하세요. 
                    각 약품명은 띄어쓰기 없이 제공하며, JSON 형식으로 출력합니다. 
                    openAPI에 검색하기 때문에 약품 이름이 너무 정확하면 검색이 안될 수 있습니다.
                    예를 들어, {\"items\": [\"약품명1\", \"약품명2\", \"약품명3\"]}. 
                    만약 예외나 이상한 입력이 들어오면, {\"error\": \"su00\"} 형식으로 출력합니다.`

    const { prompt } = req.body;

    if (!prompt || prompt.trim().length < 2) {
        return res.status(400).json({ result: "invalid_prompt_format" }); // 사용자 입력 형식 오류
    }

    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: content },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            max_tokens: 50
        });

        let result;
        try {
            result = JSON.parse(completion.choices[0].message.content);
        } catch (parseError) {
            return res.status(500).json({ result: "openai_response_parse_error" }); // GPT 응답 파싱 오류
        }

        res.json(result);

    } catch (error) {
        console.error("OpenAI API 오류:", error);
        return res.status(500).json({ result: "openai_api_error" }); // OpenAI API 호출 오류
    }
});

module.exports = router;