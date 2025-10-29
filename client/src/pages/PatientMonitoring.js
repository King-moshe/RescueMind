import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { HeartIcon, FireIcon, TrendingUpIcon } from '@heroicons/react/solid';
import alertSound from '../sounds/sound-alert.mp3';
 
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function PatientMonitoring() {
  const [heartRateData, setHeartRateData] = useState([]);
  const [oxygenLevelData, setOxygenLevelData] = useState([]);
  const [systolicData, setSystolicData] = useState([]);
  const [diastolicData, setDiastolicData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [lastAlert, setLastAlert] = useState('');
  const alertAudio = new Audio(alertSound);
  const [startTime] = useState(new Date());
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

// Adding variables to save the index history
  const [heartRateHistory, setHeartRateHistory] = useState([]);
  const [oxygenLevelHistory, setOxygenLevelHistory] = useState([]);
  const [systolicHistory, setSystolicHistory] = useState([]);
  const [diastolicHistory, setDiastolicHistory] = useState([]);

// Variables to store the index history display period
  const [heartRateTimeframe, setHeartRateTimeframe] = useState('12h');
  const [oxygenLevelTimeframe, setOxygenLevelTimeframe] = useState('12h');
  const [bloodPressureTimeframe, setBloodPressureTimeframe] = useState('12h');

// function to play a voice alert
  const playAlertSound = () => {
    alertAudio.play();
  };

  const checkAlerts = (heartRate, oxygenLevel, systolic, diastolic) => {
    const newAlerts = [];
    let alertMessage = '';

    if (heartRate < 60 || heartRate > 100) {
      alertMessage = `התראה: דופק חורג (${heartRate} BPM)`;
      newAlerts.push(alertMessage);
    }
    if (oxygenLevel < 95) {
      alertMessage = `התראה: רמת חמצן נמוכה (${oxygenLevel}%)`;
      newAlerts.push(alertMessage);
    }
    if (systolic < 90 || systolic > 120 || diastolic < 60 || diastolic > 80) {
      alertMessage = `התראה: לחץ דם חורג (${systolic}/${diastolic})`;
      newAlerts.push(alertMessage);
    }

    if (newAlerts.length > 0 && alertMessage !== lastAlert) {
      setLastAlert(alertMessage);
      playAlertSound();
    }

    setAlerts(newAlerts);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeartRate = Math.floor(60 + Math.random() * 40);
      const newOxygenLevel = Math.floor(95 + Math.random() * 5);
      const newSystolic = 110 + Math.floor(Math.random() * 20);
      const newDiastolic = 70 + Math.floor(Math.random() * 10);

      setHeartRateData(prev => [...prev.slice(-9), newHeartRate]);
      setOxygenLevelData(prev => [...prev.slice(-9), newOxygenLevel]);
      setSystolicData(prev => [...prev.slice(-9), newSystolic]);
      setDiastolicData(prev => [...prev.slice(-9), newDiastolic]);

      setHeartRateHistory(prev => [...prev, { time: new Date(), value: newHeartRate }]);
      setOxygenLevelHistory(prev => [...prev, { time: new Date(), value: newOxygenLevel }]);
      setSystolicHistory(prev => [...prev, { time: new Date(), value: newSystolic }]);
      setDiastolicHistory(prev => [...prev, { time: new Date(), value: newDiastolic }]);

      checkAlerts(newHeartRate, newOxygenLevel, newSystolic, newDiastolic);
      setLastUpdateTime(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filterHistory = (history, timeframe) => {
    const now = new Date();
    const timeframeInHours = timeframe === '12h' ? 12 : 2;
    return history.filter(entry => (now - entry.time) / (1000 * 60 * 60) <= timeframeInHours);
  };

  const createHistoryLineData = (history, label, color) => ({
    labels: history.map(entry => entry.time.toLocaleTimeString()),
    datasets: [
      {
        label,
        data: history.map(entry => entry.value),
        borderColor: color,
        backgroundColor: color.replace('1)', '0.2)'),
        fill: true,
      },
    ],
  });

  const calculateElapsedTime = () => {
    const now = new Date();
    const elapsed = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

// Color functions depending on the correctness of the indices
  const getHeartRateColor = (heartRate) => (heartRate < 60 || heartRate > 100) ? 'text-red-500' : 'text-green-500';
  const getOxygenLevelColor = (oxygenLevel) => (oxygenLevel < 95) ? 'text-red-500' : 'text-green-500';
  const getBloodPressureColor = (systolic, diastolic) => (systolic < 90 || systolic > 120 || diastolic < 60 || diastolic > 80) ? 'text-red-500' : 'text-green-500';

  return (
    <div className="text-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">ניטור פצועים</h2>

      {alerts.length > 0 && (
        <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">
          {alerts.map((alert, index) => (
            <p key={index}>{alert}</p>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center mb-6">
        <p>זמן מאז תחילת הניטור: <span className="font-bold">{calculateElapsedTime()}</span></p>
        <p>זמן עדכון אחרון: <span className="font-bold">{lastUpdateTime.toLocaleTimeString()}</span></p>
      </div>

      <div className="flex flex-wrap justify-around gap-4">
        {/* Heart rate graph */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <HeartIcon className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-700">היסטוריית דופק</h3>
          </div>
          <p className={`text-2xl font-bold mb-2 ${getHeartRateColor(heartRateData[heartRateData.length - 1])}`}>
            {heartRateData[heartRateData.length - 1]} BPM
          </p>
          <Line data={createHistoryLineData(filterHistory(heartRateHistory, heartRateTimeframe), 'Heart Rate History (BPM)', 'rgba(255, 99, 132, 1)')} />
          <div className="flex justify-center mt-2">
            <button onClick={() => setHeartRateTimeframe('12h')} className="mx-2 p-2 bg-blue-200 rounded">12 שעות</button>
            <button onClick={() => setHeartRateTimeframe('2h')} className="mx-2 p-2 bg-blue-200 rounded">שעתיים</button>
          </div>
        </div>

        {/* Graph oxygen levels */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <FireIcon className="w-6 h-6 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-700">היסטוריית רמות חמצן</h3>
          </div>
          <p className={`text-2xl font-bold mb-2 ${getOxygenLevelColor(oxygenLevelData[oxygenLevelData.length - 1])}`}>
            {oxygenLevelData[oxygenLevelData.length - 1]}%
          </p>
          <Line data={createHistoryLineData(filterHistory(oxygenLevelHistory, oxygenLevelTimeframe), 'Oxygen Level History (%)', 'rgba(75, 192, 192, 1)')} />
          <div className="flex justify-center mt-2">
            <button onClick={() => setOxygenLevelTimeframe('12h')} className="mx-2 p-2 bg-blue-200 rounded">12 שעות</button>
            <button onClick={() => setOxygenLevelTimeframe('2h')} className="mx-2 p-2 bg-blue-200 rounded">שעתיים</button>
          </div>
        </div>

        {/* Blood pressure graph */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <TrendingUpIcon className="w-6 h-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-700">לחץ דם</h3>
          </div>
          <p className={`text-2xl font-bold mb-2 ${getBloodPressureColor(systolicData[systolicData.length - 1], diastolicData[diastolicData.length - 1])}`}>
            {systolicData[systolicData.length - 1]}/{diastolicData[diastolicData.length - 1]}
          </p>
          <Line data={createHistoryLineData(filterHistory(systolicHistory, bloodPressureTimeframe), 'Systolic (mmHg)', 'rgba(54, 162, 235, 1)')} />
          <Line data={createHistoryLineData(filterHistory(diastolicHistory, bloodPressureTimeframe), 'Diastolic (mmHg)', 'rgba(153, 102, 255, 1)')} />
          <div className="flex justify-center mt-2">
            <button onClick={() => setBloodPressureTimeframe('12h')} className="mx-2 p-2 bg-blue-200 rounded">12 שעות</button>
            <button onClick={() => setBloodPressureTimeframe('2h')} className="mx-2 p-2 bg-blue-200 rounded">שעתיים</button>
          </div>
        </div>
      </div>
    </div>
  );
}
