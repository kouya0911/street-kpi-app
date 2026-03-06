import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

const TIME_SLOTS = ['10:00~', '12:00~', '14:00~', '16:00~', '18:00~'];

export const AnalysisPanel = ({
    isOpen,
    onClose,
    kpiData,
    acquisitions,
    memos,
    conversionRates,
    currentDate,
    pastDates,
    onDateChange,
    reflection,
    onReflectionUpdate,
    onAddToReflection
}) => {
    const exportRef = useRef(null);
    const [editingGood, setEditingGood] = useState('');
    const [editingMore, setEditingMore] = useState('');

    const totals = { S: 0, P: 0, C: 0, Su: 0 };
    TIME_SLOTS.forEach(slot => {
        totals.S += kpiData[slot].S;
        totals.P += kpiData[slot].P;
        totals.C += kpiData[slot].C;
        totals.Su += kpiData[slot].Su;
    });

    const copyAcquisition = (acq) => {
        const text = `${acq.time} ${acq.age}${acq.gender} ${acq.payment} ドナポ${acq.donorpo}\n${acq.memo}\n${acq.amount}`;
        navigator.clipboard.writeText(text);
        alert('獲得情報をコピーしました！');
    };

    const copyMemo = (memo) => {
        navigator.clipboard.writeText(memo.text);
        alert('メモをコピーしました！');
    };

    const addGoodItem = (e) => {
        if (e) e.preventDefault();
        if (editingGood.trim()) {
            onAddToReflection('good', editingGood);
            setEditingGood('');
        }
    };

    const addMoreItem = (e) => {
        if (e) e.preventDefault();
        if (editingMore.trim()) {
            onAddToReflection('more', editingMore);
            setEditingMore('');
        }
    };

    const removeReflectionItem = (e, type, index) => {
        if (e) e.preventDefault();
        const newItems = reflection[type].filter((_, i) => i !== index);
        onReflectionUpdate(type, newItems);
    };

    const handleAddGoodFromMemo = (e, memoText) => {
        if (e) e.preventDefault();
        onAddToReflection('good', memoText);
    };

    const handleAddMoreFromMemo = (e, memoText) => {
        if (e) e.preventDefault();
        onAddToReflection('more', memoText);
    };

    const [previewImage, setPreviewImage] = useState(null);

    const exportImage = async (e) => {
        if (e) e.preventDefault();
        if (exportRef.current) {
            try {
                // Generate canvas
                const canvas = await html2canvas(exportRef.current, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    useCORS: true,
                    logging: false,
                });

                // Convert to Blob
                canvas.toBlob(async (blob) => {
                    if (!blob) {
                        alert('画像の生成に失敗しました');
                        return;
                    }

                    const fileName = `street-hero-reflection-${currentDate}.png`;
                    const file = new File([blob], fileName, {
                        type: 'image/png',
                        lastModified: new Date().getTime()
                    });

                    // Native Share API
                    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                        try {
                            await navigator.share({
                                files: [file],
                                // iOS often ignores text/title when sharing files, but good to include
                                title: 'Street Hero 振り返り',
                            });
                        } catch (shareError) {
                            if (shareError.name !== 'AbortError') {
                                console.error('Share failed:', shareError);
                                // Fallback: Show image preview for long-press save
                                setPreviewImage(canvas.toDataURL('image/png'));
                            }
                        }
                    } else {
                        // Fallback: Show image preview for long-press save
                        setPreviewImage(canvas.toDataURL('image/png'));
                    }
                }, 'image/png', 1.0);

            } catch (error) {
                alert('画像の保存処理に失敗しました');
                console.error(error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-40">
            <div className="bg-white dark:bg-gray-900 w-full md:w-[600px] h-[90vh] md:h-[95vh] md:rounded-2xl shadow-2xl flex flex-col transition-colors duration-300">
                {/* ヘッダー */}
                <div className="p-4 border-b dark:border-gray-700 bg-blue-600 dark:bg-blue-800 text-white md:rounded-t-2xl flex justify-between items-center">
                    <h2 className="text-xl font-bold">📊 分析・履歴</h2>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onClose();
                        }}
                        className="text-2xl font-bold hover:bg-blue-700 rounded-full w-10 h-10"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
                    {/* 日付選択 */}
                    <div className="mb-4">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">日付選択</label>
                        <select
                            value={currentDate}
                            onChange={(e) => onDateChange(e.target.value)}
                            className="input-field py-2"
                        >
                            {pastDates.map(date => (
                                <option key={date} value={date}>{date}</option>
                            ))}
                        </select>
                    </div>

                    {/* エクスポート対象エリア */}
                    <div ref={exportRef} className="bg-white dark:bg-gray-900 p-4">
                        {/* 時間帯別集計 */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">⏰ 時間帯別集計</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse text-gray-900 dark:text-gray-100">
                                    <thead>
                                        <tr className="bg-gray-200 dark:bg-gray-800">
                                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-2">時間</th>
                                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-2">S</th>
                                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-2">P</th>
                                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-2">C</th>
                                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-2">Su</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {TIME_SLOTS.map(slot => (
                                            <tr key={slot}>
                                                <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 font-semibold">{slot}</td>
                                                <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center">{kpiData[slot].S}</td>
                                                <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center">{kpiData[slot].P}</td>
                                                <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center">{kpiData[slot].C}</td>
                                                <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center">{kpiData[slot].Su}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-blue-100 dark:bg-blue-900 font-bold">
                                            <td className="border border-gray-300 dark:border-gray-600 px-2 py-2">合計</td>
                                            <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center">{totals.S}</td>
                                            <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center">{totals.P}</td>
                                            <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center">{totals.C}</td>
                                            <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center">{totals.Su}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 移行率 */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">📈 移行率</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg text-center">
                                    <div className="text-xs text-gray-600 dark:text-gray-300 font-semibold">S→P</div>
                                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{conversionRates['S→P']}%</div>
                                </div>
                                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg text-center">
                                    <div className="text-xs text-gray-600 dark:text-gray-300 font-semibold">P→C</div>
                                    <div className="text-xl font-bold text-green-600 dark:text-green-400">{conversionRates['P→C']}%</div>
                                </div>
                                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-lg text-center">
                                    <div className="text-xs text-gray-600 dark:text-gray-300 font-semibold">C→Su</div>
                                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{conversionRates['C→Su']}%</div>
                                </div>
                            </div>
                        </div>

                        {/* 振り返りセクション */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">🔍 振り返り</h3>

                            {/* Good */}
                            <div className="mb-4">
                                <h4 className="text-md font-bold text-green-700 mb-2">✅ Good（良かったこと）</h4>
                                <div className="space-y-1 mb-2 min-h-[40px]">
                                    {reflection.good.length === 0 ? (
                                        <div className="text-sm text-gray-400 italic p-2 bg-gray-50 dark:bg-gray-800 rounded">未入力</div>
                                    ) : (
                                        reflection.good.map((item, index) => (
                                            <div key={index} className="flex items-start gap-2 bg-green-50 dark:bg-green-900/30 p-2 rounded">
                                                <span className="flex-1 text-sm dark:text-gray-100">• {item}</span>
                                                <button
                                                    onClick={(e) => removeReflectionItem(e, 'good', index)}
                                                    className="text-red-500 hover:text-red-700 text-xs"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={editingGood}
                                        onChange={(e) => setEditingGood(e.target.value)}
                                        className="input-field flex-1 text-sm py-1"
                                        placeholder="良かったことを追加"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addGoodItem(e);
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={addGoodItem}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-semibold"
                                    >
                                        追加
                                    </button>
                                </div>
                            </div>

                            {/* More */}
                            <div>
                                <h4 className="text-md font-bold text-orange-700 mb-2">🔄 More（改善点）</h4>
                                <div className="space-y-1 mb-2 min-h-[40px]">
                                    {reflection.more.length === 0 ? (
                                        <div className="text-sm text-gray-400 italic p-2 bg-gray-50 dark:bg-gray-800 rounded">未入力</div>
                                    ) : (
                                        reflection.more.map((item, index) => (
                                            <div key={index} className="flex items-start gap-2 bg-orange-50 dark:bg-orange-900/30 p-2 rounded">
                                                <span className="flex-1 text-sm dark:text-gray-100">• {item}</span>
                                                <button
                                                    onClick={(e) => removeReflectionItem(e, 'more', index)}
                                                    className="text-red-500 hover:text-red-700 text-xs"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={editingMore}
                                        onChange={(e) => setEditingMore(e.target.value)}
                                        className="input-field flex-1 text-sm py-1"
                                        placeholder="改善点を追加"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addMoreItem(e);
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={addMoreItem}
                                        className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm font-semibold"
                                    >
                                        追加
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 画像エクスポートボタン */}
                    <div className="mb-6">
                        <button
                            onClick={exportImage}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-bold shadow-md"
                        >
                            📥 振り返り画像を保存
                        </button>
                    </div>

                    {/* 獲得情報一覧 */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">💰 獲得情報</h3>
                        {acquisitions.length === 0 ? (
                            <p className="text-gray-500 text-sm">獲得情報はまだありません</p>
                        ) : (
                            <div className="space-y-3">
                                {acquisitions.map(acq => (
                                    <div key={acq.id} className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <div className="font-bold text-sm text-gray-800 dark:text-gray-200">
                                                    {acq.time} {acq.age}{acq.gender} {acq.payment} ドナポ{acq.donorpo}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{acq.memo}</div>
                                                <div className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">¥{acq.amount}</div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    copyAcquisition(acq);
                                                }}
                                                className="ml-2 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded-lg text-xs font-semibold shadow text-gray-800 dark:text-white"
                                            >
                                                📋 コピー
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* メモ一覧 */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">📝 メモ履歴</h3>
                        {memos.length === 0 ? (
                            <p className="text-gray-500 text-sm">メモはまだありません</p>
                        ) : (
                            <div className="space-y-2">
                                {memos.map(memo => (
                                    <div key={memo.id} className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{memo.time}</div>
                                        <div className="text-sm text-gray-800 dark:text-gray-200 mb-2">{memo.text}</div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    copyMemo(memo);
                                                }}
                                                className="bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded text-xs font-semibold shadow text-gray-800 dark:text-white"
                                            >
                                                📋 コピー
                                            </button>
                                            <button
                                                onClick={(e) => handleAddGoodFromMemo(e, memo.text)}
                                                className="bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-800 dark:text-green-300 text-green-700 px-3 py-1 rounded text-xs font-semibold"
                                            >
                                                ✅ Good追加
                                            </button>
                                            <button
                                                onClick={(e) => handleAddMoreFromMemo(e, memo.text)}
                                                className="bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800 dark:text-orange-300 text-orange-700 px-3 py-1 rounded text-xs font-semibold"
                                            >
                                                🔄 More追加
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 画像保存用プレビューモーダル（シェア非対応時またはエラー時） */}
            {previewImage && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-2 max-w-sm w-full max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-2 px-2">
                            <span className="text-sm font-bold text-gray-700">画像を長押しして保存</span>
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="text-gray-500 hover:text-gray-700 font-bold p-1"
                            >
                                ✕ 閉じる
                            </button>
                        </div>
                        <div className="overflow-auto flex-1 bg-gray-100 rounded border border-gray-200">
                            <img src={previewImage} alt="振り返り画像" className="w-full h-auto" />
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2">
                            「写真に保存」または「画像を保存」を選んでください
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
