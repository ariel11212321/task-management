import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

const MessageModal = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); 
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getAlertStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 mr-3" />;
      case 'error':
        return <XCircle className="w-5 h-5 mr-3" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 mr-3" />;
      default:
        return <AlertCircle className="w-5 h-5 mr-3" />;
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`${getAlertStyle()} border shadow-lg rounded-lg p-4 max-w-sm flex items-center`}>
        {getIcon()}
        <div className="flex-grow">{message}</div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-3 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
