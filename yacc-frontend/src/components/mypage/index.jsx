import React, { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import "./style.css";

const MyPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                const res = await axios.post("/user", { user_id: userId });
                setUserInfo(res.data.data);
            } catch (err) {
                setError("사용자 정보를 불러올 수 없어요.");
            }
        };

        fetchUser();
    }, [userId]);

    // 로그인 안 된 경우
    if (!userId) {
        return (
            <div className="mypage-container">
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                <p className="error-message">로그인이 필요해요.</p>
                <button
                    className="submit-btn"
                    onClick={() => (window.location.href = "/login")}
                >
                    로그인 하러 가기
                </button>
                <div className="info-links">

                <br></br>
                <br></br>
                <h3>💡 추천 약 정보 사이트</h3>
                <ul>
                    <li>
                        <a
                            href="https://nedrug.mfds.go.kr"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            의약품안전나라 (식약처)
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.health.kr"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            건강보험심사평가원 의약품정보
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.pharm114.or.kr"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            대한약사회 Pharm114
                        </a>
                    </li>
                </ul>
            </div>

            <div className="tips-section">
                <h3>📌 약 복용 꿀팁</h3>
                <div className="tips-list">
                    <div className="tip-card">
                        💧 약은 반드시 물과 함께 복용하세요. (우유, 커피는 비추)
                    </div>
                    <div className="tip-card">
                        ⏰ 정해진 시간에 규칙적으로 복용하는 것이 효과적입니다.
                    </div>
                    <div className="tip-card">
                        ⚠️ 감기약과 알러지약은 졸릴 수 있으니 운전 전 복용 금지!
                    </div>
                </div>
            </div>
            </div>
        );
    }

    // 오류 발생 시
    if (error) return <p className="error-message">{error}</p>;

    // 로딩 중
    if (!userInfo) return <p className="loading">불러오는 중...</p>;

    // 사용자 정보 출력
    return (
        <div className="mypage-container">
            <h2>👤 내 정보</h2>

            <div className="user-card">
                <p>
                    <strong>이름</strong> {userInfo.username}
                </p>
                <p>
                    <strong>이메일</strong> {userInfo.email}
                </p>
                <p>
                    <strong>전화번호</strong> {userInfo.tel_number}
                </p>
                <p>
                    <strong>주소</strong> {userInfo.address}
                </p>
                <p>
                    <strong>개인정보 동의</strong>{" "}
                    {userInfo.agreed_personal ? "동의함" : "동의하지 않음"}
                </p>
            </div>

            <button
                className="logout-btn"
                onClick={() => {
                    // 로컬스토리지 + 쿠키 삭제
                    localStorage.removeItem("userId");
                    localStorage.removeItem("email");
                    localStorage.removeItem("username");
                    document.cookie =
                        "connect.sid=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";

                    document.cookie.split(";").forEach((cookie) => {
                        const name = cookie.split("=")[0].trim();
                        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                    });
                    window.location.href = "/login";
                }}
            >
                로그아웃
            </button>

            <div className="info-links">
                <h3>💡 추천 약 정보 사이트</h3>
                <ul>
                    <li>
                        <a
                            href="https://nedrug.mfds.go.kr"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            의약품안전나라 (식약처)
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.health.kr"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            건강보험심사평가원 의약품정보
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.pharm114.or.kr"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            대한약사회 Pharm114
                        </a>
                    </li>
                </ul>
            </div>

            <div className="tips-section">
                <h3>📌 약 복용 꿀팁</h3>
                <div className="tips-list">
                    <div className="tip-card">
                        💧 약은 반드시 물과 함께 복용하세요. (우유, 커피는 비추)
                    </div>
                    <div className="tip-card">
                        ⏰ 정해진 시간에 규칙적으로 복용하는 것이 효과적입니다.
                    </div>
                    <div className="tip-card">
                        ⚠️ 감기약과 알러지약은 졸릴 수 있으니 운전 전 복용 금지!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
