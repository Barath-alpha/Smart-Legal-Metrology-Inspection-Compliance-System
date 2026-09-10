/**
 * Smart Legal Metrology Inspection & Compliance System
 * Notification & Alert Center Controller
 */

const Notifications = {
  items: [],

  init() {
    this.loadNotifications();
    this.bindEvents();
    this.updateBadge();
  },

  loadNotifications() {
    this.items = Storage.get(CONFIG.STORAGE_KEYS.NOTIFICATIONS) || MockData.notifications;
    this.renderList();
  },

  bindEvents() {
    const markAllReadBtn = document.getElementById('btn-notif-mark-all-read');
    const clearAllBtn = document.getElementById('btn-notif-clear-all');

    if (markAllReadBtn) {
      markAllReadBtn.onclick = () => this.markAllAsRead();
    }
    if (clearAllBtn) {
      clearAllBtn.onclick = () => this.clearAll();
    }
  },

  updateBadge() {
    const unreadCount = this.items.filter(n => !n.read).length;
    const badgeEls = document.querySelectorAll('.notification-unread-count');
    const badgeDots = document.querySelectorAll('.notification-badge-dot');

    badgeEls.forEach(el => {
      el.textContent = unreadCount;
      el.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    });

    badgeDots.forEach(dot => {
      dot.style.display = unreadCount > 0 ? 'block' : 'none';
    });
  },

  renderList() {
    const container = document.getElementById('notifications-list-container');
    const emptyState = document.getElementById('notifications-empty-state');
    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = this.items
      .map(n => `
        <div class="gov-card mb-3 p-3 ${n.read ? 'opacity-75' : 'border-primary'}" id="notif-item-${n.id}">
          <div class="d-flex justify-content-between align-items-start gap-3">
            <div class="d-flex gap-3">
              <div class="kpi-icon-wrapper ${n.severity === 'Critical' ? 'non-compliant' : (n.severity === 'Medium' ? 'review' : 'compliant')}" style="width:36px; height:36px;">
                <i class="bi ${n.severity === 'Critical' ? 'bi-shield-slash' : (n.severity === 'Medium' ? 'bi-exclamation-triangle' : 'bi-bell-fill')}"></i>
              </div>
              <div>
                <div class="fw-bold text-primary" style="font-size:0.92rem;">${Utils.escapeHtml(n.title)}</div>
                <p class="mb-1 text-secondary" style="font-size:0.84rem;">${Utils.escapeHtml(n.message)}</p>
                <div class="d-flex align-items-center gap-2" style="font-size:0.75rem; color:var(--text-muted);">
                  <span><i class="bi bi-clock"></i> ${Utils.formatDate(n.timestamp)}</span>
                  ${n.inspectionId ? `
                    &bull; <a href="#inspection-details?id=${n.inspectionId}" class="fw-semibold">View ${n.inspectionId}</a>
                  ` : ''}
                </div>
              </div>
            </div>

            <div class="d-flex align-items-center gap-2">
              ${Utils.renderSeverityBadge(n.severity)}
              ${!n.read ? `
                <button class="btn-gov btn-gov-sm btn-gov-secondary" onclick="Notifications.markAsRead('${n.id}')" title="Mark as Read">
                  <i class="bi bi-check2"></i>
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `)
      .join('');
  },

  markAsRead(id) {
    const item = this.items.find(n => n.id === id);
    if (item) {
      item.read = true;
      Storage.set(CONFIG.STORAGE_KEYS.NOTIFICATIONS, this.items);
      this.renderList();
      this.updateBadge();
    }
  },

  markAllAsRead() {
    this.items.forEach(n => n.read = true);
    Storage.set(CONFIG.STORAGE_KEYS.NOTIFICATIONS, this.items);
    this.renderList();
    this.updateBadge();
    UI.showToast('success', 'Updated', 'All notifications marked as read.');
  },

  clearAll() {
    this.items = [];
    Storage.set(CONFIG.STORAGE_KEYS.NOTIFICATIONS, this.items);
    this.renderList();
    this.updateBadge();
    UI.showToast('info', 'Cleared', 'Notification center cleared.');
  }
};
