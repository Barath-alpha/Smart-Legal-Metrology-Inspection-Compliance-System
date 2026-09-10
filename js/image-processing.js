/**
 * Smart Legal Metrology Inspection & Compliance System
 * Image Preprocessing Pipeline Visualizer
 */

const ImageProcessing = {
  stages: [
    { id: 1, name: 'Orientation & Deskewing', desc: 'Detects packaging label tilt and corrects angular skew for optical alignment.' },
    { id: 2, name: 'Perspective & PDP Correction', desc: 'Isolates the Principal Display Panel (PDP) rectangle conforming to Rule 7.' },
    { id: 3, name: 'Adaptive Noise Reduction', desc: 'Filters out packaging specular highlights, reflections, and plastic sheen.' },
    { id: 4, name: 'Contrast & Edge Enhancement', desc: 'Boosts numeral and character edge crispness for low-contrast print.' },
    { id: 5, name: 'Text Region Segmentation', desc: 'Localizes mandatory declaration zones (MRP, Net Qty, Dates, Address).' }
  ],

  async runPipeline() {
    const container = document.getElementById('preprocessing-stages-container');
    const overallProgress = document.getElementById('preprocessing-overall-progress');
    const statusText = document.getElementById('preprocessing-status-text');
    const proceedBtn = document.getElementById('btn-preprocessing-proceed');

    if (!container) return;

    // Render Stage Cards
    container.innerHTML = this.stages
      .map(stage => `
        <div class="preprocessing-stage-card" id="stage-card-${stage.id}">
          <div class="stage-header">
            <span class="stage-number">STAGE 0${stage.id}</span>
            <span class="stage-status-icon" id="stage-icon-${stage.id}"><i class="bi bi-clock text-muted"></i></span>
          </div>
          <div class="stage-title">${Utils.escapeHtml(stage.name)}</div>
          <div class="stage-desc">${Utils.escapeHtml(stage.desc)}</div>
        </div>
      `)
      .join('');

    if (proceedBtn) proceedBtn.disabled = true;

    // Execute stages sequentially
    for (let i = 0; i < this.stages.length; i++) {
      const stage = this.stages[i];
      const card = document.getElementById(`stage-card-${stage.id}`);
      const icon = document.getElementById(`stage-icon-${stage.id}`);

      if (card) card.classList.add('processing');
      if (icon) icon.innerHTML = '<span class="spinner-border spinner-border-sm text-primary" role="status"></span>';
      if (statusText) statusText.textContent = `Running: ${stage.name}...`;

      // Simulated processing duration per stage (250ms - 450ms)
      await new Promise(r => setTimeout(r, 380));

      if (card) {
        card.classList.remove('processing');
        card.classList.add('completed');
      }
      if (icon) icon.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i>';

      const pct = Math.round(((i + 1) / this.stages.length) * 100);
      if (overallProgress) {
        overallProgress.style.width = `${pct}%`;
        overallProgress.setAttribute('aria-valuenow', pct);
      }
    }

    if (statusText) statusText.textContent = 'Image Preprocessing Complete. High optical quality achieved.';
    if (proceedBtn) {
      proceedBtn.disabled = false;
      proceedBtn.focus();
    }

    UI.showToast('success', 'Preprocessing Complete', 'Principal display panel normalized for OCR.');

    // Auto-proceed after short pause
    setTimeout(() => {
      if (window.location.hash.includes('image-processing')) {
        window.location.hash = '#ocr';
      }
    }, 1200);
  }
};
