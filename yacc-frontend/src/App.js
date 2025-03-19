import React, { useState } from 'react';
import './App.css';
function DrugInfoApp() {
  const [drugData, setDrugData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://100.92.18.19:3330/drugInfo?itemName=%EC%BD%9C%EB%8C%80%EC%9B%90&type=json');

      if (!response.ok) throw new Error('API 요청 실패');
      
      const data = await response.json();
      setDrugData(data.body.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleFetchData} disabled={loading}>
        {loading ? '불러오는 중...' : '의약품 정보 조회'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {loading && <p>불러오는 중...</p>}

      {drugData && drugData.map((item, index) => (
        <div key={index}>
          <h2>{item.itemName}</h2>
          <p>{item.efcyQesitm}</p>
        </div>
      ))}
    </div>
  );
}

export default DrugInfoApp;
