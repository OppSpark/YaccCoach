import React, { useState } from 'react';
import './search-components.css'; 

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://dev.api.yacccoach.oppspark.net/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 쿠키 전송 필수
        body: JSON.stringify({ symptom: symptoms }) // user_id 제거
      });

      if (!response.ok) throw new Error('서버 응답 오류 (' + response.status + ')');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="symptom-form">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="증상을 상세히 입력해주세요"
          className="symptom-input"
          required
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '분석 중...' : '진단 시작'}
        </button>
      </form>

      {error && <p className="error-message">⚠️ {error}</p>}

      {result && (
        <div className="result-section">
          <div className="result-card">
            <h3>💊 추천 의약품</h3>
            <ul>
              {result.openAiResult?.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {result.userPreference && (
            <div className="result-card">
              <h3>⭐ 선호 제약사</h3>
              <ul>
                {result.userPreference.map((pref) => (
                  <li key={pref.preference_id}>{pref.company_name}</li>
                ))}
              </ul>
            </div>
          )}

          {result.diseaseResult && (
            <div className="result-card">
              <h3>⚕️ 기존 질환 기록</h3>
              <ul>
                {result.diseaseResult.map((disease) => (
                  <li key={disease.disease_id}>{disease.disease_name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;