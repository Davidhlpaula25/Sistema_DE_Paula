import React from 'react';

const Confirm = ({ message, onConfirm, onCancel, type = 'warning' }) => {
  const colors = {
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      icon: '⚠️',
      confirmBtn: 'bg-yellow-600 hover:bg-yellow-700',
      title: 'text-yellow-800'
    },
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      icon: '🚨',
      confirmBtn: 'bg-red-600 hover:bg-red-700',
      title: 'text-red-800'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      icon: 'ℹ️',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700',
      title: 'text-blue-800'
    }
  };

  const color = colors[type] || colors.warning;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-in">
        <div className={`${color.bg} border-2 ${color.border} rounded-t-lg p-6`}>
          <div className="flex items-start gap-4">
            <div className="text-4xl">{color.icon}</div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold ${color.title} mb-2`}>Confirmação</h3>
              <p className="text-gray-700">{message}</p>
            </div>
          </div>
        </div>
        <div className="p-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 ${color.confirmBtn} text-white rounded-lg font-semibold transition-colors`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
