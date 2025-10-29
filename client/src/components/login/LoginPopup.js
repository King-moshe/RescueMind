import React, { useState } from 'react';
import users from '../../data/users';

export default function LoginPopup({ onClose, onLogin }) {
  const [name, setName] = useState('');
  const [personalId, setPersonalId] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const user = users.find(user => user.name === name && user.personalId === personalId);
    if (user) {
      onLogin(user); // הפעלה של פונקציית ההתחברות עם פרטי המשתמש
      onClose(); // סגירת הפופאפ לאחר התחברות מוצלחת
    } else {
      setError("השם או המספר האישי אינם נכונים.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold mb-4">התחברות מהירה</h2>
        <input
          type="text"
          placeholder="שם מלא"
          className="border p-2 mb-2 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="מספר אישי (7 ספרות)"
          className="border p-2 mb-2 w-full rounded"
          value={personalId}
          onChange={(e) => setPersonalId(e.target.value)}
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button onClick={handleLogin} className="bg-blue-500 text-white py-2 px-4 rounded w-full">
          התחבר
        </button>
        <button onClick={onClose} className="mt-4 text-gray-500 underline">סגור</button>
      </div>
    </div>
  );
}
