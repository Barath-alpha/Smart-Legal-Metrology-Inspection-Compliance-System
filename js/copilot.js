/**
 * Smart Legal Metrology Inspection & Compliance System
 * AI Inspection Copilot Assistant Module
 * Provides contextual statutory explanations and guidance strictly under Legal Metrology Rules, 2011
 */

const Copilot = {
  isOpen: false,
  chatHistory: [],

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const toggleBtn = document.getElementById('btn-toggle-copilot');
    const closeBtn = document.getElementById('copilot-close-btn');
    const backdrop = document.getElementById('copilot-backdrop');
    const form = document.getElementById('copilot-input-form');
    const input = document.getElementById('copilot-chat-input');
    const clearBtn = document.getElementById('copilot-clear-chat-btn');

    if (toggleBtn) {
      toggleBtn.onclick = () => this.toggleDrawer();
    }
    if (closeBtn) {
      closeBtn.onclick = () => this.closeDrawer();
    }
    if (backdrop) {
      backdrop.onclick = () => this.closeDrawer();
    }

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const text = (input ? input.value : '').trim();
        if (text) {
          this.handleUserQuery(text);
          if (input) input.value = '';
        }
      };
    }

    if (clearBtn) {
      clearBtn.onclick = () => this.clearChat();
    }

    // Quick prompt chips
    const chips = document.querySelectorAll('.copilot-quick-chip');
    chips.forEach(chip => {
      chip.onclick = () => {
        const query = chip.dataset.query || chip.textContent.trim();
        this.handleUserQuery(query);
      };
    });
  },

  toggleDrawer() {
    if (this.isOpen) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  },

  openDrawer() {
    const drawer = document.getElementById('copilot-drawer');
    const backdrop = document.getElementById('copilot-backdrop');
    if (drawer) drawer.classList.add('show');
    if (backdrop) backdrop.classList.add('show');
    this.isOpen = true;

    // If chat is empty, send initial contextual greeting
    if (this.chatHistory.length === 0) {
      this.sendInitialGreeting();
    }
  },

  closeDrawer() {
    const drawer = document.getElementById('copilot-drawer');
    const backdrop = document.getElementById('copilot-backdrop');
    if (drawer) drawer.classList.remove('show');
    if (backdrop) backdrop.classList.remove('show');
    this.isOpen = false;
  },

  clearChat() {
    this.chatHistory = [];
    const container = document.getElementById('copilot-messages-container');
    if (container) container.innerHTML = '';
    this.sendInitialGreeting();
  },

  sendInitialGreeting() {
    const active = Storage.get(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION) || {};
    const prodName = active.productName || 'active commodity';
    const status = active.complianceStatus || 'UNDER EVALUATION';

    const greeting = `
      Hello Officer! I am your <strong>LMPC Statutory Inspection Copilot</strong>.<br/><br/>
      I assist with legal compliance analysis, rule explanations, and enforcement procedures under the 
      <strong>Legal Metrology Act, 2009</strong> and <strong>Packaged Commodities Rules, 2011</strong>.<br/><br/>
      Currently inspecting: <strong>${Utils.escapeHtml(prodName)}</strong> (Status: <strong>${Utils.escapeHtml(status)}</strong>).
      How can I assist you with this examination?
    `;

    this.appendBotMessage(greeting);
  },

  handleUserQuery(query) {
    this.appendUserMessage(query);

    // Show typing state
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateLegalAnswer(query);
      this.appendBotMessage(response);
    }, 450);
  },

  generateLegalAnswer(query) {
    const q = query.toLowerCase();
    const active = Storage.get(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION) || {};
    const violations = active.violations || [];
    const ruleChecks = active.ruleChecks || [];
    const fields = active.aiExtracted || {};

    // 1. Why non-compliant or why review required?
    if (q.includes('why') && (q.includes('non-compliant') || q.includes('violation') || q.includes('failed'))) {
      if (violations.length > 0) {
        const vio = violations[0];
        return `
          <strong>Statutory Grounds for Non-Compliance:</strong><br/>
          This product failed rule check <strong>${Utils.escapeHtml(vio.ruleId)}</strong> (${Utils.escapeHtml(vio.category)}).<br/><br/>
          &bull; <strong>Detected on Package:</strong> <span class="text-danger font-monospace">"${Utils.escapeHtml(vio.detectedEvidence)}"</span><br/>
          &bull; <strong>Mandatory Requirement:</strong> <span class="text-success">${Utils.escapeHtml(vio.expectedCondition)}</span><br/>
          &bull; <strong>Legal Basis:</strong> ${Utils.escapeHtml(vio.explanation)}<br/><br/>
          <strong>Recommended Action:</strong> Issue Show-Cause Notice under <strong>Section 36(1)</strong> of Legal Metrology Act, 2009 for non-compliant retail price/declaration.
        `;
      } else if (active.complianceStatus === 'COMPLIANT') {
        return `This commodity has satisfied all statutory checks under Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011 with an overall score of ${active.complianceScore || 100}%. No active violations detected.`;
      }
    }

    // 2. Review required explanation
    if (q.includes('review') || q.includes('faint') || q.includes('obscured') || q.includes('confidence')) {
      return `
        <strong>Basis for Manual Officer Review:</strong><br/>
        Certain optical text regions yielded low OCR confidence scores (&lt;70%), such as manufacturer/importer address or customer service contact digits.<br/><br/>
        <strong>Officer Verification Protocol:</strong><br/>
        1. Examine the physical package label under adequate lighting.<br/>
        2. Navigate to the <strong>Human Verification Desk</strong> tab.<br/>
        3. Enter the verified legible text in the override field.<br/>
        4. Sign off with your official Officer Employee ID to commit the verified record.
      `;
    }

    // 3. Rule 6(1)(e) - MRP & Taxes
    if (q.includes('mrp') || q.includes('tax') || q.includes('6(1)(e)') || q.includes('pricing')) {
      return `
        <strong>Rule 6(1)(e) &ndash; Maximum Retail Price (MRP):</strong><br/>
        Every pre-packaged commodity must declare retail sale price in the statutory format:<br/>
        <div class="p-2 bg-light border rounded mt-2 mb-2 font-monospace" style="font-size:0.85rem;">
          "Maximum Retail Price ₹ xx.xx (inclusive of all taxes)" or "MRP Rs. xx.xx (incl. of all taxes)"
        </div>
        <strong>Critical Note:</strong> Omitting the phrase <em>"(inclusive of all taxes)"</em> or rounding up illegally constitutes a direct compoundable offense under Section 36(1) and Section 18 of the Legal Metrology Act, 2009.
      `;
    }

    // 4. Rule 6(1)(da) - Unit Sale Price
    if (q.includes('unit sale price') || q.includes('usp') || q.includes('6(1)(da)')) {
      return `
        <strong>Rule 6(1)(da) &ndash; Unit Sale Price (USP):</strong><br/>
        Effective from Dec 2022 amendments, packages greater than 1 kg / 1 L, or items sold by number, must declare the Unit Sale Price expressed as:<br/>
        &bull; <strong>Per gram (₹ / g)</strong> or <strong>Per kg (₹ / kg)</strong> for solid weights.<br/>
        &bull; <strong>Per millilitre (₹ / ml)</strong> or <strong>Per litre (₹ / L)</strong> for liquids.<br/>
        &bull; <strong>Per piece / item (₹ / N)</strong> for discrete units.<br/>
        Font size of USP must be at least 50% of the MRP font height.
      `;
    }

    // 5. Rule 8 - Minimum Font Heights
    if (q.includes('font') || q.includes('height') || q.includes('rule 8') || q.includes('numeral') || q.includes('size')) {
      return `
        <strong>Rule 8 Table 1 &ndash; Minimum Font Height of Numerals:</strong><br/>
        &bull; <strong>Net Qty &le; 50 g / ml:</strong> Minimum font height = <strong>1.0 mm</strong><br/>
        &bull; <strong>50 g/ml &lt; Net Qty &le; 200 g / ml:</strong> Minimum font height = <strong>2.0 mm</strong><br/>
        &bull; <strong>200 g/ml &lt; Net Qty &le; 1 kg / L:</strong> Minimum font height = <strong>4.0 mm</strong><br/>
        &bull; <strong>Net Qty &gt; 1 kg / L:</strong> Minimum font height = <strong>6.0 mm</strong><br/>
        All letters must be printed in contrasting color against the packaging background.
      `;
    }

    // 6. Section 36(1) & Penalties
    if (q.includes('penalty') || q.includes('fine') || q.includes('section 36') || q.includes('seizure') || q.includes('act')) {
      return `
        <strong>Statutory Penalties under Legal Metrology Act, 2009:</strong><br/>
        &bull; <strong>Section 36(1) (Non-Standard Package / False Declaration):</strong><br/>
        &nbsp;&nbsp;&bull; First offense: Fine up to <strong>₹ 25,000</strong>.<br/>
        &nbsp;&nbsp;&bull; Second offense: Fine up to <strong>₹ 50,000</strong>.<br/>
        &nbsp;&nbsp;&bull; Subsequent offenses: Fine up to <strong>₹ 1,00,000</strong> or imprisonment up to 1 year, or both.<br/>
        &bull; <strong>Section 18 read with Section 36:</strong> Prohibition on manufacture, packing, or sale of non-compliant packaged commodities.
      `;
    }

    // 7. General LMPC Guidance
    return `
      <strong>Statutory Advisory for ${Utils.escapeHtml(active.productName || 'Inspected Package')}:</strong><br/>
      Under Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011, the principal display panel must contain:<br/>
      1. Name &amp; complete address of Manufacturer/Packer/Importer.<br/>
      2. Generic commodity identity.<br/>
      3. Net quantity in standard metric units.<br/>
      4. Month &amp; Year of manufacture/packing.<br/>
      5. Retail Sale Price (MRP) with "(inclusive of all taxes)".<br/>
      6. Unit Sale Price (USP).<br/>
      7. Consumer Grievance Cell with phone, email &amp; postal address.<br/>
      8. Country of Origin (for imported articles).<br/><br/>
      You may proceed to <strong>Verification</strong> or <strong>Generate Report</strong> from the top navigation.
    `;
  },

  appendUserMessage(text) {
    const container = document.getElementById('copilot-messages-container');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'copilot-msg user';
    div.innerHTML = `<div class="copilot-bubble user">${Utils.escapeHtml(text)}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    this.chatHistory.push({ role: 'user', text });
  },

  appendBotMessage(html) {
    const container = document.getElementById('copilot-messages-container');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'copilot-msg bot';
    div.innerHTML = `
      <div class="copilot-avatar"><i class="bi bi-shield-check"></i></div>
      <div class="copilot-bubble bot">${html}</div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    this.chatHistory.push({ role: 'bot', html });
  },

  showTypingIndicator() {
    const container = document.getElementById('copilot-messages-container');
    if (!container) return;

    const typing = document.createElement('div');
    typing.id = 'copilot-typing-indicator';
    typing.className = 'copilot-msg bot';
    typing.innerHTML = `
      <div class="copilot-avatar"><i class="bi bi-cpu"></i></div>
      <div class="copilot-bubble bot py-2 px-3">
        <span class="spinner-border spinner-border-sm text-primary" role="status"></span>
        <span class="small ms-2 text-muted">Analyzing statutory rules...</span>
      </div>
    `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  },

  hideTypingIndicator() {
    const typing = document.getElementById('copilot-typing-indicator');
    if (typing) typing.remove();
  }
};
