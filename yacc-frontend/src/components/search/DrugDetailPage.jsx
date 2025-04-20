// src/pages/DrugDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../config/axiosConfig';
import './style.css';

/**
 * 약 상세 페이지
 * - 목록 클릭 시 detail 카드가 자동으로 뷰포트 상단으로 스크롤됨(scrollIntoView)
 * - 공공데이터포털 약정보 API 호출 시 _type=json 으로 응답 파싱 속도 개선
 * - 항목이 1개뿐일 경우 바로 상세 표시
 */
const DrugDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemName } = location.state || {};

  const [drugList, setDrugList]     = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // detail 카드 위치 참조
  const detailRef = useRef(null);

  /* 선택이 바뀌면 detail 카드로 스크롤 */
  useEffect(() => {
    if (selectedIndex !== null && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedIndex]);

  /* 약품 리스트 요청 */
  useEffect(() => {
    if (!itemName) {
      navigate('/');
      return;
    }

    (async () => {
      try {
        const { data } = await axios.get('/drugInfo', {
          params: {
            itemName,
            pageNo: 1,
            numOfRows: 10,
            _type: 'json' // JSON 형식으로 응답
          }
        });

        const items = data?.body?.items ?? [];
        if (!items.length) {
          setError('약 정보가 존재하지 않아요.');
        } else {
          setDrugList(items);
          if (items.length === 1) setSelectedIndex(0); // 1개면 자동 선택
        }
      } catch (err) {
        setError('약 정보 조회에 실패했어요. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    })();
  }, [itemName, navigate]);

  /* 단순 문자열 강조 + 줄바꿈 처리 */
  const highlightDisease = (text) => {
    if (!text) return '정보 없음';
    return text
      .replace(/\n/g, '<br/>')                 // 줄바꿈 치환
      .replace(/(고혈압|당뇨|천식)/gi, '<mark>$1</mark>'); // 예시 강조
  };

  const handleGoBack = () => navigate(-1);

  /* 로딩/에러 렌더링 */
  if (loading) return <div className="loading">약 정보를 불러오는 중...</div>;
  if (error)   return <div className="error-message">⚠️ {error}</div>;

  return (
    <div className="container">
      <button onClick={handleGoBack} className="back-btn">← 뒤로 가기</button>

      <p className="result-count">총 {drugList.length}개의 검색 결과가 있습니다.</p>

      {/* 약 목록 */}
      <div className="drug-scroll-list">
        {drugList.map((drug, idx) => (
          <div
            key={idx}
            className={`detail-card clickable-card ${selectedIndex === idx ? 'active' : ''}`}
            onClick={() => setSelectedIndex(idx)}
          >
            <h3 className="detail-title">{drug.itemName}</h3>
            <p className="detail-sub">{drug.entpName}</p>
          </div>
        ))}
      </div>

      {/* 상세 카드 */}
      {selectedIndex !== null && (
        <div ref={detailRef} className="detail-card fade-in">
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
  );
};

export default DrugDetailPage;
