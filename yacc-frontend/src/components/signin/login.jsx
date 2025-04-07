import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../config/axiosConfig';
import './login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');
        try {
            const response = await axios.post('/login', { email, password });

            if (response.data.result === "login_success") {
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('email', response.data.user.email);
                localStorage.setItem('userId', response.data.user.user_id);
                navigate('/');
            } else {
                triggerShake();
                setMsg(response.data.message || '로그인에 실패했어요. 다시 시도해보세요.');
            }
        } catch (error) {
            triggerShake();
            const result = error.response?.data?.result;
            const fallbackMsg = '서버와 연결할 수 없어요. 잠시 후 다시 시도해주세요.';

            const errorMap = {
                missing_credentials: '이메일과 비밀번호를 모두 입력해주세요.',
                invalid_email_format: '올바른 이메일 형식이 아니에요.',
                email_not_found: '등록되지 않은 이메일이에요.',
                incorrect_password: '비밀번호가 틀렸어요.',
                login_server_error: fallbackMsg,
                session_save_error: '세션 저장 중 문제가 발생했어요. 다시 시도해주세요.',
            };

            setMsg(errorMap[result] || fallbackMsg);
        } finally {
            setLoading(false);
        }
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    return (
        <div className="login-container">
            <div className={`login-card ${shake ? 'shake' : ''}`}>
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
                    <button type="submit" disabled={loading}>
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                </form>
                {msg && <p className="login-msg">{msg}</p>}
                <p className="login-footer">
                    아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;