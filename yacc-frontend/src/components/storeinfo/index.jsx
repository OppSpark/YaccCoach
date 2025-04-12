import React, { useState, useEffect } from "react";
import axios from "../../config/axiosConfig";
import "./style.css";

const PharmacyLocator = () => {
  const [useGPS, setUseGPS] = useState(true);
  const [pharmacies, setPharmacies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [region, setRegion] = useState("서울특별시");
  const [district, setDistrict] = useState("강남구");

  const fetchByAddress = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/storeInfo", {
        params: {
          Q0: region,
          Q1: district,
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
      setError("API 호출 실패");
    } finally {
      setLoading(false);
    }
  };

  const fetchByGPS = async () => {
    if (!navigator.geolocation) {
      setError("위치 정보 사용이 불가능합니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoading(true);
          const res = await axios.get("/reverseGeocode", {
            params: { lat: latitude, lon: longitude },
          });
          const { Q0, Q1 } = res.data || {};
          if (!Q0 || !Q1) {
            setError("위치 주소를 가져올 수 없습니다.");
            setLoading(false);
            return;
          }
          setRegion(Q0);
          setDistrict(Q1);
          await fetchByAddress();
        } catch (err) {
          setError("위치 기반 주소 변환 실패");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("위치 접근이 거부되었습니다. 주소를 수동 입력해주세요.");
      }
    );
  };

  useEffect(() => {
    if (useGPS) {
      fetchByGPS();
    }
  }, [useGPS]);

  return (
    <div className="container">
      <h2>🏥 가까운 약국 찾기</h2>
      <div className="toggle-buttons">
        <button className={useGPS ? "active" : ""} onClick={() => setUseGPS(true)}>
          📍 내 위치로 찾기
        </button>
        <button className={!useGPS ? "active" : ""} onClick={() => setUseGPS(false)}>
          🧭 주소로 찾기
        </button>
      </div>

      {!useGPS && (
        <div className="address-search">
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option>서울특별시</option>
            <option>부산광역시</option>
            <option>대구광역시</option>
            <option>인천광역시</option>
            <option>광주광역시</option>
            <option>대전광역시</option>
            <option>울산광역시</option>
            <option>세종특별자치시</option>
            <option>경기도</option>
            <option>강원도</option>
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

      <ul className="pharmacy-list">
        {pharmacies.map((pharmacy) => (
          <li key={pharmacy.hpid} className="pharmacy-item">
            <strong>{pharmacy.dutyName}</strong><br />
            {pharmacy.dutyAddr}<br />
            ☎ {pharmacy.dutyTel1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PharmacyLocator;
