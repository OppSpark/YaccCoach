import React, { useState } from "react";
import axios from "../../config/axiosConfig";
import "./style.css";

const DrugSearchPage = () => {
    const [query, setQuery] = useState("");
    const [drugInfo, setDrugInfo] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDrug, setSelectedDrug] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setError("약품명을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.get("/drugInfo", {
                params: { itemName: query, pageNo: 1, numOfRows: 10 },
            });
            const items = response.data?.body?.items;
            if (!items || items.length === 0) {
                setError("해당 약품 정보를 찾을 수 없어요.");
                setDrugInfo([]);
            } else {
                setDrugInfo(items);
            }
        } catch {
            setError("검색 중 오류가 발생했어요.");
            setDrugInfo([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>🔍 의약품 검색</h2>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="약품명을 입력하세요"
                    className="search-input"
                />
                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? "검색 중..." : "검색"}
                </button>
            </form>

            {error && <p className="error-message">⚠️ {error}</p>}

            {drugInfo.length > 0 && (
                <p className="result-count">총 {drugInfo.length}개의 검색 결과가 있습니다.</p>
            )}

            {drugInfo.length > 0 && (
                <div className="horizontal-scroll">
                    {drugInfo.map((item, idx) => (
                        <div
                            className={`detail-card fade-in clickable-card ${selectedDrug === idx ? 'active' : ''}`}
                            key={idx}
                            onClick={() => setSelectedDrug(idx)}
                        >
                            <h3 className="detail-title">{item.itemName}</h3>
                            <p className="detail-sub">{item.entpName}</p>
                            {selectedDrug === idx && (
                                <>
                                    <div className="detail-header">
                                        {item.itemImage && (
                                            <img
                                                src={item.itemImage}
                                                alt="약 이미지"
                                                className="drug-image"
                                            />
                                        )}
                                    </div>
                                    <div className="info-block">
                                        <h4>📌 효능</h4>
                                        <p>{item.efcyQesitm || "정보 없음"}</p>
                                    </div>
                                    <div className="info-block">
                                        <h4>💡 복용 방법</h4>
                                        <p>{item.useMethodQesitm || "정보 없음"}</p>
                                    </div>
                                    {item.atpnQesitm && (
                                        <div className="info-block highlight-warning">
                                            <h4>⚠️ 주의사항</h4>
                                            <p>{item.atpnQesitm}</p>
                                        </div>
                                    )}
                                    {item.intrcQesitm && (
                                        <div className="info-block highlight-interaction">
                                            <h4>🥗 음식과의 상호작용</h4>
                                            <p>{item.intrcQesitm}</p>
                                        </div>
                                    )}
                                    {item.seQesitm && (
                                        <div className="info-block highlight-sideeffect">
                                            <h4>❗ 부작용</h4>
                                            <p>{item.seQesitm}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DrugSearchPage;
