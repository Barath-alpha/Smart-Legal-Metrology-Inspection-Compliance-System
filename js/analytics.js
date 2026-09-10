/**
 * Smart Legal Metrology Inspection & Compliance System
 * Analytics & Enforcement Intelligence Controller with Chart.js
 */

const Analytics = {
  charts: {},

  init() {
    this.renderMetrics();
    this.initCharts();
    this.bindEvents();
  },

  bindEvents() {
    const rangeSelect = document.getElementById('analytics-date-range');
    const categorySelect = document.getElementById('analytics-category-filter');
    const exportBtn = document.getElementById('btn-export-analytics');

    if (rangeSelect) {
      rangeSelect.onchange = () => this.refreshData();
    }
    if (categorySelect) {
      categorySelect.onchange = () => this.refreshData();
    }
    if (exportBtn) {
      exportBtn.onclick = () => {
        window.print();
      };
    }
  },

  renderMetrics() {
    const inspections = Storage.get(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST) || MockData.inspections;
    const total = inspections.length;
    const compliant = inspections.filter(i => i.complianceStatus === 'COMPLIANT').length;
    const nonCompliant = inspections.filter(i => i.complianceStatus === 'NON-COMPLIANT').length;
    const reviewReq = inspections.filter(i => i.complianceStatus === 'REVIEW REQUIRED').length;

    const rate = total > 0 ? Math.round((compliant / total) * 100) : 0;

    const totalEl = document.getElementById('analytics-total-inspections');
    const rateEl = document.getElementById('analytics-compliance-rate');
    const nonCompEl = document.getElementById('analytics-total-violations');
    const reviewEl = document.getElementById('analytics-pending-reviews');

    if (totalEl) totalEl.textContent = total;
    if (rateEl) rateEl.textContent = `${rate}%`;
    if (nonCompEl) nonCompEl.textContent = nonCompliant;
    if (reviewEl) reviewEl.textContent = reviewReq;
  },

  initCharts() {
    if (typeof Chart === 'undefined') return;

    // Destroy existing instances
    Object.values(this.charts).forEach(c => c && c.destroy());

    // 1. Trend Chart (Inspections vs Compliance over time)
    const trendCtx = document.getElementById('chart-inspection-trends');
    if (trendCtx) {
      this.charts.trend = new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: ['01 Sep', '02 Sep', '03 Sep', '04 Sep', '05 Sep', '06 Sep', '07 Sep', '08 Sep', '09 Sep', '10 Sep'],
          datasets: [
            {
              label: 'Total Inspections',
              data: [12, 19, 15, 22, 28, 24, 30, 35, 32, 40],
              borderColor: '#1d4ed8',
              backgroundColor: 'rgba(29, 78, 216, 0.08)',
              fill: true,
              tension: 0.35
            },
            {
              label: 'Compliant Products',
              data: [9, 14, 11, 18, 22, 19, 25, 29, 26, 33],
              borderColor: '#059669',
              backgroundColor: 'transparent',
              borderDash: [5, 5],
              tension: 0.35
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' }
          }
        }
      });
    }

    // 2. Violation Categories (Doughnut)
    const vioCtx = document.getElementById('chart-violation-distribution');
    if (vioCtx) {
      this.charts.violations = new Chart(vioCtx, {
        type: 'doughnut',
        data: {
          labels: ['Rule 6(1)(e) MRP & Taxes', 'Rule 6(1)(g) Country of Origin', 'Rule 6(1)(c) Net Quantity', 'Rule 6(1)(a) Mfr Address', 'Rule 6(1)(f) Consumer Care'],
          datasets: [{
            data: [38, 24, 18, 12, 8],
            backgroundColor: ['#dc2626', '#ea580c', '#d97706', '#2563eb', '#64748b']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }

    // 3. Category Compliance Bar
    const catCtx = document.getElementById('chart-category-compliance');
    if (catCtx) {
      this.charts.category = new Chart(catCtx, {
        type: 'bar',
        data: {
          labels: ['Packaged Food', 'Edible Oils', 'Cosmetics', 'Electronics', 'Household'],
          datasets: [
            {
              label: 'Compliant (%)',
              data: [82, 94, 76, 68, 88],
              backgroundColor: '#10b981'
            },
            {
              label: 'Violations (%)',
              data: [18, 6, 24, 32, 12],
              backgroundColor: '#ef4444'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true },
            y: { stacked: true, max: 100 }
          }
        }
      });
    }
  },

  refreshData() {
    UI.showToast('info', 'Filters Applied', 'Analytics refreshed for selected criteria.');
    this.renderMetrics();
    this.initCharts();
  }
};
