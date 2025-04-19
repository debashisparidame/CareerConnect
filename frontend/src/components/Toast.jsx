import React, { useEffect, useState } from 'react';

const Toast = ({ 
  show, 
  onClose, 
  message, 
  delay = 3000, 
  position = 'bottom-end',
  type = 'info' // 'info', 'success', 'warning', 'error'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  
  // Set positioning classes based on position prop
  const getPositionClasses = () => {
    switch(position) {
      case 'top-start': return 'top-4 left-4';
      case 'top-center': return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-end': return 'top-4 right-4';
      case 'bottom-start': return 'bottom-4 left-4';
      case 'bottom-center': return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-end': 
      default: return 'bottom-4 right-4';
    }
  };
  
  // Get icon and colors based on toast type
  const getToastStyles = () => {
    switch(type) {
      case 'success':
        return {
          icon: 'fas fa-check-circle',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-500',
          textColor: 'text-green-800',
          iconColor: 'text-green-500',
          progressColor: 'bg-green-500'
        };
      case 'warning':
        return {
          icon: 'fas fa-exclamation-triangle',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-500',
          progressColor: 'bg-yellow-500'
        };
      case 'error':
        return {
          icon: 'fas fa-times-circle',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-500',
          textColor: 'text-red-800',
          iconColor: 'text-red-500',
          progressColor: 'bg-red-500'
        };
      case 'info':
      default:
        return {
          icon: 'fas fa-info-circle',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-500',
          progressColor: 'bg-blue-500'
        };
    }
  };
  
  const toastStyles = getToastStyles();
  const positionClasses = getPositionClasses();
  
  useEffect(() => {
    let progressInterval;
    let closeTimeout;
    
    if (show) {
      setIsVisible(true);
      setProgress(100);
      
      // Animate progress bar
      progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress - (100 / (delay / 100));
          return newProgress < 0 ? 0 : newProgress;
        });
      }, 100);
      
      // Close toast after delay
      closeTimeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
        }, 300); // Wait for fade-out animation to complete
      }, delay);
    } else {
      setIsVisible(false);
    }
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(closeTimeout);
    };
  }, [show, delay, onClose]);
  
  if (!show && !isVisible) return null;
  
  return (
    <div 
      className={`fixed ${positionClasses} z-50 max-w-sm shadow-lg transform transition-transform duration-300 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
    >
      <div className={`flex rounded-lg overflow-hidden ${toastStyles.bgColor} border-l-4 ${toastStyles.borderColor} shadow-md`}>
        {/* Icon Section */}
        <div className={`flex items-center justify-center pl-4 ${toastStyles.iconColor}`}>
          <i className={`${toastStyles.icon} text-lg`}></i>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between">
            <p className={`font-medium ${toastStyles.textColor}`}>Notification</p>
            <div className="flex items-center">
              <span className="mr-2 text-xs text-gray-500">Just now</span>
              <button 
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="text-gray-400 transition-colors hover:text-gray-600 focus:outline-none"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          <p className={`mt-1 text-sm ${toastStyles.textColor}`}>{message}</p>
          
          {/* Progress Bar */}
          <div className="w-full h-1 mt-2 overflow-hidden bg-gray-200 rounded-full">
            <div 
              className={`h-full ${toastStyles.progressColor} transition-all duration-100 ease-linear`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
