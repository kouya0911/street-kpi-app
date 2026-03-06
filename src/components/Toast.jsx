import React, { useEffect, useState } from 'react';

export const Toast = ({ message, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setVisible(true));

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 2700);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
        >
            <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
                <span className="text-amber-400 dark:text-amber-600">⚠️</span>
                {message}
            </div>
        </div>
    );
};
