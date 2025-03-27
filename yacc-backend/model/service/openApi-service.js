require('dotenv').config();
const axios = require('axios');

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

    const serviceKey = decodeURIComponent(process.env.OPENAPI_API_KEY);

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
                type,
            },
        });
        

        return response.data;
    } catch (error) {
        console.error("Drug Info API 요청 실패:", error);
        throw error;
    }
};

module.exports = { getDrugInfo };