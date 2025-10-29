// src/components/TreatmentLog.js
import React, { useState, useEffect } from 'react';
import { XIcon } from '@heroicons/react/solid';

export default function TreatmentLog() {
  const [treatmentData, setTreatmentData] = useState({
    startTime: new Date().toLocaleString(),
    action: '',
    medication: '',
    pulse: '',
    oxygenLevel: '',
    bloodPressure: '',
    notes: '',
    additionalActions: [],
  });

  const [newAction, setNewAction] = useState({ type: '', time: '' });
  const [vitalSigns, setVitalSigns] = useState({
    pulse: '',
    oxygenLevel: '',
    bloodPressure: '',
  });

  // דימוי קבלת נתונים אוטומטיים של מדדים חיוניים
  useEffect(() => {
    const interval = setInterval(() => {
      setVitalSigns({
        pulse: Math.floor(60 + Math.random() * 40),
        oxygenLevel: Math.floor(95 + Math.random() * 5),
        bloodPressure: `${Math.floor(110 + Math.random() * 10)}/${Math.floor(70 + Math.random() * 10)}`,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTreatmentData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddAction = () => {
    if (newAction.type && newAction.time) {
      setTreatmentData((prevData) => ({
        ...prevData,
        additionalActions: [...prevData.additionalActions, newAction],
      }));
      setNewAction({ type: '', time: '' });
    }
  };

  const handleNewActionChange = (e) => {
    const { name, value } = e.target;
    setNewAction((prevAction) => ({ ...prevAction, [name]: value }));
  };

  const handleRemoveAction = (index) => {
    setTreatmentData((prevData) => ({
      ...prevData,
      additionalActions: prevData.additionalActions.filter((_, i) => i !== index),
    }));
  };

  const prepareDataForTransmission = () => {
    const dataForTransmission = {
      ...treatmentData,
      vitalSigns: {
        pulse: vitalSigns.pulse,
        oxygenLevel: vitalSigns.oxygenLevel,
        bloodPressure: vitalSigns.bloodPressure,
      },
    };
    console.log("Data for Transmission:", JSON.stringify(dataForTransmission, null, 2));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    prepareDataForTransmission();
  
    // שמירת הנתונים ב-LocalStorage
    const dataForStorage = {
      ...treatmentData,
      vitalSigns,
    };
    localStorage.setItem("treatmentLog", JSON.stringify(dataForStorage));
    alert("הנתונים נשמרו בהצלחה!");
  };
  

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">תיעוד טיפול בפצוע</h2>

      {/* הצגת מדדים חיוניים */}
      <div className="p-4 bg-gray-100 rounded mb-4">
        <h3 className="text-lg font-semibold mb-2">מדדים חיוניים</h3>
        <p>דופק: <span className="font-bold">{vitalSigns.pulse}</span> BPM</p>
        <p>רמת חמצן: <span className="font-bold">{vitalSigns.oxygenLevel}</span>%</p>
        <p>לחץ דם: <span className="font-bold">{vitalSigns.bloodPressure}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">תאריך ושעת התחלה</label>
          <input type="text" value={treatmentData.startTime} disabled className="border p-2 w-full rounded"/>
        </div>

        <div>
          <label className="block text-gray-700">פעולה שבוצעה</label>
          <input type="text" name="action" value={treatmentData.action} onChange={handleChange} className="border p-2 w-full rounded" placeholder="הזן פעולה שבוצעה"/>
        </div>

        <div>
          <label className="block text-gray-700">תרופות שניתנו</label>
          <input type="text" name="medication" value={treatmentData.medication} onChange={handleChange} className="border p-2 w-full rounded" placeholder="הזן תרופות שניתנו"/>
        </div>

        <div>
          <label className="block text-gray-700">הערות נוספות</label>
          <textarea name="notes" value={treatmentData.notes} onChange={handleChange} className="border p-2 w-full rounded" placeholder="הזן הערות נוספות" rows="3"/>
        </div>

        {/* פעולות נוספות */}
        <div className="mt-4">
          <label className="block text-gray-700">הוסף פעולה נוספת</label>
          <div className="flex items-center space-x-2">
            <select name="type" value={newAction.type} onChange={handleNewActionChange} className="border p-2 rounded w-full">
              <option value="">בחר פעולה</option>
              <option value="tourniquet">הנחת ח.ע</option>
              <option value="medication">מתן תרופה</option>
              <option value="bandage">תחבושת</option>
            </select>
            <input type="time" name="time" value={newAction.time} onChange={handleNewActionChange} className="border p-2 rounded"/>
            <button type="button" onClick={handleAddAction} className="text-blue-500 font-bold text-2xl">+</button>
          </div>
        </div>

        {treatmentData.additionalActions.length > 0 && (
          <div className="mt-4 space-y-2">
            {treatmentData.additionalActions.map((action, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <span>{action.type} - {action.time}</span>
                <button type="button" onClick={() => handleRemoveAction(index)} className="text-red-500">
                  <XIcon className="w-5 h-5"/>
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">שמירת תיעוד</button>
      </form>
    </div>
  );
}
