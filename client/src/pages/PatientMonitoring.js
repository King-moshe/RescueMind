import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { HeartIcon, FireIcon, TrendingUpIcon, TableIcon, ChartBarIcon, DocumentDownloadIcon } from '@heroicons/react/solid';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import alertSound from '../sounds/sound-alert.mp3';
import { VitalSignCard } from '../components/monitoring/VitalSignCard';
import { VitalSignsTable } from '../components/monitoring/VitalSignsTable';
import { exportToCSV, getAlertThresholds } from '../components/monitoring/monitoringUtils';
import '../components/monitoring/monitoring.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function PatientMonitoring() {
  // vitals arrays (latest at end)
  const [vitals, setVitals] = useState({
    heartRate: [],
    oxygenLevel: [],
    systolic: [],
    diastolic: [],
    temperature: [],
    respiratoryRate: []
  });

  const [alerts, setAlerts] = useState([]);
  const [lastAlert, setLastAlert] = useState('');
  const [viewMode, setViewMode] = useState('charts'); // 'charts' or 'table'
  const [selectedPatient] = useState('patient1');
  const [startTime] = useState(new Date());
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  const alertAudioRef = useRef(null);

  const [timeframes, setTimeframes] = useState({
    heartRate: '12h',
    oxygenLevel: '12h',
    bloodPressure: '12h'
  });

  // initialize audio ref
  useEffect(() => {
    alertAudioRef.current = new Audio(alertSound);
    // allow autoplay on user gesture restrictions by preparing audio
    alertAudioRef.current.load();
  }, []);

  const playAlertSound = useCallback(() => {
    try {
      alertAudioRef.current && alertAudioRef.current.play();
    } catch (e) {
      // ignore autoplay errors
    }
  }, []);

  const checkAlerts = useCallback((current) => {
    const t = getAlertThresholds;
    const newAlerts = [];

    if (current.heartRate < t.heartRate.min || current.heartRate > t.heartRate.max) {
      newAlerts.push(`התראה: דופק חורג (${current.heartRate} BPM)`);
    }
    if (current.oxygenLevel < t.oxygenLevel.min) {
      newAlerts.push(`התראה: רמת חמצן נמוכה (${current.oxygenLevel}%)`);
    }
    if (current.systolic < t.systolic.min || current.systolic > t.systolic.max ||
        current.diastolic < t.diastolic.min || current.diastolic > t.diastolic.max) {
      newAlerts.push(`התראה: לחץ דם חורג (${current.systolic}/${current.diastolic})`);
    }

    if (newAlerts.length > 0) {
      const last = newAlerts[newAlerts.length - 1];
      if (last !== lastAlert) {
        setLastAlert(last);
        playAlertSound();
      }
    }

    setAlerts(newAlerts);
  }, [lastAlert, playAlertSound]);

  // simulation loop to generate vitals every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      const newVitals = {
        heartRate: Math.floor(60 + Math.random() * 40),
        oxygenLevel: Math.floor(95 + Math.random() * 5),
        systolic: Math.floor(110 + Math.random() * 30),
        diastolic: Math.floor(70 + Math.random() * 20),
        temperature: +(36.5 + Math.random()).toFixed(1),
        respiratoryRate: Math.floor(12 + Math.random() * 8)
      };

      setVitals(prev => ({
        heartRate: [...prev.heartRate.slice(-119), newVitals.heartRate],
        oxygenLevel: [...prev.oxygenLevel.slice(-119), newVitals.oxygenLevel],
        systolic: [...prev.systolic.slice(-119), newVitals.systolic],
        diastolic: [...prev.diastolic.slice(-119), newVitals.diastolic],
        temperature: [...prev.temperature.slice(-119), newVitals.temperature],
        respiratoryRate: [...prev.respiratoryRate.slice(-119), newVitals.respiratoryRate]
      }));

      checkAlerts(newVitals);
      setLastUpdateTime(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [checkAlerts]);

  // helpers
  const formatDuration = (ms) => {
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}` : `${m}:${s.toString().padStart(2,'0')}`;
  };

  const getChartData = (arr, label, color) => ({
    labels: arr.map((_, i) => i).reverse(),
    datasets: [{
      label,
      data: [...arr].reverse(),
      borderColor: color,
      tension: 0.1,
      fill: false
    }]
  });

  const toTableRecords = useCallback(() => {
    const length = Math.max(
      vitals.heartRate.length,
      vitals.oxygenLevel.length,
      vitals.systolic.length
    );
    const records = [];
    for (let i = 0; i < length; i++) {
      const time = new Date(startTime.getTime() + i * 5000);
      const hr = vitals.heartRate[i] ?? null;
      const ox = vitals.oxygenLevel[i] ?? null;
      const sys = vitals.systolic[i] ?? null;
      const dia = vitals.diastolic[i] ?? null;
      const temp = vitals.temperature[i] ?? null;
      const resp = vitals.respiratoryRate[i] ?? null;

      const rec = {
        time,
        heartRate: hr,
        oxygenLevel: ox,
        systolic: sys,
        diastolic: dia,
        temperature: temp,
        respiratoryRate: resp,
        heartRateAlert: hr !== null && (hr < getAlertThresholds.heartRate.min || hr > getAlertThresholds.heartRate.max),
        oxygenAlert: ox !== null && (ox < getAlertThresholds.oxygenLevel.min),
        bpAlert: (sys !== null && dia !== null) && (sys < getAlertThresholds.systolic.min || sys > getAlertThresholds.systolic.max || dia < getAlertThresholds.diastolic.min || dia > getAlertThresholds.diastolic.max),
        tempAlert: temp !== null && (temp < getAlertThresholds.temperature.min || temp > getAlertThresholds.temperature.max),
        respiratoryAlert: resp !== null && (resp < getAlertThresholds.respiratoryRate.min || resp > getAlertThresholds.respiratoryRate.max)
      };
      records.push(rec);
    }
    return records;
  }, [vitals, startTime]);

  const handleExport = useCallback(() => {
    const records = toTableRecords();
    exportToCSV(records, `vitals-${selectedPatient}-${new Date().toISOString()}.csv`);
  }, [toTableRecords, selectedPatient]);

  // computed stats intentionally omitted from rendering for now

  // small helpers to compute color class
  const hrColor = (v) => (v === undefined || v === null) ? 'text-gray-700' : (v < getAlertThresholds.heartRate.min || v > getAlertThresholds.heartRate.max) ? 'text-red-500' : 'text-green-500';
  const oxColor = (v) => (v === undefined || v === null) ? 'text-gray-700' : (v < getAlertThresholds.oxygenLevel.min) ? 'text-red-500' : 'text-green-500';
  const bpColor = (s, d) => (s === undefined || d === undefined) ? 'text-gray-700' : ((s < getAlertThresholds.systolic.min || s > getAlertThresholds.systolic.max || d < getAlertThresholds.diastolic.min || d > getAlertThresholds.diastolic.max) ? 'text-red-500':'text-green-500');

  const latestHR = vitals.heartRate[vitals.heartRate.length - 1] ?? 0;
  const latestOX = vitals.oxygenLevel[vitals.oxygenLevel.length - 1] ?? 0;
  const latestSYS = vitals.systolic[vitals.systolic.length - 1] ?? 0;
  const latestDIA = vitals.diastolic[vitals.diastolic.length - 1] ?? 0;

  const tableRecords = toTableRecords();

  return (
    <div className="text-center p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">ניטור פצועים</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('charts')}
                className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'charts' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <ChartBarIcon className="h-5 w-5 inline-block ml-2" />
                גרפים
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <TableIcon className="h-5 w-5 inline-block ml-2" />
                טבלה
              </button>
              <button onClick={handleExport} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <DocumentDownloadIcon className="h-5 w-5 inline-block ml-2" />
                ייצוא נתונים
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <div>זמן מאז תחילת הניטור: <span className="font-bold">{formatDuration(new Date() - startTime)}</span></div>
            <div>עדכון אחרון: <span className="font-bold">{lastUpdateTime.toLocaleTimeString()}</span></div>
          </div>
        </header>

        <TransitionGroup>
          {alerts.length > 0 && (
            <CSSTransition classNames="alert" timeout={300}>
              <div className="bg-red-100 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mr-3">
                    {alerts.map((alert, index) => (
                      <p key={index} className="text-sm text-red-800">{alert}</p>
                    ))}
                  </div>
                </div>
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>

        {viewMode === 'charts' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VitalSignCard
              icon={<HeartIcon className="w-6 h-6 text-red-500" />}
              title="דופק"
              value={`${latestHR} BPM`}
              color={hrColor(latestHR)}
              data={getChartData(vitals.heartRate, 'דופק', 'rgba(255,99,132,1)')}
              timeframe={timeframes.heartRate}
              onTimeframeChange={(tf) => setTimeframes(prev => ({ ...prev, heartRate: tf }))}
              onExportData={handleExport}
            />

            <VitalSignCard
              icon={<FireIcon className="w-6 h-6 text-green-500" />}
              title="רמת חמצן"
              value={`${latestOX}%`}
              color={oxColor(latestOX)}
              data={getChartData(vitals.oxygenLevel, 'חמצן', 'rgba(75,192,192,1)')}
              timeframe={timeframes.oxygenLevel}
              onTimeframeChange={(tf) => setTimeframes(prev => ({ ...prev, oxygenLevel: tf }))}
              onExportData={handleExport}
            />

            <VitalSignCard
              icon={<TrendingUpIcon className="w-6 h-6 text-blue-500" />}
              title="לחץ דם"
              value={`${latestSYS}/${latestDIA}`}
              color={bpColor(latestSYS, latestDIA)}
              data={getChartData(vitals.systolic, 'סיסטולי', 'rgba(54,162,235,1)')}
              timeframe={timeframes.bloodPressure}
              onTimeframeChange={(tf) => setTimeframes(prev => ({ ...prev, bloodPressure: tf }))}
              onExportData={handleExport}
            />
          </div>
        ) : (
          <VitalSignsTable data={tableRecords} timeframe={timeframes} />
        )}
      </div>
    </div>
  );
}

