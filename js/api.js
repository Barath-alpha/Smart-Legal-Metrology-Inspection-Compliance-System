/**
 * Smart Legal Metrology Inspection & Compliance System
 * Centralized API Client Module with Fetch API & Mock Fallback Adapter
 */

const API = {
  // Execute HTTP Request
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      data = null,
      headers = {},
      isFormData = false,
      timeout = CONFIG.API_TIMEOUT_MS,
      retries = 1
    } = options;

    const token = Storage.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    const requestHeaders = {
      ...headers
    };

    if (!isFormData) {
      requestHeaders['Content-Type'] = 'application/json';
      requestHeaders['Accept'] = 'application/json';
    }
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = `${CONFIG.API_BASE_URL}${endpoint}`;

    // If Mock Mode is explicitly activated, immediately route to Mock Handler
    if (CONFIG.USE_MOCK_DATA) {
      return this.mockAdapter(endpoint, method, data);
    }

    // Try live Flask REST API with timeout & retry
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const fetchOptions = {
          method,
          headers: requestHeaders,
          signal: controller.signal
        };

        if (data) {
          fetchOptions.body = isFormData ? data : JSON.stringify(data);
        }

        const response = await fetch(fullUrl, fetchOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorJson = await response.json().catch(() => ({}));
          throw new Error(errorJson.message || `API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        clearTimeout(timeoutId);
        console.warn(`[API] Request failed (attempt ${attempt + 1}/${retries + 1}) to ${fullUrl}:`, err.message);

        if (attempt === retries) {
          console.info(`[API] Falling back to Mock Adapter for endpoint: ${endpoint}`);
          return this.mockAdapter(endpoint, method, data);
        }
      }
    }
  },

  // GET helper
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  // POST helper
  post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', data });
  },

  // PUT / PATCH helper
  put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', data });
  },

  // DELETE helper
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },

  // Multipart Image Upload helper
  uploadImage(formData, options = {}) {
    return this.request(CONFIG.ENDPOINTS.IMAGE_UPLOAD, {
      ...options,
      method: 'POST',
      data: formData,
      isFormData: true
    });
  },

  // ==========================================
  // Mock Adapter Layer for Standalone / Offline
  // ==========================================
  async mockAdapter(endpoint, method, data) {
    // Artificial realistic delay (100ms - 400ms)
    await new Promise(r => setTimeout(r, 180));

    // 1. Auth Endpoints
    if (endpoint === CONFIG.ENDPOINTS.AUTH_LOGIN) {
      const { email, password } = data || {};
      const users = Storage.get(CONFIG.STORAGE_KEYS.USERS_LIST) || MockData.users;
      const foundUser = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || {
        id: 'USR-MOCK-01',
        employeeId: 'EMP-8842',
        name: 'Inspector Officer',
        email: email || 'inspector@metrology.gov.in',
        department: 'Legal Metrology Enforcement Directorate',
        role: email && email.includes('admin') ? 'Admin' : (email && email.includes('senior') ? 'Senior Inspector' : 'Inspector'),
        status: 'Active'
      };

      if (password === 'wrong_password') {
        throw new Error('Invalid credentials. Please verify your official email and password.');
      }

      const mockToken = `gov_jwt_${btoa(foundUser.email)}_${Date.now()}`;
      return {
        success: true,
        token: mockToken,
        user: foundUser,
        message: 'Authentication successful. Welcome to Legal Metrology Portal.'
      };
    }

    if (endpoint === CONFIG.ENDPOINTS.AUTH_REGISTER) {
      const users = Storage.get(CONFIG.STORAGE_KEYS.USERS_LIST) || MockData.users;
      const newUser = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        employeeId: data.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        department: data.department || 'Enforcement Wing',
        role: data.role || 'Inspector',
        status: 'Active',
        lastLogin: new Date().toISOString()
      };
      users.push(newUser);
      Storage.set(CONFIG.STORAGE_KEYS.USERS_LIST, users);
      return {
        success: true,
        user: newUser,
        message: 'Registration submitted successfully. Account authorized.'
      };
    }

    if (endpoint === CONFIG.ENDPOINTS.AUTH_ME) {
      return {
        success: true,
        user: Storage.get(CONFIG.STORAGE_KEYS.USER) || MockData.users[0]
      };
    }

    // 2. Inspections List & Create
    if (endpoint === CONFIG.ENDPOINTS.INSPECTIONS) {
      const inspections = Storage.get(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST) || MockData.inspections;
      if (method === 'POST') {
        const newInspection = {
          id: data.id || Utils.generateId('INS'),
          productName: data.productName || 'Unlabeled Packaged Commodity',
          category: data.category || 'Packaged Food & Confectionery',
          brand: data.brand || 'Unbranded / Local Pack',
          inspector: data.inspector || 'Rajesh Sharma (EMP-8842)',
          date: new Date().toISOString(),
          location: data.location || 'General Market Inspection, Sector 12',
          complianceStatus: 'PENDING',
          score: 0,
          violationsCount: 0,
          reviewStatus: 'In Progress',
          reportId: null,
          barcode: data.barcode || '',
          images: data.images || []
        };
        inspections.unshift(newInspection);
        Storage.set(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST, inspections);
        return { success: true, inspection: newInspection };
      }
      return { success: true, inspections };
    }

    // 3. Inspection Detail
    if (endpoint.startsWith('/api/inspections/')) {
      const id = endpoint.split('/api/inspections/')[1];
      const inspections = Storage.get(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST) || MockData.inspections;
      const found = inspections.find(i => i.id === id) || inspections[0];
      return { success: true, inspection: found };
    }

    // 4. Image Upload & OCR
    if (endpoint === CONFIG.ENDPOINTS.IMAGE_UPLOAD || endpoint === CONFIG.ENDPOINTS.OCR_PROCESS) {
      // Pick matching sample product from MockData
      const sample = MockData.sampleProducts[0];
      return {
        success: true,
        processingTimeMs: sample.ocrTimeMs,
        ocrText: sample.rawOcrText,
        confidence: sample.ocrConfidence,
        boundingBoxes: sample.boundingBoxes,
        language: 'English (Eng) + Hindi (Hin numerals)',
        imageQuality: {
          score: 94,
          status: 'High Quality',
          resolution: '1200x800'
        }
      };
    }

    // 5. AI Extraction
    if (endpoint === CONFIG.ENDPOINTS.AI_EXTRACT) {
      const sample = MockData.sampleProducts[0];
      return {
        success: true,
        extractedFields: sample.aiExtracted,
        overallConfidence: sample.ocrConfidence
      };
    }

    // 6. Compliance Evaluation
    if (endpoint === CONFIG.ENDPOINTS.COMPLIANCE_CHECK) {
      const sample = MockData.sampleProducts[0];
      return {
        success: true,
        complianceScore: sample.complianceScore,
        complianceStatus: sample.complianceStatus,
        ruleChecks: sample.ruleChecks,
        violations: sample.violations
      };
    }

    // 7. Rules Catalog
    if (endpoint === CONFIG.ENDPOINTS.RULES) {
      const rules = Storage.get(CONFIG.STORAGE_KEYS.RULES_LIST) || MockData.rules;
      return { success: true, rules };
    }

    // 8. Users Catalog
    if (endpoint === CONFIG.ENDPOINTS.USERS) {
      const users = Storage.get(CONFIG.STORAGE_KEYS.USERS_LIST) || MockData.users;
      return { success: true, users };
    }

    // 9. Notifications
    if (endpoint === CONFIG.ENDPOINTS.NOTIFICATIONS) {
      const notifications = Storage.get(CONFIG.STORAGE_KEYS.NOTIFICATIONS) || MockData.notifications;
      return { success: true, notifications };
    }

    // 10. System Status
    if (endpoint === CONFIG.ENDPOINTS.SYSTEM_STATUS) {
      return {
        success: true,
        lastSync: new Date().toISOString(),
        services: MockData.systemServices
      };
    }

    // Default Fallback
    return { success: true, message: 'Operation completed successfully (Mock Handler).' };
  }
};
