/**
 * Smart Legal Metrology Inspection & Compliance System
 * Dashboard Controller
 */

const Dashboard = {
  charts: {},

  init() {
    this.renderStats();
    this.renderRecentInspections();
    this.renderPendingReviews();
    this.renderRecentViolations();
    this.initCharts();
    this.bindEvents();
  },

  bindEvents() {
    const startNewBtn = document.getElementById('btn-dashboard-start-inspection');
    if (startNewBtn) {
      startNewBtn.onclick = () => {
        window.location.hash = '#new-inspection';
      };
    }
  },

  renderStats() {
    const inspections = Storage.get(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST) || MockData.inspections;
    const total = inspections.length;
    const compliant = inspections.filter(i => i.complianceStatus === 'COMPLIANT').length;
    const nonCompliant = inspections.filter(i => i.complianceStatus === 'NON-COMPLIANT').length;
    const reviewRequired = inspections.filter(i => i.complianceStatus === 'REVIEW REQUIRED').length;

    const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 0;

    const totalEl = document.getElementById('dash-kpi-total');
    const compEl = document.getElementById('dash-kpi-compliant');
    const nonCompEl = document.getElementById('dash-kpi-non-compliant');
    const reviewEl = document.getElementById('dash-kpi-review');
    const rateEl = document.getElementById('dash-kpi-rate');

    if (totalEl) totalEl.textContent = total;
    if (compEl) compEl.textContent = compliant;
    if (nonCompEl) nonCompEl.textContent = nonCompliant;
    if (reviewEl) reviewEl.textContent = reviewRequired;
    if (rateEl) rateEl.textContent = `${complianceRate}%`;
  },

  renderRecentInspections() {
    const container = document.getElementById('dash-recent-inspections-tbody');
    if (!container) return;

    const inspections = Storage.get(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST) || MockData.inspections;
    const recent = inspections.slice(0, 5);

    container.innerHTML = recent
      .map(item => `
        <tr>
          <td class="font-monospace fw-bold text-primary">
            <a href="javascript:void(0)" onclick="UI.openInspectionDrawer('${item.id}')">${Utils.escapeHtml(item.id)}</a>
          </td>
          <td>
            <div class="fw-semibold">${Utils.escapeHtml(item.productName)}</div>
            <div class="form-hint-text">${Utils.escapeHtml(item.brand || 'Unbranded')}</div>
          </td>
          <td>${Utils.renderStatusBadge(item.complianceStatus)}</td>
          <td>${Utils.renderConfidenceMeter(item.score)}</td>
          <td class="text-end">
            <button class="btn-gov btn-gov-sm btn-gov-secondary" onclick="UI.openInspectionDrawer('${item.id}')" title="Quick Drawer View">
              <i class="bi bi-eye"></i>
            </button>
            <a href="#inspection-details?id=${item.id}" class="btn-gov btn-gov-sm btn-gov-outline-primary" title="Details">
              <i class="bi bi-chevron-right"></i>
            </a>
          </td>
        </tr>
      `)
      .join('');
  },

  renderPendingReviews() {
    const container = document.getElementById('dash-pending-reviews-list');
    if (!container) return;

    const inspections = Storage.get(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST) || MockData.inspections;
    const pending = inspections.filter(i => i.complianceStatus === 'REVIEW REQUIRED');

    if (pending.length === 0) {
      container.innerHTML = '<div class="text-muted p-3 text-center" style="font-size:0.85rem;">No inspections currently require manual review.</div>';
      return;
    }

    container.innerHTML = pending
      .map(item => `
        <div class="p-3 mb-2 bg-light border rounded d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-bold text-primary">${Utils.escapeHtml(item.id)}: ${Utils.escapeHtml(item.productName)}</div>
            <div class="form-hint-text">${Utils.escapeHtml(item.category)} &bull; ${Utils.formatDate(item.date)}</div>
          </div>
          <a href="#human-verification?id=${item.id}" class="btn-gov btn-gov-sm btn-gov-warning">
            <i class="bi bi-person-check-fill"></i> Review
          </a>
        </div>
      `)
      .join('');
  },

  renderRecentViolations() {
    const container = document.getElementById('dash-recent-violations-list');
    if (!container) return;

    const violations = [
      { id: 'VIO-2026-0104', ruleId: 'LMPC-R6-1E', desc: 'Missing "inclusive of all taxes" clause in retail price declaration.', severity: 'Critical', time: '10 Sep 2026' },
      { id: 'VIO-2026-0105', ruleId: 'LMPC-R6-1G', desc: 'Country of origin missing on imported True Wireless Earbuds.', severity: 'Critical', time: '09 Sep 2026' },
      { id: 'VIO-2026-0106', ruleId: 'LMPC-R8', desc: 'Net quantity numeral font height is below statutory 2.0mm threshold.', severity: 'Medium', time: '08 Sep 2026' }
    ];

    container.innerHTML = violations
      .map(v => `
        <div class="p-3 mb-2 bg-danger-subtle border border-danger-subtle rounded d-flex justify-content-between align-items-center">
          <div>
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-danger font-monospace">${Utils.escapeHtml(v.id)}</span>
              <strong class="text-danger">${Utils.escapeHtml(v.ruleId)}</strong>
            </div>
            <div style="font-size:0.8rem;" class="mt-1 text-secondary">${Utils.escapeHtml(v.desc)}</div>
          </div>
          ${Utils.renderSeverityBadge(v.severity)}
        </div>
      `)
      .join('');
  },

  initCharts() {
    if (typeof Chart === 'undefined') return;

    // Destroy existing dashboard charts
    Object.values(this.charts).forEach(c => c && c.destroy());

    const dashTrendCtx = document.getElementById('dash-chart-trends');
    if (dashTrendCtx) {
      this.charts.trend = new Chart(dashTrendCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Inspections',
              data: [8, 14, 12, 19, 24, 18, 22],
              borderColor: '#1d4ed8',
              backgroundColor: 'rgba(29, 78, 216, 0.1)',
              fill: true,
              tension: 0.3
            },
            {
              label: 'Compliant',
              data: [7, 11, 10, 16, 20, 15, 19],
              borderColor: '#10b981',
              backgroundColor: 'transparent',
              borderDash: [4, 4],
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } }
        }
      });
    }
  }
};
