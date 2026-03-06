import { useState, useEffect } from 'react';
import { useDateTime } from './useDateTime';

const TIME_SLOTS = ['10:00~', '12:00~', '14:00~', '16:00~', '18:00~'];

export const useKpiData = () => {
    const { getTimeSlot, getExactTime } = useDateTime();
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

    // 初期データ構造
    const getInitialData = () => ({
        date: currentDate,
        station: '',
        locationCode: '',
        theme: '',
        goal: '',
        quickMemos: [],
        kpiData: {
            '10:00~': { S: 0, P: 0, C: 0, Su: 0 },
            '12:00~': { S: 0, P: 0, C: 0, Su: 0 },
            '14:00~': { S: 0, P: 0, C: 0, Su: 0 },
            '16:00~': { S: 0, P: 0, C: 0, Su: 0 },
            '18:00~': { S: 0, P: 0, C: 0, Su: 0 },
        },
        acquisitions: [],
        reflection: {
            good: [],
            more: [],
        },
    });

    // localStorageからデータを取得
    const loadData = (date) => {
        const key = `street-hero-${date}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            const parsedData = JSON.parse(saved);
            // マイグレーション: reflectionフィールドがない古いデータに対応
            if (!parsedData.reflection) {
                parsedData.reflection = {
                    good: [],
                    more: [],
                };
            }
            return parsedData;
        }
        return getInitialData();
    };

    const [data, setData] = useState(() => loadData(currentDate));

    // データをlocalStorageに保存
    useEffect(() => {
        const key = `street-hero-${currentDate}`;
        localStorage.setItem(key, JSON.stringify(data));
    }, [data, currentDate]);

    // 日付変更
    const changeDate = (newDate) => {
        setCurrentDate(newDate);
        setData(loadData(newDate));
    };

    // 次の日を開始
    const startNextDay = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        changeDate(tomorrowStr);
    };

    // 基本情報更新
    const updateBasicInfo = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    // KPIカウンター増減
    const incrementKpi = (type) => {
        const slot = getTimeSlot();
        setData(prev => ({
            ...prev,
            kpiData: {
                ...prev.kpiData,
                [slot]: {
                    ...prev.kpiData[slot],
                    [type]: prev.kpiData[slot][type] + 1,
                },
            },
        }));
    };

    const decrementKpi = (type) => {
        const slot = getTimeSlot();
        setData(prev => {
            const currentValue = prev.kpiData[slot][type];
            if (currentValue > 0) {
                return {
                    ...prev,
                    kpiData: {
                        ...prev.kpiData,
                        [slot]: {
                            ...prev.kpiData[slot],
                            [type]: currentValue - 1,
                        },
                    },
                };
            }
            return prev;
        });
    };

    // 獲得情報追加
    const addAcquisition = (acquisitionData) => {
        const newAcquisition = {
            id: Date.now(),
            time: getExactTime(),
            ...acquisitionData,
        };
        setData(prev => ({
            ...prev,
            acquisitions: [...prev.acquisitions, newAcquisition],
        }));
    };

    // クイックメモ追加
    const addQuickMemo = (memo) => {
        if (memo.trim()) {
            setData(prev => ({
                ...prev,
                quickMemos: [...prev.quickMemos, {
                    id: Date.now(),
                    time: getExactTime(),
                    text: memo,
                }],
            }));
        }
    };

    // 集計データ計算
    const getTotalKpi = () => {
        const totals = { S: 0, P: 0, C: 0, Su: 0 };
        TIME_SLOTS.forEach(slot => {
            totals.S += data.kpiData[slot].S;
            totals.P += data.kpiData[slot].P;
            totals.C += data.kpiData[slot].C;
            totals.Su += data.kpiData[slot].Su;
        });
        return totals;
    };

    // 移行率計算
    const getConversionRates = () => {
        const totals = getTotalKpi();
        return {
            'S→P': totals.S > 0 ? ((totals.P / totals.S) * 100).toFixed(1) : '0.0',
            'P→C': totals.P > 0 ? ((totals.C / totals.P) * 100).toFixed(1) : '0.0',
            'C→Su': totals.C > 0 ? ((totals.Su / totals.C) * 100).toFixed(1) : '0.0',
        };
    };

    // 過去の日付リスト取得
    const getPastDates = () => {
        const dates = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('street-hero-')) {
                dates.push(key.replace('street-hero-', ''));
            }
        }
        return dates.sort().reverse();
    };

    // 振り返りセクション管理
    const addToReflection = (type, text) => {
        if (text.trim()) {
            setData(prev => ({
                ...prev,
                reflection: {
                    ...prev.reflection,
                    [type]: [...prev.reflection[type], text],
                },
            }));
        }
    };

    const updateReflection = (type, items) => {
        setData(prev => ({
            ...prev,
            reflection: {
                ...prev.reflection,
                [type]: items,
            },
        }));
    };

    return {
        data,
        currentDate,
        changeDate,
        startNextDay,
        updateBasicInfo,
        incrementKpi,
        decrementKpi,
        addAcquisition,
        addQuickMemo,
        getTotalKpi,
        getConversionRates,
        getPastDates,
        addToReflection,
        updateReflection,
    };
};
