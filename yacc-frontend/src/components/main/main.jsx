import React from 'react';
import { Link } from 'react-router-dom';
import './main.css';

const Main = () => {
    return (
        <div className="main-container">
            <div className="main-card">
                <h1>약코치에 오신 걸 환영합니다! 💊</h1>
                <p>증상을 입력하면, 복용 가능한 약을 추천해드릴게요.</p>
                <div className="button-group">
                    <Link to="/login" className="main-button">로그인 하러 가기</Link>
                    <Link to="/symptom-checker" className="main-button">증상 입력하러 가기</Link>
                </div>
            </div>
        </div>
    );
};

export default Main;