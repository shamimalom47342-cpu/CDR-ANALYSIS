const fileInput = document.getElementById('fileInput');
const sampleButton = document.getElementById('sampleButton');
const summarySection = document.getElementById('summary');
const chartsSection = document.getElementById('charts');
const totalCallsEl = document.getElementById('totalCalls');
const totalDurationEl = document.getElementById('totalDuration');
const uniqueCallersEl = document.getElementById('uniqueCallers');
const uniqueReceiversEl = document.getElementById('uniqueReceivers');
const callTypeCanvas = document.getElementById('callTypeChart');
const topCallersCanvas = document.getElementById('topCallersChart');

let callTypeChart;
let topCallersChart;

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const text = await file.text();
  analyzeCsv(text);
});

sampleButton.addEventListener('click', () => {
  const sampleCsv = `Caller,Receiver,Date,Time,Duration,Location
9876543210,9123456780,2026-05-15,10:30,180,Bangalore
9988776655,9011223344,2026-05-16,11:00,240,Delhi
9123456780,9876543210,2026-05-17,09:45,120,Mumbai
9011223344,9988776655,2026-05-17,14:20,300,Hyderabad
8899776655,7766554433,2026-05-18,16:10,90,Chennai`;
  analyzeCsv(sampleCsv);
});

function analyzeCsv(csvText) {
  const rows = csvText.trim().split(/\r?\n/).map((row) => row.split(','));
  if (rows.length < 2) {
    alert('CSV must contain header plus data rows.');
    return;
  }

  const headers = rows[0].map((col) => col.trim().toLowerCase());
  const required = ['date', 'time', 'caller', 'receiver', 'duration'];
  const missing = required.filter((col) => !headers.includes(col));
  if (missing.length) {
    alert(`Missing columns: ${missing.join(', ')}`);
    return;
  }

  const index = headers.reduce((acc, header, i) => {
    acc[header] = i;
    return acc;
  }, {});

  const records = rows.slice(1).map((cols) => {
    const callType = cols[index.calltype]?.trim();
    const location = cols[index.location]?.trim();
    return {
      date: cols[index.date]?.trim(),
      time: cols[index.time]?.trim(),
      caller: cols[index.caller]?.trim(),
      receiver: cols[index.receiver]?.trim(),
      duration: Number(cols[index.duration]?.trim() || 0),
      callType: callType || location || 'Unknown',
    };
  });

  const totalCalls = records.length;
  const totalDuration = records.reduce((sum, row) => sum + (isFinite(row.duration) ? row.duration : 0), 0);
  const uniqueCallers = new Set(records.map((row) => row.caller)).size;
  const uniqueReceivers = new Set(records.map((row) => row.receiver)).size;

  const callTypeCounts = records.reduce((acc, row) => {
    acc[row.callType] = (acc[row.callType] || 0) + 1;
    return acc;
  }, {});

  const topCallers = Object.entries(records.reduce((acc, row) => {
    acc[row.caller] = (acc[row.caller] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5);

  totalCallsEl.textContent = totalCalls;
  totalDurationEl.textContent = totalDuration;
  uniqueCallersEl.textContent = uniqueCallers;
  uniqueReceiversEl.textContent = uniqueReceivers;
  summarySection.classList.remove('hidden');
  chartsSection.classList.remove('hidden');

  renderChart(callTypeChart, callTypeCanvas, {
    labels: Object.keys(callTypeCounts),
    data: Object.values(callTypeCounts),
    title: 'Calls by Type',
  });

  renderChart(topCallersChart, topCallersCanvas, {
    labels: topCallers.map(([caller]) => caller),
    data: topCallers.map(([, count]) => count),
    title: 'Top Callers',
  });
}

function renderChart(chart, canvas, { labels, data, title }) {
  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: title,
          data,
          backgroundColor: labels.map(() => 'rgba(84, 230, 255, 0.75)'),
          borderColor: labels.map(() => 'rgba(84, 230, 255, 1)'),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: false,
          text: title,
        },
      },
      scales: {
        x: { ticks: { color: '#cdd9f0' } },
        y: {
          beginAtZero: true,
          ticks: { color: '#cdd9f0' },
        },
      },
    },
  };

  if (chart) chart.destroy();
  return new Chart(canvas, config);
}
