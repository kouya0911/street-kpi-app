import React, { useMemo } from 'react';

const TIME_SLOTS = ['10:00~', '12:00~', '14:00~', '16:00~', '18:00~'];

const getTotals = (kpiData) => {
    const totals = { S: 0, P: 0, C: 0, Su: 0 };
    if (!kpiData) return totals;
    TIME_SLOTS.forEach(slot => {
        if (kpiData[slot]) {
            totals.S += kpiData[slot].S || 0;
            totals.P += kpiData[slot].P || 0;
            totals.C += kpiData[slot].C || 0;
            totals.Su += kpiData[slot].Su || 0;
        }
    });
    return totals;
};

const getConversion = (totals) => ({
    'S→P': totals.S > 0 ? ((totals.P / totals.S) * 100).toFixed(1) : '0.0',
    'P→C': totals.P > 0 ? ((totals.C / totals.P) * 100).toFixed(1) : '0.0',
    'C→Su': totals.C > 0 ? ((totals.Su / totals.C) * 100).toFixed(1) : '0.0',
});

const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${weekdays[d.getDay()]})`;
};

export const DayDetailModal = ({ isOpen, onClose, dateStr }) => {
    const dayData = useMemo(() => {
        if (!dateStr) return null;
        const key = `street-hero-${dateStr}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    }, [dateStr]);

    if (!isOpen) return null;

    const hasData = dayData !== null;
    const totals = hasData ? getTotals(dayData.kpiData) : null;
    const conversion = totals ? getConversion(totals) : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-blue-100 dark:border-gray-700 transition-colors duration-300 max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 flex items-center justify-between flex-shrink-0">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        📅 {dateStr ? formatDateLabel(dateStr) : ''}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white text-2xl leading-none transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4 overflow-y-auto">
                    {!hasData ? (
                        <div className="text-center py-8">
                            <div className="text-3xl mb-2">📭</div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">データがありません</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Basic Info */}
                            {(dayData.station || dayData.locationCode || dayData.theme || dayData.goal) && (
                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">基本情報</h4>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {dayData.station && (
                                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1.5">
                                                <div className="text-[10px] text-gray-400">駅名</div>
                                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{dayData.station}</div>
                                            </div>
                                        )}
                                        {dayData.locationCode && (
                                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1.5">
                                                <div className="text-[10px] text-gray-400">ロケコ</div>
                                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{dayData.locationCode}</div>
                                            </div>
                                        )}
                                        {dayData.theme && (
                                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1.5">
                                                <div className="text-[10px] text-gray-400">テーマ</div>
                                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{dayData.theme}</div>
                                            </div>
                                        )}
                                        {dayData.goal && (
                                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1.5">
                                                <div className="text-[10px] text-gray-400">ゴール</div>
                                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{dayData.goal}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* KPI Summary */}
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">KPI</h4>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {[
                                        { key: 'S', label: 'Stop', color: 'bg-blue-600' },
                                        { key: 'P', label: 'Pitch', color: 'bg-green-600' },
                                        { key: 'C', label: 'Close', color: 'bg-yellow-600' },
                                        { key: 'Su', label: 'Sign Up', color: 'bg-indigo-600' },
                                    ].map(({ key, label, color }) => (
                                        <div key={key} className={`${color} rounded-lg py-2 text-center text-white`}>
                                            <div className="text-lg font-bold leading-tight">{totals[key]}</div>
                                            <div className="text-[10px] opacity-80">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Conversion Rates */}
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">移行率</h4>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {Object.entries(conversion).map(([label, rate]) => (
                                        <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2 text-center">
                                            <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{rate}%</div>
                                            <div className="text-[10px] text-gray-500">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Memos */}
                            {dayData.quickMemos && dayData.quickMemos.length > 0 && (
                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">メモ</h4>
                                    <div className="space-y-1">
                                        {dayData.quickMemos.map((memo, i) => (
                                            <div
                                                key={memo.id || i}
                                                className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300"
                                            >
                                                <span className="text-[10px] text-gray-400 mr-1.5">{memo.time || ''}</span>
                                                {memo.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Acquisitions */}
                            {dayData.acquisitions && dayData.acquisitions.length > 0 && (
                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">獲得詳細</h4>
                                    <div className="space-y-1">
                                        {dayData.acquisitions.map((acq, i) => (
                                            <div
                                                key={acq.id || i}
                                                className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border border-indigo-100 dark:border-indigo-800"
                                            >
                                                <span className="text-[10px] text-gray-400 mr-1.5">{acq.time || ''}</span>
                                                {acq.productName && <span className="font-medium">{acq.productName}</span>}
                                                {acq.notes && <span className="ml-1 text-gray-500">— {acq.notes}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
