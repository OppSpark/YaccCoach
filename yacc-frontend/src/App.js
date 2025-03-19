import React, { useState } from 'react';
import { fetchDrugData } from './service/drugService';

function DrugInfoApp() {
  const [drugData, setDrugData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchDrugData('콜대원');
      setDrugData(result);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drug-info-container">
      <button 
        onClick={handleFetchData} 
        disabled={loading}
        className="fetch-button"
      >
        {loading ? '데이터 로드 중...' : '의약품 정보 가져오기'}
      </button>

      {error && (
        <div className="error-message">
          ⚠️ 오류 발생: {error}
        </div>
      )}

      {drugData && (
        <div className="drug-list">
          {drugData.map((item, index) => (
            <div key={index} className="drug-item">
              <h2 className="drug-name">{item.itemName}</h2>
              <p className="drug-effect">{item.efcyQesitm}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DrugInfoApp;
