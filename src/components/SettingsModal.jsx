import React, { useState, useEffect } from 'react';

export const SettingsModal = ({ isOpen, onClose, theme, onToggleTheme, settings, onSaveSettings, onStartNextDay }) => {
    const [locationSheetUrl, setLocationSheetUrl] = useState('');
    const [noticeMemoUrl, setNoticeMemoUrl] = useState('');
    const [pointSheetUrl, setPointSheetUrl] = useState('');
    const [saved, setSaved] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLocationSheetUrl(settings.locationSheetUrl || '');
            setNoticeMemoUrl(settings.noticeMemoUrl || '');
            setPointSheetUrl(settings.pointSheetUrl || '');
            setSaved(false);
            setShowResetConfirm(false);
        }
    }, [isOpen, settings]);

    const handleSave = () => {
        onSaveSettings({
            locationSheetUrl: locationSheetUrl.trim(),
            noticeMemoUrl: noticeMemoUrl.trim(),
            pointSheetUrl: pointSheetUrl.trim(),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleStartNextDay = () => {
        onStartNextDay();
        setShowResetConfirm(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-blue-100 dark:border-gray-700 transition-colors duration-300 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        ⚙️ 設定
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white text-2xl leading-none transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-5 space-y-5 overflow-y-auto">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
                            <div>
                                <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">ダークモード</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {theme === 'dark' ? 'ON' : 'OFF'}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onToggleTheme}
                            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* URL Configurator */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            🔗 クイックリンク設定
                        </h4>

                        <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                                📋 ロケーションシート URL
                            </label>
                            <input
                                type="url"
                                value={locationSheetUrl}
                                onChange={(e) => setLocationSheetUrl(e.target.value)}
                                className="input-field text-sm"
                                placeholder="https://docs.google.com/spreadsheets/..."
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                                📝 デイリー連絡/メモ URL
                            </label>
                            <input
                                type="url"
                                value={noticeMemoUrl}
                                onChange={(e) => setNoticeMemoUrl(e.target.value)}
                                className="input-field text-sm"
                                placeholder="https://docs.google.com/document/..."
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                                ⭐ ポイントシート URL
                            </label>
                            <input
                                type="url"
                                value={pointSheetUrl}
                                onChange={(e) => setPointSheetUrl(e.target.value)}
                                className="input-field text-sm"
                                placeholder="https://docs.google.com/spreadsheets/..."
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className={`w-full py-3 rounded-xl font-bold text-white text-sm shadow-lg transition-all duration-300 active:scale-95 ${saved
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                            }`}
                    >
                        {saved ? '✓ 保存しました！' : '保存'}
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700" />

                    {/* Start Next Day */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            🔄 運用管理
                        </h4>
                        {!showResetConfirm ? (
                            <button
                                onClick={() => setShowResetConfirm(true)}
                                className="w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all duration-300 active:scale-95 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                            >
                                🔄 次の日を始める
                            </button>
                        ) : (
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                                <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-3">
                                    現在のデータは保存されます。<br />次の日を開始しますか？
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowResetConfirm(false)}
                                        className="flex-1 py-2 rounded-lg text-sm font-semibold bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        onClick={handleStartNextDay}
                                        className="flex-1 py-2 rounded-lg text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white transition-colors"
                                    >
                                        開始
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
