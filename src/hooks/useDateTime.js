import { useState, useEffect } from 'react';

export const useDateTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getTimeSlot = (date = currentTime) => {
        const hour = date.getHours();
        if (hour >= 18) return '18:00~';
        if (hour >= 16) return '16:00~';
        if (hour >= 14) return '14:00~';
        if (hour >= 12) return '12:00~';
        if (hour >= 10) return '10:00~';
        return '10:00~'; // デフォルト
    };

    const formatTime = (date = currentTime) => {
        return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date = currentTime) => {
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    const getExactTime = (date = currentTime) => {
        return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return {
        currentTime,
        timeSlot: getTimeSlot(),
        formatTime,
        formatDate,
        getTimeSlot,
        getExactTime
    };
};
