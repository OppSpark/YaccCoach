import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../config/axiosConfig';
import './login.css';

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
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('email', response.data.user.email);
                localStorage.setItem('userId', response.data.user.user_id);
                navigate('/');
            } else {
                setMsg(response.data.message || '로그인 실패!');
            }
        } catch (error) {
            setMsg(error.response?.data?.message || '서버 연결 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>로그인</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호"
                        required
                    />
                    <button type="submit">로그인</button>
                </form>
                {msg && <p className="login-msg">{msg}</p>}
            </div>
        </div>
    );
}

export default Login;