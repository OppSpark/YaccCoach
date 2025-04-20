// src/axiosConfig.js
import axios from 'axios';

// Axios 전역 설정
axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.withCredentials = true;

export default axios;
