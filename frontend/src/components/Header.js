import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    const titles = {
      '/dashboard': 'Dashboard',
      '/pdv': 'PDV - Ponto de Venda',
      '/estoque': 'Estoque',
      '/financeiro': 'Financeiro',
    };
    return titles[location.pathname] || 'Sistema Paula Bebidas';
  };

  return (
    <header className="h-24 flex items-center justify-between px-10 shrink-0">
      <h2 className="text-2xl font-black text-slate-800">{getPageTitle()}</h2>
      <div className="bg-white border p-3 rounded-2xl font-bold shadow-sm">
        {currentTime.toLocaleTimeString('pt-BR')}
      </div>
    </header>
  );
};

export default Header;
