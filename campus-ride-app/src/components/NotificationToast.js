import React, { useEffect } from 'react';

const NotificationToast = ({ message, type, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return '#22c55e';
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            default: return '#3b82f6';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: getBackgroundColor(),
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            zIndex: 1000,
            maxWidth: '300px',
            animation: 'slideIn 0.3s ease-out'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{message}</span>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '18px',
                        cursor: 'pointer',
                        marginLeft: '10px'
                    }}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default NotificationToast;