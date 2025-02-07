'use client';

import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

export default function Error({ 
    type = 'error',
    message, 
    onClose,
    className = ''
}) {
    if (!message) return null;

    return (
        <div className={`error-message ${type} ${className}`}>
            <div className="error-content">
                <span className="error-icon">
                    {type === 'success' ? 
                        <FiCheckCircle size={20} /> : 
                        <FiAlertCircle size={20} />
                    }
                </span>
                <span>{message}</span>
            </div>
            {onClose && (
                <button 
                    onClick={onClose}
                    className="close-button"
                    aria-label="Close message"
                >
                    <FiX size={18} />
                </button>
            )}
        </div>
    );
}