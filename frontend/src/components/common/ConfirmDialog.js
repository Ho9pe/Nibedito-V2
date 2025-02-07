'use client';

import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay" onClick={onCancel}>
            <div className="dialog-content" onClick={e => e.stopPropagation()}>
                <div className="dialog-header">
                    <FiAlertTriangle className="dialog-icon" />
                    <h3 className="dialog-title">{title}</h3>
                </div>
                <p className="dialog-message">{message}</p>
                <div className="dialog-actions">
                    <button 
                        className="btn btn-secondary" 
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button 
                        className="btn btn-danger" 
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
} 