const express = require("express");
const axios = require("axios");
const router = express.Router();

// 약국 정보 조회 API (공공데이터)
router.get("/storeInfo", async (req, res) => {
    console.log("🧭 Incoming request to /storeInfo");
    
    const apiUrl = "http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire";

    const {
        Q0 = "부산광역시",     // 시도
        Q1 = "남구",         // 시군구
        QT = "1",             // 요일코드 (1~8: 월~일, 공휴일)
        QN = "",              // 기관명 (약국명)
        ORD = "NAME",        // 정렬 기준
        pageNo = "1",
        numOfRows = "10"
    } = req.query;

    if (!process.env.PHARMACY_API_KEY) {
        return res.status(500).json({ result: "missing_api_key", message: "API 키가 설정되지 않았습니다." });
    }

    const serviceKey = decodeURIComponent(process.env.PHARMACY_API_KEY);
    console.log("🛠️ /storeInfo endpoint triggered");

    console.log("약국 API 호출 요청 시작:", {
        Q0, Q1, QT, QN, ORD, pageNo, numOfRows
    });

    try {
        const response = await axios.get(apiUrl, {
            params: {
                serviceKey,
                Q0,
                Q1,
                QT,
                QN,
                ORD,
                pageNo,
                numOfRows,
            },
            timeout: 5000
        });

        console.log("공공데이터 응답 수신:", response.data);

        const body = response.data?.response?.body;

        if (!body) {
            console.log("예상치 못한 응답 구조:", response.data);
            return res.status(500).json({ result: "malformed_response", message: "공공데이터 응답 오류" });
        }

        return res.status(200).json({
            result: "store_fetch_success",
            data: body
        });
    } catch (err) {
        console.error("공공 API 호출 오류:", err);

        if (err.code === "ECONNABORTED") {
            return res.status(500).json({ result: "request_timeout", message: "요청 시간이 초과되었습니다." });
        }

        if (err.response?.status === 403) {
            return res.status(403).json({ result: "forbidden_access", message: "접근 권한이 없습니다." });
        }

        return res.status(500).json({ result: "external_api_error", message: "외부 API 오류" });
    }
});

module.exports = router;