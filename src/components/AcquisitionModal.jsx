import React, { useState } from 'react';

const AGE_OPTIONS = ['20代', '30代', '40代', '50代', '60代', '70代'];
const AMOUNT_OPTIONS = [1500, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
const GENDER_OPTIONS = ['男性', '女性'];
const PAYMENT_OPTIONS = ['クレジット', '口座'];
const DONORPO_OPTIONS = ['〇', '×'];

export const AcquisitionModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        amount: '',
        payment: '',
        donorpo: '',
        memo: '',
    });

    const [showDetails, setShowDetails] = useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!formData.age || !formData.gender || !formData.amount || !formData.payment || !formData.donorpo) {
            alert('全ての項目を入力してください');
            return;
        }
        onSave(formData);
        setFormData({
            age: '',
            gender: '',
            amount: '',
            payment: '',
            donorpo: '',
            memo: '',
        });
        setShowDetails(false);
        onClose();
    };

    const handleLater = () => {
        setShowDetails(false);
        onClose();
    };

    const handleInputNow = () => {
        setShowDetails(true);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300">
                {!showDetails ? (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">📝 獲得情報を入力しますか？</h2>
                        <div className="flex gap-4">
                            <button
                                onClick={handleLater}
                                className="btn-large btn-secondary flex-1"
                            >
                                後で
                            </button>
                            <button
                                onClick={handleInputNow}
                                className="btn-large btn-primary flex-1"
                            >
                                入力する
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">✍️ 獲得詳細入力</h2>

                        {/* 年代 */}
                        <div className="mb-5">
                            <label className="text-lg font-semibold text-gray-700 dark:text-gray-300 block mb-2">年代</label>
                            <div className="grid grid-cols-3 gap-2">
                                {AGE_OPTIONS.map(age => (
                                    <button
                                        key={age}
                                        onClick={() => setFormData({ ...formData, age })}
                                        className={`py-3 px-4 rounded-lg font-bold transition-all ${formData.age === age
                                            ? 'bg-primary-500 text-white shadow-lg scale-105'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {age}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 性別 */}
                        <div className="mb-5">
                            <label className="text-lg font-semibold text-gray-700 dark:text-gray-300 block mb-2">性別</label>
                            <div className="grid grid-cols-2 gap-2">
                                {GENDER_OPTIONS.map(gender => (
                                    <button
                                        key={gender}
                                        onClick={() => setFormData({ ...formData, gender })}
                                        className={`py-3 px-4 rounded-lg font-bold transition-all ${formData.gender === gender
                                            ? 'bg-primary-500 text-white shadow-lg scale-105'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {gender}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 金額 */}
                        <div className="mb-5">
                            <label className="text-lg font-semibold text-gray-700 dark:text-gray-300 block mb-2">金額</label>
                            <div className="grid grid-cols-5 gap-2">
                                {AMOUNT_OPTIONS.map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => setFormData({ ...formData, amount })}
                                        className={`py-3 px-2 rounded-lg font-bold text-sm transition-all ${formData.amount === amount
                                            ? 'bg-green-500 text-white shadow-lg scale-105'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {amount}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 決済方法 */}
                        <div className="mb-5">
                            <label className="text-lg font-semibold text-gray-700 dark:text-gray-300 block mb-2">決済方法</label>
                            <div className="grid grid-cols-2 gap-2">
                                {PAYMENT_OPTIONS.map(payment => (
                                    <button
                                        key={payment}
                                        onClick={() => setFormData({ ...formData, payment })}
                                        className={`py-3 px-4 rounded-lg font-bold transition-all ${formData.payment === payment
                                            ? 'bg-primary-500 text-white shadow-lg scale-105'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {payment}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ドナポ */}
                        <div className="mb-5">
                            <label className="text-lg font-semibold text-gray-700 dark:text-gray-300 block mb-2">ドナポ</label>
                            <div className="grid grid-cols-2 gap-2">
                                {DONORPO_OPTIONS.map(donorpo => (
                                    <button
                                        key={donorpo}
                                        onClick={() => setFormData({ ...formData, donorpo })}
                                        className={`py-3 px-4 rounded-lg font-bold text-2xl transition-all ${formData.donorpo === donorpo
                                            ? 'bg-accent-500 text-white shadow-lg scale-105'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {donorpo}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* アプローチメモ */}
                        <div className="mb-6">
                            <label className="text-lg font-semibold text-gray-700 dark:text-gray-300 block mb-2">アプローチメモ</label>
                            <textarea
                                value={formData.memo}
                                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                                className="input-field resize-none"
                                rows="3"
                                placeholder="アプローチの内容や特記事項"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleLater}
                                className="btn-large btn-secondary flex-1"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleSave}
                                className="btn-large btn-success flex-1"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
