/**
 * Smart Legal Metrology Inspection & Compliance System
 * Violations & Visual Evidence Controller
 */

const Violations = {
  activeInspection: null,
  violationsList: [],

  init() {
    this.activeInspection = Storage.get(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION) || {};
    this.violationsList = this.activeInspection.violations || [];
    this.renderViolationsList();
    this.bindEvents();
  },

  bindEvents() {
    const continueBtn = document.getElementById('btn-violations-continue-summary');
    const humanReviewBtn = document.getElementById('btn-violations-human-review');

    if (continueBtn) {
      continueBtn.onclick = () => {
        window.location.hash = '#summary';
      };
    }

    if (humanReviewBtn) {
      humanReviewBtn.onclick = () => {
        window.location.hash = '#human-verification';
      };
    }
  },

  renderViolationsList() {
    const container = document.getElementById('violations-evidence-container');
    const emptyState = document.getElementById('violations-empty-state');
    const countBadge = document.getElementById('violations-total-count-badge');
    if (!container) return;

    if (countBadge) countBadge.textContent = `${this.violationsList.length} Violations`;

    if (this.violationsList.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const sample = this.activeInspection.sampleId
      ? MockData.sampleProducts.find(s => s.id === this.activeInspection.sampleId)
      : MockData.sampleProducts[0];

    const previewImgSrc = (this.activeInspection.images && this.activeInspection.images[0] && this.activeInspection.images[0].dataUrl) || (sample && sample.image) || '';

    container.innerHTML = this.violationsList
      .map((vio, index) => `
        <div class="violation-evidence-card" id="violation-card-${index}">
          <div class="violation-evidence-header">
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-danger font-monospace" style="font-size:0.8rem;">${Utils.escapeHtml(vio.id)}</span>
              <strong>${Utils.escapeHtml(vio.category || 'Statutory Violation')}</strong>
              <span class="badge bg-dark font-monospace">${Utils.escapeHtml(vio.ruleId)}</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              ${Utils.renderSeverityBadge(vio.severity || 'Critical')}
              <span class="badge bg-warning text-dark font-monospace" id="vio-status-badge-${index}">${Utils.escapeHtml(vio.status || 'Under Review')}</span>
            </div>
          </div>

          <div class="violation-evidence-body">
            <div>
              <div class="fw-bold mb-1" style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">
                <i class="bi bi-camera-fill"></i> Label Photographic Evidence
              </div>
              <img src="${previewImgSrc}" alt="Evidence" class="violation-crop-preview" />
              <div class="form-hint-text mt-1 text-center">Digitally stamped &amp; geo-tagged</div>
            </div>

            <div>
              <div class="evidence-diff-box">
                <div>
                  <div class="evidence-diff-label text-danger">
                    <i class="bi bi-x-circle-fill"></i> Detected Package Value
                  </div>
                  <div class="evidence-diff-val text-danger font-monospace">
                    "${Utils.escapeHtml(vio.detectedEvidence)}"
                  </div>
                </div>
                <div>
                  <div class="evidence-diff-label text-success">
                    <i class="bi bi-check-circle-fill"></i> Statutory Requirement
                  </div>
                  <div class="evidence-diff-val text-success">
                    ${Utils.escapeHtml(vio.expectedCondition)}
                  </div>
                </div>
              </div>

              <div class="mb-2" style="font-size:0.85rem;">
                <strong>Statutory Ground:</strong>
                <p class="mb-1 text-secondary">${Utils.escapeHtml(vio.explanation)}</p>
              </div>

              <div class="mb-3" style="font-size:0.85rem;">
                <strong>Recommended Enforcement Action:</strong>
                <p class="mb-0 text-primary fw-semibold">${Utils.escapeHtml(vio.recommendedAction)}</p>
              </div>

              <div class="form-group mb-3">
                <label class="form-label-gov" style="font-size:0.78rem;">Inspector Findings &amp; Seizure Remarks</label>
                <textarea class="form-control-gov" 
                          rows="2" 
                          id="vio-remarks-${index}" 
                          placeholder="Enter on-site verification notes, seized batch numbers, or remarks...">${Utils.escapeHtml(vio.inspectorRemarks || '')}</textarea>
              </div>

              <div class="d-flex flex-wrap gap-2">
                <button class="btn-gov btn-gov-danger btn-gov-sm" onclick="Violations.confirmViolation(${index})">
                  <i class="bi bi-check-circle-fill"></i> Confirm &amp; Issue Violation Notice
                </button>
                <button class="btn-gov btn-gov-warning btn-gov-sm" onclick="Violations.requestManualReview(${index})">
                  <i class="bi bi-person-check-fill"></i> Escalate to Senior Inspector
                </button>
                <button class="btn-gov btn-gov-secondary btn-gov-sm" onclick="Violations.markFalsePositive(${index})">
                  <i class="bi bi-shield-x"></i> Mark as False Positive
                </button>
              </div>
            </div>
          </div>
        </div>
      `)
      .join('');
  },

  confirmViolation(index) {
    const remarksEl = document.getElementById(`vio-remarks-${index}`);
    const remarks = remarksEl ? remarksEl.value : '';

    this.violationsList[index].status = 'Confirmed Violation';
    this.violationsList[index].inspectorRemarks = remarks;
    this.saveViolations();

    const statusBadge = document.getElementById(`vio-status-badge-${index}`);
    if (statusBadge) {
      statusBadge.className = 'badge bg-danger font-monospace';
      statusBadge.textContent = 'Confirmed Violation';
    }

    UI.showToast('success', 'Violation Confirmed', `Violation ${this.violationsList[index].id} confirmed for notice issuance.`);
  },

  requestManualReview(index) {
    this.violationsList[index].status = 'Escalated for Senior Review';
    this.saveViolations();

    const statusBadge = document.getElementById(`vio-status-badge-${index}`);
    if (statusBadge) {
      statusBadge.className = 'badge bg-primary font-monospace';
      statusBadge.textContent = 'Escalated for Senior Review';
    }

    UI.showToast('info', 'Escalated', `Case escalated to Senior Metrology Officer.`);
  },

  async markFalsePositive(index) {
    const confirmed = await UI.confirm({
      title: 'Mark as False Positive?',
      message: 'Are you sure this detection is a false positive based on manual physical package inspection?',
      confirmText: 'Mark False Positive',
      confirmBtnClass: 'btn-gov-warning'
    });

    if (confirmed) {
      this.violationsList[index].status = 'False Positive (Overridden)';
      this.saveViolations();

      const statusBadge = document.getElementById(`vio-status-badge-${index}`);
      if (statusBadge) {
        statusBadge.className = 'badge bg-secondary font-monospace';
        statusBadge.textContent = 'False Positive';
      }

      UI.showToast('warning', 'Overridden', 'Violation flagged as false positive by authorized inspector.');
    }
  },

  saveViolations() {
    this.activeInspection.violations = this.violationsList;
    Storage.set(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION, this.activeInspection);
  }
};
