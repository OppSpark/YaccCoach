import React from 'react';
import { Link } from 'react-router-dom'; // 추가
import './style.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <nav className="footer-nav">
        <Link to="/" className="footer-link">🏠 홈</Link>
        <Link to="/drugInfo">💊 의약품</Link>
        <Link>📍 약국</Link>
        <Link to="/mypage">👤 마이페이지</Link>
      </nav>
    </footer>
  );
};

export default Footer;