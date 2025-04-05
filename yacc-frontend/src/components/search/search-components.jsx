import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router 훅 추가
import axios from '../../config/axiosConfig';
import './style.css';

const SymptomDrugInfoPage = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedDrug, setSelectedDrug] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const resultRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedDrug('');
    setSelectedCompany('');

    try {
      const response = await axios.post('/search', { symptom: symptoms }, { withCredentials: true });
      setResult(response.data);
    } catch (err) {
      const code = err.response?.data?.result;
      if (code === 'unauthorized') setError('로그인이 필요해요. 먼저 로그인해주세요.');
      else if (code === 'parameters_required') setError('증상은 필수로 입력해야 해요.');
      else if (code === 'openai_service_error') setError('AI 분석 서버에 문제가 있어요.');
      else if (code === 'user_preference_error') setError('선호 제약사 정보를 가져오지 못했어요.');
      else if (code === 'disease_info_error') setError('기존 질병 정보를 불러오지 못했어요.');
      else setError('알 수 없는 오류가 발생했어요.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = () => {
    if (!selectedDrug) {
      setError('추천 의약품을 선택해주세요.');
      return;
    }

    navigate('/drug-detail', { 
      state: { 
        itemName: selectedDrug, 
        entpName: selectedCompany 
      } 
    });
  };

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

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
          {loading ? '약을 찾는 중...' : '진단 시작'}
        </button>
      </form>

      {error && <p className="error-message">⚠️ {error}</p>}

      {result && (
        <div className="result-section" ref={resultRef}>
          <div className="result-card">
            <h3>💊 추천 의약품</h3>
            <p>1개만 선택해주세요</p>
            <div className="recommend-list">
              {result.openAiResult?.items?.map((item, index) => (
                <label key={index} className={`recommend-pill ${selectedDrug === item ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="drug"
                    value={item}
                    onChange={() => setSelectedDrug(item)}
                    className="sr-only"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {result.userPreference?.length > 0 && (
            <div className="result-card">
              <h3>⭐ 선호 제약사 (선택사항)</h3>
              <div className="recommend-list">
                {result.userPreference.map((pref, index) => (
                  <label
                    key={index}
                    className={`recommend-pill ${selectedCompany === pref.company_name ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="company"
                      value={pref.company_name}
                      onChange={() => setSelectedCompany(pref.company_name)}
                      className="sr-only"
                    />
                    {pref.company_name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleViewDetail} className="submit-btn" style={{ marginTop: '20px' }}>
            상세 정보 보기
          </button>

          {error && <p className="error-message">⚠️ {error}</p>}
        </div>
      )}
    </div>
  );
};

export default SymptomDrugInfoPage;
