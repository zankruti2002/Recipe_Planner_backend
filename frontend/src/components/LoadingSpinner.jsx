import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
    const sizeClasses = {
        small: 'spinner-small',
        medium: 'spinner-medium',
        large: 'spinner-large'
    };

    const colorClasses = {
        primary: 'spinner-primary',
        secondary: 'spinner-secondary',
        light: 'spinner-light',
        dark: 'spinner-dark'
    };

    return (
        <div className="loading-container">
            <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}></div>
        </div>
    );
};

export default LoadingSpinner; 