'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Error({ 
  type = 'error',
  message, 
  action,
  className = '',
  dismissible = true
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '×';
      case 'warning':
        return '!';
      case 'info':
        return 'i';
      case 'success':
        return '✓';
      default:
        return '!';
    }
  };

  return (
    <div className={`error-wrapper ${type} ${className}`}>
      <div className="error-icon-wrapper">
        <span className="error-icon">{getIcon()}</span>
      </div>
      <div className="error-content">
        <p className="error-text">{message}</p>
        {action && (
          <div className="error-action">
            {typeof action === 'string' ? (
              <Link href={action}>Try Again</Link>
            ) : (
              action
            )}
          </div>
        )}
      </div>
      {dismissible && (
        <button 
          className="error-dismiss" 
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}