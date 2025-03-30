// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axiosConfig';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password });
      
      if (response.data.result === "login_success") {
        setMsg('로그인 성공!');
        
        // 로그인 성공 시 추가 작업 (예: localStorage에 저장)
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('userId', response.data.user.user_id);

        // 홈으로 리디렉션 또는 원하는 페이지로 이동
        navigate('/'); 
      } else {
        setMsg(response.data.message || '로그인 실패!');
      }

    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.message || '로그인 실패!');
      } else {
        setMsg('서버 연결 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <label>이메일</label><br />
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
        <br />
        <label>비밀번호</label><br />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <br /><br />
        <button type="submit">로그인</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}

export default Login;