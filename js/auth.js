/**
 * Smart Legal Metrology Inspection & Compliance System
 * Authentication & Authorization Module
 */

const Auth = {
  // Check if session is authenticated
  isAuthenticated() {
    const token = Storage.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    const user = Storage.get(CONFIG.STORAGE_KEYS.USER);
    return !!(token && user);
  },

  // Get current logged-in user
  getUser() {
    return Storage.get(CONFIG.STORAGE_KEYS.USER, null);
  },

  // Get current user role
  getRole() {
    const user = this.getUser();
    return user ? user.role : 'Guest';
  },

  // Role permissions check
  isAdmin() {
    const role = (this.getRole() || '').toLowerCase();
    return role.includes('admin') || role.includes('director');
  },

  isSeniorInspector() {
    const role = (this.getRole() || '').toLowerCase();
    return this.isAdmin() || role.includes('senior');
  },

  // Perform Login
  async login(email, password, remember = true) {
    try {
      const response = await API.post(CONFIG.ENDPOINTS.AUTH_LOGIN, { email, password });
      if (response && response.success) {
        Storage.set(CONFIG.STORAGE_KEYS.AUTH_TOKEN, response.token);
        Storage.set(CONFIG.STORAGE_KEYS.USER, response.user);

        if (remember) {
          Storage.set('slm_saved_email', email);
        } else {
          Storage.remove('slm_saved_email');
        }

        this.updateUserInterface();
        return { success: true, user: response.user };
      }
      throw new Error(response.message || 'Login failed.');
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Perform Registration
  async register(formData) {
    try {
      const response = await API.post(CONFIG.ENDPOINTS.AUTH_REGISTER, formData);
      if (response && response.success) {
        // Automatically login after successful authorized registration
        const loginRes = await this.login(formData.email, formData.password);
        return loginRes;
      }
      throw new Error(response.message || 'Registration failed.');
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Perform Logout
  logout() {
    Storage.remove(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    Storage.remove(CONFIG.STORAGE_KEYS.USER);
    Storage.remove(CONFIG.STORAGE_KEYS.CURRENT_INSPECTION);
    
    // Redirect to Login view
    window.location.hash = '#login';
    this.updateUserInterface();
  },

  // Refresh Topbar and Sidebar user identity
  updateUserInterface() {
    const user = this.getUser();
    const userAvatarEls = document.querySelectorAll('.user-avatar-text');
    const userNameEls = document.querySelectorAll('.user-display-name');
    const userRoleEls = document.querySelectorAll('.user-display-role');
    const userBadgeEls = document.querySelectorAll('.user-role-badge');
    const adminOnlyEls = document.querySelectorAll('.admin-only');

    if (user) {
      const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'LM';

      userAvatarEls.forEach(el => el.textContent = initials);
      userNameEls.forEach(el => el.textContent = user.name);
      userRoleEls.forEach(el => el.textContent = user.role || 'Inspector');
      userBadgeEls.forEach(el => el.textContent = user.role || 'Inspector');

      // Admin visibility toggle
      const hasAdmin = this.isAdmin();
      adminOnlyEls.forEach(el => {
        el.style.display = hasAdmin ? 'block' : 'none';
      });
    }
  }
};
