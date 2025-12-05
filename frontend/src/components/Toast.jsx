import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose(); // Call onClose when the toast starts to hide
    }, 3000); // Hide after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: CheckCircle, // Using CheckCircle for info as well, can be changed
  }[type || 'info']; // Default to info icon if type is not specified

  const bgColor = typeClasses[type || 'info'];

  return (
    <div className={`fixed bottom-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-[999] flex items-center space-x-3 animate-fade-in-up`}>
      {Icon && <Icon size={20} />}
      <span className="font-medium">{message}</span>
      <button onClick={() => { setIsVisible(false); onClose(); }} className="ml-2 text-white/80 hover:text-white transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
