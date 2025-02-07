'use client';

export default function ConfirmDialog({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmButtonProps = {}
}) {
    if (!isOpen) return null;

    return (
        <div className="confirm-dialog-overlay" onClick={onCancel}>
            <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
                <div className="confirm-dialog-header">
                    <h3>{title}</h3>
                </div>
                <div className="confirm-dialog-content">
                    {message}
                </div>
                <div className="confirm-dialog-actions">
                    <button 
                        className="btn btn-secondary" 
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button 
                        onClick={onConfirm}
                        {...confirmButtonProps}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
} 