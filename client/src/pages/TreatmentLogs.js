// src/components/TreatmentLog.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { XIcon } from '@heroicons/react/solid';

const STORAGE_KEY = 'treatmentLog';
const VITALS_INTERVAL_MS = 5000;

export default function TreatmentLog() {
  const [treatmentData, setTreatmentData] = useState(() => ({
    startTime: new Date().toISOString(),
    action: '',
    medication: '',
    notes: '',
    additionalActions: [],
  }));

  const [newAction, setNewAction] = useState({ type: '', time: '' });
  const [vitalSigns, setVitalSigns] = useState({ pulse: '', oxygenLevel: '', bloodPressure: '' });
  const [savedMessage, setSavedMessage] = useState('');
  const mountedRef = useRef(true);
  const [lastSavedTime, setLastSavedTime] = useState(null);

  // דימוי קבלת נתונים אוטומטיים של מדדים חיוניים
  useEffect(() => {
    mountedRef.current = true;
    const interval = setInterval(() => {
      if (!mountedRef.current) return;
      setVitalSigns({
        pulse: Math.floor(60 + Math.random() * 40),
        oxygenLevel: Math.floor(95 + Math.random() * 5),
        bloodPressure: `${Math.floor(110 + Math.random() * 10)}/${Math.floor(70 + Math.random() * 10)}`,
      });
    }, VITALS_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTreatmentData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleNewActionChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewAction(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAddAction = useCallback(() => {
    if (!newAction.type || !newAction.time) return;
    setTreatmentData(prev => ({ ...prev, additionalActions: [...prev.additionalActions, newAction] }));
    setNewAction({ type: '', time: '' });
  }, [newAction]);

  const handleRemoveAction = useCallback((index) => {
    setTreatmentData(prev => ({ ...prev, additionalActions: prev.additionalActions.filter((_, i) => i !== index) }));
  }, []);

  const prepareDataForTransmission = useCallback(() => {
    const dataForTransmission = {
      ...treatmentData,
      vitalSigns: { ...vitalSigns }
    };
    // keep as debug log only
    console.debug('Data for Transmission:', dataForTransmission);
    return dataForTransmission;
  }, [treatmentData, vitalSigns]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const payload = prepareDataForTransmission();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      const now = new Date();
      setSavedMessage('הנתונים נשמרו בהצלחה');
      setLastSavedTime(now.toLocaleString());
      // clear message after 3s
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save treatment log', err);
      setSavedMessage('שגיאה בשמירת הנתונים');
      setTimeout(() => setSavedMessage(''), 3000);
    }
  }, [prepareDataForTransmission]);

  const handleClear = useCallback(() => {
    setTreatmentData({ startTime: new Date().toISOString(), action: '', medication: '', notes: '', additionalActions: [] });
    setNewAction({ type: '', time: '' });
    setSavedMessage('');
    setLastSavedTime(null);
  }, []);

  // Load saved data once (non-blocking)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // keep existing startTime if present
        setTreatmentData(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">תיעוד טיפול בפצוע</h2>

      {/* הצגת מדדים חיוניים (compact card) */}
      <div className="p-4 bg-gray-100 rounded mb-4">
        <h3 className="text-lg font-semibold mb-2">מדדים חיוניים</h3>
        <div className="flex gap-3 flex-wrap">
          <div className={`px-3 py-2 rounded-lg shadow-sm w-40 text-center ${vitalSigns.pulse && (vitalSigns.pulse < 60 || vitalSigns.pulse > 100) ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-100'}`}>
            <div className="text-sm text-gray-500">דופק</div>
            <div className="text-xl font-bold mt-1">{vitalSigns.pulse || '-'}</div>
            <div className="text-sm text-gray-400">BPM</div>
          </div>

          <div className={`px-3 py-2 rounded-lg shadow-sm w-40 text-center ${vitalSigns.oxygenLevel && (vitalSigns.oxygenLevel < 95) ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-100'}`}>
            <div className="text-sm text-gray-500">חמצן</div>
            <div className="text-xl font-bold mt-1">{vitalSigns.oxygenLevel || '-'}</div>
            <div className="text-sm text-gray-400">%</div>
          </div>

          <div className={`px-3 py-2 rounded-lg shadow-sm w-56 text-center ${vitalSigns.bloodPressure && (function(){const parts = String(vitalSigns.bloodPressure).split('/'); if(parts.length===2){const s=Number(parts[0]);const d=Number(parts[1]); return s<90||s>140||d<60||d>90} return false})() ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-100'}`}>
            <div className="text-sm text-gray-500">לחץ דם</div>
            <div className="text-xl font-bold mt-1">{vitalSigns.bloodPressure || '-'}</div>
            <div className="text-sm text-gray-400">mmHg</div>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          {lastSavedTime && <span>שמירה אחרונה: <strong>{lastSavedTime}</strong></span>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" aria-label="treatment-log-form">
        <div>
          <label htmlFor="startTime" className="block text-gray-700">תאריך ושעת התחלה</label>
          <input id="startTime" type="text" value={new Date(treatmentData.startTime).toLocaleString()} disabled className="border p-2 w-full rounded" />
        </div>

        <div>
          <label htmlFor="action" className="block text-gray-700">פעולה שבוצעה</label>
          <input id="action" type="text" name="action" value={treatmentData.action || ''} onChange={handleChange} className="border p-2 w-full rounded" placeholder="הזן פעולה שבוצעה" />
        </div>

        <div>
          <label htmlFor="medication" className="block text-gray-700">תרופות שניתנו</label>
          <input id="medication" type="text" name="medication" value={treatmentData.medication || ''} onChange={handleChange} className="border p-2 w-full rounded" placeholder="הזן תרופות שניתנו" />
        </div>

        <div>
          <label htmlFor="notes" className="block text-gray-700">הערות נוספות</label>
          <textarea id="notes" name="notes" value={treatmentData.notes || ''} onChange={handleChange} className="border p-2 w-full rounded" placeholder="הזן הערות נוספות" rows="3" />
        </div>

        {/* פעולות נוספות */}
        <div className="mt-4">
          <label className="block text-gray-700">הוסף פעולה נוספת</label>
          <div className="flex items-center gap-2">
            <select name="type" value={newAction.type} onChange={handleNewActionChange} className="border p-2 rounded w-full">
              <option value="">בחר פעולה</option>
              <option value="tourniquet">הנחת ח.ע</option>
              <option value="medication">מתן תרופה</option>
              <option value="bandage">תחבושת</option>
            </select>
            <input aria-label="action-time" type="time" name="time" value={newAction.time} onChange={handleNewActionChange} className="border p-2 rounded" />
            <button type="button" onClick={handleAddAction} className="text-blue-500 font-bold text-2xl">+</button>
          </div>
        </div>

        {treatmentData.additionalActions.length > 0 && (
          <div className="mt-4 space-y-2">
            {treatmentData.additionalActions.map((action, index) => (
              <div key={`${action.type}-${action.time}-${index}`} className="flex justify-between items-center border-b pb-2">
                <span>{action.type} - {action.time}</span>
                <button type="button" onClick={() => handleRemoveAction(index)} className="text-red-500" aria-label={`remove-action-${index}`}>
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full sm:w-auto">שמירת תיעוד</button>
          <button type="button" onClick={handleClear} className="bg-gray-100 text-gray-800 py-2 px-4 rounded w-full sm:w-auto">נקה טופס</button>
          {savedMessage && <div className="mt-2 sm:mt-0 text-sm text-green-600">{savedMessage}</div>}
        </div>
      </form>
    </div>
  );
}
