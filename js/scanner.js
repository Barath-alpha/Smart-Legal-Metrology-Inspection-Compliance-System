/**
 * Smart Legal Metrology Inspection & Compliance System
 * Product Scanner & Camera Capture Controller
 */

const Scanner = {
  activeStream: null,
  facingMode: 'environment', // 'user' or 'environment' (back camera for mobile)
  currentImages: [], // { side: 'Front', dataUrl: string, file: File, quality: object }
  currentSelectedSide: 'Front Label',
  currentRotation: 0,
  currentZoom: 1,

  // Initialize Scanner View
  init() {
    this.bindEvents();
    this.renderThumbnails();
    this.loadActiveInspection();
  },

  loadActiveInspection() {
    const active = Storage.get(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION);
    if (active && active.images && active.images.length > 0) {
      this.currentImages = active.images;
      this.renderThumbnails();
    } else if (this.currentImages.length === 0) {
      // Load first sample product as a pre-populated demo label if empty
      this.loadSampleProduct('SAMPLE-01');
    }
  },

  bindEvents() {
    const startCamBtn = document.getElementById('btn-start-camera');
    const stopCamBtn = document.getElementById('btn-stop-camera');
    const captureBtn = document.getElementById('btn-capture-snapshot');
    const switchCamBtn = document.getElementById('btn-switch-camera');
    const fileInput = document.getElementById('scanner-file-input');
    const dropzone = document.getElementById('scanner-dropzone');
    const analyzeBtn = document.getElementById('btn-analyze-product');
    const sampleSelect = document.getElementById('scanner-sample-select');

    // Image tools buttons
    const rotateBtn = document.getElementById('btn-tool-rotate');
    const zoomInBtn = document.getElementById('btn-tool-zoomin');
    const zoomOutBtn = document.getElementById('btn-tool-zoomout');
    const clearImgBtn = document.getElementById('btn-tool-clear');

    if (startCamBtn) startCamBtn.onclick = () => this.startCamera();
    if (stopCamBtn) stopCamBtn.onclick = () => this.stopCamera();
    if (captureBtn) captureBtn.onclick = () => this.captureSnapshot();
    if (switchCamBtn) switchCamBtn.onclick = () => this.switchCamera();
    
    if (fileInput) {
      fileInput.onchange = (e) => this.handleFileUpload(e.target.files);
    }

    if (dropzone) {
      dropzone.onclick = () => fileInput && fileInput.click();
      dropzone.ondragover = (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      };
      dropzone.ondragleave = () => dropzone.classList.remove('dragover');
      dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.handleFileUpload(e.dataTransfer.files);
        }
      };
    }

    if (sampleSelect) {
      sampleSelect.onchange = (e) => {
        if (e.target.value) {
          this.loadSampleProduct(e.target.value);
        }
      };
    }

    if (rotateBtn) rotateBtn.onclick = () => this.rotateImage(90);
    if (zoomInBtn) zoomInBtn.onclick = () => this.zoomImage(0.2);
    if (zoomOutBtn) zoomOutBtn.onclick = () => this.zoomImage(-0.2);
    if (clearImgBtn) clearImgBtn.onclick = () => this.clearActiveImage();

    // Side selection pills
    const sidePills = document.querySelectorAll('.label-side-pill');
    sidePills.forEach(pill => {
      pill.onclick = () => {
        sidePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentSelectedSide = pill.dataset.side || 'Front Label';
      };
    });

    if (analyzeBtn) {
      analyzeBtn.onclick = () => this.startAnalysisWorkflow();
    }
  },

  // Start Camera Stream via MediaDevices API
  async startCamera() {
    const video = document.getElementById('camera-video');
    const previewImg = document.getElementById('scanner-image-preview');
    const overlayGrid = document.querySelector('.scanner-overlay-grid');
    const camControls = document.getElementById('camera-active-controls');
    const idleControls = document.getElementById('camera-idle-controls');

    try {
      if (this.activeStream) {
        this.stopCamera();
      }

      const constraints = {
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      this.activeStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (video) {
        video.srcObject = this.activeStream;
        video.style.display = 'block';
        if (previewImg) previewImg.style.display = 'none';
        if (overlayGrid) overlayGrid.style.display = 'flex';
        if (camControls) camControls.style.display = 'flex';
        if (idleControls) idleControls.style.display = 'none';
        video.play();
      }
      UI.showToast('success', 'Camera Active', 'Position commodity principal display panel within frame.');
    } catch (err) {
      console.warn('Camera access error:', err);
      UI.showToast('warning', 'Camera Unavailable', 'Using file upload or sample label presets instead.');
    }
  },

  // Stop Camera
  stopCamera() {
    if (this.activeStream) {
      this.activeStream.getTracks().forEach(track => track.stop());
      this.activeStream = null;
    }
    const video = document.getElementById('camera-video');
    const overlayGrid = document.querySelector('.scanner-overlay-grid');
    const camControls = document.getElementById('camera-active-controls');
    const idleControls = document.getElementById('camera-idle-controls');

    if (video) video.style.display = 'none';
    if (overlayGrid) overlayGrid.style.display = 'none';
    if (camControls) camControls.style.display = 'none';
    if (idleControls) idleControls.style.display = 'flex';
  },

  // Switch between front/back camera
  switchCamera() {
    this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
    this.startCamera();
  },

  // Capture Snapshot to canvas
  captureSnapshot() {
    const video = document.getElementById('camera-video');
    if (!video || !this.activeStream) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    this.addImage({
      side: this.currentSelectedSide,
      dataUrl,
      name: `Capture_${this.currentSelectedSide}_${Date.now()}.jpg`,
      quality: { score: 92, status: 'Good Resolution' }
    });

    this.stopCamera();
    UI.showToast('success', 'Image Captured', `${this.currentSelectedSide} image captured successfully.`);
  },

  // Handle uploaded files
  async handleFileUpload(files) {
    if (!files || !files.length) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        UI.showToast('error', 'Unsupported File', `${file.name} is not a valid image format.`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        const tempImg = new Image();
        tempImg.src = dataUrl;
        tempImg.onload = async () => {
          const quality = await Utils.checkImageQuality(file, tempImg);
          this.addImage({
            side: this.currentSelectedSide,
            dataUrl,
            file,
            name: file.name,
            quality
          });
          UI.showToast('success', 'Image Added', `${file.name} loaded with quality score ${quality.score}%.`);
        };
      };
      reader.readAsDataURL(file);
    }
  },

  // Load a built-in sample commodity product
  loadSampleProduct(sampleId) {
    const sample = MockData.sampleProducts.find(s => s.id === sampleId) || MockData.sampleProducts[0];
    this.currentImages = [
      {
        side: 'Front Label',
        dataUrl: sample.image,
        name: `${sample.name} - Front.svg`,
        sampleId: sample.id,
        quality: { score: 96, isLowRes: false, isBlurry: false, warnings: [] }
      }
    ];

    // Store active sample product context in active inspection
    let activeInspection = Storage.get(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION) || {};
    activeInspection = {
      ...activeInspection,
      sampleId: sample.id,
      productName: sample.name,
      category: sample.category,
      brand: sample.brand,
      barcode: sample.barcode,
      images: this.currentImages,
      rawOcrText: sample.rawOcrText,
      ocrConfidence: sample.ocrConfidence,
      boundingBoxes: sample.boundingBoxes,
      aiExtracted: sample.aiExtracted,
      complianceScore: sample.complianceScore,
      complianceStatus: sample.complianceStatus,
      ruleChecks: sample.ruleChecks,
      violations: sample.violations
    };
    Storage.set(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION, activeInspection);

    this.renderThumbnails();
    this.displayActiveImage(0);
    UI.showToast('info', 'Sample Loaded', `Loaded sample: "${sample.name}"`);
  },

  // Add Image to Workspace
  addImage(imageObj) {
    this.currentImages.push(imageObj);
    this.saveInspectionImages();
    this.renderThumbnails();
    this.displayActiveImage(this.currentImages.length - 1);
  },

  saveInspectionImages() {
    let activeInspection = Storage.get(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION) || {};
    activeInspection.images = this.currentImages;
    Storage.set(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION, activeInspection);
  },

  // Display active image in main preview
  displayActiveImage(index) {
    const previewImg = document.getElementById('scanner-image-preview');
    const qualityBadge = document.getElementById('scanner-quality-score');
    const warningBox = document.getElementById('scanner-quality-warnings');
    const video = document.getElementById('camera-video');

    if (video) video.style.display = 'none';

    if (index >= 0 && index < this.currentImages.length) {
      const img = this.currentImages[index];
      if (previewImg) {
        previewImg.src = img.dataUrl;
        previewImg.style.display = 'block';
        previewImg.style.transform = `rotate(${this.currentRotation}deg) scale(${this.currentZoom})`;
      }

      if (qualityBadge && img.quality) {
        qualityBadge.innerHTML = `Quality: <strong>${img.quality.score}%</strong> (${img.quality.score >= 80 ? 'High' : 'Acceptable'})`;
      }

      if (warningBox) {
        if (img.quality && img.quality.warnings && img.quality.warnings.length > 0) {
          warningBox.style.display = 'flex';
          warningBox.querySelector('.warning-text').textContent = img.quality.warnings.join(' ');
        } else {
          warningBox.style.display = 'none';
        }
      }
    }
  },

  // Render thumbnail tray
  renderThumbnails() {
    const grid = document.getElementById('scanner-thumbnail-grid');
    if (!grid) return;

    if (this.currentImages.length === 0) {
      grid.innerHTML = '<div class="text-muted" style="font-size:0.8rem; grid-column:1/-1;">No package images added yet.</div>';
      return;
    }

    grid.innerHTML = this.currentImages
      .map((img, idx) => `
        <div class="thumbnail-card ${idx === 0 ? 'selected' : ''}" data-index="${idx}">
          <img src="${img.dataUrl}" alt="${img.side}" />
          <span class="thumbnail-side-tag">${Utils.escapeHtml(img.side)}</span>
          <button class="thumbnail-remove-btn" title="Remove" data-remove="${idx}">&times;</button>
        </div>
      `)
      .join('');

    // Attach click events
    grid.querySelectorAll('.thumbnail-card').forEach(card => {
      card.onclick = (e) => {
        if (e.target.dataset.remove !== undefined) {
          const remIdx = parseInt(e.target.dataset.remove, 10);
          this.removeImage(remIdx);
          return;
        }
        grid.querySelectorAll('.thumbnail-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.displayActiveImage(parseInt(card.dataset.index, 10));
      };
    });
  },

  removeImage(index) {
    this.currentImages.splice(index, 1);
    this.saveInspectionImages();
    this.renderThumbnails();
    if (this.currentImages.length > 0) {
      this.displayActiveImage(0);
    } else {
      const previewImg = document.getElementById('scanner-image-preview');
      if (previewImg) previewImg.style.display = 'none';
    }
  },

  rotateImage(deg) {
    this.currentRotation = (this.currentRotation + deg) % 360;
    const previewImg = document.getElementById('scanner-image-preview');
    if (previewImg) {
      previewImg.style.transform = `rotate(${this.currentRotation}deg) scale(${this.currentZoom})`;
    }
  },

  zoomImage(delta) {
    this.currentZoom = Math.max(0.6, Math.min(3.0, this.currentZoom + delta));
    const previewImg = document.getElementById('scanner-image-preview');
    if (previewImg) {
      previewImg.style.transform = `rotate(${this.currentRotation}deg) scale(${this.currentZoom})`;
    }
  },

  clearActiveImage() {
    this.currentRotation = 0;
    this.currentZoom = 1;
    const previewImg = document.getElementById('scanner-image-preview');
    if (previewImg) {
      previewImg.style.transform = 'none';
    }
  },

  // Proceed to Preprocessing & OCR
  startAnalysisWorkflow() {
    if (this.currentImages.length === 0) {
      UI.showToast('warning', 'Image Required', 'Please capture or upload at least one commodity label image before analyzing.');
      return;
    }

    this.stopCamera();
    window.location.hash = '#image-processing';
  }
};
