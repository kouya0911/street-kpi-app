import React, { useState } from 'react';

export const DayManagement = ({ onStartNextDay }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleConfirm = () => {
        onStartNextDay();
        setShowConfirm(false);
    };

    return (
        <div className="card">
            <h2 className="text-xl font-bold mb-3 text-gray-800">⚙️ 運用管理</h2>
            <button
                onClick={() => setShowConfirm(true)}
                className="btn-large bg-orange-500 hover:bg-orange-600 text-white w-full"
            >
                🔄 次の日の稼働を始める
            </button>

            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-center">確認</h3>
                        <p className="text-gray-700 mb-6 text-center">
                            現在のデータは保存されます。<br />
                            次の日のデータを開始しますか？
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="btn-large btn-secondary flex-1"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="btn-large bg-orange-500 hover:bg-orange-600 text-white flex-1"
                            >
                                開始
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
