/**
 * Smart Legal Metrology Inspection & Compliance System
 * OCR Result & Bounding Box Workspace Controller
 */

const OCR = {
  currentOcrData: null,
  activeInspection: null,

  init() {
    this.activeInspection = Storage.get(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION) || {};
    this.loadOcrData();
    this.bindEvents();
  },

  async loadOcrData() {
    UI.showLoader('Extracting Optical Characters from Packaging...');

    try {
      const response = await API.post(CONFIG.ENDPOINTS.OCR_PROCESS, {
        inspectionId: this.activeInspection.id,
        image: (this.activeInspection.images && this.activeInspection.images[0]) || null
      });

      UI.hideLoader();

      if (response && response.success) {
        this.currentOcrData = response;
        this.renderOcrWorkspace();
      } else {
        throw new Error('OCR extraction failed.');
      }
    } catch (err) {
      UI.hideLoader();
      UI.showToast('error', 'OCR Error', err.message);
    }
  },

  bindEvents() {
    const copyBtn = document.getElementById('btn-copy-ocr-text');
    const continueBtn = document.getElementById('btn-ocr-continue-ai');
    const textarea = document.getElementById('ocr-raw-text-input');

    if (copyBtn) {
      copyBtn.onclick = () => {
        if (textarea) {
          navigator.clipboard.writeText(textarea.value);
          UI.showToast('success', 'Copied', 'OCR text copied to clipboard.');
        }
      };
    }

    if (textarea) {
      textarea.oninput = () => {
        this.updateStats();
        // Save live edits back to active inspection draft
        if (this.activeInspection) {
          this.activeInspection.rawOcrText = textarea.value;
          Storage.set(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION, this.activeInspection);
        }
      };
    }

    if (continueBtn) {
      continueBtn.onclick = () => {
        window.location.hash = '#ai-analysis';
      };
    }
  },

  renderOcrWorkspace() {
    const previewImg = document.getElementById('ocr-image-preview');
    const textarea = document.getElementById('ocr-raw-text-input');
    const confidenceBadge = document.getElementById('ocr-confidence-badge');
    const timeBadge = document.getElementById('ocr-time-badge');
    const langBadge = document.getElementById('ocr-lang-badge');
    const candidateContainer = document.getElementById('ocr-candidate-tags-container');

    const sample = this.activeInspection.sampleId
      ? MockData.sampleProducts.find(s => s.id === this.activeInspection.sampleId)
      : MockData.sampleProducts[0];

    const ocrText = this.activeInspection.rawOcrText || this.currentOcrData.ocrText || sample.rawOcrText;
    const confidence = this.activeInspection.ocrConfidence || this.currentOcrData.confidence || sample.ocrConfidence;
    const timeMs = this.currentOcrData.processingTimeMs || sample.ocrTimeMs;

    if (previewImg) {
      const imgObj = this.activeInspection.images && this.activeInspection.images[0];
      previewImg.src = (imgObj && imgObj.dataUrl) || sample.image;
      previewImg.onload = () => {
        this.drawBoundingBoxes(sample.boundingBoxes || this.currentOcrData.boundingBoxes);
      };
    }

    if (textarea) textarea.value = ocrText;
    if (confidenceBadge) confidenceBadge.innerHTML = Utils.renderConfidenceMeter(confidence);
    if (timeBadge) timeBadge.textContent = `${timeMs} ms`;
    if (langBadge) langBadge.textContent = this.currentOcrData.language || 'English (IN)';

    // Candidate detected fields
    if (candidateContainer) {
      const candidates = [
        { label: 'MRP Candidate', val: 'Rs. 65.00' },
        { label: 'Net Qty', val: '200 g' },
        { label: 'Packing Date', val: '08/2026' },
        { label: 'FSSAI Lic', val: '10014022002345' },
        { label: 'Consumer Helpline', val: '1800-200-9988' }
      ];

      candidateContainer.innerHTML = candidates
        .map(c => `<span class="ocr-candidate-tag" title="Click to insert at cursor"><i class="bi bi-tag-fill"></i> ${Utils.escapeHtml(c.label)}: <strong>${Utils.escapeHtml(c.val)}</strong></span>`)
        .join('');
    }

    this.updateStats();
  },

  drawBoundingBoxes(boxes = []) {
    const canvas = document.getElementById('ocr-bbox-canvas');
    const img = document.getElementById('ocr-image-preview');
    if (!canvas || !img) return;

    canvas.width = img.clientWidth || 500;
    canvas.height = img.clientHeight || 350;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / (img.naturalWidth || 600);
    const scaleY = canvas.height / (img.naturalHeight || 400);

    boxes.forEach((item, i) => {
      const [x, y, w, h] = item.box;
      const bx = x * scaleX;
      const by = y * scaleY;
      const bw = w * scaleX;
      const bh = h * scaleY;

      ctx.strokeStyle = item.confidence < 75 ? '#f59e0b' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.fillStyle = item.confidence < 75 ? 'rgba(245, 158, 11, 0.18)' : 'rgba(56, 189, 248, 0.12)';
      ctx.fillRect(bx, by, bw, bh);

      // Label index tag
      ctx.fillStyle = item.confidence < 75 ? '#d97706' : '#0284c7';
      ctx.fillRect(bx, by - 16, 24, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText(`0${i + 1}`, bx + 4, by - 4);
    });
  },

  updateStats() {
    const textarea = document.getElementById('ocr-raw-text-input');
    const wordCountEl = document.getElementById('ocr-word-count');
    const charCountEl = document.getElementById('ocr-char-count');
    if (!textarea) return;

    const text = textarea.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = textarea.value.length;

    if (wordCountEl) wordCountEl.textContent = `${words} words`;
    if (charCountEl) charCountEl.textContent = `${chars} chars`;
  }
};
