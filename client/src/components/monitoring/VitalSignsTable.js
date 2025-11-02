import React from 'react';

export function VitalSignsTable({ data, timeframe }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="px-4 py-2 text-right">זמן</th>
            <th className="px-4 py-2 text-right">דופק</th>
            <th className="px-4 py-2 text-right">חמצן</th>
            <th className="px-4 py-2 text-right">לחץ דם סיסטולי</th>
            <th className="px-4 py-2 text-right">לחץ דם דיאסטולי</th>
            <th className="px-4 py-2 text-right">טמפרטורה</th>
            <th className="px-4 py-2 text-right">קצב נשימה</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-2">{record.time.toLocaleTimeString()}</td>
              <td className={`px-4 py-2 ${record.heartRateAlert ? 'text-red-600 font-bold' : ''}`}>
                {record.heartRate}
              </td>
              <td className={`px-4 py-2 ${record.oxygenAlert ? 'text-red-600 font-bold' : ''}`}>
                {record.oxygenLevel}%
              </td>
              <td className={`px-4 py-2 ${record.bpAlert ? 'text-red-600 font-bold' : ''}`}>
                {record.systolic}
              </td>
              <td className={`px-4 py-2 ${record.bpAlert ? 'text-red-600 font-bold' : ''}`}>
                {record.diastolic}
              </td>
              <td className={`px-4 py-2 ${record.tempAlert ? 'text-red-600 font-bold' : ''}`}>
                {record.temperature}°C
              </td>
              <td className={`px-4 py-2 ${record.respiratoryAlert ? 'text-red-600 font-bold' : ''}`}>
                {record.respiratoryRate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}