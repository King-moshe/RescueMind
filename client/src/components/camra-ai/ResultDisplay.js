// src/components/camera-ai/ResultDisplay.js
import React from 'react';

export default function ResultDisplay({ prediction }) {
  if (!prediction || !prediction.response) {
    return <p>אין נתונים זמינים להצגה.</p>;
  }

  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2 style={{ fontWeight: 'bold', marginBottom: '10px' }}>תוצאת זיהוי:</h2>
      <p><strong>פירוט:</strong></p>
      <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>
        {prediction.response}
      </div>
    </div>
  );
}
