import React from 'react';

export default function ApplicationLogo({ className = 'h-9 w-auto' }) {
    return (
        <img 
            src="/images/repairlink-logo.png" 
            alt="RepairLink Logo" 
            className={`object-contain ${className}`}
        />
    );
}