import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/main/main.jsx';
import Login from './components/examples/login/login.jsx';
import SymptomChecker from './components/examples/search/search-components.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);