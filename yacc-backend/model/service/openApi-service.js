require('dotenv').config();
const axios = require('axios');

// 사용자 약 정보 조회 함수 (공공 API)
const getDrugInfo = async ({
    pageNo = "1",
    numOfRows = "5",
    type = "json",
    itemName = "",
    entpName = "",
    atpnQesitm = "",
    intrcQesitm = "",
    seQesitm = ""
}) => {
    const apiUrl =
        "http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList";

    const apiKey = process.env.OPENAPI_API_KEY;

    if (!apiKey) {
        return {
            result: "missing_api_key", // 환경변수에서 API 키 없음
            message: "OPENAPI_API_KEY is not defined in environment variables."
        };
    }

    const serviceKey = decodeURIComponent(apiKey);

    try {
        const response = await axios.get(apiUrl, {
            params: {
                serviceKey,
                pageNo,
                numOfRows,
                entpName,
                itemName,
                atpnQesitm,
                intrcQesitm,
                seQesitm,
                type
            },
            timeout: 5000 // 5초 타임아웃
        });

        if (!response.data || !response.data.body) {
            return {
                result: "malformed_response", // 응답 형식 오류
                message: "Invalid structure from drug info API"
            };
        }

        return response.data; // 정상 응답 그대로 반환

    } catch (error) {
        console.error("Drug Info API 요청 실패:", error);

        if (error.code === "ECONNABORTED") {
            return {
                result: "request_timeout", // 요청 시간 초과
                message: "Drug Info API request timed out"
            };
        }

        if (error.response?.status === 403) {
            return {
                result: "forbidden_access", // 403 권한 오류
                message: "Access to drug info API is forbidden"
            };
        }

        return {
            result: "external_api_error", // 그 외 오류
            message: "Failed to fetch data from drug info API"
        };
    }
};

module.exports = { getDrugInfo };