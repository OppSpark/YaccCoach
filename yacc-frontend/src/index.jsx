import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/main/index.jsx';
import Login from './components/signin/login.jsx';
import SymptomChecker from './components/search/search-components.jsx';
import Signup from './components/signup/index.jsx';
import DrugDetailPage from './components/search/DrugDetailPage.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/drug-detail" element={<DrugDetailPage />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);