export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 750,
    easing: 'easeInOutQuart'
  },
  plugins: {
    legend: {
      position: 'top',
      rtl: true,
      labels: {
        font: { size: 12 },
        padding: 10
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      rtl: true
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
        drawBorder: false
      },
      ticks: {
        font: { size: 11 },
        padding: 8
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: { size: 11 },
        padding: 8
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
};