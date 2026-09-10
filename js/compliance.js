/**
 * Smart Legal Metrology Inspection & Compliance System
 * Legal Metrology (Packaged Commodities) Rules 2011 Compliance Evaluator
 */

const Compliance = {
  activeInspection: null,
  complianceResult: null,

  init() {
    this.activeInspection = Storage.get(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION) || {};
    this.evaluateCompliance();
    this.bindEvents();
  },

  async evaluateCompliance() {
    UI.showLoader('Evaluating Rules against Legal Metrology (Packaged Commodities) Rules, 2011...');

    try {
      const response = await API.post(CONFIG.ENDPOINTS.COMPLIANCE_CHECK, {
        inspectionId: this.activeInspection.id,
        extractedFields: this.activeInspection.aiExtracted
      });

      UI.hideLoader();

      if (response && response.success) {
        this.complianceResult = {
          score: this.activeInspection.complianceScore || response.complianceScore,
          status: this.activeInspection.complianceStatus || response.complianceStatus,
          ruleChecks: this.activeInspection.ruleChecks || response.ruleChecks,
          violations: this.activeInspection.violations || response.violations
        };

        // Update active draft
        this.activeInspection.complianceScore = this.complianceResult.score;
        this.activeInspection.complianceStatus = this.complianceResult.status;
        this.activeInspection.ruleChecks = this.complianceResult.ruleChecks;
        this.activeInspection.violations = this.complianceResult.violations;
        this.activeInspection.violationsCount = (this.complianceResult.violations || []).length;
        Storage.set(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION, this.activeInspection);

        this.renderComplianceView();
      }
    } catch (err) {
      UI.hideLoader();
      UI.showToast('error', 'Compliance Evaluation Error', err.message);
    }
  },

  bindEvents() {
    const reviewViolationsBtn = document.getElementById('btn-compliance-review-violations');
    const viewSummaryBtn = document.getElementById('btn-compliance-view-summary');
    const filterSelect = document.getElementById('compliance-rule-filter');

    if (reviewViolationsBtn) {
      reviewViolationsBtn.onclick = () => {
        window.location.hash = '#violations';
      };
    }

    if (viewSummaryBtn) {
      viewSummaryBtn.onclick = () => {
        window.location.hash = '#summary';
      };
    }

    if (filterSelect) {
      filterSelect.onchange = (e) => {
        this.filterRuleChecks(e.target.value);
      };
    }
  },

  renderComplianceView() {
    const scoreValEl = document.getElementById('compliance-score-number');
    const scoreCircleEl = document.getElementById('compliance-score-circle');
    const statusTextEl = document.getElementById('compliance-status-verdict');
    const passedCountEl = document.getElementById('compliance-kpi-passed');
    const failedCountEl = document.getElementById('compliance-kpi-failed');
    const reviewCountEl = document.getElementById('compliance-kpi-review');
    const warningsCountEl = document.getElementById('compliance-kpi-warnings');
    const rulesListEl = document.getElementById('compliance-rules-list-container');
    const violationAlertBanner = document.getElementById('compliance-violations-alert');

    const { score, status, ruleChecks, violations } = this.complianceResult;

    if (scoreValEl) scoreValEl.textContent = `${score}%`;
    if (scoreCircleEl) {
      scoreCircleEl.style.borderColor = status === 'COMPLIANT' ? '#10b981' : (status === 'NON-COMPLIANT' ? '#ef4444' : '#f59e0b');
    }

    if (statusTextEl) {
      statusTextEl.innerHTML = `
        <div class="d-flex align-items-center gap-2 mb-1">
          <span style="font-size:1.4rem; font-weight:800;">VERDICT:</span>
          ${Utils.renderStatusBadge(status)}
        </div>
        <p class="text-light mb-0" style="font-size:0.85rem;">
          ${status === 'COMPLIANT' ? 'All mandatory statutory declarations under LMPC Rules 2011 are verified.' :
            (status === 'NON-COMPLIANT' ? 'One or more statutory violations detected. Enforcement action recommended.' :
             'Low optical confidence detected on one or more declarations. Human verification required before final sign-off.')}
        </p>
      `;
    }

    // Counts
    const passed = ruleChecks.filter(r => r.status === 'PASSED').length;
    const failed = ruleChecks.filter(r => r.status === 'FAILED').length;
    const review = ruleChecks.filter(r => r.status === 'REVIEW REQUIRED').length;
    const warnings = ruleChecks.filter(r => r.status === 'WARNING').length;

    if (passedCountEl) passedCountEl.textContent = passed;
    if (failedCountEl) failedCountEl.textContent = failed;
    if (reviewCountEl) reviewCountEl.textContent = review;
    if (warningsCountEl) warningsCountEl.textContent = warnings;

    if (violationAlertBanner) {
      if (violations && violations.length > 0) {
        violationAlertBanner.style.display = 'flex';
        violationAlertBanner.querySelector('.violation-alert-text').innerHTML = `
          <strong>${violations.length} Statutory Violation(s) Identified:</strong> Immediate attention required under Section 36(1) of Legal Metrology Act, 2009.
        `;
      } else {
        violationAlertBanner.style.display = 'none';
      }
    }

    this.renderRulesList(ruleChecks);
  },

  renderRulesList(rules) {
    const container = document.getElementById('compliance-rules-list-container');
    if (!container) return;

    if (!rules || rules.length === 0) {
      container.innerHTML = '<div class="text-muted p-4 text-center">No rule checks matching selected filter.</div>';
      return;
    }

    container.innerHTML = rules
      .map((r, idx) => `
        <div class="compliance-rule-accordion-item">
          <div class="compliance-rule-header" data-bs-toggle="collapse" data-bs-target="#rule-collapse-${idx}">
            <div class="d-flex align-items-center gap-3">
              <span class="badge bg-secondary font-monospace" style="font-size:0.75rem;">${Utils.escapeHtml(r.ruleId)}</span>
              <div>
                <strong style="font-size:0.88rem; color:var(--text-primary);">${Utils.escapeHtml(r.name)}</strong>
              </div>
            </div>
            <div class="d-flex align-items-center gap-3">
              ${Utils.renderConfidenceMeter(r.confidence)}
              ${Utils.renderStatusBadge(r.status)}
              <i class="bi bi-chevron-down text-muted" style="font-size:0.75rem;"></i>
            </div>
          </div>
          <div id="rule-collapse-${idx}" class="collapse ${r.status !== 'PASSED' ? 'show' : ''}">
            <div class="compliance-rule-body">
              <div class="d-flex align-items-start gap-2 mb-2">
                <i class="bi bi-info-circle text-primary mt-1"></i>
                <div>
                  <strong>Statutory Analysis &amp; Finding:</strong>
                  <div class="mt-1">${Utils.escapeHtml(r.explanation)}</div>
                </div>
              </div>
              <div class="text-muted mt-2" style="font-size:0.75rem;">
                <i class="bi bi-shield-check"></i> Standard Regulation Reference: Legal Metrology (Packaged Commodities) Rules, 2011.
              </div>
            </div>
          </div>
        </div>
      `)
      .join('');
  },

  filterRuleChecks(filterVal) {
    if (!this.complianceResult || !this.complianceResult.ruleChecks) return;
    if (filterVal === 'ALL') {
      this.renderRulesList(this.complianceResult.ruleChecks);
    } else {
      const filtered = this.complianceResult.ruleChecks.filter(r => r.status === filterVal);
      this.renderRulesList(filtered);
    }
  }
};
