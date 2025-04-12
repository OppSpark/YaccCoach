import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../config/axiosConfig';
import './style.css';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        tel: '',
        address: '',
        agreed: false
    });

    const inputRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }, [step]);

    const handleChange = (field) => (e) => {
        const value = field === 'agreed' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [field]: value });
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const isStepValid = () => {
        switch (step) {
            case 2: return formData.username.trim() !== '';
            case 3: return formData.email.trim() !== '';
            case 4:
                return (
                    formData.password.trim() !== '' &&
                    formData.confirmPassword.trim() !== '' &&
                    formData.password === formData.confirmPassword
                );
            case 5: return formData.tel.trim() !== '';
            case 6: return formData.address.trim() !== '';
            case 7: return formData.agreed === true;
            default: return true;
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                tel_number: formData.tel.replace(/-/g, ''),
                address: formData.address,
                agreed_personal: formData.agreed ? 1 : 0,
            };

            const res = await axios.post('/signUp', payload);

            if (res.data.result === 'register_success') {
                alert('회원가입 완료!');
                window.location.href = '/login';
            } else {
                alert(res.data.message || '회원가입 실패');
            }
        } catch (err) {
            alert(err.response?.data?.message || '서버 오류 발생');
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="card">
                        <h2 className="intro">👋 환영합니다!</h2>
                        <p className="intro">🚑 당신을 위한 응급 의약품 서비스, <strong>약코치</strong> 💊</p>
                        <p className="intro-title">약코치에 오신 것을 환영합니다.</p>
                        <p className="intro-title">아래 버튼을 눌러 지금 바로 간편하게 회원가입을 시작해보세요!</p>
                        <button className="start-button" onClick={nextStep}>회원가입 시작하기</button>
                    </div>
                );
            case 2:
                return (
                    <div className="card">
                        <h3>👤 닉네임을 입력해주세요</h3>
                        <p>약코치에서 사용할 닉네임입니다.</p>
                        <input ref={inputRef} type="text" value={formData.username} onChange={handleChange('username')} placeholder="김코치" required />
                    </div>
                );
            case 3:
                return (
                    <div className="card">
                        <h3>✉️ 이메일을 입력해주세요</h3>
                        <p>이메일은 로그인 시 사용됩니다.</p>
                        <input ref={inputRef} type="email" value={formData.email} onChange={handleChange('email')} placeholder="Yacc@coach.com" required />
                        <div className="nav-buttons">
                            <button className="back-button" onClick={prevStep}>이전</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="card">
                        <h3>🔑 비밀번호를 설정해주세요</h3>
                        <p>8자 이상, 대/소문자, 숫자, 특수문자 포함해야 해요.</p>
                        <input ref={inputRef} type="password" value={formData.password} onChange={handleChange('password')} placeholder="비밀번호" required autoComplete="new-password" />
                        <input type="password" value={formData.confirmPassword} onChange={handleChange('confirmPassword')} placeholder="비밀번호 확인" required autoComplete="new-password" />
                        <div className="nav-buttons">
                            <button className="back-button" onClick={prevStep}>이전</button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="card">
                        <h3>📱 전화번호</h3>
                        <p>본인 확인을 위해 필요합니다.</p>
                        <input ref={inputRef} type="tel" value={formData.tel} onChange={handleChange('tel')} placeholder="010-0000-0000" required />
                        <div className="nav-buttons">
                            <button className="back-button" onClick={prevStep}>이전</button>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="card">
                        <h3>🏠 주소</h3>
                        <p>위치 기반 약국 검색에 사용됩니다.</p>
                        <input ref={inputRef} type="text" value={formData.address} onChange={handleChange('address')} placeholder="우리집 주소" required />
                        <div className="nav-buttons">
                            <button className="back-button" onClick={prevStep}>이전</button>
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div className="card">
                        <h3>💊 이용약관</h3>
                        <p>가입까지 거의 다 왔어요.</p>
                        <label className="checkbox-group">
                            <input type="checkbox" checked={formData.agreed} onChange={handleChange('agreed')} required /> 약관 및 개인정보 수집에 동의합니다.
                        </label>
                        <div className="nav-buttons">
                            <button className="back-button" onClick={prevStep}>이전</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="signup-container">
            <h2>회원가입</h2>
            {renderStep()}

            {step > 1 && (
                <div className="global-next-btn-container">
                    {step === 7 ? (
                        <button className="btn-primary" onClick={handleSubmit} disabled={!isStepValid()}>
                            가입하기
                        </button>
                    ) : (
                        <button className="btn-primary" onClick={nextStep} disabled={!isStepValid()}>
                            다음
                        </button>
                    )}
                </div>
            )}

            <p className="signup-footer">이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
        </div>
    );
};

export default Signup;