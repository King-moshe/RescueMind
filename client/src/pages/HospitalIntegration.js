import React, { useEffect, useState } from "react";

export default function HospitalIntegration() {
  const [storedData, setStoredData] = useState(null);

  useEffect(() => {
    // קריאת הנתונים מ-LocalStorage
    const data = localStorage.getItem("treatmentLog");
    if (data) {
      setStoredData(JSON.parse(data));
    }
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">אינטגרציה לבית החולים</h2>
      <p>כאן יוצגו הנתונים המועברים לבית החולים והסטטוס שלהם.</p>

      {storedData ? (
        <div className="mt-4 space-y-2">
          <div>
            <strong>תאריך ושעת התחלה:</strong> {storedData.startTime}
          </div>
          <div>
            <strong>פעולה שבוצעה:</strong> {storedData.action}
          </div>
          <div>
            <strong>תרופות שניתנו:</strong> {storedData.medication}
          </div>
          <div>
            <strong>דופק:</strong> {storedData.vitalSigns.pulse} BPM
          </div>
          <div>
            <strong>רמת חמצן:</strong> {storedData.vitalSigns.oxygenLevel}%
          </div>
          <div>
            <strong>לחץ דם:</strong> {storedData.vitalSigns.bloodPressure}
          </div>
          <div>
            <strong>הערות:</strong> {storedData.notes}
          </div>
          {storedData.additionalActions.length > 0 && (
            <div>
              <strong>פעולות נוספות:</strong>
              <ul>
                {storedData.additionalActions.map((action, index) => (
                  <li key={index}>
                    {action.type} - {action.time}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>אין נתונים להצגה.</p>
      )}
    </div>
  );
}
