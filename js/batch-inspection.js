/**
 * Smart Legal Metrology Inspection & Compliance System
 * Batch Inspection & Multi-Product Queue Processor
 */

const BatchInspection = {
  isProcessing: false,
  currentIndex: 0,
  batchItems: [],

  init() {
    this.initDefaultBatch();
    this.bindEvents();
    this.renderBatchTable();
  },

  initDefaultBatch() {
    this.batchItems = [
      {
        id: 'BATCH-ITEM-01',
        name: 'NutriCrunch Almond & Honey Cookies (200g)',
        category: 'Packaged Food & Confectionery',
        brand: 'NutriCrunch Foods Ltd',
        image: 'assets/images/label-cookies.svg',
        status: 'Pending',
        progress: 0,
        complianceStatus: 'Pending',
        score: 0,
        violationsCount: 0,
        sampleId: 'SAMPLE-01'
      },
      {
        id: 'BATCH-ITEM-02',
        name: 'GlowCare Herbal Brightening Face Wash (100ml)',
        category: 'Cosmetics & Personal Care',
        brand: 'GlowCare Botanicals Ltd',
        image: 'assets/images/label-facewash.svg',
        status: 'Pending',
        progress: 0,
        complianceStatus: 'Pending',
        score: 0,
        violationsCount: 0,
        sampleId: 'SAMPLE-02'
      },
      {
        id: 'BATCH-ITEM-03',
        name: 'PureDrop Refined Sunflower Cooking Oil (1L)',
        category: 'Edible Oils & Commodities',
        brand: 'PureDrop Agro Refineries',
        image: 'assets/images/label-sunfloweroil.svg',
        status: 'Pending',
        progress: 0,
        complianceStatus: 'Pending',
        score: 0,
        violationsCount: 0,
        sampleId: 'SAMPLE-03'
      },
      {
        id: 'BATCH-ITEM-04',
        name: 'SoundMax Pro Wireless Bluetooth Earbuds',
        category: 'Electronics & Hardware',
        brand: 'SoundMax Digital Ltd',
        image: 'assets/images/label-earbuds.svg',
        status: 'Pending',
        progress: 0,
        complianceStatus: 'Pending',
        score: 0,
        violationsCount: 0,
        sampleId: 'SAMPLE-04'
      },
      {
        id: 'BATCH-ITEM-05',
        name: 'Royal Heritage Aged Basmati Rice (5kg)',
        category: 'Packaged Food & Confectionery',
        brand: 'Royal Agro Mills Ltd',
        image: 'assets/images/label-rice.svg',
        status: 'Pending',
        progress: 0,
        complianceStatus: 'Pending',
        score: 0,
        violationsCount: 0,
        sampleId: 'SAMPLE-05'
      }
    ];
  },

  bindEvents() {
    const startBtn = document.getElementById('btn-batch-start-processing');
    const resetBtn = document.getElementById('btn-batch-reset-queue');
    const exportCsvBtn = document.getElementById('btn-batch-export-csv');
    const uploadInput = document.getElementById('batch-multi-file-input');

    if (startBtn) {
      startBtn.onclick = () => this.startProcessingQueue();
    }
    if (resetBtn) {
      resetBtn.onclick = () => this.resetQueue();
    }
    if (exportCsvBtn) {
      exportCsvBtn.onclick = () => this.exportBatchCsv();
    }
    if (uploadInput) {
      uploadInput.onchange = (e) => this.handleBatchFiles(e.target.files);
    }
  },

  handleBatchFiles(files) {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const newItem = {
        id: `BATCH-ITEM-${Date.now().toString().slice(-4)}-${i + 1}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Market Package Sample',
        brand: 'Unspecified Brand',
        image: URL.createObjectURL(file),
        status: 'Pending',
        progress: 0,
        complianceStatus: 'Pending',
        score: 0,
        violationsCount: 0,
        sampleId: 'SAMPLE-01'
      };
      this.batchItems.push(newItem);
    }

    this.renderBatchTable();
    UI.showToast('success', 'Batch Queue Updated', `${files.length} package items added to queue.`);
  },

  renderBatchTable() {
    const tbody = document.getElementById('batch-table-body');
    const totalEl = document.getElementById('batch-kpi-total');
    const compEl = document.getElementById('batch-kpi-compliant');
    const nonCompEl = document.getElementById('batch-kpi-non-compliant');
    const reviewEl = document.getElementById('batch-kpi-review');
    const overallProgress = document.getElementById('batch-overall-progressbar');

    if (!tbody) return;

    const total = this.batchItems.length;
    const compliant = this.batchItems.filter(i => i.complianceStatus === 'COMPLIANT').length;
    const nonCompliant = this.batchItems.filter(i => i.complianceStatus === 'NON-COMPLIANT').length;
    const review = this.batchItems.filter(i => i.complianceStatus === 'REVIEW REQUIRED').length;
    const completed = this.batchItems.filter(i => i.status === 'Completed').length;

    if (totalEl) totalEl.textContent = total;
    if (compEl) compEl.textContent = compliant;
    if (nonCompEl) nonCompEl.textContent = nonCompliant;
    if (reviewEl) reviewEl.textContent = review;

    if (overallProgress) {
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      overallProgress.style.width = `${pct}%`;
      overallProgress.textContent = `${pct}%`;
    }

    tbody.innerHTML = this.batchItems.map((item, idx) => `
      <tr>
        <td><span class="font-monospace fw-bold">${Utils.escapeHtml(item.id)}</span></td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="${item.image}" alt="Thumb" style="width:36px; height:36px; object-fit:contain; border-radius:4px; border:1px solid #e2e8f0; background:#f8fafc;" />
            <div>
              <div class="fw-bold" style="font-size:0.85rem;">${Utils.escapeHtml(item.name)}</div>
              <div class="small text-muted">${Utils.escapeHtml(item.category)}</div>
            </div>
          </div>
        </td>
        <td style="width:160px;">
          <div class="progress" style="height:8px; margin-bottom:4px;">
            <div class="progress-bar progress-bar-striped ${item.status === 'Processing' ? 'progress-bar-animated bg-primary' : (item.status === 'Completed' ? 'bg-success' : 'bg-secondary')}" style="width: ${item.progress}%"></div>
          </div>
          <span class="badge ${item.status === 'Completed' ? 'bg-success-subtle text-success' : (item.status === 'Processing' ? 'bg-primary-subtle text-primary' : 'bg-light text-muted')} border" style="font-size:0.7rem;">
            ${Utils.escapeHtml(item.status)} (${item.progress}%)
          </span>
        </td>
        <td>
          ${item.complianceStatus === 'Pending' ? '<span class="badge bg-light text-muted border">Pending</span>' : Utils.renderStatusBadge(item.complianceStatus)}
        </td>
        <td>
          ${item.status === 'Completed' ? `<span class="fw-bold font-monospace">${item.score}%</span>` : '<span class="text-muted">-</span>'}
        </td>
        <td>
          ${item.violationsCount > 0 ? `<span class="badge bg-danger">${item.violationsCount} Violations</span>` : (item.status === 'Completed' ? '<span class="badge bg-success">0</span>' : '<span class="text-muted">-</span>')}
        </td>
        <td class="text-end">
          <button class="btn btn-gov btn-gov-sm btn-gov-secondary" onclick="BatchInspection.inspectItem(${idx})" ${item.status !== 'Completed' ? 'disabled' : ''} title="View Dossier">
            <i class="bi bi-eye"></i> View
          </button>
        </td>
      </tr>
    `).join('');
  },

  async startProcessingQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const startBtn = document.getElementById('btn-batch-start-processing');
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Processing Batch...';
    }

    UI.showToast('info', 'Batch Processing Started', `Analyzing ${this.batchItems.length} packaged commodities...`);

    for (let i = 0; i < this.batchItems.length; i++) {
      const item = this.batchItems[i];
      if (item.status === 'Completed') continue;

      item.status = 'Processing';
      item.progress = 20;
      this.renderBatchTable();

      // Step 1: Preprocessing & OCR
      await new Promise(r => setTimeout(r, 220));
      item.progress = 55;
      this.renderBatchTable();

      // Step 2: AI Entity Extraction
      await new Promise(r => setTimeout(r, 220));
      item.progress = 85;
      this.renderBatchTable();

      // Step 3: Compliance Check against LMPC 2011 Rules
      await new Promise(r => setTimeout(r, 200));

      const sample = MockData.sampleProducts.find(s => s.id === item.sampleId) || MockData.sampleProducts[0];
      item.status = 'Completed';
      item.progress = 100;
      item.complianceStatus = sample.complianceStatus || 'COMPLIANT';
      item.score = sample.complianceScore || 90;
      item.violationsCount = (sample.violations || []).length;
      item.violations = sample.violations || [];
      item.aiExtracted = sample.aiExtracted;
      item.ruleChecks = sample.ruleChecks;

      this.renderBatchTable();
    }

    this.isProcessing = false;
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.innerHTML = '<i class="bi bi-play-fill"></i> Process Batch Queue';
    }

    UI.showToast('success', 'Batch Completed', 'All packaged commodities in batch analyzed successfully.');
  },

  inspectItem(index) {
    const item = this.batchItems[index];
    if (!item) return;

    // Set as active inspection and navigate to summary
    Storage.set(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION, {
      id: item.id,
      productName: item.name,
      category: item.category,
      brand: item.brand,
      inspector: 'Rajesh Sharma (EMP-8842)',
      date: new Date().toISOString(),
      location: 'Batch Inspection Facility, Mumbai Zone',
      complianceStatus: item.complianceStatus,
      complianceScore: item.score,
      violationsCount: item.violationsCount,
      violations: item.violations || [],
      aiExtracted: item.aiExtracted,
      ruleChecks: item.ruleChecks,
      images: [{ side: 'Front Label', dataUrl: item.image }]
    });

    // Close batch modal if open
    const modalEl = document.getElementById('batch-inspection-modal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }

    window.location.hash = '#summary';
  },

  resetQueue() {
    this.initDefaultBatch();
    this.renderBatchTable();
    UI.showToast('info', 'Queue Reset', 'Batch inspection queue restored to default samples.');
  },

  exportBatchCsv() {
    const headers = ['Batch ID', 'Product Name', 'Category', 'Brand', 'Status', 'Compliance Verdict', 'Score', 'Violations Count'];
    const rows = this.batchItems.map(item => [
      item.id,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.brand}"`,
      item.status,
      item.complianceStatus,
      `${item.score}%`,
      item.violationsCount
    ]);

    Utils.exportToCsv(`LMPC_Batch_Inspection_${Date.now()}`, headers, rows);
    UI.showToast('success', 'Batch Exported', 'CSV report downloaded successfully.');
  }
};
