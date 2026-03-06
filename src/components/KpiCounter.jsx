import React from 'react';

const KPI_COLORS = {
    S: 'bg-blue-600 hover:bg-blue-700',
    P: 'bg-green-600 hover:bg-green-700',
    C: 'bg-yellow-600 hover:bg-yellow-700',
    Su: 'bg-indigo-600 hover:bg-indigo-700',
};

const KPI_LABELS = {
    S: 'Stop',
    P: 'Pitch',
    C: 'Close',
    Su: 'Sign Up',
};

export const KpiCounter = ({ type, count, onIncrement, onDecrement }) => {
    return (
        <div className="card !p-2.5">
            <div className="text-center mb-1">
                <div className="text-[10px] font-semibold text-gray-500 leading-tight">{KPI_LABELS[type]}</div>
                <div className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight">{type}</div>
            </div>

            <button
                onClick={onIncrement}
                className={`kpi-button ${KPI_COLORS[type]} mb-1.5`}
            >
                {count}
            </button>

            <div className="grid grid-cols-2 gap-1.5">
                <button
                    onClick={onIncrement}
                    className="counter-control bg-green-600 hover:bg-green-700 text-white"
                >
                    ＋
                </button>
                <button
                    onClick={onDecrement}
                    className="counter-control bg-red-600 hover:bg-red-700 text-white"
                >
                    ー
                </button>
            </div>
        </div>
    );
};
