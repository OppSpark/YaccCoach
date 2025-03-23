// src/axiosConfig.js
import axios from 'axios';

// 서버 주소: 실제 dev/production 환경에 맞춰 설정
const BASE_URL = 'http://dev.api.yacccoach.oppspark.net';

// Axios 전역 설정
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

export default axios;