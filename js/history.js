/**
 * Smart Legal Metrology Inspection & Compliance System
 * Inspection History & Audit Records Controller
 */

const History = {
  inspections: [],
  filteredInspections: [],
  currentPage: 1,
  pageSize: 10,
  sortBy: 'date',
  sortOrder: 'desc',

  init() {
    this.loadInspections();
    this.bindEvents();
  },

  loadInspections() {
    this.inspections = Storage.get(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST) || MockData.inspections;
    this.applyFilters();
  },

  bindEvents() {
    const searchInput = document.getElementById('history-search-input');
    const categoryFilter = document.getElementById('history-filter-category');
    const statusFilter = document.getElementById('history-filter-status');
    const exportCsvBtn = document.getElementById('btn-history-export-csv');
    const exportJsonBtn = document.getElementById('btn-history-export-json');

    if (searchInput) {
      searchInput.oninput = Utils.debounce(() => this.applyFilters(), 250);
    }
    if (categoryFilter) categoryFilter.onchange = () => this.applyFilters();
    if (statusFilter) statusFilter.onchange = () => this.applyFilters();

    if (exportCsvBtn) {
      exportCsvBtn.onclick = () => {
        Utils.exportToCsv('Legal_Metrology_Inspections_Audit', this.filteredInspections);
        UI.showToast('success', 'Export Complete', 'Inspections exported to CSV.');
      };
    }

    if (exportJsonBtn) {
      exportJsonBtn.onclick = () => {
        Utils.exportToJson('Legal_Metrology_Inspections_Audit', this.filteredInspections);
        UI.showToast('success', 'Export Complete', 'Inspections exported to JSON.');
      };
    }
  },

  applyFilters() {
    const search = (document.getElementById('history-search-input')?.value || '').toLowerCase().trim();
    const category = document.getElementById('history-filter-category')?.value || 'ALL';
    const status = document.getElementById('history-filter-status')?.value || 'ALL';

    this.filteredInspections = this.inspections.filter(item => {
      const matchSearch = !search ||
        (item.id && item.id.toLowerCase().includes(search)) ||
        (item.productName && item.productName.toLowerCase().includes(search)) ||
        (item.brand && item.brand.toLowerCase().includes(search)) ||
        (item.inspector && item.inspector.toLowerCase().includes(search)) ||
        (item.location && item.location.toLowerCase().includes(search)) ||
        (item.barcode && item.barcode.includes(search));

      const matchCategory = category === 'ALL' || item.category === category;
      const matchStatus = status === 'ALL' || item.complianceStatus === status;

      return matchSearch && matchCategory && matchStatus;
    });

    // Sort
    this.filteredInspections.sort((a, b) => {
      let valA = a[this.sortBy];
      let valB = b[this.sortBy];
      if (this.sortBy === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (this.sortOrder === 'desc') {
        return valA < valB ? 1 : -1;
      }
      return valA > valB ? 1 : -1;
    });

    this.currentPage = 1;
    this.renderTable();
  },

  renderTable() {
    const tbody = document.getElementById('history-table-body');
    const mobileCardsContainer = document.getElementById('history-mobile-cards');
    const totalCountEl = document.getElementById('history-total-count');
    const paginationEl = document.getElementById('history-pagination-container');

    if (!tbody) return;

    if (totalCountEl) totalCountEl.textContent = `${this.filteredInspections.length} records found`;

    const startIdx = (this.currentPage - 1) * this.pageSize;
    const paginatedItems = this.filteredInspections.slice(startIdx, startIdx + this.pageSize);

    if (paginatedItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center p-4 text-muted">No inspection records found matching your filters.</td></tr>`;
      if (mobileCardsContainer) mobileCardsContainer.innerHTML = `<div class="text-center p-4 text-muted">No inspections found.</div>`;
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    // Render Desktop Table Rows
    tbody.innerHTML = paginatedItems
      .map(item => `
        <tr>
          <td class="font-monospace fw-bold text-primary">
            <a href="javascript:void(0)" onclick="UI.openInspectionDrawer('${item.id}')">${Utils.escapeHtml(item.id)}</a>
          </td>
          <td>
            <div class="fw-semibold">${Utils.escapeHtml(item.productName)}</div>
            <div class="form-hint-text">${Utils.escapeHtml(item.brand || 'Unbranded')}</div>
          </td>
          <td><span class="badge bg-light text-dark border">${Utils.escapeHtml(item.category)}</span></td>
          <td>${Utils.escapeHtml(item.inspector)}</td>
          <td style="font-size:0.8rem; white-space:nowrap;">${Utils.formatDate(item.date)}</td>
          <td>${Utils.renderStatusBadge(item.complianceStatus)}</td>
          <td>${Utils.renderConfidenceMeter(item.score)}</td>
          <td class="text-center">
            ${item.violationsCount > 0 
              ? `<span class="badge bg-danger">${item.violationsCount}</span>` 
              : `<span class="badge bg-success">0</span>`}
          </td>
          <td class="text-end" style="white-space:nowrap;">
            <button class="btn-gov btn-gov-sm btn-gov-secondary" title="Quick Drawer View" onclick="UI.openInspectionDrawer('${item.id}')">
              <i class="bi bi-eye"></i>
            </button>
            <a href="#inspection-details?id=${item.id}" class="btn-gov btn-gov-sm btn-gov-outline-primary" title="Full Audit Trail">
              <i class="bi bi-journal-text"></i>
            </a>
            ${item.reportId ? `
              <a href="#reports?id=${item.id}" class="btn-gov btn-gov-sm btn-gov-primary" title="Official Report">
                <i class="bi bi-file-earmark-pdf"></i>
              </a>
            ` : ''}
          </td>
        </tr>
      `)
      .join('');

    // Render Mobile Cards
    if (mobileCardsContainer) {
      mobileCardsContainer.innerHTML = paginatedItems
        .map(item => `
          <div class="gov-card mb-3 p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="font-monospace fw-bold text-primary">${Utils.escapeHtml(item.id)}</span>
              ${Utils.renderStatusBadge(item.complianceStatus)}
            </div>
            <h6 class="mb-1">${Utils.escapeHtml(item.productName)}</h6>
            <div class="text-muted" style="font-size:0.78rem;">${Utils.escapeHtml(item.category)} &bull; ${Utils.escapeHtml(item.inspector)}</div>
            <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
              <span style="font-size:0.75rem;" class="text-muted">${Utils.formatDate(item.date)}</span>
              <div class="d-flex gap-1">
                <button class="btn-gov btn-gov-sm btn-gov-secondary" onclick="UI.openInspectionDrawer('${item.id}')">Drawer</button>
                <a href="#inspection-details?id=${item.id}" class="btn-gov btn-gov-sm btn-gov-primary">Details</a>
              </div>
            </div>
          </div>
        `)
        .join('');
    }

    this.renderPagination(paginationEl);
  },

  renderPagination(container) {
    if (!container) return;
    const totalPages = Math.ceil(this.filteredInspections.length / this.pageSize);
    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let pagesHtml = '';
    for (let p = 1; p <= totalPages; p++) {
      pagesHtml += `
        <button class="btn-gov btn-gov-sm ${p === this.currentPage ? 'btn-gov-primary' : 'btn-gov-secondary'}" onclick="History.goToPage(${p})">
          ${p}
        </button>
      `;
    }

    container.innerHTML = `
      <div class="d-flex align-items-center gap-1">
        <button class="btn-gov btn-gov-sm btn-gov-secondary" ${this.currentPage === 1 ? 'disabled' : ''} onclick="History.goToPage(${this.currentPage - 1})">
          Prev
        </button>
        ${pagesHtml}
        <button class="btn-gov btn-gov-sm btn-gov-secondary" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="History.goToPage(${this.currentPage + 1})">
          Next
        </button>
      </div>
    `;
  },

  goToPage(page) {
    this.currentPage = page;
    this.renderTable();
  }
};
