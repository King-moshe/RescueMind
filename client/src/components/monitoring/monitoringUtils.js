export const exportToCSV = (data, filename) => {
  const headers = ['זמן', 'דופק', 'חמצן', 'לחץ דם סיסטולי', 'לחץ דם דיאסטולי', 'טמפרטורה', 'קצב נשימה'];
  const csvData = data.map(record => [
    record.time.toLocaleString(),
    record.heartRate,
    record.oxygenLevel,
    record.systolic,
    record.diastolic,
    record.temperature,
    record.respiratoryRate
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const calculateStats = (data) => {
  if (!data.length) return null;

  const values = data.map(item => item.value);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
    trend: values[values.length - 1] - values[0]
  };
};

export const getAlertThresholds = {
  heartRate: { min: 60, max: 100 },
  oxygenLevel: { min: 95, max: 100 },
  systolic: { min: 90, max: 120 },
  diastolic: { min: 60, max: 80 },
  temperature: { min: 36, max: 37.5 },
  respiratoryRate: { min: 12, max: 20 }
};