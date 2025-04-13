

const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/reverseGeocode", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ result: "missing_coordinates", message: "위도 또는 경도가 누락되었습니다." });
  }

  const KAKAO_API_KEY = process.env.KAKAO_REST_API_KEY;
  if (!KAKAO_API_KEY) {
    return res.status(500).json({ result: "missing_api_key", message: "Kakao API 키가 설정되지 않았습니다." });
  }

  try {
    const response = await axios.get("https://dapi.kakao.com/v2/local/geo/coord2regioncode.json", {
      params: {
        x: lon,
        y: lat
      },
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`
      }
    });

    const regionInfo = response.data.documents?.[0];

    if (!regionInfo) {
      return res.status(500).json({ result: "no_region_info", message: "행정 구역 정보를 찾을 수 없습니다." });
    }

    const Q0 = regionInfo.region_1depth_name; // 시/도
    const Q1 = regionInfo.region_2depth_name; // 시/군/구

    return res.json({ Q0, Q1 });
  } catch (err) {
    console.error("카카오 API 오류:", err);
    return res.status(500).json({ result: "kakao_api_error", message: "카카오 주소 변환 실패" });
  }
});

module.exports = router;
