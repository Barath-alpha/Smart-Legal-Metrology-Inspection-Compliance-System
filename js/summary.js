/**
 * Smart Legal Metrology Inspection & Compliance System
 * Comprehensive Inspection Summary & Final Decision Controller
 */

const Summary = {
  activeInspection: null,

  init() {
    this.activeInspection = Storage.get(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION) || {};
    this.renderSummary();
    this.bindEvents();
  },

  bindEvents() {
    const generateReportBtn = document.getElementById('btn-summary-generate-report');
    const commitDecisionBtn = document.getElementById('btn-summary-commit-decision');

    if (generateReportBtn) {
      generateReportBtn.onclick = () => {
        this.commitInspectionData();
        window.location.hash = '#reports';
      };
    }

    if (commitDecisionBtn) {
      commitDecisionBtn.onclick = () => {
        this.commitInspectionData();
        UI.showToast('success', 'Inspection Completed', 'Inspection record committed and saved to registry.');
        window.location.hash = '#reports';
      };
    }
  },

  renderSummary() {
    const inspIdEl = document.getElementById('summary-inspection-id');
    const dateEl = document.getElementById('summary-date');
    const inspectorEl = document.getElementById('summary-inspector');
    const locationEl = document.getElementById('summary-location');
    const productNameEl = document.getElementById('summary-product-name');
    const categoryEl = document.getElementById('summary-category');
    const barcodeEl = document.getElementById('summary-barcode');
    const verdictEl = document.getElementById('summary-verdict-badge');
    const scoreEl = document.getElementById('summary-score');
    const violationsListEl = document.getElementById('summary-violations-list');
    const declarationsTableEl = document.getElementById('summary-declarations-table-body');
    const officerReviewStatusEl = document.getElementById('summary-officer-review-status');

    const insp = this.activeInspection;

    if (inspIdEl) inspIdEl.textContent = insp.id || Utils.generateId('INS');
    if (dateEl) dateEl.textContent = Utils.formatDate(insp.date || new Date());
    if (inspectorEl) inspectorEl.textContent = insp.inspector || 'Rajesh Sharma (EMP-8842)';
    if (locationEl) locationEl.textContent = insp.location || 'General Market Inspection';
    if (productNameEl) productNameEl.textContent = insp.productName || 'Packaged Commodity';
    if (categoryEl) categoryEl.textContent = insp.category || 'Standard Goods';
    if (barcodeEl) barcodeEl.textContent = insp.barcode || 'N/A';
    if (scoreEl) scoreEl.textContent = `${insp.complianceScore || 85}%`;
    if (verdictEl) verdictEl.innerHTML = Utils.renderStatusBadge(insp.complianceStatus || 'PENDING');

    if (officerReviewStatusEl) {
      officerReviewStatusEl.innerHTML = insp.humanReviewed
        ? `<span class="badge bg-success"><i class="bi bi-shield-check"></i> Verified by ${Utils.escapeHtml(insp.reviewedBy)}</span>`
        : `<span class="badge bg-secondary"><i class="bi bi-robot"></i> Automated AI Extraction</span>`;
    }

    // Render Declarations Table
    if (declarationsTableEl) {
      const fields = insp.aiExtracted || {};
      const rows = [
        { label: 'Manufacturer / Packer Address', val: fields.manufacturer ? fields.manufacturer.value : 'N/A', rule: 'Rule 6(1)(a)' },
        { label: 'Commodity Generic Name', val: fields.productName ? fields.productName.value : 'N/A', rule: 'Rule 6(1)(b)' },
        { label: 'Net Quantity', val: fields.netQuantity ? fields.netQuantity.value : 'N/A', rule: 'Rule 6(1)(c)' },
        { label: 'Month & Year of Packing', val: fields.mfgDate ? fields.mfgDate.value : 'N/A', rule: 'Rule 6(1)(d)' },
        { label: 'Unit Sale Price (USP)', val: fields.unitSalePrice ? fields.unitSalePrice.value : 'N/A', rule: 'Rule 6(1)(da)' },
        { label: 'Retail Sale Price (MRP)', val: fields.mrp ? fields.mrp.value : 'N/A', rule: 'Rule 6(1)(e)' },
        { label: 'Consumer Redressal Cell', val: fields.customerCare ? fields.customerCare.value : 'N/A', rule: 'Rule 6(1)(f)' },
        { label: 'Country of Origin', val: fields.countryOfOrigin ? fields.countryOfOrigin.value : 'N/A', rule: 'Rule 6(1)(g)' }
      ];

      declarationsTableEl.innerHTML = rows
        .map(r => `
          <tr>
            <td class="fw-bold text-secondary" style="width:30%;">${Utils.escapeHtml(r.label)}</td>
            <td>${Utils.escapeHtml(r.val)}</td>
            <td class="font-monospace text-muted" style="width:15%;">${Utils.escapeHtml(r.rule)}</td>
          </tr>
        `)
        .join('');
    }

    // Render Violations
    if (violationsListEl) {
      const violations = insp.violations || [];
      if (violations.length === 0) {
        violationsListEl.innerHTML = `
          <div class="alert alert-success d-flex align-items-center gap-2 mb-0">
            <i class="bi bi-check-circle-fill" style="font-size:1.2rem;"></i>
            <div>Zero statutory violations detected. Commodity conforms to Legal Metrology Rules, 2011.</div>
          </div>
        `;
      } else {
        violationsListEl.innerHTML = violations
          .map(v => `
            <div class="p-3 mb-2 bg-danger-subtle border border-danger rounded d-flex justify-content-between align-items-center">
              <div>
                <strong class="text-danger">${Utils.escapeHtml(v.id)}: ${Utils.escapeHtml(v.category)}</strong>
                <div style="font-size:0.82rem; color:var(--text-secondary);">${Utils.escapeHtml(v.explanation)}</div>
              </div>
              <div>${Utils.renderSeverityBadge(v.severity)}</div>
            </div>
          `)
          .join('');
      }
    }
  },

  commitInspectionData() {
    const remarksInput = document.getElementById('summary-final-remarks');
    const decisionSelect = document.getElementById('summary-decision-select');

    if (remarksInput) this.activeInspection.finalRemarks = remarksInput.value;
    if (decisionSelect) this.activeInspection.finalDecision = decisionSelect.value;

    this.activeInspection.reportId = this.activeInspection.reportId || Utils.generateId('REP');
    this.activeInspection.reviewStatus = 'Completed';

    // Save to active draft & update inspections database
    Storage.set(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION, this.activeInspection);

    const inspections = Storage.get(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST) || MockData.inspections;
    const existingIndex = inspections.findIndex(i => i.id === this.activeInspection.id);

    const recordToSave = {
      id: this.activeInspection.id,
      productName: this.activeInspection.productName,
      category: this.activeInspection.category,
      brand: this.activeInspection.brand,
      inspector: this.activeInspection.inspector,
      date: this.activeInspection.date,
      location: this.activeInspection.location,
      complianceStatus: this.activeInspection.complianceStatus,
      score: this.activeInspection.complianceScore,
      violationsCount: (this.activeInspection.violations || []).length,
      reviewStatus: this.activeInspection.finalDecision || 'Notice Issued',
      reportId: this.activeInspection.reportId,
      barcode: this.activeInspection.barcode
    };

    if (existingIndex >= 0) {
      inspections[existingIndex] = { ...inspections[existingIndex], ...recordToSave };
    } else {
      inspections.unshift(recordToSave);
    }
    Storage.set(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST, inspections);
  }
};
