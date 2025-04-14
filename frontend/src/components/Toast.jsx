import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className={`toast ${type}`}>
            <div className="toast-content">
                <div className="toast-icon">
                    {type === 'success' ? '✓' : type === 'error' ? '✕' : '!'}
                </div>
                <div className="toast-message">{message}</div>
                <button className="toast-close" onClick={() => {
                    setIsVisible(false);
                    if (onClose) onClose();
                }}>
                    ×
                </button>
            </div>
        </div>
    );
};

export default Toast; 