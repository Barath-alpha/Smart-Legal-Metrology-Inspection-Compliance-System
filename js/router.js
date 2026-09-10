/**
 * Smart Legal Metrology Inspection & Compliance System
 * Client-Side Router & Viewport Manager
 */

const Router = {
  routes: {
    'login': { title: 'Authorized Sign In', crumbs: [{ label: 'Sign In', url: '#login' }], authRequired: false },
    'register': { title: 'Register Authorized Officer', crumbs: [{ label: 'Sign Up', url: '#register' }], authRequired: false },
    'dashboard': { title: 'Inspection & Compliance Overview', crumbs: [{ label: 'Portal', url: '#dashboard' }, { label: 'Dashboard', url: '#dashboard' }], authRequired: true },
    'new-inspection': { title: 'Start New Commodity Inspection', crumbs: [{ label: 'Inspections', url: '#history' }, { label: 'New Inspection', url: '#new-inspection' }], authRequired: true, step: 1 },
    'scanner': { title: 'Commodity Label Optical Scanner', crumbs: [{ label: 'Inspection', url: '#scanner' }, { label: 'Capture & Scan', url: '#scanner' }], authRequired: true, step: 2 },
    'image-processing': { title: 'Preprocessing Pipeline', crumbs: [{ label: 'Inspection', url: '#scanner' }, { label: 'Preprocessing', url: '#image-processing' }], authRequired: true, step: 3 },
    'ocr': { title: 'Optical Character Recognition (OCR)', crumbs: [{ label: 'Inspection', url: '#scanner' }, { label: 'OCR Extraction', url: '#ocr' }], authRequired: true, step: 4 },
    'ai-analysis': { title: 'AI Extracted Legal Metrology Fields', crumbs: [{ label: 'Inspection', url: '#scanner' }, { label: 'AI Structured Data', url: '#ai-analysis' }], authRequired: true, step: 5 },
    'compliance': { title: 'LMPC 2011 Compliance Analysis', crumbs: [{ label: 'Inspection', url: '#scanner' }, { label: 'Rule Evaluation', url: '#compliance' }], authRequired: true, step: 6 },
    'violations': { title: 'Statutory Violations & Evidence', crumbs: [{ label: 'Inspection', url: '#scanner' }, { label: 'Violations', url: '#violations' }], authRequired: true, step: 7 },
    'human-verification': { title: 'Officer Verification & Audit Review', crumbs: [{ label: 'Inspection', url: '#scanner' }, { label: 'Human Review', url: '#human-verification' }], authRequired: true, step: 8 },
    'summary': { title: 'Inspection Dossier Summary', crumbs: [{ label: 'Inspection', url: '#scanner' }, { label: 'Final Summary', url: '#summary' }], authRequired: true, step: 9 },
    'reports': { title: 'Official Government Compliance Report', crumbs: [{ label: 'Reports', url: '#reports' }, { label: 'Inspection Certificate', url: '#reports' }], authRequired: true, step: 10 },
    'history': { title: 'Inspection History & Audit Records', crumbs: [{ label: 'Portal', url: '#dashboard' }, { label: 'Inspection Registry', url: '#history' }], authRequired: true },
    'inspection-details': { title: 'Inspection Audit Record Details', crumbs: [{ label: 'Registry', url: '#history' }, { label: 'Audit Trail', url: '#history' }], authRequired: true },
    'analytics': { title: 'Analytics & Enforcement Trends', crumbs: [{ label: 'Portal', url: '#dashboard' }, { label: 'Analytics', url: '#analytics' }], authRequired: true },
    'rules': { title: 'Legal Metrology Rules Catalog', crumbs: [{ label: 'Admin', url: '#rules' }, { label: 'Rules Management', url: '#rules' }], authRequired: true, adminOnly: true },
    'users': { title: 'Officer Directory & Permissions', crumbs: [{ label: 'Admin', url: '#users' }, { label: 'User Management', url: '#users' }], authRequired: true, adminOnly: true },
    'notifications': { title: 'Alerts & Statutory Notices', crumbs: [{ label: 'Portal', url: '#dashboard' }, { label: 'Notifications', url: '#notifications' }], authRequired: true },
    'settings': { title: 'System & Profile Preferences', crumbs: [{ label: 'Portal', url: '#dashboard' }, { label: 'Settings', url: '#settings' }], authRequired: true },
    'system-status': { title: 'Enterprise Services Health', crumbs: [{ label: 'System', url: '#system-status' }, { label: 'Service Status', url: '#system-status' }], authRequired: true }
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    let hash = window.location.hash.replace('#', '') || 'dashboard';
    const [routeName, queryStr] = hash.split('?');
    const params = new URLSearchParams(queryStr || '');

    const targetRoute = this.routes[routeName] || this.routes['dashboard'];
    const currentRouteKey = this.routes[routeName] ? routeName : 'dashboard';

    // Check Auth
    const isAuth = Auth.isAuthenticated();
    if (targetRoute.authRequired && !isAuth) {
      window.location.hash = '#login';
      return;
    }

    if (!targetRoute.authRequired && isAuth && (routeName === 'login' || routeName === 'register')) {
      window.location.hash = '#dashboard';
      return;
    }

    // Check Admin authorization
    if (targetRoute.adminOnly && !Auth.isAdmin()) {
      UI.showToast('error', 'Access Denied', 'Administrative privileges required to access this module.');
      window.location.hash = '#dashboard';
      return;
    }

    // Toggle Shell vs Login/Register UI
    const isAuthPage = routeName === 'login' || routeName === 'register';
    const appShell = document.getElementById('app-shell-container');
    const authContainer = document.getElementById('auth-view-container');
    const stepperContainer = document.getElementById('inspection-stepper-container');

    if (isAuthPage) {
      if (appShell) appShell.style.display = 'none';
      if (authContainer) authContainer.style.display = 'block';
    } else {
      if (appShell) appShell.style.display = 'flex';
      if (authContainer) authContainer.style.display = 'none';
    }

    // Show / Hide Stepper for inspection workflow steps
    if (stepperContainer) {
      if (targetRoute.step) {
        stepperContainer.style.display = 'flex';
        this.updateStepper(targetRoute.step);
      } else {
        stepperContainer.style.display = 'none';
      }
    }

    // Switch View Containers
    document.querySelectorAll('.app-page-view').forEach(view => {
      view.style.display = 'none';
    });

    const activeView = document.getElementById(`view-${currentRouteKey}`);
    if (activeView) {
      activeView.style.display = 'block';
    }

    // Update Topbar and Breadcrumbs
    UI.updateBreadcrumb(targetRoute.crumbs);

    // Update Active Sidebar link
    document.querySelectorAll('.sidebar-nav-item .nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === `#${currentRouteKey}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close Mobile Drawer if open
    const sidebar = document.querySelector('.app-sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('show');
    if (backdrop) backdrop.classList.remove('show');

    // Trigger Module Controller Init
    this.dispatchController(currentRouteKey, params);
  },

  updateStepper(activeStep) {
    const steps = document.querySelectorAll('.stepper-step');
    const connectors = document.querySelectorAll('.stepper-connector');

    steps.forEach(s => {
      const stepNum = parseInt(s.dataset.step, 10);
      s.classList.remove('active', 'completed');
      if (stepNum < activeStep) {
        s.classList.add('completed');
      } else if (stepNum === activeStep) {
        s.classList.add('active');
      }
    });

    connectors.forEach((c, idx) => {
      if (idx + 1 < activeStep) {
        c.classList.add('completed');
      } else {
        c.classList.remove('completed');
      }
    });
  },

  dispatchController(route, params) {
    switch (route) {
      case 'dashboard':
        if (typeof Dashboard !== 'undefined') Dashboard.init();
        break;
      case 'new-inspection':
        if (typeof NewInspection !== 'undefined') NewInspection.init();
        break;
      case 'scanner':
        if (typeof Scanner !== 'undefined') Scanner.init();
        break;
      case 'image-processing':
        if (typeof ImageProcessing !== 'undefined') ImageProcessing.runPipeline();
        break;
      case 'ocr':
        if (typeof OCR !== 'undefined') OCR.init();
        break;
      case 'ai-analysis':
        if (typeof AIAnalysis !== 'undefined') AIAnalysis.init();
        break;
      case 'compliance':
        if (typeof Compliance !== 'undefined') Compliance.init();
        break;
      case 'violations':
        if (typeof Violations !== 'undefined') Violations.init();
        break;
      case 'human-verification':
        if (typeof HumanVerification !== 'undefined') HumanVerification.init();
        break;
      case 'summary':
        if (typeof Summary !== 'undefined') Summary.init();
        break;
      case 'reports':
        if (typeof Reports !== 'undefined') Reports.init();
        break;
      case 'history':
        if (typeof History !== 'undefined') History.init();
        break;
      case 'inspection-details':
        if (typeof InspectionDetails !== 'undefined') InspectionDetails.init(params.get('id'));
        break;
      case 'analytics':
        if (typeof Analytics !== 'undefined') Analytics.init();
        break;
      case 'rules':
        if (typeof AdminRules !== 'undefined') AdminRules.init();
        break;
      case 'users':
        if (typeof AdminUsers !== 'undefined') AdminUsers.init();
        break;
      case 'notifications':
        if (typeof Notifications !== 'undefined') Notifications.init();
        break;
      case 'settings':
        if (typeof Settings !== 'undefined') Settings.init();
        break;
      case 'system-status':
        if (typeof SystemStatus !== 'undefined') SystemStatus.init();
        break;
    }
  }
};
