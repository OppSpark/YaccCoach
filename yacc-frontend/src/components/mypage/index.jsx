import React, { useEffect, useState } from 'react';
import axios from '../../config/axiosConfig';
import './style.css';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('user_id'); // 또는 쿠키에서 가져오기

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/user', { data: { user_id: userId } }); // ⚠️ 주의: GET + body → 서버에서 POST로 바꾸는게 나을 수도 있음
        setUserInfo(res.data.data);
      } catch (err) {
        setError('사용자 정보를 불러올 수 없어요.');
      }
    };

    fetchUser();
  }, []);

  if (error) return <p className="error-message">{error}</p>;
  if (!userInfo) return <p className="loading">불러오는 중...</p>;

  return (
    <div className="mypage-container">
      <h2>👤 내 정보</h2>

      <div className="user-card">
        <p><strong>이름</strong> {userInfo.username}</p>
        <p><strong>이메일</strong> {userInfo.email}</p>
        <p><strong>전화번호</strong> {userInfo.tel_number}</p>
        <p><strong>주소</strong> {userInfo.address}</p>
        <p><strong>개인정보 동의</strong> {userInfo.agreed_personal ? '동의함' : '동의하지 않음'}</p>
      </div>

      <button className="logout-btn" onClick={() => {
        localStorage.removeItem('user_id');
        window.location.href = '/login';
      }}>
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;