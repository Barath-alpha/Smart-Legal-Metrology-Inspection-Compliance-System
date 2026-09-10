/**
 * Smart Legal Metrology Inspection & Compliance System
 * AI Extracted Structured Fields & Metrology Entity Parser
 */

const AIAnalysis = {
  activeInspection: null,
  extractedFields: {},
  hasUnsavedChanges: false,

  init() {
    this.activeInspection = Storage.get(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION) || {};
    this.loadExtractedData();
    this.bindEvents();
  },

  async loadExtractedData() {
    UI.showLoader('Analyzing Legal Metrology Declarations with AI Engine...');

    try {
      const response = await API.post(CONFIG.ENDPOINTS.AI_EXTRACT, {
        inspectionId: this.activeInspection.id,
        rawOcrText: this.activeInspection.rawOcrText
      });

      UI.hideLoader();

      if (response && response.success) {
        // Use existing modified fields if present in active inspection draft, else API response
        this.extractedFields = (this.activeInspection.aiExtracted) || response.extractedFields;
        this.renderFieldsGrid();
      }
    } catch (err) {
      UI.hideLoader();
      UI.showToast('error', 'AI Extraction Error', err.message);
    }
  },

  bindEvents() {
    const saveChangesBtn = document.getElementById('btn-save-ai-edits');
    const continueBtn = document.getElementById('btn-ai-continue-compliance');

    if (saveChangesBtn) {
      saveChangesBtn.onclick = () => this.saveChanges();
    }

    if (continueBtn) {
      continueBtn.onclick = () => {
        if (this.hasUnsavedChanges) {
          this.saveChanges();
        }
        window.location.hash = '#compliance';
      };
    }
  },

  renderFieldsGrid() {
    const container = document.getElementById('ai-fields-container');
    const unsavedBanner = document.getElementById('ai-unsaved-banner');
    if (!container) return;

    if (unsavedBanner) {
      unsavedBanner.style.display = this.hasUnsavedChanges ? 'flex' : 'none';
    }

    const fieldMeta = [
      { key: 'productName', label: 'Product Name / Brand', icon: 'bi-box-seam', hint: 'Rule 6(1)(b) Generic Name' },
      { key: 'category', label: 'Commodity Category', icon: 'bi-tags', hint: 'Standard commodity classification' },
      { key: 'manufacturer', label: 'Manufacturer / Packer / Importer Address', icon: 'bi-geo-alt', hint: 'Rule 6(1)(a) Full physical address with PIN' },
      { key: 'netQuantity', label: 'Net Quantity', icon: 'bi-speedometer2', hint: 'Rule 6(1)(c) Standard metric units (g, kg, ml, l, N)' },
      { key: 'mrp', label: 'Maximum Retail Price (MRP)', icon: 'bi-currency-rupee', hint: 'Rule 6(1)(e) Must state "incl. of all taxes"' },
      { key: 'mfgDate', label: 'Month & Year of Packing / Import', icon: 'bi-calendar3', hint: 'Rule 6(1)(d) MM/YYYY format' },
      { key: 'unitSalePrice', label: 'Unit Sale Price (USP)', icon: 'bi-calculator', hint: 'Rule 6(1)(da) Price per g/kg/ml/l/piece' },
      { key: 'customerCare', label: 'Consumer Redressal Contact', icon: 'bi-headset', hint: 'Rule 6(1)(f) Email and Telephone helpline' },
      { key: 'countryOfOrigin', label: 'Country of Origin', icon: 'bi-globe', hint: 'Rule 6(1)(g) Mandatory for imported goods' }
    ];

    container.innerHTML = fieldMeta
      .map(meta => {
        const fieldData = this.extractedFields[meta.key] || { value: '', confidence: 0, status: 'Missing' };
        const isModified = fieldData.status === 'Modified';
        const isMissing = fieldData.status === 'Missing' || !fieldData.value;
        const isLow = fieldData.confidence < 70;

        return `
          <div class="ai-field-card ${isModified ? 'modified' : ''}" id="field-card-${meta.key}">
            <div class="ai-field-header">
              <div class="d-flex align-items-center gap-2">
                <i class="bi ${meta.icon} text-primary"></i>
                <span class="ai-field-name">${Utils.escapeHtml(meta.label)}</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                ${Utils.renderConfidenceMeter(fieldData.confidence || 90)}
                <span class="status-badge ${isMissing ? 'non-compliant' : (isLow ? 'review' : (isModified ? 'neutral' : 'compliant'))}" style="font-size:0.68rem; padding:0.15rem 0.45rem;">
                  ${Utils.escapeHtml(fieldData.status || 'Extracted')}
                </span>
              </div>
            </div>

            <div class="ai-field-val-container">
              <input type="text" 
                     class="ai-field-input" 
                     id="input-${meta.key}" 
                     data-key="${meta.key}" 
                     value="${Utils.escapeHtml(fieldData.value || '')}" 
                     placeholder="Not detected on package (Click to fill manually)" />
              <button class="btn-gov btn-gov-secondary btn-gov-sm" title="Edit Field" onclick="document.getElementById('input-${meta.key}').focus()">
                <i class="bi bi-pencil-square"></i>
              </button>
            </div>
            <div class="form-hint-text">${Utils.escapeHtml(meta.hint)}</div>
          </div>
        `;
      })
      .join('');

    // Attach inline edit handlers
    container.querySelectorAll('.ai-field-input').forEach(input => {
      input.oninput = (e) => {
        const key = e.target.dataset.key;
        this.markFieldModified(key, e.target.value);
      };
      input.onfocus = () => input.classList.add('editing');
      input.onblur = () => input.classList.remove('editing');
    });
  },

  markFieldModified(key, newValue) {
    if (!this.extractedFields[key]) {
      this.extractedFields[key] = { value: '', confidence: 100, status: 'Modified' };
    }
    this.extractedFields[key].value = newValue;
    this.extractedFields[key].status = 'Modified';
    this.extractedFields[key].confidence = 100; // Human confirmed
    this.hasUnsavedChanges = true;

    const card = document.getElementById(`field-card-${key}`);
    if (card) card.classList.add('modified');

    const unsavedBanner = document.getElementById('ai-unsaved-banner');
    if (unsavedBanner) unsavedBanner.style.display = 'flex';
  },

  saveChanges() {
    this.activeInspection.aiExtracted = this.extractedFields;
    Storage.set(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION, this.activeInspection);
    this.hasUnsavedChanges = false;

    const unsavedBanner = document.getElementById('ai-unsaved-banner');
    if (unsavedBanner) unsavedBanner.style.display = 'none';

    UI.showToast('success', 'Changes Saved', 'AI extracted metrology declarations updated.');
  }
};
