/**
 * Smart Legal Metrology Inspection & Compliance System
 * Settings & System Configuration Controller
 */

const Settings = {
  init() {
    this.populateCurrentSettings();
    this.bindEvents();
  },

  populateCurrentSettings() {
    const user = Auth.getUser() || {};
    const nameInput = document.getElementById('settings-profile-name');
    const emailInput = document.getElementById('settings-profile-email');
    const phoneInput = document.getElementById('settings-profile-phone');
    const deptInput = document.getElementById('settings-profile-dept');
    const roleBadge = document.getElementById('settings-profile-role');

    const apiUrlInput = document.getElementById('settings-api-base-url');
    const mockDataToggle = document.getElementById('settings-mock-data-toggle');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (deptInput) deptInput.value = user.department || '';
    if (roleBadge) roleBadge.textContent = user.role || 'Inspector';

    if (apiUrlInput) apiUrlInput.value = localStorage.getItem('slm_api_base_url') || CONFIG.API_BASE_URL;
    if (mockDataToggle) mockDataToggle.checked = localStorage.getItem('slm_use_mock_data') !== 'false';
  },

  bindEvents() {
    const saveProfileBtn = document.getElementById('btn-save-profile-settings');
    const saveApiBtn = document.getElementById('btn-save-api-settings');
    const testApiBtn = document.getElementById('btn-test-api-connection');

    if (saveProfileBtn) {
      saveProfileBtn.onclick = () => this.saveProfile();
    }
    if (saveApiBtn) {
      saveApiBtn.onclick = () => this.saveApiSettings();
    }
    if (testApiBtn) {
      testApiBtn.onclick = () => this.testApiConnection();
    }
  },

  saveProfile() {
    const user = Auth.getUser() || {};
    const name = document.getElementById('settings-profile-name')?.value.trim();
    const phone = document.getElementById('settings-profile-phone')?.value.trim();
    const dept = document.getElementById('settings-profile-dept')?.value.trim();

    if (!name) {
      UI.showToast('error', 'Validation Error', 'Profile name cannot be blank.');
      return;
    }

    user.name = name;
    user.phone = phone;
    user.department = dept;

    Storage.set(CONFIG.STORAGE_KEYS.USER, user);
    Auth.updateUserInterface();
    UI.showToast('success', 'Profile Updated', 'Inspector identity profile updated.');
  },

  saveApiSettings() {
    const apiUrl = document.getElementById('settings-api-base-url')?.value.trim() || 'http://localhost:5000';
    const useMock = document.getElementById('settings-mock-data-toggle')?.checked;

    localStorage.setItem('slm_api_base_url', apiUrl);
    localStorage.setItem('slm_use_mock_data', useMock ? 'true' : 'false');

    UI.showToast('success', 'Configuration Saved', `API Base URL configured to ${apiUrl} (Mock: ${useMock ? 'Enabled' : 'Live Flask'}).`);
  },

  async testApiConnection() {
    const apiUrl = document.getElementById('settings-api-base-url')?.value.trim() || 'http://localhost:5000';
    UI.showLoader(`Testing connection to Flask backend at ${apiUrl}...`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${apiUrl}/api/system/status`, { signal: controller.signal })
        .catch(() => null);
      clearTimeout(timeoutId);

      UI.hideLoader();

      if (res && res.ok) {
        UI.showToast('success', 'Backend Connected', `Flask REST API responded successfully (HTTP 200 OK).`);
      } else {
        UI.showToast('warning', 'Backend Unreachable', `Flask API at ${apiUrl} is currently offline. Standalone Mock Adapter is active.`);
      }
    } catch (e) {
      UI.hideLoader();
      UI.showToast('warning', 'Backend Unreachable', `Cannot reach ${apiUrl}. Running seamlessly with Mock Adapter.`);
    }
  }
};
