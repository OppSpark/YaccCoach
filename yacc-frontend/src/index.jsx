import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/main/index.jsx';
import Login from './components/signin/login.jsx';
import SymptomChecker from './components/search/search-components.jsx';
import Signup from './components/signup/index.jsx';
import DrugDetailPage from './components/search/DrugDetailPage.jsx';
import Footer from './components/foorter/footer.jsx';
import MainPage from './components/index/index.jsx';
import DrugSearchPage from './components/druginfo/index.jsx';
import MyPage from './components/mypage/index.jsx';
import DiseaseManager from './components/disease/index.jsx';
import PreferenceManager from './components/preference/index.jsx';



const Layout = ({ children }) => (
  <div className="app-wrapper">
    <main>{children}</main>
    <Footer />
  </div>
);

// 루트 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout><MainPage /></Layout>} />
      <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/symptom-checker" element={<Layout><SymptomChecker /></Layout>} />
      <Route path="/drug-detail" element={<Layout><DrugDetailPage /></Layout>} />
      <Route path="/drugInfo" element={<Layout><DrugSearchPage /></Layout>} />
      <Route path="/mypage" element={<Layout><MyPage /></Layout>} />
      <Route path="/disease" element={<Layout><DiseaseManager /></Layout>} />
      <Route path="/preference" element={<Layout><PreferenceManager /></Layout>} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
