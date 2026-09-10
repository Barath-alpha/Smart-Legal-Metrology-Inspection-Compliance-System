/**
 * Smart Legal Metrology Inspection & Compliance System
 * New Inspection Metadata Controller
 */

const NewInspection = {
  init() {
    this.resetForm();
    this.bindEvents();
  },

  resetForm() {
    const user = Auth.getUser() || { name: 'Rajesh Sharma', employeeId: 'EMP-8842' };
    const idInput = document.getElementById('new-insp-id');
    const dateInput = document.getElementById('new-insp-date');
    const inspectorInput = document.getElementById('new-insp-inspector');
    const locationInput = document.getElementById('new-insp-location');
    const productNameInput = document.getElementById('new-insp-product-name');
    const categorySelect = document.getElementById('new-insp-category');
    const brandInput = document.getElementById('new-insp-brand');
    const barcodeInput = document.getElementById('new-insp-barcode');
    const notesInput = document.getElementById('new-insp-notes');

    if (idInput) idInput.value = Utils.generateId('INS');
    if (dateInput) dateInput.value = new Date().toISOString().slice(0, 16);
    if (inspectorInput) inspectorInput.value = `${user.name} (${user.employeeId || 'EMP-8842'})`;
    if (locationInput) locationInput.value = 'General Market Inspection, Ward 4';
    if (productNameInput) productNameInput.value = '';
    if (brandInput) brandInput.value = '';
    if (barcodeInput) barcodeInput.value = '';
    if (notesInput) notesInput.value = '';
    if (categorySelect) categorySelect.value = 'Packaged Food & Confectionery';
  },

  bindEvents() {
    const startBtn = document.getElementById('btn-start-inspection-submit');
    const presetSelect = document.getElementById('new-insp-preset-select');

    if (startBtn) {
      startBtn.onclick = (e) => {
        e.preventDefault();
        this.submitNewInspection();
      };
    }

    if (presetSelect) {
      presetSelect.onchange = (e) => {
        if (e.target.value) {
          this.applyPreset(e.target.value);
        }
      };
    }
  },

  applyPreset(sampleId) {
    const sample = MockData.sampleProducts.find(s => s.id === sampleId);
    if (!sample) return;

    const productNameInput = document.getElementById('new-insp-product-name');
    const categorySelect = document.getElementById('new-insp-category');
    const brandInput = document.getElementById('new-insp-brand');
    const barcodeInput = document.getElementById('new-insp-barcode');

    if (productNameInput) productNameInput.value = sample.name;
    if (categorySelect) categorySelect.value = sample.category;
    if (brandInput) brandInput.value = sample.brand;
    if (barcodeInput) barcodeInput.value = sample.barcode;

    UI.showToast('info', 'Preset Loaded', `Pre-filled details for "${sample.name}"`);
  },

  submitNewInspection() {
    const id = document.getElementById('new-insp-id')?.value.trim() || Utils.generateId('INS');
    const productName = document.getElementById('new-insp-product-name')?.value.trim();
    const category = document.getElementById('new-insp-category')?.value;
    const brand = document.getElementById('new-insp-brand')?.value.trim();
    const location = document.getElementById('new-insp-location')?.value.trim();
    const inspector = document.getElementById('new-insp-inspector')?.value.trim();
    const barcode = document.getElementById('new-insp-barcode')?.value.trim();
    const notes = document.getElementById('new-insp-notes')?.value.trim();

    if (!productName) {
      UI.showToast('error', 'Validation Error', 'Please enter the Product Name or select a sample preset.');
      document.getElementById('new-insp-product-name')?.focus();
      return;
    }

    const newInspectionDraft = {
      id,
      productName,
      category,
      brand: brand || 'Unbranded',
      location: location || 'On-site Inspection',
      inspector: inspector || 'Inspector Officer',
      barcode,
      notes,
      date: new Date().toISOString(),
      complianceStatus: 'PENDING',
      complianceScore: 0,
      images: [],
      rawOcrText: '',
      aiExtracted: {},
      ruleChecks: [],
      violations: []
    };

    // Save active inspection to session/local storage
    Storage.set(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION, newInspectionDraft);

    UI.showToast('success', 'Inspection Initialized', `Inspection ${id} created. Launching label scanner.`);

    // Proceed to Step 2: Scanner
    window.location.hash = '#scanner';
  }
};
