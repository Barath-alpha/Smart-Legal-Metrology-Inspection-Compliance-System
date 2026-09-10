/**
 * Smart Legal Metrology Inspection & Compliance System
 * Main Application Bootstrap & Orchestrator
 */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  init() {
    console.log(`[${CONFIG.APP_SHORT_NAME}] Initializing Version ${CONFIG.APP_VERSION}...`);

    // Ensure initial demo user exists if clean session
    if (!Auth.getUser()) {
      Storage.set(CONFIG.STORAGE_KEYS.AUTH_TOKEN, 'gov_jwt_demo_session');
      Storage.set(CONFIG.STORAGE_KEYS.USER, MockData.users[0]); // Rajesh Sharma (Inspector)
    }

    this.bindGlobalEvents();
    this.initAuthForms();
    Auth.updateUserInterface();
    Notifications.updateBadge();

    // Initialize AI Copilot and Batch Queue
    if (typeof Copilot !== 'undefined') Copilot.init();
    if (typeof BatchInspection !== 'undefined') BatchInspection.init();

    // Start Router
    Router.init();
  },

  bindGlobalEvents() {
    // Sidebar toggle buttons
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebarMobileToggleBtn = document.getElementById('sidebar-mobile-toggle-btn');
    const sidebar = document.querySelector('.app-sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');

    if (sidebarToggleBtn && sidebar) {
      sidebarToggleBtn.onclick = () => {
        sidebar.classList.toggle('collapsed');
        document.querySelector('.app-main-content')?.classList.toggle('expanded');
      };
    }

    if (sidebarMobileToggleBtn && sidebar && backdrop) {
      sidebarMobileToggleBtn.onclick = () => {
        sidebar.classList.add('show');
        backdrop.classList.add('show');
      };
    }

    if (backdrop && sidebar) {
      backdrop.onclick = () => {
        sidebar.classList.remove('show');
        backdrop.classList.remove('show');
      };
    }

    if (drawerBackdrop) {
      drawerBackdrop.onclick = () => UI.closeInspectionDrawer();
    }
    if (drawerCloseBtn) {
      drawerCloseBtn.onclick = () => UI.closeInspectionDrawer();
    }

    // Global Logout buttons
    document.querySelectorAll('.btn-action-logout').forEach(btn => {
      btn.onclick = async () => {
        const confirmed = await UI.confirm({
          title: 'Sign Out Session?',
          message: 'Are you sure you want to log out of the Legal Metrology Compliance Portal?',
          confirmText: 'Sign Out',
          confirmBtnClass: 'btn-gov-danger'
        });
        if (confirmed) {
          Auth.logout();
          UI.showToast('info', 'Logged Out', 'Your session has ended securely.');
        }
      };
    });

    // Theme Switcher Toggle
    const themeToggleBtn = document.getElementById('btn-theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.onclick = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        Storage.set(CONFIG.STORAGE_KEYS.THEME, newTheme);
        UI.showToast('info', 'Theme Changed', `Switched to ${newTheme} mode.`);
      };
    }

    // Restore saved theme
    const savedTheme = Storage.get(CONFIG.STORAGE_KEYS.THEME, 'light');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  },

  initAuthForms() {
    // Login Form Submit
    const loginForm = document.getElementById('auth-login-form');
    if (loginForm) {
      loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value.trim();
        const password = document.getElementById('login-password')?.value;
        const remember = document.getElementById('login-remember')?.checked;

        if (!email || !password) {
          UI.showToast('error', 'Required Fields', 'Please enter your official email and password.');
          return;
        }

        UI.showLoader('Authenticating with Government Directory...');
        const result = await Auth.login(email, password, remember);
        UI.hideLoader();

        if (result.success) {
          UI.showToast('success', 'Authentication Successful', `Welcome back, ${result.user.name}`);
          window.location.hash = '#dashboard';
        } else {
          UI.showToast('error', 'Authentication Failed', result.error || 'Invalid credentials.');
        }
      };
    }

    // Registration Form Submit
    const registerForm = document.getElementById('auth-register-form');
    if (registerForm) {
      registerForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name')?.value.trim();
        const employeeId = document.getElementById('register-empid')?.value.trim();
        const email = document.getElementById('register-email')?.value.trim();
        const phone = document.getElementById('register-phone')?.value.trim();
        const department = document.getElementById('register-department')?.value;
        const role = document.getElementById('register-role')?.value;
        const password = document.getElementById('register-password')?.value;
        const confirmPassword = document.getElementById('register-confirm-password')?.value;
        const terms = document.getElementById('register-terms')?.checked;

        if (!terms) {
          UI.showToast('error', 'Terms Required', 'Please acknowledge the Legal Metrology official code of conduct.');
          return;
        }

        if (password !== confirmPassword) {
          UI.showToast('error', 'Password Mismatch', 'The entered passwords do not match.');
          return;
        }

        UI.showLoader('Registering Official Credentials...');
        const result = await Auth.register({
          name,
          employeeId,
          email,
          phone,
          department,
          role,
          password
        });
        UI.hideLoader();

        if (result.success) {
          UI.showToast('success', 'Registration Authorized', 'Your inspector account is active.');
          window.location.hash = '#dashboard';
        } else {
          UI.showToast('error', 'Registration Failed', result.error || 'Could not complete registration.');
        }
      };
    }

    // Toggle Password Visibility
    document.querySelectorAll('.btn-toggle-password').forEach(btn => {
      btn.onclick = (e) => {
        const inputId = btn.dataset.target;
        const input = document.getElementById(inputId);
        if (input) {
          const isPass = input.type === 'password';
          input.type = isPass ? 'text' : 'password';
          btn.innerHTML = `<i class="bi ${isPass ? 'bi-eye-slash-fill' : 'bi-eye-fill'}"></i>`;
        }
      };
    });
  }
};
