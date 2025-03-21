import apiConfig from '../config/apiconfig';

export const fetchDrugData = async (itemName) => {
  try {
    const url = new URL(
      `${apiConfig.baseURL}${apiConfig.endpoints.drugInfo}`
    );

    const params = new URLSearchParams({
      itemName: encodeURIComponent(itemName),
      ...apiConfig.defaultParams
    });

    url.search = params.toString();

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API 요청 실패 (상태 코드: ${response.status})`);
    }

    const data = await response.json();
    return data.body.items; // 응답 구조에 맞게 조정

  } catch (error) {
    console.error('API 호출 에러:', error);
    throw new Error(error.message || '의약품 정보를 불러오는데 실패했습니다');
  }
};
