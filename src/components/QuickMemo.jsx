import React, { useState } from 'react';

export const QuickMemo = ({ onAddMemo }) => {
    const [memo, setMemo] = useState('');

    const handleSave = () => {
        if (memo.trim()) {
            onAddMemo(memo);
            setMemo('');
        }
    };

    return (
        <div className="card !p-2.5">
            <h2 className="text-sm font-bold mb-1.5 text-gray-800 dark:text-gray-100">📝 クイックメモ</h2>
            <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="input-field resize-none mb-1.5 !py-1.5"
                rows="2"
                placeholder="現場で気づいたことをメモ"
            />
            <button
                onClick={handleSave}
                className="btn-large btn-primary w-full !py-2 !text-sm"
            >
                保存
            </button>
        </div>
    );
};
