require('dotenv').config();
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.post("/openAi", (req, res) => {
    const { prompt } = req.body;

    openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { 
                role: "system",
                content: "사용자의 증상을 입력받으면, 해당 증상에 맞는 한국에서 판매되는 일반의약품 3가지를 추천하세요. 각 약품명은 띄어쓰기 없이 제공하며, JSON 형식으로 출력합니다. 예를 들어, {\"items\": [\"약품명1\", \"약품명2\", \"약품명3\"]}. 만약 예외나 이상한 입력이 들어오면, {\"error\": \"su00\"} 형식으로 출력합니다."
            },
            { 
                role: "user", 
                content: prompt 
            }
        ],
        response_format: { type: "json_object" },
        max_tokens: 50
    })
    .then(completion => {
        const result = JSON.parse(completion.choices[0].message.content);
        res.json(result);
    })
    .catch(error => {
        console.error("OpenAI API 오류:", error);
        res.status(500).json({ error: "처리 실패" });
    });
});

module.exports = router;