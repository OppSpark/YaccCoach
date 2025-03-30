import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import DrugInfoApp from './components/examples/App.js';
import Login from './components/examples/login.js';
import SymptomChecker from './components/examples/search-components.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);