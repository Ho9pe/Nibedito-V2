'use client';

import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmDialog({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    actionType 
}) {
    if (!isOpen) return null;

    const getActionColor = () => {
        switch (actionType) {
            case 'ban':
                return 'text-yellow-500';
            case 'unban':
                return 'text-green-500';
            case 'delete':
                return 'text-red-500';
            default:
                return 'text-blue-500';
        }
    };

    return (
        <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
                <div className="dialog-header">
                    <FiAlertTriangle className={`dialog-icon ${getActionColor()}`} />
                    <h3>{title}</h3>
                </div>
                <p className="dialog-message">{message}</p>
                <div className="dialog-actions">
                    <button 
                        onClick={onClose}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className={`btn-primary ${actionType}`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
} 