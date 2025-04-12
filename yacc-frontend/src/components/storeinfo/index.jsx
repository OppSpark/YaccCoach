import React, { useState, useEffect } from "react";
import axios from "../../config/axiosConfig";
import './style.css';

const PharmacyLocator = () => {
  const [useGPS, setUseGPS] = useState(true);
  const [pharmacies, setPharmacies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState("서울특별시");
  const [district, setDistrict] = useState("");

  const fetchPharmacies = async (q0, q1) => {
    try {
      setLoading(true);
      const res = await axios.get("/storeInfo", {
        params: {
          Q0: q0,
          Q1: q1,
          QT: 1,
          ORD: "NAME",
          pageNo: 1,
          numOfRows: 10,
        },
      });
      const items = res.data.data.items?.item || res.data.data || [];
      setPharmacies(Array.isArray(items) ? items : [items]);
      setError("");
    } catch (err) {
      setError("약국 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchByAddress = () => {
    const safeRegion = region?.trim() || "서울특별시";
    const safeDistrict = district?.trim() || "강남구";
    fetchPharmacies(safeRegion, safeDistrict);
  };

  const fetchByGPS = () => {
    if (!navigator.geolocation) {
      setError("브라우저에서 위치 정보 사용이 불가능합니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          setLoading(true);
          const { data } = await axios.get("/reverseGeocode", {
            params: { lat: coords.latitude, lon: coords.longitude },
          });
          const { Q0, Q1 } = data || {};
          if (!Q0 || !Q1) throw new Error();
          setRegion(Q0);
          setDistrict(Q1);
          fetchPharmacies(Q0, Q1);
        } catch {
          setError("위치 기반 주소 변환에 실패했습니다.");
        } finally {
          setLoading(false);
        }
      },
      () => setError("위치 접근이 거부되었습니다. 주소 검색을 이용해주세요.")
    );
  };

  useEffect(() => {
    if (useGPS) fetchByGPS();
  }, [useGPS]);

  return (
    <div className="container">
      <h2>🏥 가까운 약국 찾기</h2>
      <div className="toggle-buttons">
        <button className={useGPS ? "active" : ""} onClick={() => setUseGPS(true)}>📍 내 위치로 찾기</button>
        <button className={!useGPS ? "active" : ""} onClick={() => setUseGPS(false)}>🧭 주소로 찾기</button>
      </div>

      {!useGPS && (
        <div className="address-search">
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {["서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시", "경기도", "강원도"]
              .map(city => <option key={city}>{city}</option>)}
          </select>
          <input
            type="text"
            placeholder="시/군/구 입력 (예: 강남구)"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
          <button onClick={fetchByAddress}>🔍 검색</button>
        </div>
      )}

      {loading && <p className="loading">불러오는 중...</p>}
      {error && <p className="error-message">⚠️ {error}</p>}

      <div className="pharmacy-result-container">
        {pharmacies.map((pharmacy) => (
          <div key={pharmacy.hpid} className="pharmacy-card">
            <div className="pharmacy-name">{pharmacy.dutyName}</div>
            <div className="pharmacy-addr">{pharmacy.dutyAddr}</div>
            <div className="pharmacy-tel">☎ {pharmacy.dutyTel1}</div>

            <div className="pharmacy-time">
              <strong>운영시간</strong><br />
              <span>월요일: {pharmacy.dutyTime1s || '-'} ~ {pharmacy.dutyTime1c || '-'}</span><br />
              <span>화요일: {pharmacy.dutyTime2s || '-'} ~ {pharmacy.dutyTime2c || '-'}</span><br />
              <span>수요일: {pharmacy.dutyTime3s || '-'} ~ {pharmacy.dutyTime3c || '-'}</span><br />
              <span>목요일: {pharmacy.dutyTime4s || '-'} ~ {pharmacy.dutyTime4c || '-'}</span><br />
              <span>금요일: {pharmacy.dutyTime5s || '-'} ~ {pharmacy.dutyTime5c || '-'}</span><br />
              <span>토요일: {pharmacy.dutyTime6s || '-'} ~ {pharmacy.dutyTime6c || '-'}</span><br />
              {pharmacy.dutyTime7s && (
                <span>일요일: {pharmacy.dutyTime7s} ~ {pharmacy.dutyTime7c}</span>
              )}
            </div>
            <a
              href={`https://map.kakao.com/?q=${encodeURIComponent(`${pharmacy.region || region} ${pharmacy.district || district} ${pharmacy.dutyName}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ㅇisplay: 'inline-block', marginTop: '8px', color: '#007bff', textDecoration: 'underline' }}
            >
              📍 지도에서 보기
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacyLocator;