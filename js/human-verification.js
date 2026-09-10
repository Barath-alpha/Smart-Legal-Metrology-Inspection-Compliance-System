/**
 * Smart Legal Metrology Inspection & Compliance System
 * Human-in-the-Loop Verification Workflow Controller
 */

const HumanVerification = {
  activeInspection: null,

  init() {
    this.activeInspection = Storage.get(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION) || {};
    this.renderVerificationPanel();
    this.bindEvents();
  },

  bindEvents() {
    const signOffBtn = document.getElementById('btn-human-review-signoff');
    const returnSummaryBtn = document.getElementById('btn-human-review-return');

    if (signOffBtn) {
      signOffBtn.onclick = () => this.completeSignOff();
    }

    if (returnSummaryBtn) {
      returnSummaryBtn.onclick = () => {
        window.location.hash = '#summary';
      };
    }
  },

  renderVerificationPanel() {
    const container = document.getElementById('human-review-items-container');
    const user = Auth.getUser() || { name: 'Rajesh Sharma', employeeId: 'EMP-8842' };
    const reviewerNameEl = document.getElementById('human-reviewer-name');
    const reviewerTimestampEl = document.getElementById('human-reviewer-timestamp');

    if (reviewerNameEl) reviewerNameEl.textContent = `${user.name} (${user.employeeId || 'EMP-8842'})`;
    if (reviewerTimestampEl) reviewerTimestampEl.textContent = Utils.formatDate(new Date());

    if (!container) return;

    const sample = this.activeInspection.sampleId
      ? MockData.sampleProducts.find(s => s.id === this.activeInspection.sampleId)
      : MockData.sampleProducts[1]; // GlowCare (has low confidence items)

    const lowConfidenceFields = [
      {
        field: 'Importer / Packer Address',
        ruleId: 'LMPC-R6-1A',
        originalOcr: 'BioSkin Labs Co Ltd, Bangk0k [LOW CONTRAST]',
        aiSuggestion: 'BioSkin Laboratories Co. Ltd., 88 Sukhumvit Road, Bangkok 10110, Thailand',
        confidence: 58,
        imageSlice: (this.activeInspection.images && this.activeInspection.images[0] && this.activeInspection.images[0].dataUrl) || (sample && sample.image)
      },
      {
        field: 'Consumer Care Helpline Number',
        ruleId: 'LMPC-R6-1F',
        originalOcr: '+91-33-2289XXXX [FAINT INK]',
        aiSuggestion: '+91-33-22895500',
        confidence: 54,
        imageSlice: (this.activeInspection.images && this.activeInspection.images[0] && this.activeInspection.images[0].dataUrl) || (sample && sample.image)
      }
    ];

    container.innerHTML = lowConfidenceFields
      .map((item, idx) => `
        <div class="gov-card mb-3 p-3 border-warning">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
              <strong class="text-primary">${Utils.escapeHtml(item.field)}</strong>
              <span class="badge bg-secondary ms-2">${Utils.escapeHtml(item.ruleId)}</span>
            </div>
            ${Utils.renderConfidenceMeter(item.confidence)}
          </div>

          <div class="row g-3 align-items-center">
            <div class="col-md-4">
              <label class="form-hint-text fw-bold">RAW OCR EXTRACT</label>
              <div class="p-2 bg-light border rounded font-monospace" style="font-size:0.8rem; color:#dc2626;">
                ${Utils.escapeHtml(item.originalOcr)}
              </div>
            </div>

            <div class="col-md-4">
              <label class="form-hint-text fw-bold text-success">AI PROPOSED METROLOGY VALUE</label>
              <div class="p-2 bg-success-subtle border border-success-subtle rounded text-success fw-semibold" style="font-size:0.8rem;">
                ${Utils.escapeHtml(item.aiSuggestion)}
              </div>
            </div>

            <div class="col-md-4">
              <label class="form-hint-text fw-bold text-primary">INSPECTOR FINAL VERIFIED VALUE</label>
              <input type="text" class="form-control-gov" id="verified-val-${idx}" value="${Utils.escapeHtml(item.aiSuggestion)}" />
            </div>
          </div>

          <div class="mt-2 d-flex justify-content-end gap-2">
            <button class="btn-gov btn-gov-sm btn-gov-outline-primary" onclick="HumanVerification.useAiValue(${idx}, '${Utils.escapeHtml(item.aiSuggestion)}')">
              <i class="bi bi-magic"></i> Accept AI Suggestion
            </button>
          </div>
        </div>
      `)
      .join('');
  },

  useAiValue(idx, val) {
    const input = document.getElementById(`verified-val-${idx}`);
    if (input) {
      input.value = val;
      UI.showToast('success', 'Accepted', 'AI suggestion copied to verified field.');
    }
  },

  async completeSignOff() {
    const notes = document.getElementById('human-review-notes');
    const notesVal = notes ? notes.value : '';

    const user = Auth.getUser() || { name: 'Inspector Officer', employeeId: 'EMP-8842' };

    this.activeInspection.humanReviewed = true;
    this.activeInspection.reviewedBy = `${user.name} (${user.employeeId})`;
    this.activeInspection.reviewDate = new Date().toISOString();
    this.activeInspection.reviewNotes = notesVal;
    this.activeInspection.reviewStatus = 'Human Verified & Approved';

    // Upgrade status if previously in review
    if (this.activeInspection.complianceStatus === 'REVIEW REQUIRED') {
      this.activeInspection.complianceStatus = 'COMPLIANT';
      this.activeInspection.complianceScore = 96;
    }

    Storage.set(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION, this.activeInspection);

    UI.showToast('success', 'Sign-off Recorded', 'Audit verification recorded with digital officer seal.');

    setTimeout(() => {
      window.location.hash = '#summary';
    }, 600);
  }
};
