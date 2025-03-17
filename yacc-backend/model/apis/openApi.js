const express = require("express");
const router = express.Router();

router.get("/drugInfo", (req, res) => {
  const apiUrl = "http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList";

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

  const serviceKey = decodeURIComponent(
    process.env.OPENAPI_API_KEY
  );

  axios
    .get(
      apiUrl,
      {
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
      }
    )
    .then((response) => {
      // console.log("API 요청 성공:", response.data);
      console.log("API 요청 성공:", response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.error("API 요청 실패:", error);
      res.status(500).json({ error: "외부 API 연동 실패" });
    });
});

module.exports = router;
