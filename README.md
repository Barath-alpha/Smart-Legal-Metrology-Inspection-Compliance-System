# Smart Legal Metrology Inspection & Compliance System (SLM-ICS)
### Enterprise-Grade Frontend Platform for Statutory Inspection of Packaged Commodities
**Statutory Framework**: Legal Metrology Act, 2009 &amp; Legal Metrology (Packaged Commodities) Rules, 2011 (as amended).

---

## 1. System Overview
The **Smart Legal Metrology Inspection & Compliance System (SLM-ICS)** is a government-grade digital inspection platform designed for Legal Metrology Officers, Senior Enforcement Officers, and Central Directorate Administrators. It provides an automated, AI-assisted workflow for verifying compliance of packaged commodities sold across retail, wholesale, and e-commerce supply chains.

### Statutory Rule Engines Enforced (LMPC Rules, 2011)
- **Rule 6(1)(a)**: Verification of complete manufacturer, packer, or importer name and physical address with postal PIN code.
- **Rule 6(1)(b)**: Generic/common commodity name validation.
- **Rule 6(1)(c)**: Net quantity validation in standard metric units ($g, kg, ml, l, N$) and dual declarations for edible oils (Rule 12).
- **Rule 6(1)(d)**: Manufacturing, packing, or import month & year check.
- **Rule 6(1)(da)**: Unit Sale Price (USP) per $g, kg, ml, l, N$ calculation and declaration.
- **Rule 6(1)(e)**: Retail Sale Price (MRP) mandatory statutory statement `"inclusive of all taxes"`.
- **Rule 6(1)(f)**: Consumer grievance cell details (name, email, telephone).
- **Rule 6(1)(g)**: Country of Origin declaration for imported goods.
- **Rule 8 & 9**: Minimum numeral and letter font height based on area of principal display panel.
- **Section 36(1) & 18**: Penalty determination and statutory notice dispatch under Legal Metrology Act, 2009.

---

## 2. Key Architecture & File Structure

```
Smart Legal Metrology Inspection & Compliance System/
├── index.html                   # Master application shell & 22 integrated modular views
├── login.html                   # Dedicated standalone login gateway
├── register.html                # Dedicated authorized officer registration
├── dashboard.html               # Standalone direct route gateway to Dashboard
├── new-inspection.html          # Standalone direct route gateway to New Inspection
├── scanner.html                 # Standalone direct route gateway to Optical Scanner
├── processing.html              # Standalone direct route gateway to Preprocessing Pipeline
├── ocr.html                     # Standalone direct route gateway to OCR Split Workspace
├── ai-analysis.html             # Standalone direct route gateway to AI Structured Fields
├── compliance.html              # Standalone direct route gateway to Compliance Matrix
├── violations.html              # Standalone direct route gateway to Violations & Evidence
├── verification.html            # Standalone direct route gateway to Human Review Desk
├── inspection-summary.html      # Standalone direct route gateway to Dossier Summary
├── history.html                 # Standalone direct route gateway to Inspection Registry
├── inspection-details.html      # Standalone direct route gateway to Audit Lifecycle
├── reports.html                 # Standalone direct route gateway to Reports Registry
├── report-preview.html          # Standalone direct route gateway to Certificate Preview
├── analytics.html               # Standalone direct route gateway to Charts & Analytics
├── rules.html                   # Standalone direct route gateway to LMPC Rules Catalog
├── users.html                   # Standalone direct route gateway to Officer Directory
├── notifications.html           # Standalone direct route gateway to Alert Center
├── settings.html                # Standalone direct route gateway to Settings & API Config
├── status.html                  # Standalone direct route gateway to Service Health
├── README.md                    # System architecture, API contracts & user guide
├── css/
│   ├── base.css                 # Design tokens, CSS variables, typography, reset rules
│   ├── components.css           # Buttons, KPI cards, badges, stepper, tables, toasts, drawer, copilot
│   ├── pages.css                # Scanner viewport, OCR split workspace, compliance gauge, reports
│   ├── print.css                # A4 print stylesheet for official government certificates
│   └── responsive.css           # Responsive breakpoints (320px to 2560px ultrawide)
├── js/
│   ├── config.js                # Endpoints, constants, storage keys, versioning
│   ├── storage.js               # Safe localStorage & sessionStorage abstraction
│   ├── utils.js                 # Formatting, sanitization, confidence meters, CSV/JSON export
│   ├── mock-data.js             # LMPC 2011 rules database, 5 sample products, historical audits
│   ├── api.js                   # Fetch API client with Bearer Auth, retries, multipart & Mock Adapter
│   ├── auth.js                  # Authentication & role management (Inspector, Senior Inspector, Admin)
│   ├── ui-components.js         # Toasts, confirmation dialogs, loaders, breadcrumbs, drawer
│   ├── dashboard.js             # Dashboard KPIs, trend charts, pending action queues
│   ├── new-inspection.js        # New inspection metadata form & preset loader
│   ├── scanner.js               # WebRTC camera capture, upload, drag & drop, rotate, zoom, crop
│   ├── image-processing.js      # Multi-stage preprocessing pipeline animation & metrics
│   ├── ocr.js                   # OCR split-screen viewer, bounding box canvas, raw text editor
│   ├── ai-analysis.js           # Structured field cards, inline editing, dirty state tracking
│   ├── compliance.js            # Compliance evaluation engine, score gauge, legal citation checks
│   ├── violations.js            # Visual evidence cards, extracted vs expected diffs, officer actions
│   ├── human-verification.js    # Low-confidence human review desk with side-by-side verification
│   ├── summary.js               # Consolidated inspection dossier summary & officer signoff
│   ├── reports.js               # Official government inspection report with QR verification
│   ├── history.js               # Filterable audit registry, search, pagination, CSV/JSON export
│   ├── inspection-details.js    # Immutable inspection audit timeline & image gallery
│   ├── analytics.js             # Chart.js analytics for volume, compliance trends & violation categories
│   ├── admin-rules.js           # LMPC rules catalog CRUD manager (Admin)
│   ├── admin-users.js           # Officer directory & access management (Admin)
│   ├── notifications.js         # Alert center with unread counter & inspection quick-links
│   ├── settings.js              # Officer profile, theme toggle, Flask API Base URL configuration
│   ├── system-status.js         # Live service health monitor (Flask, OCR, AI, DB, Storage)
│   ├── copilot.js               # AI Statutory Copilot Assistant drawer with legal explanations
│   ├── batch-inspection.js      # Multi-product batch queue processor & export
│   ├── router.js                # Single-page client-side router & route protection
│   └── app.js                   # Main application bootstrap & event orchestrator
└── assets/
    └── images/                  # High-resolution SVG labels & official government seal
        ├── label-cookies.svg    # NutriCrunch Cookies 200g (Rule 6(1)(e) MRP violation)
        ├── label-facewash.svg   # GlowCare Face Wash 100ml (Faint address - Review Required)
        ├── label-sunfloweroil.svg # PureDrop Sunflower Oil 1L (100% Compliant)
        ├── label-earbuds.svg    # SoundMax Earbuds Pro (Missing Country of Origin violation)
        ├── label-rice.svg       # Royal Basmati Rice 5kg (Standard Net Mass & USP Compliant)
        └── govt-seal.svg        # Official Directorate of Legal Metrology Seal
```

---

## 3. How to Run & Test the Application

### Option A: Using Python (Recommended)
Open a terminal in the root directory:
```bash
python -m http.server 8000
```
Then navigate in your browser to:
`http://localhost:8000`

### Option B: Using Node.js
```bash
npx serve .
```

### Option C: Direct File Browser Opening
You can directly double-click and open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari).

---

## 4. Default Demo Accounts

For standalone demo and offline evaluation, the following pre-configured credentials are ready to use:

| Role | Email | Password | Authorized Scope |
| :--- | :--- | :--- | :--- |
| **Inspector** | `inspector@metrology.gov.in` | `inspector123` | Full Inspection Workflow, Scanner, OCR, AI, Summary, Reports |
| **Senior Inspector** | `senior.inspector@metrology.gov.in` | `senior123` | All Inspector Features + Review Escalations & Sign-offs |
| **Administrator** | `admin@metrology.gov.in` | `admin123` | Complete Portal Access + LMPC Rules Catalog & Officer Directory |

---

## 5. The Complete Inspection Workflow

1. **Sign In (`#login`)**: Authenticate with official credentials or use one-click demo presets.
2. **Dashboard (`#dashboard`)**: Review KPI metrics, inspection volume trends, and pending action queues.
3. **New Inspection (`#new-inspection`)**: Enter inspection location, retailer particulars, product category, and choose a quick preset.
4. **Optical Scanner (`#scanner`)**:
   - Activate live camera stream or upload high-res label images.
   - Select between Front, Back, Side, or Weights panels.
   - Use Rotate ($90^\circ$), Zoom in/out, and Reset tools.
   - Check real-time Image Quality Score (e.g. 96% High Quality).
5. **Preprocessing Pipeline (`#image-processing`)**: Watch the automated signal normalization (Binarization, Deskewing, Noise Reduction, Contrast Equalization).
6. **OCR Results (`#ocr`)**:
   - Split-pane interface with original image + interactive bounding box overlays on the left.
   - Extracted text, candidate tags, and character counter on the right with copy and edit actions.
7. **AI Structured Fields (`#ai-analysis`)**:
   - Entities parsed against Rule 6 mandatory declarations (Manufacturer, Net Qty, MRP, Mfg Date, USP, Customer Care, Origin).
   - Inline editing, confidence meters, and dirty state tracking.
8. **Compliance Analysis (`#compliance`)**:
   - Visual compliance score gauge ($0-100\%$) and statutory verdict (`COMPLIANT`, `NON-COMPLIANT`, `REVIEW REQUIRED`).
   - Detailed rule evaluation matrix citing specific sections of LMPC Rules 2011.
9. **Violations & Evidence (`#violations`)**:
   - Photographic proof cards highlighting detected package values vs mandatory statutory requirements.
   - Inspector decision buttons: `Confirm Violation`, `Mark False Positive`, `Require Manual Review`.
10. **Human Verification (`#human-verification`)**:
    - Dedicated desk for low-confidence text regions with side-by-side diffing and officer signature sign-off.
11. **Inspection Dossier Summary (`#summary`)**:
    - Comprehensive examination summary, final statutory action commitment, and officer remarks.
12. **Official Government Report (`#reports` / `#report-preview`)**:
    - Legally admissible A4 portrait inspection certificate with National Emblem, verification QR code, digital seal, and print-optimized CSS.
13. **Inspection Registry (`#history`)**:
    - Searchable, sortable historical logs with CSV and JSON data export.
14. **Analytics (`#analytics`)**:
    - Interactive Chart.js graphs displaying daily volume, compliance trends, and violation category distributions.
15. **AI Inspection Copilot**:
    - Slide-over legal advisor answering questions on Rule 6, Rule 8 font heights, Rule 18 retail prices, and Section 36 penalties.
16. **Batch Inspection Queue**:
    - Multi-commodity queue manager with real-time state transitions and batch CSV export.

---

## 6. Python Flask REST API Integration

The application is architected with a centralized API layer (`js/api.js`) that is 100% compatible with a Python Flask REST API backend.

### Connecting to Real Flask Backend
1. Start your Python Flask API server on `http://localhost:5000`.
2. Go to **Settings (`#settings`)** in the application.
3. In the **Flask REST API Base URL** field, ensure `http://localhost:5000` is entered.
4. Toggle **Enable Standalone Mock Adapter** to **OFF**.
5. Click **Test API Connection** and **Save API Config**.

### Flask Endpoints Specification & Contracts

#### 1. `POST /api/auth/login`
```json
// Request
{
  "email": "inspector@metrology.gov.in",
  "password": "inspector123"
}
// Response (200 OK)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USR-01",
    "employeeId": "EMP-8842",
    "name": "Rajesh Sharma",
    "email": "inspector@metrology.gov.in",
    "department": "Enforcement Zone 1 (West)",
    "role": "Inspector"
  }
}
```

#### 2. `POST /api/images/upload` & `POST /api/ocr/process`
```json
// Request (Multipart FormData or Base64 JSON)
{
  "inspectionId": "INS-2026-8801",
  "image": "data:image/svg+xml;base64,..."
}
// Response (200 OK)
{
  "success": true,
  "processingTimeMs": 420,
  "ocrText": "NUTRICRUNCH ALMOND COOKIES\nNet Qty: 200 g\nMRP: Rs. 65.00...",
  "confidence": 96.4,
  "language": "English (IN)",
  "boundingBoxes": [
    { "text": "Net Qty: 200 g", "box": [70, 190, 180, 25], "confidence": 97 },
    { "text": "MRP: Rs. 65.00", "box": [70, 220, 160, 25], "confidence": 95 }
  ]
}
```

#### 3. `POST /api/ai/extract`
```json
// Request
{
  "ocrText": "NUTRICRUNCH ALMOND COOKIES\nNet Qty: 200 g\nMRP: Rs. 65.00..."
}
// Response (200 OK)
{
  "success": true,
  "extractedFields": {
    "productName": { "value": "NutriCrunch Almond & Honey Cookies", "confidence": 98 },
    "netQuantity": { "value": "200 g", "confidence": 97 },
    "mrp": { "value": "Rs. 65.00", "confidence": 94 },
    "mfgDate": { "value": "08/2026", "confidence": 95 },
    "unitSalePrice": { "value": "Rs. 0.325 / g", "confidence": 88 },
    "manufacturer": { "value": "NutriCrunch Foods Pvt Ltd, Pune - 411028", "confidence": 95 }
  }
}
```

#### 4. `POST /api/compliance/check`
```json
// Request
{
  "inspectionId": "INS-2026-8801",
  "extractedFields": { ... }
}
// Response (200 OK)
{
  "success": true,
  "complianceScore": 78,
  "complianceStatus": "NON-COMPLIANT",
  "ruleChecks": [
    { "ruleId": "LMPC-R6-1E", "name": "MRP & Tax Declaration", "status": "FAILED", "explanation": "Statutory phrase '(inclusive of all taxes)' is missing." }
  ],
  "violations": [
    {
      "id": "VIO-2026-0104",
      "ruleId": "LMPC-R6-1E",
      "category": "Pricing & Taxes",
      "severity": "Critical",
      "detectedEvidence": "MRP: Rs. 65.00",
      "expectedCondition": "Maximum Retail Price ₹xx.xx (inclusive of all taxes)",
      "recommendedAction": "Issue Notice under Section 36(1) of Legal Metrology Act, 2009."
    }
  ]
}
```

---

## 7. Responsive Breakpoint & Device Matrix

The application layout has been engineered and tested across the full spectrum of screen sizes and aspect ratios:

| Device Class | Viewport Width | Aspect Ratio Mental Model | Layout Optimization |
| :--- | :--- | :--- | :--- |
| **Small Mobile** | $320\text{px} - 375\text{px}$ | $9:16$ Portrait | Full single-column, touch-friendly touch targets ($>44\text{px}$), stacked KPI cards, offcanvas sidebar drawer. |
| **Standard Mobile** | $375\text{px} - 425\text{px}$ | $9:16$ Portrait | Prominent live camera viewport, collapsible filter accordions, card-based table transformation. |
| **Tablet** | $768\text{px}$ | $4:3$ Portrait/Landscape | Balanced 2-column inspection grids, split preview panels, touch-optimized stepper controls. |
| **Laptop** | $1024\text{px} - 1280\text{px}$ | $16:10$ | Semi-fixed persistent sidebar, split OCR dual-pane, detailed tabular grids. |
| **Desktop / Full HD**| $1440\text{px} - 1920\text{px}$ | $16:9$ | Comprehensive multi-column dashboard, side-by-side image canvas and live text editor ($600\text{px}$ height). |
| **Ultrawide & 4K** | $2560\text{px}+$ | $21:9$ | Max-width content constraint ($2200\text{px}$), 4-column service health grids, balanced whitespace without distortion. |
| **Print / PDF** | A4 Portrait | $210\text{mm} \times 297\text{mm}$ | Official government certificate styling with clean black/gold headers, signature blocks, and verification QR code. |

---

## 8. Security & Zero Secret Exposure
- **No Client-Side Secrets**: Never expose Gemini API keys, AWS credentials, or backend database secrets in client JavaScript.
- **Bearer Token Auth**: Authorization tokens are passed strictly in HTTP headers (`Authorization: Bearer <token>`).
- **Input Sanitization**: All user-supplied and OCR-parsed strings are sanitized via `Utils.escapeHtml()` to prevent XSS.
- **HTTPS & WebRTC**: Camera access strictly adheres to browser `navigator.mediaDevices.getUserMedia` security standards.

---

## 9. License & Compliance
This software is developed for statutory verification under the **Department of Consumer Affairs, Government of India**, adhering to the provisions of the **Legal Metrology Act, 2009** and **Legal Metrology (Packaged Commodities) Rules, 2011**.
