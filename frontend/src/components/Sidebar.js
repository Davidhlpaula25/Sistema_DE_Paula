import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', path: '/dashboard' },
    { id: 'pdv', label: '🛒 PDV', path: '/pdv' },
    { id: 'estoque', label: '📦 Estoque', path: '/estoque' },
    { id: 'financeiro', label: '💰 Financeiro', path: '/financeiro' },
  ];

  return (
    <aside className="w-72 bg-sidebar text-white flex flex-col p-6">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-black tracking-tighter italic text-blue-400">
          DAVID_DISTRI
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Premium ERP System
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`block w-full text-left px-6 py-4 rounded-[1.5rem] font-semibold transition-all hover:bg-slate-800 ${
              location.pathname === item.path ? 'sidebar-active' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-700">
        <p className="text-xs text-slate-400">© 2026 David Distri</p>
        <p className="text-xs text-slate-500">v2.0.0 Full Stack</p>
      </div>
    </aside>
  );
};

export default Sidebar;
