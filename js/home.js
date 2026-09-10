/**
 * Smart Legal Metrology Inspection & Compliance System (SLM-ICS)
 * Home Page Client Controller & Interactive Engine
 * WCAG-Conscious Accessibility & Live Analytics Integration
 */

const Home = {
  charts: {},
  currentFontSize: 100, // percentage

  init() {
    this.initAccessibility();
    this.initHomeCharts();
    this.initMockConsole();
    this.initHumanInLoop();
    this.initSupportForm();
    this.initNoticeTicker();
    console.log('[Home] Official Government Portal Home Page initialized.');
  },

  /* -------------------------------------------------------------------------- */
  /* 1. Accessibility Controls (Font Scaling, High Contrast, Language)          */
  /* -------------------------------------------------------------------------- */
  initAccessibility() {
    // Font Scaling
    const btnDecrease = document.getElementById('btn-font-decrease');
    const btnNormal = document.getElementById('btn-font-normal');
    const btnIncrease = document.getElementById('btn-font-increase');

    if (btnDecrease) {
      btnDecrease.addEventListener('click', () => {
        if (this.currentFontSize > 85) {
          this.currentFontSize -= 5;
          document.documentElement.style.fontSize = `${this.currentFontSize}%`;
        }
      });
    }

    if (btnNormal) {
      btnNormal.addEventListener('click', () => {
        this.currentFontSize = 100;
        document.documentElement.style.fontSize = '100%';
      });
    }

    if (btnIncrease) {
      btnIncrease.addEventListener('click', () => {
        if (this.currentFontSize < 125) {
          this.currentFontSize += 5;
          document.documentElement.style.fontSize = `${this.currentFontSize}%`;
        }
      });
    }

    // High Contrast Mode Toggle
    const btnContrast = document.getElementById('btn-high-contrast');
    if (btnContrast) {
      const savedContrast = localStorage.getItem('slm_high_contrast') === 'true';
      if (savedContrast) {
        document.body.classList.add('high-contrast');
      }

      btnContrast.addEventListener('click', () => {
        const isHigh = document.body.classList.toggle('high-contrast');
        localStorage.setItem('slm_high_contrast', isHigh);
        if (typeof UI !== 'undefined' && UI.showToast) {
          UI.showToast('info', 'Accessibility', isHigh ? 'High Contrast Mode Enabled' : 'Standard Contrast Restored');
        }
      });
    }

    // Language Selector
    const langSelect = document.getElementById('portal-lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        if (typeof UI !== 'undefined' && UI.showToast) {
          UI.showToast('info', 'Language Preference', `Interface language switched to: ${lang === 'ta' ? 'தமிழ் (Tamil)' : lang === 'hi' ? 'हिन्दी (Hindi)' : 'English'}`);
        }
      });
    }
  },

  /* -------------------------------------------------------------------------- */
  /* 2. Live Chart.js Visualizations                                            */
  /* -------------------------------------------------------------------------- */
  initHomeCharts() {
    if (typeof Chart === 'undefined') return;

    // Destroy existing charts to prevent duplication
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') chart.destroy();
    });

    // 1. Monthly Inspection Volume Trend
    const ctxTrends = document.getElementById('chart-home-trends');
    if (ctxTrends) {
      this.charts.trends = new Chart(ctxTrends, {
        type: 'line',
        data: {
          labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
          datasets: [
            {
              label: 'Total Inspected Units',
              data: [1240, 1480, 1390, 1620, 1850, 2100, 1980, 2250, 2410, 2300, 2650, 2890],
              borderColor: '#1d4ed8',
              backgroundColor: 'rgba(29, 78, 216, 0.08)',
              fill: true,
              tension: 0.35,
              borderWidth: 2.5,
              pointBackgroundColor: '#1d4ed8',
              pointRadius: 4
            },
            {
              label: 'Verified Compliant',
              data: [1020, 1210, 1150, 1360, 1540, 1780, 1690, 1940, 2090, 2010, 2320, 2560],
              borderColor: '#059669',
              backgroundColor: 'transparent',
              borderDash: [5, 5],
              tension: 0.35,
              borderWidth: 2,
              pointBackgroundColor: '#059669',
              pointRadius: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
            tooltip: { padding: 10 }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      });
    }

    // 2. Compliance Distribution Doughnut
    const ctxComp = document.getElementById('chart-home-compliance');
    if (ctxComp) {
      this.charts.compliance = new Chart(ctxComp, {
        type: 'doughnut',
        data: {
          labels: ['Compliant (84.2%)', 'Statutory Violations (11.8%)', 'Under Human Review (4.0%)'],
          datasets: [{
            data: [842, 118, 40],
            backgroundColor: ['#059669', '#dc2626', '#d97706'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }

    // 3. Top Violation Categories Horizontal Bar
    const ctxViolations = document.getElementById('chart-home-violations');
    if (ctxViolations) {
      this.charts.violations = new Chart(ctxViolations, {
        type: 'bar',
        indexAxis: 'y',
        data: {
          labels: [
            'MRP Tax Clause Omission',
            'Non-Standard Net Qty',
            'Missing Origin / Importer',
            'Font Size / Height Defect',
            'Illegible Customer Care'
          ],
          datasets: [{
            label: 'Incidents Logged',
            data: [342, 289, 215, 178, 142],
            backgroundColor: '#dc2626',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } },
            y: { grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      });
    }

    // 4. Regional Enforcement Activity
    const ctxRegional = document.getElementById('chart-home-regional');
    if (ctxRegional) {
      this.charts.regional = new Chart(ctxRegional, {
        type: 'bar',
        data: {
          labels: ['North Zone', 'South Zone', 'West Zone', 'East Zone', 'Central Zone'],
          datasets: [
            {
              label: 'Inspections Completed',
              data: [840, 920, 780, 610, 520],
              backgroundColor: '#1d4ed8',
              borderRadius: 4
            },
            {
              label: 'Notices Dispatched',
              data: [98, 112, 85, 74, 58],
              backgroundColor: '#f59e0b',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      });
    }
  },

  /* -------------------------------------------------------------------------- */
  /* 3. Interactive Mock Inspector Console & Filter Pills                       */
  /* -------------------------------------------------------------------------- */
  initMockConsole() {
    const filterPills = document.querySelectorAll('.mock-console-filter');
    const tableRows = document.querySelectorAll('#mock-console-tbody tr');

    filterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        filterPills.forEach(p => p.classList.remove('active', 'btn-primary'));
        filterPills.forEach(p => p.classList.add('btn-outline-secondary'));
        pill.classList.remove('btn-outline-secondary');
        pill.classList.add('active', 'btn-primary');

        const filter = pill.dataset.filter;
        tableRows.forEach(row => {
          if (filter === 'all' || row.dataset.status === filter) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  },

  /* -------------------------------------------------------------------------- */
  /* 4. Responsible Human-In-The-Loop Inspector Verification Desk               */
  /* -------------------------------------------------------------------------- */
  initHumanInLoop() {
    const btnApprove = document.getElementById('hil-btn-approve');
    const btnReject = document.getElementById('hil-btn-reject');
    const btnReinspect = document.getElementById('hil-btn-reinspect');
    const statusBadge = document.getElementById('hil-status-badge');
    const auditLog = document.getElementById('hil-audit-log');

    if (btnApprove) {
      btnApprove.addEventListener('click', () => {
        if (statusBadge) {
          statusBadge.className = 'badge bg-success px-3 py-2';
          statusBadge.innerHTML = '<i class="fas fa-check-circle me-1"></i> VERIFIED &amp; APPROVED';
        }
        if (auditLog) {
          auditLog.textContent = `[${new Date().toLocaleTimeString()}] Verified by Officer ID #LM-8841. AI finding confirmed. Record digitally signed.`;
          auditLog.className = 'text-success small fw-semibold';
        }
        if (typeof UI !== 'undefined' && UI.showToast) {
          UI.showToast('success', 'Inspector Verification Signed', 'Statutory compliance verification recorded in audit ledger.');
        }
      });
    }

    if (btnReject) {
      btnReject.addEventListener('click', () => {
        if (statusBadge) {
          statusBadge.className = 'badge bg-danger px-3 py-2';
          statusBadge.innerHTML = '<i class="fas fa-exclamation-triangle me-1"></i> VIOLATION NOTICE ISSUED';
        }
        if (auditLog) {
          auditLog.textContent = `[${new Date().toLocaleTimeString()}] Non-compliance verified under Rule 6(1)(e). Formal notice dispatched.`;
          auditLog.className = 'text-danger small fw-semibold';
        }
        if (typeof UI !== 'undefined' && UI.showToast) {
          UI.showToast('warning', 'Notice Dispatched', 'Statutory Show Cause Notice reference generated: SCN-2026/09/8821');
        }
      });
    }

    if (btnReinspect) {
      btnReinspect.addEventListener('click', () => {
        if (statusBadge) {
          statusBadge.className = 'badge bg-warning text-dark px-3 py-2';
          statusBadge.innerHTML = '<i class="fas fa-search me-1"></i> PHYSICAL SAMPLE REQUESTED';
        }
        if (auditLog) {
          auditLog.textContent = `[${new Date().toLocaleTimeString()}] Flagged for Physical Laboratory Re-Verification by Authorized Inspector.`;
          auditLog.className = 'text-warning small fw-semibold';
        }
        if (typeof UI !== 'undefined' && UI.showToast) {
          UI.showToast('info', 'Re-inspection Flagged', 'Sample scheduled for lab verification protocol.');
        }
      });
    }
  },

  /* -------------------------------------------------------------------------- */
  /* 5. Support / Helpdesk Ticket Submission Handler                            */
  /* -------------------------------------------------------------------------- */
  initSupportForm() {
    const form = document.getElementById('home-support-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('support-category')?.value || 'Technical';
        const officerId = document.getElementById('support-officer-id')?.value || 'Authorized User';
        const subject = document.getElementById('support-subject')?.value || 'Help Request';
        const tckNum = 'SLM-TCK-' + Math.floor(100000 + Math.random() * 900000);

        if (typeof UI !== 'undefined' && UI.showToast) {
          UI.showToast('success', 'Ticket Dispatched', `Support Ticket ${tckNum} logged for ${officerId}. Our technical helpdesk will respond within 2 business hours.`);
        } else {
          alert(`Support Ticket ${tckNum} logged successfully.`);
        }

        form.reset();
      });
    }
  },

  /* -------------------------------------------------------------------------- */
  /* 6. Real-Time Notice Ticker                                                 */
  /* -------------------------------------------------------------------------- */
  initNoticeTicker() {
    const notices = [
      'Legal Metrology (Packaged Commodities) Amendment Rules 2026 compliance engine is currently active in production.',
      'Scheduled maintenance window: Sunday 02:00 AM - 04:00 AM IST. Portal uptime remains 99.98%.',
      'Circular No. LM-88/2026: Mandatory declaration of Unit Sale Price (USP) across all ecommerce-distributed packaged commodities.'
    ];

    let currentIdx = 0;
    const tickerEl = document.getElementById('live-notice-ticker');
    if (tickerEl) {
      setInterval(() => {
        currentIdx = (currentIdx + 1) % notices.length;
        tickerEl.style.opacity = '0';
        setTimeout(() => {
          tickerEl.textContent = notices[currentIdx];
          tickerEl.style.opacity = '1';
        }, 300);
      }, 7000);
    }
  }
};

// Auto initialize on DOMContentLoaded if standalone
document.addEventListener('DOMContentLoaded', () => {
  Home.init();
});
