import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../config/axiosConfig';
import './style.css';

const DrugDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drugDetail, setDrugDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL을 통해 전달받은 약품 정보
  const { itemName, entpName } = location.state || {};

  useEffect(() => {
    // 전달받은 정보가 없으면 이전 페이지로 돌려보냄
    if (!itemName) {
      navigate('/');
      return;
    }

    const fetchDrugInfo = async () => {
      try {
        const response = await axios.get('/drugInfo', {
          params: {
            itemName: itemName,
            entpName: entpName,
          },
        });

        const items = response.data?.body?.items;
        if (!items || items.length === 0) {
          setError('약 정보가 존재하지 않아요.');
          return;
        }

        setDrugDetail(items[0]);
      } catch (err) {
        setError('약 정보 조회에 실패했어요. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrugInfo();
  }, [itemName, entpName, navigate]);

  const highlightDisease = (text) => {
    if (!text) return text;
    // 질병 강조 로직 (기존과 동일)
    return text;
  };

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  if (loading) return <div className="loading">약 정보를 불러오는 중...</div>;
  if (error) return <div className="error-message">⚠️ {error}</div>;

  return (
    <div className="container">
      <button onClick={handleGoBack} className="back-btn">← 뒤로 가기</button>

      {drugDetail && (
        <div className="detail-card fade-in">
          <div className="detail-header">
            {drugDetail.itemImage && (
              <img
                src={drugDetail.itemImage}
                alt="약 이미지"
                className="drug-image"
              />
            )}
            <div>
              <h3 className="detail-title">{drugDetail.itemName}</h3>
              <p className="detail-sub">{drugDetail.entpName}</p>
            </div>
          </div>

          <div className="info-block">
            <h4>📌 효능</h4>
            <p>{drugDetail.efcyQesitm || '정보 없음'}</p>
          </div>

          <div className="info-block">
            <h4>💡 복용 방법</h4>
            <p>{drugDetail.useMethodQesitm || '정보 없음'}</p>
          </div>

          {drugDetail.atpnQesitm && (
            <div className="info-block highlight-warning">
              <h4>⚠️ 주의사항</h4>
              <p dangerouslySetInnerHTML={{ __html: highlightDisease(drugDetail.atpnQesitm) }} />
            </div>
          )}

          {drugDetail.intrcQesitm && (
            <div className="info-block highlight-interaction">
              <h4>🥗 음식과의 상호작용</h4>
              <p dangerouslySetInnerHTML={{ __html: highlightDisease(drugDetail.intrcQesitm) }} />
            </div>
          )}

          {drugDetail.seQesitm && (
            <div className="info-block highlight-sideeffect">
              <h4>❗ 부작용</h4>
              <p dangerouslySetInnerHTML={{ __html: highlightDisease(drugDetail.seQesitm) }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DrugDetailPage;