import React, { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import "./style.css";

const ALL_COMPANIES = [
  "삼성바이오로직스", "셀트리온", "유한양행", "대웅", "종근당", "녹십자", "광동제약", "한미약품", "대웅제약", "차바이오텍",
  "종근당홀딩스", "보령", "휴온스글로벌", "JW중외제약", "제일약품", "동아에스티", "일동홀딩스", "일동제약", "콜마비앤에이치",
  "휴온스", "한독", "대웅바이오", "덴티움", "바텍", "일양약품", "SK바이오사이언스", "씨젠", "동화약품", "엑세스바이오",
  "휴젤", "에스티팜", "바이오니아", "파마리서치", "영진약품", "안국약품", "환인제약", "테라젠이텍스", "메디톡스", "경보제약",
  "JW생명과학", "대한뉴팜", "신풍제약", "삼일제약", "삼천당제약", "알리코제약", "현대약품", "클래시스", "명문제약", "인바디",
  "광전사이언스", "경동제약", "종근당바이오", "바이넥스", "휴메딕스", "이연제약", "알피바이오", "파크시스템스", "레이언스",
  "씨티씨바이오", "유유제약", "국제약품", "바디텍메드", "한올바이오파마", "부광약품", "코오롱생명과학", "화일약품", "국전약품",
  "티앤엘", "JW신약", "HLB생명과학", "삼아제약", "녹십자엠에스", "CMG제약", "바이오노트", "동성제약", "대봉엘에스",
  "에이프로젠바이오로직스", "한국파마", "고려제약", "한국비엔씨", "위더스제약", "케어젠", "일성신약", "메디아나", "하이텍팜",
  "엔지켐생명과학", "비씨월드제약", "옵투스제약", "비보존 계약", "유바이오로직스", "엘앤씨바이오", "메디포스트", "경남제약",
  "세운메디칼", "에이비엘바이오", "에스텍파마", "조아제약", "제테마", "파미셀", "이수앱지스"
];

const PreferenceManager = () => {
  const [preferences, setPreferences] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const userId = localStorage.getItem("userId");

  const filteredCompanies = ALL_COMPANIES.filter(c =>
    c.includes(search) && !preferences.some(p => p.company_name === c)
  );

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await axios.post("/preference/list", {
          user_id: userId,
        });
        setPreferences(res.data.data);
      } catch (err) {
        setError("선호 정보를 불러오지 못했어요.");
      }
    };

    if (userId) fetchPreferences();
  }, [refresh, userId]);

  const handleAdd = async (company) => {
    try {
      await axios.post("/preference", {
        user_id: userId,
        company_name: company,
      });
      setSearch("");
      setRefresh(!refresh);
    } catch (err) {
      setError("추가에 실패했어요.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("/preference", {
        data: { preference_id: id },
      });
      setRefresh(!refresh);
    } catch (err) {
      setError("삭제에 실패했어요.");
    }
  };

  return (
    <div className="container">
      <h2>🏢 선호 제약사 등록</h2>
      {error && <p className="error-message">⚠️ {error}</p>}

      <div className="add-section">
        <input
          type="text"
          placeholder="제약사 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />

        {search && (
          <div className="search-dropdown">
            {filteredCompanies.map((name, idx) => (
              <div key={idx} className="dropdown-item" onClick={() => handleAdd(name)}>
                {name}
              </div>
            ))}
            {filteredCompanies.length === 0 && (
              <div className="dropdown-item">검색 결과가 없습니다.</div>
            )}
          </div>
        )}
      </div>

      <div className="preference-list">
        {preferences.map((pref) => (
          <div className="preference-item" key={pref.preference_id}>
            <span>{pref.company_name}</span>
            <button onClick={() => handleDelete(pref.preference_id)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreferenceManager;