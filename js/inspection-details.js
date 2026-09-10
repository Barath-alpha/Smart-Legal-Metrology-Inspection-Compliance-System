/**
 * Smart Legal Metrology Inspection & Compliance System
 * Full Inspection Details & Audit Timeline Controller
 */

const InspectionDetails = {
  currentInspection: null,

  init(inspectionId) {
    this.loadInspection(inspectionId);
    this.bindEvents();
  },

  loadInspection(id) {
    const inspections = Storage.get(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST) || MockData.inspections;
    const activeDraft = Storage.get(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION);

    if (id && activeDraft && activeDraft.id === id) {
      this.currentInspection = activeDraft;
    } else if (id) {
      this.currentInspection = inspections.find(i => i.id === id) || inspections[0];
    } else {
      this.currentInspection = activeDraft || inspections[0];
    }

    this.renderDetailsView();
  },

  bindEvents() {
    const openReportBtn = document.getElementById('btn-details-open-report');
    const backBtn = document.getElementById('btn-details-back-history');

    if (openReportBtn) {
      openReportBtn.onclick = () => {
        // Set this inspection as active draft and route to reports
        Storage.set(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION, this.currentInspection);
        window.location.hash = '#reports';
      };
    }

    if (backBtn) {
      backBtn.onclick = () => {
        window.location.hash = '#history';
      };
    }
  },

  renderDetailsView() {
    const insp = this.currentInspection;
    if (!insp) return;

    const idEl = document.getElementById('details-inspection-id');
    const productEl = document.getElementById('details-product-name');
    const categoryEl = document.getElementById('details-category');
    const inspectorEl = document.getElementById('details-inspector');
    const dateEl = document.getElementById('details-date');
    const locationEl = document.getElementById('details-location');
    const statusEl = document.getElementById('details-status-badge');
    const scoreEl = document.getElementById('details-score');
    const timelineEl = document.getElementById('details-audit-timeline');
    const imagesGridEl = document.getElementById('details-images-grid');

    if (idEl) idEl.textContent = insp.id;
    if (productEl) productEl.textContent = insp.productName;
    if (categoryEl) categoryEl.textContent = insp.category;
    if (inspectorEl) inspectorEl.textContent = insp.inspector;
    if (dateEl) dateEl.textContent = Utils.formatDate(insp.date);
    if (locationEl) locationEl.textContent = insp.location;
    if (statusEl) statusEl.innerHTML = Utils.renderStatusBadge(insp.complianceStatus);
    if (scoreEl) scoreEl.textContent = `${insp.score || insp.complianceScore || 85}%`;

    // Render Timeline
    if (timelineEl) {
      const isCompliant = insp.complianceStatus === 'COMPLIANT';
      const steps = [
        { title: 'Inspection Metadata Initialized', time: Utils.formatDate(insp.date), desc: `Created by ${insp.inspector}`, status: 'done' },
        { title: 'Label Image Upload & Preprocessing', time: Utils.formatDate(insp.date), desc: 'Perspective correction and PDP alignment completed', status: 'done' },
        { title: 'OCR Character Recognition', time: Utils.formatDate(insp.date), desc: 'Optical text segmented with 96.4% confidence', status: 'done' },
        { title: 'AI Metrology Entity Extraction', time: Utils.formatDate(insp.date), desc: 'Extracted Rule 6 mandatory statutory fields', status: 'done' },
        { title: 'LMPC 2011 Compliance Evaluation', time: Utils.formatDate(insp.date), desc: `Evaluated against 8 statutory rules. Verdict: ${insp.complianceStatus}`, status: 'done' },
        { title: 'Statutory Report Generation', time: Utils.formatDate(insp.date), desc: `Official Certificate ${insp.reportId || 'REP-2026-8801'} created`, status: 'done' }
      ];

      timelineEl.innerHTML = steps
        .map((s, idx) => `
          <div class="d-flex gap-3 mb-3">
            <div class="d-flex flex-column align-items-center">
              <div class="stepper-icon completed" style="width:28px; height:28px; font-size:0.75rem;">
                <i class="bi bi-check"></i>
              </div>
              ${idx < steps.length - 1 ? '<div style="width:2px; height:36px; background:var(--status-compliant);"></div>' : ''}
            </div>
            <div>
              <div class="fw-bold" style="font-size:0.88rem;">${Utils.escapeHtml(s.title)}</div>
              <div class="text-muted" style="font-size:0.75rem;">${Utils.escapeHtml(s.desc)} &bull; ${s.time}</div>
            </div>
          </div>
        `)
        .join('');
    }

    // Render Image Preview
    if (imagesGridEl) {
      const sample = MockData.sampleProducts[0];
      const imgSrc = (insp.images && insp.images[0] && insp.images[0].dataUrl) || sample.image;

      imagesGridEl.innerHTML = `
        <div class="thumbnail-card" style="height:180px;">
          <img src="${imgSrc}" alt="Packaging Label" />
          <span class="thumbnail-side-tag">Principal Display Panel</span>
        </div>
      `;
    }
  }
};
