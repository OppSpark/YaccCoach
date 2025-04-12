import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header.jsx";
import Footer from "../foorter/footer.jsx";
import "./style.css";

const MainPage = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    return (
        <div className="main-container">

            <div className="feature-section">
                <div className="feature-card" onClick={() => navigate("/symptom-checker")}>
                    <h3>💊 증상 기반 의약품 추천</h3>
                    <p>증상을 입력하고 즉시 약을 추천받아요</p>
                </div>

                <div
                    className="feature-card"
                    onClick={() => navigate("/storeInfo")}>

                    <h3>📍 근처 약국 찾기</h3>
                    <p>GPS 기반으로 약국 위치를 확인해요</p>
                </div>

                <div
                    className="feature-card"
                    onClick={() => navigate("/preference")}
                >
                    <h3>🏢 선호 제약사 설정</h3>
                    <p>좋아하는 제약사를 선택할 수 있어요</p>
                </div>

                <div
                    className="feature-card"
                    onClick={() => navigate("/disease")}
                >
                    <h3>⚕️ 기존 질환 관리</h3>
                    <p>기존에 등록한 질환을 관리해요</p>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
