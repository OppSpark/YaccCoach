// src/Login.js
import React, { useState } from 'react';
import axios from '../../config/axiosConfig';  // 위에서 만든 axios 설정

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // POST /login → 실제 서버 라우트에 맞춰 조정
      const response = await axios.post('/login', { email, password });
      setMsg(response.data.message); // 서버에서 보내주는 메시지
      // 필요하다면 response.data.user 등으로 유저 정보를 가져올 수도 있음
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.message);
      } else {
        setMsg('로그인 중 오류가 발생했습니다.');
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