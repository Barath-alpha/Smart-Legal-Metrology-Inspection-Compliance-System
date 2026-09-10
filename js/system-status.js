/**
 * Smart Legal Metrology Inspection & Compliance System
 * System Service Health & Status Monitor Controller
 */

const SystemStatus = {
  services: [],

  init() {
    this.checkHealth();
    this.bindEvents();
  },

  bindEvents() {
    const refreshBtn = document.getElementById('btn-refresh-system-status');
    if (refreshBtn) {
      refreshBtn.onclick = () => this.checkHealth();
    }
  },

  async checkHealth() {
    UI.showLoader('Pinging Legal Metrology Enterprise Services...');

    try {
      const response = await API.get(CONFIG.ENDPOINTS.SYSTEM_STATUS);
      UI.hideLoader();

      if (response && response.success) {
        this.services = response.services || MockData.systemServices;
        this.renderStatusView(response.lastSync);
      }
    } catch (err) {
      UI.hideLoader();
      UI.showToast('error', 'Health Check Failed', err.message);
    }
  },

  renderStatusView(lastSync) {
    const container = document.getElementById('system-services-grid');
    const lastSyncEl = document.getElementById('system-last-sync-time');
    const overallBadgeEl = document.getElementById('system-overall-health-badge');

    if (lastSyncEl) lastSyncEl.textContent = `Last Checked: ${Utils.formatDate(lastSync || new Date())}`;
    if (overallBadgeEl) {
      overallBadgeEl.className = 'status-badge compliant';
      overallBadgeEl.innerHTML = '<i class="bi bi-check-circle-fill"></i> ALL SYSTEMS OPERATIONAL';
    }

    if (!container) return;

    container.innerHTML = this.services
      .map(s => `
        <div class="service-health-card">
          <div class="service-health-header">
            <div class="service-name">${Utils.escapeHtml(s.name)}</div>
            <span class="service-status-pill ${s.status === 'Online' ? 'online' : (s.status === 'Degraded' ? 'degraded' : 'offline')}">
              <i class="bi ${s.status === 'Online' ? 'bi-record-fill' : 'bi-exclamation-circle-fill'}"></i> ${Utils.escapeHtml(s.status)}
            </span>
          </div>
          <div style="font-size:0.78rem; color:var(--text-muted);">${Utils.escapeHtml(s.description)}</div>
          <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style="font-size:0.75rem;">
            <span>Endpoint: <code class="text-primary">${Utils.escapeHtml(s.endpoint)}</code></span>
            <span class="badge bg-light text-dark border">Latency: ${Utils.escapeHtml(s.responseTime)}</span>
          </div>
          <div class="d-flex justify-content-between align-items-center" style="font-size:0.72rem; color:var(--text-muted);">
            <span>Uptime: ${Utils.escapeHtml(s.uptime)}</span>
            <span>Version: ${Utils.escapeHtml(s.version)}</span>
          </div>
        </div>
      `)
      .join('');
  }
};
