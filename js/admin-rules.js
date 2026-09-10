/**
 * Smart Legal Metrology Inspection & Compliance System
 * Rules Catalog Management Controller (Admin)
 */

const AdminRules = {
  rules: [],

  init() {
    this.loadRules();
    this.bindEvents();
  },

  loadRules() {
    this.rules = Storage.get(CONFIG.STORAGE_KEYS.RULES_LIST) || MockData.rules;
    this.renderRulesTable();
  },

  bindEvents() {
    const searchInput = document.getElementById('rules-search-input');
    const categoryFilter = document.getElementById('rules-filter-category');
    const addRuleBtn = document.getElementById('btn-add-new-rule');
    const saveRuleModalBtn = document.getElementById('btn-save-rule-modal');

    if (searchInput) {
      searchInput.oninput = Utils.debounce(() => this.filterRules(), 200);
    }
    if (categoryFilter) {
      categoryFilter.onchange = () => this.filterRules();
    }
    if (addRuleBtn) {
      addRuleBtn.onclick = () => this.openRuleModal();
    }
    if (saveRuleModalBtn) {
      saveRuleModalBtn.onclick = () => this.saveRuleFromModal();
    }
  },

  filterRules() {
    const search = (document.getElementById('rules-search-input')?.value || '').toLowerCase();
    const category = document.getElementById('rules-filter-category')?.value || 'ALL';

    const filtered = this.rules.filter(r => {
      const matchSearch = !search ||
        r.id.toLowerCase().includes(search) ||
        r.title.toLowerCase().includes(search) ||
        r.description.toLowerCase().includes(search);

      const matchCategory = category === 'ALL' || r.category === category;
      return matchSearch && matchCategory;
    });

    this.renderRulesTable(filtered);
  },

  renderRulesTable(rulesList = this.rules) {
    const tbody = document.getElementById('rules-table-body');
    const countEl = document.getElementById('rules-total-count');
    if (!tbody) return;

    if (countEl) countEl.textContent = `${rulesList.length} Rules Configured`;

    if (rulesList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center p-4 text-muted">No statutory rules found matching search.</td></tr>`;
      return;
    }

    tbody.innerHTML = rulesList
      .map((r, idx) => `
        <tr>
          <td class="font-monospace fw-bold text-primary">${Utils.escapeHtml(r.id)}</td>
          <td>
            <div class="fw-bold">${Utils.escapeHtml(r.title)}</div>
            <div class="form-hint-text text-truncate" style="max-width:320px;">${Utils.escapeHtml(r.description)}</div>
          </td>
          <td><span class="badge bg-light text-dark border">${Utils.escapeHtml(r.category)}</span></td>
          <td style="font-size:0.75rem; color:var(--text-muted);">${Utils.escapeHtml(r.legalReference)}</td>
          <td>${Utils.renderSeverityBadge(r.severity)}</td>
          <td>
            <span class="status-badge ${r.status === 'Active' ? 'compliant' : 'neutral'}">
              ${Utils.escapeHtml(r.status)}
            </span>
          </td>
          <td class="text-end">
            <button class="btn-gov btn-gov-sm btn-gov-secondary" onclick="AdminRules.editRule('${r.id}')" title="Edit Rule">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-gov btn-gov-sm ${r.status === 'Active' ? 'btn-gov-danger' : 'btn-gov-success'}" onclick="AdminRules.toggleStatus('${r.id}')" title="Toggle Status">
              <i class="bi ${r.status === 'Active' ? 'bi-pause-circle' : 'bi-play-circle'}"></i>
            </button>
          </td>
        </tr>
      `)
      .join('');
  },

  openRuleModal(rule = null) {
    const modalEl = document.getElementById('admin-rule-modal');
    if (!modalEl) return;

    const isEdit = !!rule;
    modalEl.querySelector('#rule-modal-title').textContent = isEdit ? `Edit Rule ${rule.id}` : 'Add New Legal Metrology Rule';
    modalEl.querySelector('#modal-rule-id').value = rule ? rule.id : `LMPC-R${Math.floor(10 + Math.random() * 90)}`;
    modalEl.querySelector('#modal-rule-title').value = rule ? rule.title : '';
    modalEl.querySelector('#modal-rule-category').value = rule ? rule.category : 'Mandatory Declarations';
    modalEl.querySelector('#modal-rule-severity').value = rule ? rule.severity : 'High';
    modalEl.querySelector('#modal-rule-legal-ref').value = rule ? rule.legalReference : 'Legal Metrology (Packaged Commodities) Rules, 2011';
    modalEl.querySelector('#modal-rule-desc').value = rule ? rule.description : '';

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  },

  editRule(id) {
    const rule = this.rules.find(r => r.id === id);
    if (rule) this.openRuleModal(rule);
  },

  saveRuleFromModal() {
    const modalEl = document.getElementById('admin-rule-modal');
    if (!modalEl) return;

    const id = modalEl.querySelector('#modal-rule-id').value.trim();
    const title = modalEl.querySelector('#modal-rule-title').value.trim();
    const category = modalEl.querySelector('#modal-rule-category').value;
    const severity = modalEl.querySelector('#modal-rule-severity').value;
    const legalRef = modalEl.querySelector('#modal-rule-legal-ref').value.trim();
    const desc = modalEl.querySelector('#modal-rule-desc').value.trim();

    if (!id || !title || !desc) {
      UI.showToast('error', 'Validation Error', 'Rule ID, Title, and Description are required.');
      return;
    }

    const existingIdx = this.rules.findIndex(r => r.id === id);
    const ruleObj = {
      id,
      title,
      category,
      severity,
      legalReference: legalRef,
      description: desc,
      version: '2024.2',
      status: 'Active',
      effectiveDate: new Date().toISOString().split('T')[0]
    };

    if (existingIdx >= 0) {
      this.rules[existingIdx] = { ...this.rules[existingIdx], ...ruleObj };
      UI.showToast('success', 'Rule Updated', `Rule ${id} updated successfully.`);
    } else {
      this.rules.unshift(ruleObj);
      UI.showToast('success', 'Rule Created', `New rule ${id} added to LMPC catalog.`);
    }

    Storage.set(CONFIG.STORAGE_KEYS.RULES_LIST, this.rules);
    this.renderRulesTable();

    const bsModal = bootstrap.Modal.getInstance(modalEl);
    if (bsModal) bsModal.hide();
  },

  toggleStatus(id) {
    const rule = this.rules.find(r => r.id === id);
    if (rule) {
      rule.status = rule.status === 'Active' ? 'Inactive' : 'Active';
      Storage.set(CONFIG.STORAGE_KEYS.RULES_LIST, this.rules);
      this.renderRulesTable();
      UI.showToast('info', 'Status Changed', `Rule ${id} is now ${rule.status}.`);
    }
  }
};
