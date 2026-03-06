import React, { useState, useCallback } from 'react';
import './index.css';
import { useKpiData } from './hooks/useKpiData';
import { useDateTime } from './hooks/useDateTime';
import { useTheme } from './hooks/useTheme';
import { useSettings } from './hooks/useSettings';
import { KpiCounter } from './components/KpiCounter';
import { QuickMemo } from './components/QuickMemo';
import { AcquisitionModal } from './components/AcquisitionModal';
import { AnalysisPanel } from './components/AnalysisPanel';
import { SettingsModal } from './components/SettingsModal';
import { Toast } from './components/Toast';
import { HistoryCalendar } from './components/HistoryCalendar';
import { DayDetailModal } from './components/DayDetailModal';

function App() {
  const {
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
  } = useKpiData();

  const { formatDate, formatTime, timeSlot } = useDateTime();
  const { theme, toggleTheme } = useTheme();
  const { settings, saveSettings } = useSettings();

  const [showAcquisitionModal, setShowAcquisitionModal] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);

  const totals = getTotalKpi();
  const conversionRates = getConversionRates();
  const pastDates = getPastDates();

  const handleSuIncrement = () => {
    incrementKpi('Su');
    setShowAcquisitionModal(true);
  };

  const handleStartNextDay = () => {
    startNextDay();
  };

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
  }, []);

  const handleOpenLocationSheet = () => {
    if (settings.locationSheetUrl) {
      window.open(settings.locationSheetUrl, '_blank');
    } else {
      showToast('設定からロケーションシートのURLを登録してください');
    }
  };

  const handleOpenNoticeMemo = () => {
    if (settings.noticeMemoUrl) {
      window.open(settings.noticeMemoUrl, '_blank');
    } else {
      showToast('設定からデイリー連絡/メモのURLを登録してください');
    }
  };

  const handleOpenPointSheet = () => {
    if (settings.pointSheetUrl) {
      window.open(settings.pointSheetUrl, '_blank');
    } else {
      showToast('設定からポイントシートのURLを登録してください');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-black dark:to-gray-900 p-2 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Field Cockpit ヘッダー */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2.5 mb-2 border border-transparent dark:border-gray-700">
          <div className="flex items-center justify-between mb-1.5">
            <div className="min-w-0 flex-shrink">
              <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400 leading-tight">Street KPI</h1>
              <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {formatDate()} {formatTime()} | {timeSlot}
              </div>
            </div>
            <div className="flex gap-1 items-center flex-shrink-0">
              <button
                onClick={handleOpenLocationSheet}
                className="w-9 h-9 rounded-full flex items-center justify-center text-base bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-600 dark:text-blue-300 shadow-sm transition-colors"
                title="ロケーションシート"
              >
                📍
              </button>
              <button
                onClick={handleOpenNoticeMemo}
                className="w-9 h-9 rounded-full flex items-center justify-center text-base bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-600 dark:text-blue-300 shadow-sm transition-colors"
                title="デイリー連絡/メモ"
              >
                📝
              </button>
              <button
                onClick={handleOpenPointSheet}
                className="w-9 h-9 rounded-full flex items-center justify-center text-base bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-600 dark:text-blue-300 shadow-sm transition-colors"
                title="ポイントシート"
              >
                ⭐
              </button>
              <button
                onClick={() => setShowAnalysisPanel(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow whitespace-nowrap transition-colors"
              >
                📊 分析
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-base bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 shadow-sm transition-colors"
                title="設定"
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-2 gap-1.5 mb-1.5">
            <input
              type="text"
              value={data.station}
              onChange={(e) => updateBasicInfo('station', e.target.value)}
              className="input-field text-sm py-1"
              placeholder="駅名"
            />
            <input
              type="text"
              value={data.locationCode}
              onChange={(e) => updateBasicInfo('locationCode', e.target.value)}
              className="input-field text-sm py-1"
              placeholder="ロケコ"
            />
          </div>

          {/* テーマ・ゴール */}
          <div className="grid grid-cols-2 gap-1.5">
            <input
              type="text"
              value={data.theme}
              onChange={(e) => updateBasicInfo('theme', e.target.value)}
              className="input-field text-sm py-1"
              placeholder="今日のテーマ"
            />
            <input
              type="text"
              value={data.goal}
              onChange={(e) => updateBasicInfo('goal', e.target.value)}
              className="input-field text-sm py-1"
              placeholder="ゴール"
            />
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 gap-2">
          {/* KPIカウンター */}
          <div className="card !p-2.5">
            <h2 className="text-sm font-bold mb-1.5 text-center text-gray-800 dark:text-gray-100">
              KPI カウンター
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <KpiCounter
                type="S"
                count={totals.S}
                onIncrement={() => incrementKpi('S')}
                onDecrement={() => decrementKpi('S')}
              />
              <KpiCounter
                type="P"
                count={totals.P}
                onIncrement={() => incrementKpi('P')}
                onDecrement={() => decrementKpi('P')}
              />
              <KpiCounter
                type="C"
                count={totals.C}
                onIncrement={() => incrementKpi('C')}
                onDecrement={() => decrementKpi('C')}
              />
              <KpiCounter
                type="Su"
                count={totals.Su}
                onIncrement={handleSuIncrement}
                onDecrement={() => decrementKpi('Su')}
              />
            </div>
          </div>

          {/* クイックメモ */}
          <QuickMemo onAddMemo={addQuickMemo} />

          {/* 履歴カレンダー */}
          <HistoryCalendar
            recordedDates={pastDates}
            onDateSelect={(date) => setSelectedHistoryDate(date)}
          />
        </div>
      </div>

      {/* 獲得詳細モーダル */}
      <AcquisitionModal
        isOpen={showAcquisitionModal}
        onClose={() => setShowAcquisitionModal(false)}
        onSave={addAcquisition}
      />

      {/* 分析パネル */}
      <AnalysisPanel
        isOpen={showAnalysisPanel}
        onClose={() => setShowAnalysisPanel(false)}
        kpiData={data.kpiData}
        acquisitions={data.acquisitions}
        memos={data.quickMemos}
        conversionRates={conversionRates}
        currentDate={currentDate}
        pastDates={pastDates}
        onDateChange={changeDate}
        reflection={data.reflection || { good: [], more: [] }}
        onReflectionUpdate={updateReflection}
        onAddToReflection={addToReflection}
      />

      {/* 設定モーダル */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        settings={settings}
        onSaveSettings={saveSettings}
        onStartNextDay={handleStartNextDay}
      />

      {/* 日別詳細モーダル */}
      <DayDetailModal
        isOpen={!!selectedHistoryDate}
        onClose={() => setSelectedHistoryDate(null)}
        dateStr={selectedHistoryDate}
      />

      {/* トースト通知 */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
}

export default App;
