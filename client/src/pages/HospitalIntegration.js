import React, { useEffect, useState, useCallback, useMemo } from "react";
import { exportToCSV } from '../components/monitoring/monitoringUtils';

const STORAGE_KEY = 'treatmentLog';

export default function HospitalIntegration() {
  const [storedData, setStoredData] = useState(null);
  const [sendStatus, setSendStatus] = useState(null); // null | 'sending' | 'success' | 'error'

  useEffect(() => {
    // קריאת הנתונים מ-LocalStorage בצורה בטוחה
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setStoredData(parsed);
    } catch (e) {
      console.warn('Failed to load stored treatment log', e);
      setStoredData(null);
    }
  }, []);

  const hasData = Boolean(storedData && storedData.vitalSigns);

  const recordForExport = useMemo(() => {
    if (!hasData) return null;
    return {
      time: storedData.startTime ? new Date(storedData.startTime) : new Date(),
      heartRate: storedData.vitalSigns?.pulse ?? '',
      oxygenLevel: storedData.vitalSigns?.oxygenLevel ?? '',
      systolic: storedData.vitalSigns?.bloodPressure?.split('/')?.[0] ?? '',
      diastolic: storedData.vitalSigns?.bloodPressure?.split('/')?.[1] ?? '',
      medication: storedData.medication ?? '',
      notes: storedData.notes ?? ''
    };
  }, [storedData, hasData]);

  const handleExport = useCallback(() => {
    if (!recordForExport) return;
    exportToCSV([recordForExport], `hospital-transfer-${new Date().toISOString()}.csv`);
  }, [recordForExport]);

  // Simulate sending to hospital API
  const handleSend = useCallback(async () => {
    if (!hasData) return;
    setSendStatus('sending');
    try {
      // Simulate network latency
      await new Promise(res => setTimeout(res, 900));
      // Simulate success
      setSendStatus('success');
    } catch (e) {
      setSendStatus('error');
    }
    // clear status after 3s
    setTimeout(() => setSendStatus(null), 3000);
  }, [hasData]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <header className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-2xl font-bold">אינטגרציה לבית החולים</h2>
          <p className="text-sm text-gray-600 mt-1">כאן יוצגו הנתונים המועברים לבית החולים והסטטוס שלהם.</p>
        </header>

        {!hasData ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">אין נתונים להצגה. יש לשמור תיעוד טיפול קודם על-מנת להציג כאן.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500">תאריך ושעת התחלה</div>
                <div className="font-medium">{storedData.startTime ? new Date(storedData.startTime).toLocaleString() : '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">פעולה שבוצעה</div>
                <div className="font-medium">{storedData.action || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">תרופות שניתנו</div>
                <div className="font-medium">{storedData.medication || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">הערות</div>
                <div className="font-medium">{storedData.notes || '-'}</div>
              </div>
            </div>

            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="px-3 py-2 rounded-lg bg-white border text-center">
                <div className="text-sm text-gray-500">דופק</div>
                <div className="text-xl font-bold">{storedData.vitalSigns?.pulse ?? '-'}</div>
                <div className="text-sm text-gray-400">BPM</div>
              </div>

              <div className="px-3 py-2 rounded-lg bg-white border text-center">
                <div className="text-sm text-gray-500">רמת חמצן</div>
                <div className="text-xl font-bold">{storedData.vitalSigns?.oxygenLevel ?? '-'}</div>
                <div className="text-sm text-gray-400">%</div>
              </div>

              <div className="px-3 py-2 rounded-lg bg-white border text-center">
                <div className="text-sm text-gray-500">לחץ דם</div>
                <div className="text-xl font-bold">{storedData.vitalSigns?.bloodPressure ?? '-'}</div>
                <div className="text-sm text-gray-400">mmHg</div>
              </div>
            </div>

            {storedData.additionalActions?.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-gray-500">פעולות נוספות</div>
                <ul className="list-disc list-inside mt-2 text-sm">
                  {storedData.additionalActions.map((a, idx) => (
                    <li key={idx}>{a.type} - {a.time}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button onClick={handleSend} className={`px-4 py-2 rounded ${sendStatus === 'sending' ? 'bg-yellow-400' : 'bg-blue-500 text-white'}`}>שלח לבית החולים</button>
              <button onClick={handleExport} className="px-4 py-2 bg-gray-100 rounded">ייצוא CSV</button>
              {sendStatus === 'success' && <div className="text-sm text-green-600">נשלח בהצלחה</div>}
              {sendStatus === 'error' && <div className="text-sm text-red-600">שגיאה בשליחה</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
