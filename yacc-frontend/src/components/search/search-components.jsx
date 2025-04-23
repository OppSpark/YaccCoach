import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axiosConfig";
import "./style.css";

const SymptomDrugInfoPage = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDrug, setSelectedDrug] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!userId || !email || !username) {
      setShowLoginModal(true);
    }
    const recent = localStorage.getItem("recentSymptoms");
    if (recent && !symptoms) setSymptoms(recent);
  }, []);

  useEffect(() => {
    if (symptoms) {
      localStorage.setItem("recentSymptoms", symptoms);
    }
  }, [symptoms]);

  const handleModalConfirm = () => {
    window.location.href = "/login";
  };

  const handleModalCancel = () => {
    setShowLoginModal(false);
    window.history.back();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedDrug("");
    setSelectedCompany("");

    try {
      const response = await axios.post("/search", { symptom: symptoms }, { withCredentials: true });
      setResult(response.data);
    } catch (err) {
      const code = err.response?.data?.result;
      if (code === "unauthorized") setError("로그인이 필요해요. 먼저 로그인해주세요.");
      else if (code === "parameters_required") setError("증상은 필수로 입력해야 해요.");
      else if (code === "openai_service_error") setError("AI 분석 서버에 문제가 있어요.");
      else if (code === "user_preference_error") setError("선호 제약사 정보를 가져오지 못했어요.");
      else if (code === "disease_info_error") setError("기존 질병 정보를 불러오지 못했어요.");
      else setError("알 수 없는 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = () => {
    if (!selectedDrug) {
      setError("추천 의약품을 선택해주세요.");
      return;
    }

    navigate("/drug-detail", {
      state: {
        itemName: selectedDrug,
        entpName: selectedCompany,
      },
    });
  };

  return (
    <div className="container">
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>로그인이 되어 있지 않습니다. 로그인 페이지로 이동할까요?</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={handleModalConfirm}>예</button>
              <button className="cancel-btn" onClick={handleModalCancel}>아니오</button>
            </div>
          </div>
        </div>
      )}

      {!showLoginModal && (
        <>
          <form onSubmit={handleSubmit} className="symptom-form">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="증상을 상세히 입력해주세요"
              className="symptom-input"
              required
            />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "약을 찾는 중..." : "진단 시작"}
            </button>
          </form>

          <br></br>


          <div className="ai-suggestion-box">
                <h4>🤔 뭘 입력해야 할지 막막하다면, 이런 예시로 시작해보세요.</h4>
                <div className="example-hints">
            <button className="example-btn" onClick={() => setSymptoms("머리가 아프고 열이납니다. 근육통도 있고 설사도 조금 나는거 같아요. 인후통이나 콧물 증상은 없는거 같아요")}>💡 참고할 수 있는 예시를 준비했어요.</button>
          </div>
            </div>


          {error && <p className="error-message">⚠️ {error}</p>}

          {result?.summary && (
            <div className="summary-card">
              <h4>🧠 AI 분석 요약</h4>
              <p>{result.summary}</p>
            </div>
          )}

          {result && (
            <div className="result-section">
              <div className="result-card">
                <h3>💊 추천 의약품</h3>
                <p>1개만 선택해주세요</p>
                <div className="recommend-list">
                  {result.openAiResult?.items?.map((item, index) => (
                    <label key={index} className={`recommend-pill ${selectedDrug === item ? "selected" : ""}`}>
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
                        className={`recommend-pill ${selectedCompany === pref.company_name ? "selected" : ""}`}
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

              <button onClick={handleViewDetail} className="submit-btn" style={{ marginTop: "20px" }}>
                {selectedDrug ? `${selectedDrug} 상세 정보 보기` : "상세 정보 보기"}
              </button>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `내 증상: ${symptoms}\n추천 약: ${selectedDrug || "미선택"}`
                  )
                }
                className="submit-btn"
                style={{ marginTop: "10px", backgroundColor: "#666" }}
              >
                📋 결과 복사하기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SymptomDrugInfoPage;