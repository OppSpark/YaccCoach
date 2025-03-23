import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DrugInfoApp from './components/examples/App.js';
import Login from './components/examples/login.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DrugInfoApp />
    <Login />
  </React.StrictMode>
);