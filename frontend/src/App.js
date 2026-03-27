import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import PDV from './pages/PDV';
import Estoque from './pages/Estoque';
import Financeiro from './pages/Financeiro';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pdv" element={<PDV />} />
              <Route path="/estoque" element={<Estoque />} />
              <Route path="/financeiro" element={<Financeiro />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
