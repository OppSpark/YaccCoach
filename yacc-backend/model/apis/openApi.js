const express = require("express");
const router = express.Router();

router.get("/drugInfo", (req, res) => {
    const apiUrl =
        "http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList";

    const {
        pageNo = "1",
        numOfRows = "5",
        type = "json",
        itemName = "", // 약 이름
        entpName = "", // 제조사
        atpnQesitm = "", // 주의사항
        intrcQesitm = "", // 주의할 음식
        seQesitm = "", // 이상반응
    } = req.query;

    const axios = require("axios");

    // 환경변수에 API 키가 존재하지 않는 경우 예외 처리
    if (!process.env.OPENAPI_API_KEY) {
        return res.status(500).json({ result: "missing_api_key" }); // 환경변수에서 API 키를 찾을 수 없음
    }

    const serviceKey = decodeURIComponent(process.env.OPENAPI_API_KEY);

    axios
        .get(apiUrl, {
            params: {
                serviceKey: serviceKey,
                pageNo: pageNo,
                numOfRows: numOfRows,
                entpName: entpName,
                itemName: itemName,
                atpnQesitm: atpnQesitm,
                intrcQesitm: intrcQesitm,
                seQesitm: seQesitm,
                type: type,
            },
            timeout: 5000 // 타임아웃 설정 (5초)
        })
        .then((response) => {
            if (!response.data || !response.data.body) {
                return res.status(500).json({ result: "malformed_response" }); // 외부 API의 응답 형식이 예상과 다름
            }
            res.json(response.data);
        })
        .catch((error) => {
            if (error.code === 'ECONNABORTED') {
                return res.status(500).json({ result: "request_timeout" }); // API 요청 시간 초과
            }

            if (error.response && error.response.status === 403) {
                return res.status(500).json({ result: "forbidden_access" }); // 외부 API 접근 권한 오류
            }

            return res.status(500).json({ result: "external_api_error" }); // 외부 공공데이터 API 호출 실패
        });
});

module.exports = router;