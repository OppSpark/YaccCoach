import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <nav className="footer-nav">
        <Link to="/" className="footer-link">
          <div className="footer-icon-text">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12 L12 4 L20 12 L20 20 L4 20 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>홈</span>
          </div>
        </Link>
        <Link to="/drugInfo" className="footer-link">
          <div className="footer-icon-text">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 15 L15 5 A4 4 0 0 1 19 9 L9 19 A4 4 0 0 1 5 15 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>의약품</span>
          </div>
        </Link>
        <Link to="/storeInfo" className="footer-link">
          <div className="footer-icon-text">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13 A7 7 0 0 1 19 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 15 L9 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>약국</span>
          </div>
        </Link>
        <Link to="/mypage" className="footer-link">
          <div className="footer-icon-text">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 18 Q12 22 18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>마이페이지</span>
          </div>
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
