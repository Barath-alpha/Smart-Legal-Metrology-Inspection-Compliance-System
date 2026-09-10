/**
 * Smart Legal Metrology Inspection & Compliance System
 * Application Configuration & Constants
 */

const CONFIG = {
  APP_NAME: 'Smart Legal Metrology Inspection & Compliance System',
  APP_SHORT_NAME: 'SLM-ICS',
  APP_VERSION: '2.4.0-PROD',
  GOVERNMENT_BODY: 'Department of Consumer Affairs, Legal Metrology Division',
  REGULATION: 'Legal Metrology (Packaged Commodities) Rules, 2011 (as amended)',
  
  // API Backend Settings
  API_BASE_URL: localStorage.getItem('slm_api_base_url') || 'http://localhost:5000',
  USE_MOCK_DATA: localStorage.getItem('slm_use_mock_data') !== 'false', // default true for standalone demo
  API_TIMEOUT_MS: 15000,
  
  // Supported Image Formats
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGE_SIZE_MB: 12,
  
  // Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'slm_auth_token',
    USER: 'slm_current_user',
    CURRENT_INSPECTION: 'slm_active_inspection',
    INSPECTIONS_LIST: 'slm_inspections_db',
    RULES_LIST: 'slm_rules_db',
    USERS_LIST: 'slm_users_db',
    NOTIFICATIONS: 'slm_notifications_db',
    THEME: 'slm_theme_pref'
  },
  
  // Endpoints Specification (Flask REST API contracts)
  ENDPOINTS: {
    AUTH_LOGIN: '/api/auth/login',
    AUTH_REGISTER: '/api/auth/register',
    AUTH_ME: '/api/auth/me',
    AUTH_LOGOUT: '/api/auth/logout',
    INSPECTIONS: '/api/inspections',
    INSPECTION_DETAIL: (id) => `/api/inspections/${id}`,
    IMAGE_UPLOAD: '/api/images/upload',
    IMAGE_PREPROCESS: '/api/images/preprocess',
    OCR_PROCESS: '/api/ocr/process',
    AI_EXTRACT: '/api/ai/extract',
    AI_CLASSIFY: '/api/ai/classify',
    COMPLIANCE_CHECK: '/api/compliance/check',
    VIOLATIONS: '/api/violations',
    HUMAN_VERIFY: '/api/inspections/verify',
    REPORTS_GENERATE: '/api/reports/generate',
    REPORT_DETAIL: (id) => `/api/reports/${id}`,
    ANALYTICS_DASHBOARD: '/api/analytics/dashboard',
    RULES: '/api/rules',
    USERS: '/api/users',
    NOTIFICATIONS: '/api/notifications',
    SYSTEM_STATUS: '/api/system/status'
  }
};

// Freeze config to prevent accidental mutation
Object.freeze(CONFIG);
