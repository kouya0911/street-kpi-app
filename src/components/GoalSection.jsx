import React from 'react';

export const GoalSection = ({ theme, goal, onThemeChange, onGoalChange }) => {
    return (
        <div className="card mb-4">
            <h2 className="text-xl font-bold mb-3 text-gray-800">🎯 目標意識</h2>
            <div className="space-y-3">
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">今日のテーマ</label>
                    <textarea
                        value={theme}
                        onChange={(e) => onThemeChange(e.target.value)}
                        className="input-field resize-none"
                        rows="2"
                        placeholder="今日のテーマを入力"
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">ゴール</label>
                    <textarea
                        value={goal}
                        onChange={(e) => onGoalChange(e.target.value)}
                        className="input-field resize-none"
                        rows="2"
                        placeholder="今日のゴールを入力"
                    />
                </div>
            </div>
        </div>
    );
};
