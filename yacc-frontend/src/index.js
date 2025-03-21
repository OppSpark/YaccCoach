import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DrugInfoApp from './components/examples/App.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DrugInfoApp />
  </React.StrictMode>
);