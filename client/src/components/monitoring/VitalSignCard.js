import React from 'react';
import { Line } from 'react-chartjs-2';
import { chartOptions } from './chartConfig';

export function VitalSignCard({ 
  icon, 
  title, 
  value, 
  color, 
  data, 
  timeframe, 
  onTimeframeChange,
  onExportData 
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl vital-sign-card">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {icon}
            <h3 className="text-lg font-medium text-gray-700">{title}</h3>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
            <button 
              onClick={onExportData}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="ייצא נתונים"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="h-48 mb-4">
          <Line data={data} options={chartOptions} />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              onClick={() => onTimeframeChange('12h')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                timeframe === '12h' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              12 שעות
            </button>
            <button 
              onClick={() => onTimeframeChange('2h')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                timeframe === '2h' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              שעתיים
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}