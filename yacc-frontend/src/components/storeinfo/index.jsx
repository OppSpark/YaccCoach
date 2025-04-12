import React, { useState } from 'react';
import axios from '../../config/axiosConfig';

const NearbyPharmacy = () => {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNearbyPharmacies = () => {
        if (!navigator.geolocation) {
            setError("위치 정보를 사용할 수 없습니다.");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await axios.get('/storeInfo', {
                        params: {
                            lat: latitude,
                            lng: longitude
                        }
                    });
                    setPharmacies(res.data.data);
                    setError(null);
                } catch (err) {
                    setError("약국 검색에 실패했습니다.");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError("위치 접근이 거부되었습니다.");
                setLoading(false);
            }
        );
    };

    return (
        <div className="container">
            <h2>📍 내 주변 약국 찾기</h2>
            <button onClick={fetchNearbyPharmacies} className="btn-primary">현재 위치로 검색</button>
            {loading && <p>검색 중입니다...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="pharmacy-list">
                {pharmacies.map((ph, index) => (
                    <div key={index} className="pharmacy-card">
                        <h3>{ph.dutyName}</h3>
                        <p>{ph.dutyAddr}</p>
                        <p>☎️ {ph.dutyTel1}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NearbyPharmacy;