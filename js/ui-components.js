/**
 * Smart Legal Metrology Inspection & Compliance System
 * UI Components & Notification Helper Module
 */

const UI = {
  // Toast Notifications Stack
  showToast(type = 'info', title = 'Notification', message = '', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `gov-toast ${type}`;

    let icon = 'bi-info-circle-fill';
    if (type === 'success') icon = 'bi-check-circle-fill';
    else if (type === 'error') icon = 'bi-x-circle-fill';
    else if (type === 'warning') icon = 'bi-exclamation-triangle-fill';

    toast.innerHTML = `
      <div class="gov-toast-icon"><i class="bi ${icon}"></i></div>
      <div class="gov-toast-content">
        <div class="gov-toast-title">${Utils.escapeHtml(title)}</div>
        <div class="gov-toast-message">${Utils.escapeHtml(message)}</div>
      </div>
      <button class="gov-toast-close" aria-label="Close">&times;</button>
    `;

    const closeBtn = toast.querySelector('.gov-toast-close');
    closeBtn.addEventListener('click', () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    });

    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        if (toast.parentElement) {
          toast.style.opacity = '0';
          toast.style.transform = 'translateY(10px)';
          setTimeout(() => toast.remove(), 250);
        }
      }, duration);
    }
  },

  // Global Loading Overlay
  showLoader(message = 'Processing Legal Metrology Data...') {
    let loader = document.getElementById('global-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'global-loader';
      loader.className = 'global-loader-overlay';
      loader.innerHTML = `
        <div class="spinner-gov"></div>
        <div id="global-loader-text" style="font-weight:600; font-size:1.05rem; letter-spacing:0.02em;">${Utils.escapeHtml(message)}</div>
      `;
      document.body.appendChild(loader);
    } else {
      loader.querySelector('#global-loader-text').textContent = message;
      loader.style.display = 'flex';
    }
  },

  hideLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) {
      loader.style.display = 'none';
    }
  },

  // Modal Confirmation Dialog (Promise-based)
  confirm(options = {}) {
    return new Promise((resolve) => {
      const {
        title = 'Confirmation Required',
        message = 'Are you sure you want to proceed with this action?',
        confirmText = 'Confirm Action',
        confirmBtnClass = 'btn-gov-primary',
        cancelText = 'Cancel'
      } = options;

      const modalEl = document.getElementById('global-confirm-modal');
      if (!modalEl) {
        resolve(confirm(message));
        return;
      }

      modalEl.querySelector('#confirm-modal-title').textContent = title;
      modalEl.querySelector('#confirm-modal-message').textContent = message;
      
      const confirmBtn = modalEl.querySelector('#confirm-modal-action-btn');
      confirmBtn.textContent = confirmText;
      confirmBtn.className = `btn-gov ${confirmBtnClass}`;

      const bsModal = new bootstrap.Modal(modalEl);

      const cleanup = (result) => {
        confirmBtn.removeEventListener('click', onConfirm);
        bsModal.hide();
        resolve(result);
      };

      const onConfirm = () => cleanup(true);
      confirmBtn.addEventListener('click', onConfirm, { once: true });

      modalEl.addEventListener('hidden.bs.modal', () => {
        resolve(false);
      }, { once: true });

      bsModal.show();
    });
  },

  // Update Breadcrumb trail in Topbar
  updateBreadcrumb(crumbs = []) {
    const breadcrumbsEl = document.getElementById('topbar-breadcrumb-list');
    const titleEl = document.getElementById('topbar-page-heading');
    if (!breadcrumbsEl || !titleEl) return;

    if (crumbs.length > 0) {
      const current = crumbs[crumbs.length - 1];
      titleEl.textContent = current.label;

      breadcrumbsEl.innerHTML = crumbs
        .map((c, i) => {
          if (i === crumbs.length - 1) {
            return `<span>${Utils.escapeHtml(c.label)}</span>`;
          }
          return `<a href="${c.url}">${Utils.escapeHtml(c.label)}</a> <i class="bi bi-chevron-right" style="font-size:0.65rem;"></i> `;
        })
        .join('');
    }
  },

  // Open Inspection Quick View Drawer
  openInspectionDrawer(inspectionId) {
    const backdrop = document.getElementById('drawer-backdrop');
    const drawer = document.getElementById('inspection-drawer');
    if (!drawer || !backdrop) return;

    const inspections = Storage.get(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST) || MockData.inspections;
    const item = inspections.find(i => i.id === inspectionId) || inspections[0];

    drawer.querySelector('#drawer-inspection-id').textContent = item.id;
    drawer.querySelector('#drawer-product-name').textContent = item.productName;
    drawer.querySelector('#drawer-category').textContent = item.category;
    drawer.querySelector('#drawer-brand').textContent = item.brand || 'N/A';
    drawer.querySelector('#drawer-inspector').textContent = item.inspector;
    drawer.querySelector('#drawer-location').textContent = item.location;
    drawer.querySelector('#drawer-date').textContent = Utils.formatDate(item.date);
    drawer.querySelector('#drawer-status-badge').innerHTML = Utils.renderStatusBadge(item.complianceStatus);
    drawer.querySelector('#drawer-score').textContent = `${item.score}%`;
    drawer.querySelector('#drawer-violations').textContent = item.violationsCount;

    const viewFullBtn = drawer.querySelector('#drawer-view-full-btn');
    viewFullBtn.onclick = () => {
      this.closeInspectionDrawer();
      window.location.hash = `#inspection-details?id=${item.id}`;
    };

    backdrop.classList.add('open');
    drawer.classList.add('open');
  },

  closeInspectionDrawer() {
    const backdrop = document.getElementById('drawer-backdrop');
    const drawer = document.getElementById('inspection-drawer');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }
};
