import React, { useState, useMemo } from 'react';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export const HistoryCalendar = ({ recordedDates, onDateSelect }) => {
    const [viewDate, setViewDate] = useState(() => new Date());

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        // Padding for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            days.push(d);
        }
        return days;
    }, [year, month]);

    const recordedSet = useMemo(() => new Set(recordedDates), [recordedDates]);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const getDateStr = (day) => {
        if (!day) return '';
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    return (
        <div className="card !p-2.5">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={prevMonth}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-bold"
                >
                    ‹
                </button>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    {year}年{month + 1}月
                </h3>
                <button
                    onClick={nextMonth}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-bold"
                >
                    ›
                </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
                {WEEKDAYS.map((wd, i) => (
                    <div
                        key={wd}
                        className={`text-center text-[10px] font-semibold py-0.5 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400 dark:text-gray-500'
                            }`}
                    >
                        {wd}
                    </div>
                ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0.5">
                {calendarDays.map((day, idx) => {
                    if (day === null) {
                        return <div key={`empty-${idx}`} className="h-9" />;
                    }

                    const dateStr = getDateStr(day);
                    const hasData = recordedSet.has(dateStr);
                    const isToday = dateStr === todayStr;
                    const dayOfWeek = (new Date(year, month, day)).getDay();
                    const isSunday = dayOfWeek === 0;
                    const isSaturday = dayOfWeek === 6;

                    return (
                        <button
                            key={day}
                            onClick={() => onDateSelect(dateStr)}
                            className={`h-9 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all duration-150 active:scale-90 relative ${isToday
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : hasData
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800/40'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                } ${isSunday && !isToday ? '!text-red-400' : ''} ${isSaturday && !isToday ? '!text-blue-400' : ''}`}
                        >
                            {day}
                            {hasData && !isToday && (
                                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
