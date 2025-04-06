import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../config/axiosConfig';
import './style.css';

const DrugDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drugList, setDrugList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { itemName } = location.state || {};

  useEffect(() => {
    if (!itemName) {
      navigate('/');
      return;
    }

    const fetchDrugList = async () => {
      try {
        const response = await axios.get('/drugInfo', {
          params: {
            itemName: itemName,
            pageNo: 1,
            numOfRows: 10,
          },
        });

        const items = response.data?.body?.items;
        if (!items || items.length === 0) {
          setError('약 정보가 존재하지 않아요.');
          return;
        }

        setDrugList(items);
      } catch (err) {
        setError('약 정보 조회에 실패했어요. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrugList();
  }, [itemName, navigate]);

  const highlightDisease = (text) => {
    if (!text) return text;
    return text;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const [selectedIndex, setSelectedIndex] = useState(null);

  if (loading) return <div className="loading">약 정보를 불러오는 중...</div>;
  if (error) return <div className="error-message">⚠️ {error}</div>;

  return (
    <div className="container">
      <button onClick={handleGoBack} className="back-btn">← 뒤로 가기</button>

      {drugList.length > 0 && (
        <div className="drug-list">
          <p className="result-count">총 {drugList.length}개의 검색 결과가 있습니다.</p>
          <div className="drug-scroll-list">
            {drugList.map((drug, index) => (
              <div
                key={index}
                className={`detail-card clickable-card ${selectedIndex === index ? 'active' : ''}`}
                onClick={() => setSelectedIndex(index)}
              >
                <h3 className="detail-title">{drug.itemName}</h3>
                <p className="detail-sub">{drug.entpName}</p>
              </div>
            ))}
          </div>

          {selectedIndex !== null && (
            <div className="detail-card fade-in">
              <div className="detail-header">
                {drugList[selectedIndex].itemImage && (
                  <img
                    src={drugList[selectedIndex].itemImage}
                    alt="약 이미지"
                    className="drug-image"
                  />
                )}
                <div>
                  <h3 className="detail-title">{drugList[selectedIndex].itemName}</h3>
                  <p className="detail-sub">{drugList[selectedIndex].entpName}</p>
                </div>
              </div>

              <div className="info-block">
                <h4>📌 효능</h4>
                <p>{drugList[selectedIndex].efcyQesitm || '정보 없음'}</p>
              </div>

              <div className="info-block">
                <h4>💡 복용 방법</h4>
                <p>{drugList[selectedIndex].useMethodQesitm || '정보 없음'}</p>
              </div>

              {drugList[selectedIndex].atpnQesitm && (
                <div className="info-block highlight-warning">
                  <h4>⚠️ 주의사항</h4>
                  <p dangerouslySetInnerHTML={{ __html: highlightDisease(drugList[selectedIndex].atpnQesitm) }} />
                </div>
              )}

              {drugList[selectedIndex].intrcQesitm && (
                <div className="info-block highlight-interaction">
                  <h4>🥗 음식과의 상호작용</h4>
                  <p dangerouslySetInnerHTML={{ __html: highlightDisease(drugList[selectedIndex].intrcQesitm) }} />
                </div>
              )}

              {drugList[selectedIndex].seQesitm && (
                <div className="info-block highlight-sideeffect">
                  <h4>❗ 부작용</h4>
                  <p dangerouslySetInnerHTML={{ __html: highlightDisease(drugList[selectedIndex].seQesitm) }} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DrugDetailPage;