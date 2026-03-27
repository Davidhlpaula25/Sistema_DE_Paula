import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const types = {
    success: {
      bg: 'bg-green-50 border-green-500',
      icon: '✅',
      text: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50 border-red-500',
      icon: '❌',
      text: 'text-red-800'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-500',
      icon: '⚠️',
      text: 'text-yellow-800'
    },
    info: {
      bg: 'bg-blue-50 border-blue-500',
      icon: 'ℹ️',
      text: 'text-blue-800'
    }
  };

  const style = types[type] || types.info;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${style.bg} border-l-4 p-4 rounded-lg shadow-lg max-w-md`}>
        <div className="flex items-start">
          <span className="text-2xl mr-3">{style.icon}</span>
          <div className="flex-1">
            <p className={`${style.text} font-semibold`}>{message}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
