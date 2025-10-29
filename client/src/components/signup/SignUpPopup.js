import React, { useState } from 'react';

export default function SignUpPopup({ onClose, onRegister }) {
  const [name, setName] = useState('');
  const [personalId, setPersonalId] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (name && personalId.length === 7) {
      onRegister({ name, personalId, role: 'medic' });
      onClose();
    } else {
      setError('אנא מלא את כל הפרטים הנדרשים');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold mb-4">הרשמה</h2>
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
        <button onClick={handleRegister} className="bg-green-500 text-white py-2 px-4 rounded w-full">
          הרשמה
        </button>
        <button onClick={onClose} className="mt-4 text-gray-500 underline">סגור</button>
      </div>
    </div>
  );
}
