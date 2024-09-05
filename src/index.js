import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Home'
import Wel from './welcome';
import Instr from './Instr';
import Sendinstr from './SendInstr';
import Dash from './Dash'
import App from './App';
import WalletConnect from './components/WalletConnect';
import DeployContract from './components/DeployContract';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dash" element={<Dash />} />
        <Route path="/send-instruction" element={<Sendinstr />} />
        <Route path="/instructions" element={<Instr />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
