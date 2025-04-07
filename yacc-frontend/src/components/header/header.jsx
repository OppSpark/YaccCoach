
import React from 'react';
import  './style.css'

const Header = ({ username }) => {
  return (
    <header className="yakcoach-header">
      <div className="header-left">
        <h1 className="logo-text">약코치</h1>
      </div>
      {username && (
        <div className="header-right">
          <span className="greeting">👋 {username}님</span>
        </div>
      )}
    </header>
  );
};

export default Header;