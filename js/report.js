// Transaction Data (Assignment 3 placeholder)

const transactionData = [
  {
    transactionId: "T1001",
    timestamp: "2026-05-01T10:15:00",
    genre: "Fiction",
    title: "The Lost City",
    author: "A. Writer",
    units: 3,
    revenue: 59.97
  },
  {
    transactionId: "T1002",
    timestamp: "2026-05-02T14:22:00",
    genre: "Science",
    title: "Quantum Dreams",
    author: "Dr. S. Researcher",
    units: 1,
    revenue: 28.99
  },
  {
    transactionId: "T1003",
    timestamp: "2026-05-03T09:40:00",
    genre: "Fantasy",
    title: "Dragons of Dawn",
    author: "L. Myth",
    units: 2,
    revenue: 51.98
  }
];


//  DOM Elements
const btnGenerate = document.getElementById("btnGenerateReport");
const tableBody = document.getElementById("reportTableBody");
const reportOutput = document.getElementById("reportOutput");


//  Helper: Format date to YYYY-MM-DD
function formatDate(dateStr) {
  return dateStr.split("T")[0];
}


//  Generate Report
btnGenerate.addEventListener("click", () => {
  const startDate = document.getElementById("filter-start").value;
  const endDate = document.getElementById("filter-end").value;
  const genre = document.getElementById("filter-genre").value;

  // Filter data
  const filtered = transactionData.filter(record => {
    const recordDate = formatDate(record.timestamp);

    const matchStart = startDate ? recordDate >= startDate : true;
    const matchEnd = endDate ? recordDate <= endDate : true;
    const matchGenre = genre === "all" ? true : record.genre.toLowerCase() === genre;

    return matchStart && matchEnd && matchGenre;
  });

  // Update placeholder text
  reportOutput.innerHTML = `
    <h2 class="dashboard-report-heading">Report Results</h2>
    <p class="dashboard-placeholder-text">${filtered.length} record(s) found</p>
  `;

  // Populate table
  tableBody.innerHTML = "";

  filtered.forEach(record => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${record.title}</td>
      <td>${record.author}</td>
      <td>${record.genre}</td>
      <td>${record.units}</td>
      <td>$${record.revenue.toFixed(2)}</td>
    `;

    tableBody.appendChild(row);
  });
});


//  Export CSV
function exportCSV() {
  let csv = "Title,Author,Genre,Units Sold,Revenue\n";

  transactionData.forEach(r => {
    csv += `${r.title},${r.author},${r.genre},${r.units},${r.revenue}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "sales_report.csv";
  a.click();

  URL.revokeObjectURL(url);
}

// Optional: attach export button if you add one
const exportBtn = document.querySelector(".btn-export");
if (exportBtn) {
  exportBtn.addEventListener("click", exportCSV);
}
