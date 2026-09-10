/**
 * Smart Legal Metrology Inspection & Compliance System
 * Realistic Mock Datasets & LMPC Rules 2011 Engine Data
 */

const MockData = {
  // LMPC Rules Catalog
  rules: [
    {
      id: 'LMPC-R6-1A',
      category: 'Mandatory Declarations',
      title: 'Manufacturer / Packer / Importer Identity & Address',
      description: 'The name and complete physical address of the manufacturer, or where the manufacturer is not the packer, the name and address of the manufacturer and packer, or in case of imported packages, the name and address of the importer.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(a)',
      severity: 'Critical',
      version: '2024.1',
      status: 'Active',
      effectiveDate: '2011-04-01',
      penaltySection: 'Section 36(1) of Legal Metrology Act, 2009'
    },
    {
      id: 'LMPC-R6-1B',
      category: 'Product Identification',
      title: 'Common or Generic Name of Commodity',
      description: 'The common or generic names of the commodity contained in the package and in case of packages containing more than one product, the name and number or quantity of each product.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(b)',
      severity: 'High',
      version: '2024.1',
      status: 'Active',
      effectiveDate: '2011-04-01',
      penaltySection: 'Section 36(1) of Legal Metrology Act, 2009'
    },
    {
      id: 'LMPC-R6-1C',
      category: 'Net Quantity',
      title: 'Net Quantity in Standard Units of Measurement',
      description: 'The net quantity, in terms of the standard unit of weight or measure, of the commodity contained in the package or where the commodity is packed or sold by number, the number of the commodity contained in the package.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(c) read with Rule 11 & 12',
      severity: 'Critical',
      version: '2024.1',
      status: 'Active',
      effectiveDate: '2011-04-01',
      penaltySection: 'Section 36(1) and Section 30 of Legal Metrology Act, 2009'
    },
    {
      id: 'LMPC-R6-1D',
      category: 'Manufacturing Details',
      title: 'Month and Year of Manufacture / Packing / Import',
      description: 'The month and year in which the commodity is manufactured, packed, or imported shall be clearly indicated on the principal display panel.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(d)',
      severity: 'High',
      version: '2024.1',
      status: 'Active',
      effectiveDate: '2011-04-01',
      penaltySection: 'Section 36(1) of Legal Metrology Act, 2009'
    },
    {
      id: 'LMPC-R6-1DA',
      category: 'Unit Sale Price',
      title: 'Unit Sale Price (USP) Declaration',
      description: 'Unit Sale Price shall be declared on packages where net quantity is greater than 1 kg / 1 L, or sold by number, expressed as Rs. per g/kg/ml/l/piece.',
      legalReference: 'Legal Metrology (Packaged Commodities) Amendment Rules, 2021, Rule 6(1)(da)',
      severity: 'Medium',
      version: '2024.1',
      status: 'Active',
      effectiveDate: '2022-12-01',
      penaltySection: 'Section 36(1) of Legal Metrology Act, 2009'
    },
    {
      id: 'LMPC-R6-1E',
      category: 'Pricing & Taxes',
      title: 'Retail Sale Price / MRP Inclusive of All Taxes',
      description: 'The retail sale price of the package shall be clearly printed in the format: "Maximum or Max. Retail Price Rs. / INR xx.xx (inclusive of all taxes)" or "MRP Rs. xx.xx (incl. of all taxes)".',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(e)',
      severity: 'Critical',
      version: '2024.1',
      status: 'Active',
      effectiveDate: '2011-04-01',
      penaltySection: 'Section 36(1) and Section 18 of Legal Metrology Act, 2009'
    },
    {
      id: 'LMPC-R6-1F',
      category: 'Consumer Redressal',
      title: 'Consumer Care Cell Details',
      description: 'Name, address, telephone number, and e-mail address of the person who can be contacted by the consumer in case of complaints or queries.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(f)',
      severity: 'High',
      version: '2024.1',
      status: 'Active',
      effectiveDate: '2011-04-01',
      penaltySection: 'Section 36(1) of Legal Metrology Act, 2009'
    },
    {
      id: 'LMPC-R6-1G',
      category: 'Origin of Goods',
      title: 'Country of Origin Declaration for Imported Commodities',
      description: 'Every package containing an imported commodity shall mention the name of the country of origin or manufacture on the principal display panel.',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(g)',
      severity: 'High',
      version: '2024.1',
      status: 'Active',
      effectiveDate: '2011-04-01',
      penaltySection: 'Section 36(1) of Legal Metrology Act, 2009'
    },
    {
      id: 'LMPC-R8',
      category: 'Typography & Visibility',
      title: 'Minimum Font Height of Numerals & Letters',
      description: 'The height of any numeral and letter in the declaration shall not be less than the minimum prescribed height according to the net quantity capacity table (Rule 8 Table 1).',
      legalReference: 'Legal Metrology (Packaged Commodities) Rules, 2011, Rule 8 & 9',
      severity: 'Medium',
      version: '2024.1',
      status: 'Active',
      effectiveDate: '2011-04-01',
      penaltySection: 'Section 36(1) of Legal Metrology Act, 2009'
    }
  ],

  // Sample Products for Demo Scanning
  sampleProducts: [
    {
      id: 'SAMPLE-01',
      name: 'NutriCrunch Almond & Honey Cookies (200g)',
      category: 'Packaged Food & Confectionery',
      brand: 'NutriCrunch Foods Ltd.',
      barcode: '8901234567890',
      expectedStatus: 'NON-COMPLIANT',
      image: 'assets/images/label-cookies.svg',
      rawOcrText: `NUTRICRUNCH ALMOND COOKIES
Crunchy Baked Biscuits with Roasted Californian Almonds
Mfd By: NutriCrunch Foods Pvt Ltd, Plot 42, GIDC Industrial Estate, Pune - 411028
Net Qty: 200 g
MRP: Rs. 65.00
Mfg Date: 08/2026 | Best Before 6 Months
Customer Care: care@nutricrunch.in | Tel: 1800-200-9988
Country of Origin: India | FSSAI Lic. No. 10014022002345`,
      ocrConfidence: 96.4,
      ocrTimeMs: 420,
      boundingBoxes: [
        { text: 'NUTRICRUNCH ALMOND COOKIES', box: [50, 40, 500, 40], confidence: 99 },
        { text: 'Mfd By: NutriCrunch Foods Pvt Ltd...', box: [70, 160, 460, 25], confidence: 98 },
        { text: 'Net Qty: 200 g', box: [70, 190, 180, 25], confidence: 97 },
        { text: 'MRP: Rs. 65.00', box: [70, 220, 160, 25], confidence: 95 },
        { text: 'Mfg Date: 08/2026', box: [70, 250, 200, 25], confidence: 94 },
        { text: 'Customer Care: care@nutricrunch.in', box: [70, 280, 440, 25], confidence: 96 }
      ],
      aiExtracted: {
        productName: { value: 'NutriCrunch Almond & Honey Cookies', confidence: 98, status: 'Extracted' },
        category: { value: 'Packaged Food & Confectionery', confidence: 96, status: 'Extracted' },
        manufacturer: { value: 'NutriCrunch Foods Pvt Ltd, Plot 42, GIDC Industrial Estate, Pune - 411028, Maharashtra', confidence: 95, status: 'Extracted' },
        netQuantity: { value: '200 g', confidence: 97, status: 'Extracted' },
        mrp: { value: 'Rs. 65.00 (Missing "incl. of all taxes" declaration)', confidence: 94, status: 'Extracted' },
        mfgDate: { value: '08/2026', confidence: 95, status: 'Extracted' },
        unitSalePrice: { value: 'Rs. 0.325 / g', confidence: 88, status: 'Extracted' },
        customerCare: { value: 'Email: care@nutricrunch.in, Tel: 1800-200-9988', confidence: 96, status: 'Extracted' },
        countryOfOrigin: { value: 'India', confidence: 99, status: 'Extracted' }
      },
      complianceScore: 78,
      complianceStatus: 'NON-COMPLIANT',
      ruleChecks: [
        { ruleId: 'LMPC-R6-1A', name: 'Manufacturer Name & Address', status: 'PASSED', confidence: 95, explanation: 'Full manufacturing entity name and complete postal PIN address detected.' },
        { ruleId: 'LMPC-R6-1B', name: 'Generic Commodity Name', status: 'PASSED', confidence: 98, explanation: 'Product clearly identifies commodity as "Cookies / Biscuits".' },
        { ruleId: 'LMPC-R6-1C', name: 'Net Quantity Standard Units', status: 'PASSED', confidence: 97, explanation: 'Expressed in standard metric unit "g" with proper spacing.' },
        { ruleId: 'LMPC-R6-1D', name: 'Month & Year of Packing', status: 'PASSED', confidence: 95, explanation: 'Month and Year "08/2026" declared prominently.' },
        { ruleId: 'LMPC-R6-1E', name: 'MRP & Tax Declaration', status: 'FAILED', confidence: 94, explanation: 'VIOLATION DETECTED: MRP stated as "Rs. 65.00" without the mandatory statutory phrase "(inclusive of all taxes)" or "incl. of all taxes". Violates Rule 6(1)(e).' },
        { ruleId: 'LMPC-R6-1F', name: 'Customer Care Details', status: 'PASSED', confidence: 96, explanation: 'Both email and toll-free telephone number are present.' },
        { ruleId: 'LMPC-R6-1G', name: 'Country of Origin', status: 'PASSED', confidence: 99, explanation: 'Declared as "India".' },
        { ruleId: 'LMPC-R8', name: 'Minimum Numeral Font Height', status: 'WARNING', confidence: 76, explanation: 'Font height of MRP numerals is approximately 1.8mm; recommended minimum for 200g package is 2.0mm.' }
      ],
      violations: [
        {
          id: 'VIO-2026-0104',
          ruleId: 'LMPC-R6-1E',
          category: 'Pricing & Taxes',
          severity: 'Critical',
          detectedEvidence: 'MRP: Rs. 65.00',
          expectedCondition: 'Maximum Retail Price ₹xx.xx (inclusive of all taxes)',
          explanation: 'Package declares price as "Rs. 65.00" omitting the statutory words "inclusive of all taxes" under Rule 6(1)(e).',
          recommendedAction: 'Issue Notice under Section 36(1) of Legal Metrology Act, 2009 for non-compliant retail price declaration.',
          status: 'Confirmed'
        }
      ]
    },
    {
      id: 'SAMPLE-02',
      name: 'GlowCare Herbal Brightening Face Wash (100ml)',
      category: 'Cosmetics & Personal Care',
      brand: 'GlowCare Botanicals Ltd.',
      barcode: '8908877665544',
      expectedStatus: 'REVIEW REQUIRED',
      image: 'assets/images/label-facewash.svg',
      rawOcrText: `GLOWCARE HERBAL FACE WASH
Purifying Neem & Organic Tea Tree Formulation
Marketed By: GlowCare Botanicals Pvt Ltd, 12 Park Street, Kolkata - 700016
Packed & Imported by: BioSkin Labs Co Ltd, Bangk0k Industrial Zone [LOW CONFIDENCE]
Net Volume: 100 ml | MRP: ₹ 185.00 (Inclusive of all taxes)
Unit Sale Price (USP): ₹ 1.85 / ml | Mfd: 07/2026 | Use Before: 06/2028
Consumer Care: support@glowcare.in | Tel: +91-33-22899988
Country of Origin: Thailand | Import Reg: COS-IMP-2024-8841`,
      ocrConfidence: 68.2,
      ocrTimeMs: 510,
      boundingBoxes: [
        { text: 'GLOWCARE HERBAL FACE WASH', box: [50, 40, 500, 40], confidence: 98 },
        { text: 'Marketed By: GlowCare Botanicals...', box: [70, 150, 460, 25], confidence: 94 },
        { text: 'Packed & Imported by: BioSkin Labs...', box: [70, 180, 440, 25], confidence: 54 },
        { text: 'Net Volume: 100 ml | MRP: ₹ 185.00...', box: [70, 210, 450, 25], confidence: 91 },
        { text: 'Consumer Care: support@glowcare.in', box: [70, 270, 440, 25], confidence: 58 }
      ],
      aiExtracted: {
        productName: { value: 'GlowCare Herbal Brightening Face Wash', confidence: 96, status: 'Extracted' },
        category: { value: 'Cosmetics & Personal Care', confidence: 95, status: 'Extracted' },
        manufacturer: { value: 'GlowCare Botanicals Pvt Ltd, 12 Park Street, Kolkata - 700016 (Marketed By); Importer address faint', confidence: 58, status: 'Low Confidence' },
        netQuantity: { value: '100 ml', confidence: 93, status: 'Extracted' },
        mrp: { value: '₹ 185.00 (Inclusive of all taxes)', confidence: 94, status: 'Extracted' },
        mfgDate: { value: '07/2026', confidence: 92, status: 'Extracted' },
        unitSalePrice: { value: '₹ 1.85 / ml', confidence: 90, status: 'Extracted' },
        customerCare: { value: 'support@glowcare.in | +91-33-22899988', confidence: 54, status: 'Low Confidence' },
        countryOfOrigin: { value: 'Thailand', confidence: 91, status: 'Extracted' }
      },
      complianceScore: 84,
      complianceStatus: 'REVIEW REQUIRED',
      ruleChecks: [
        { ruleId: 'LMPC-R6-1A', name: 'Manufacturer / Importer Address', status: 'REVIEW REQUIRED', confidence: 58, explanation: 'Packer / Importer address text is faint and has low OCR confidence (58%). Human verification required.' },
        { ruleId: 'LMPC-R6-1B', name: 'Generic Commodity Name', status: 'PASSED', confidence: 96, explanation: 'Face Wash generic title present.' },
        { ruleId: 'LMPC-R6-1C', name: 'Net Quantity Standard Units', status: 'PASSED', confidence: 93, explanation: 'Net quantity 100 ml in standard units.' },
        { ruleId: 'LMPC-R6-1D', name: 'Month & Year of Packing', status: 'PASSED', confidence: 92, explanation: '07/2026 present.' },
        { ruleId: 'LMPC-R6-1DA', name: 'Unit Sale Price (USP)', status: 'PASSED', confidence: 90, explanation: 'Unit Sale Price declared as ₹ 1.85 / ml.' },
        { ruleId: 'LMPC-R6-1E', name: 'MRP & Tax Declaration', status: 'PASSED', confidence: 94, explanation: 'Declared with statutory "Inclusive of all taxes" clause.' },
        { ruleId: 'LMPC-R6-1F', name: 'Customer Care Details', status: 'REVIEW REQUIRED', confidence: 54, explanation: 'Customer care contact number has unreadable digits. Needs manual review.' },
        { ruleId: 'LMPC-R6-1G', name: 'Country of Origin', status: 'PASSED', confidence: 91, explanation: 'Thailand declared as origin.' }
      ],
      violations: []
    },
    {
      id: 'SAMPLE-03',
      name: 'PureDrop Refined Sunflower Cooking Oil (1 Litre)',
      category: 'Edible Oils & Commodities',
      brand: 'PureDrop Agro Refineries',
      barcode: '8901122334455',
      expectedStatus: 'COMPLIANT',
      image: 'assets/images/label-sunfloweroil.svg',
      rawOcrText: `PUREDROP REFINED SUNFLOWER OIL
Enriched with Natural Vitamin A & D2 | 100% Pure Agmark Certified
Mfd & Packed By: PureDrop Agro Industries Ltd, Plot 18, MIDC Hingna Road, Nagpur - 440028
Net Quantity: 1 L (910 g) [Net Volume at 30°C]
MRP: ₹ 145.00 (Inclusive of all taxes)
Unit Sale Price (USP): ₹ 0.145 / ml (₹ 145.00 / L)
Packed on: 08/2026 | Customer Care: help@puredropagro.in | 1800-419-8822
Country of Origin: India | FSSAI Lic. No. 10018021003456 | Agmark Reg: AG/NGP/2022/8890`,
      ocrConfidence: 98.6,
      ocrTimeMs: 380,
      boundingBoxes: [
        { text: 'PUREDROP REFINED SUNFLOWER OIL', box: [50, 40, 500, 40], confidence: 99 },
        { text: 'Mfd & Packed By: PureDrop Agro...', box: [70, 150, 460, 25], confidence: 98 },
        { text: 'Net Quantity: 1 L (910 g)...', box: [70, 180, 400, 25], confidence: 99 },
        { text: 'MRP: ₹ 145.00 (Inclusive of all taxes)', box: [70, 210, 380, 25], confidence: 99 },
        { text: 'Unit Sale Price (USP): ₹ 0.145 / ml', box: [70, 240, 380, 25], confidence: 97 }
      ],
      aiExtracted: {
        productName: { value: 'PureDrop Refined Sunflower Cooking Oil', confidence: 99, status: 'Extracted' },
        category: { value: 'Edible Oils & Commodities', confidence: 98, status: 'Extracted' },
        manufacturer: { value: 'PureDrop Agro Industries Ltd, Plot 18, MIDC Hingna Road, Nagpur - 440028, Maharashtra', confidence: 99, status: 'Extracted' },
        netQuantity: { value: '1 L (910 g)', confidence: 99, status: 'Extracted' },
        mrp: { value: '₹ 145.00 (Inclusive of all taxes)', confidence: 99, status: 'Extracted' },
        mfgDate: { value: '08/2026', confidence: 98, status: 'Extracted' },
        unitSalePrice: { value: '₹ 145.00 / L (₹ 0.145 / ml)', confidence: 97, status: 'Extracted' },
        customerCare: { value: 'help@puredropagro.in, 1800-419-8822', confidence: 99, status: 'Extracted' },
        countryOfOrigin: { value: 'India', confidence: 99, status: 'Extracted' }
      },
      complianceScore: 100,
      complianceStatus: 'COMPLIANT',
      ruleChecks: [
        { ruleId: 'LMPC-R6-1A', name: 'Manufacturer Name & Address', status: 'PASSED', confidence: 99, explanation: 'Full name, unit address with MIDC location and 6-digit PIN code present.' },
        { ruleId: 'LMPC-R6-1B', name: 'Generic Commodity Name', status: 'PASSED', confidence: 98, explanation: 'Refined Sunflower Oil standard commodity name declared.' },
        { ruleId: 'LMPC-R6-1C', name: 'Net Quantity Standard Units', status: 'PASSED', confidence: 99, explanation: 'Dual unit specification for edible oils (Volume 1 L & Equivalent Mass 910 g at 30°C) fully compliant with Rule 12.' },
        { ruleId: 'LMPC-R6-1D', name: 'Month & Year of Packing', status: 'PASSED', confidence: 98, explanation: 'Packed on 08/2026 clearly declared.' },
        { ruleId: 'LMPC-R6-1DA', name: 'Unit Sale Price (USP)', status: 'PASSED', confidence: 97, explanation: 'USP properly calculated and printed as ₹ 145.00 / L.' },
        { ruleId: 'LMPC-R6-1E', name: 'MRP & Tax Declaration', status: 'PASSED', confidence: 99, explanation: 'MRP ₹ 145.00 (Inclusive of all taxes) exactly conforms to statutory phrasing.' },
        { ruleId: 'LMPC-R6-1F', name: 'Customer Care Details', status: 'PASSED', confidence: 99, explanation: 'Toll-free 1800 number and corporate grievance email present.' },
        { ruleId: 'LMPC-R6-1G', name: 'Country of Origin', status: 'PASSED', confidence: 99, explanation: 'Country of Origin India declared.' }
      ],
      violations: []
    },
    {
      id: 'SAMPLE-04',
      name: 'SoundMax Active Noise-Cancelling Earbuds Pro',
      category: 'Electronics & Hardware',
      brand: 'SoundMax Audio Ltd.',
      barcode: '8909988776611',
      expectedStatus: 'NON-COMPLIANT',
      image: 'assets/images/label-earbuds.svg',
      rawOcrText: `SOUNDMAX EARBUDS PRO WIRELESS
Active Noise Cancellation • 40H Battery Life • Bluetooth 5.4
Generic Name: True Wireless Stereo (TWS) Earbuds
Net Quantity: 1 Unit (1 N)
Marketed By: SoundMax Digital Ltd, 804 Cyber City, Gurugram - 122002
Country of Origin: [MISSING / NOT DECLARED ON PACKAGE]
MRP: ₹ 1,999.00 (Inclusive of all taxes) | Month of Import: 08/2026
Consumer Care: support@soundmaxaudio.in | Tel: +91-124-4890000`,
      ocrConfidence: 97.1,
      ocrTimeMs: 440,
      boundingBoxes: [
        { text: 'SOUNDMAX EARBUDS PRO WIRELESS', box: [50, 40, 500, 40], confidence: 99 },
        { text: 'Marketed By: SoundMax Digital...', box: [70, 150, 460, 25], confidence: 97 },
        { text: 'Net Quantity: 1 Unit (1 N)', box: [70, 180, 440, 25], confidence: 96 },
        { text: 'MRP: ₹ 1,999.00 (Inclusive of all taxes)', box: [70, 210, 420, 25], confidence: 98 }
      ],
      aiExtracted: {
        productName: { value: 'SoundMax Active Noise-Cancelling Earbuds Pro', confidence: 98, status: 'Extracted' },
        category: { value: 'Electronics & Hardware', confidence: 97, status: 'Extracted' },
        manufacturer: { value: 'SoundMax Digital Ltd, 804 Cyber City, Gurugram - 122002, Haryana', confidence: 96, status: 'Extracted' },
        netQuantity: { value: '1 Unit (1 N)', confidence: 95, status: 'Extracted' },
        mrp: { value: '₹ 1,999.00 (Inclusive of all taxes)', confidence: 98, status: 'Extracted' },
        mfgDate: { value: '08/2026 (Import Date)', confidence: 96, status: 'Extracted' },
        unitSalePrice: { value: '₹ 1,999.00 / N', confidence: 92, status: 'Extracted' },
        customerCare: { value: 'support@soundmaxaudio.in, +91-124-4890000', confidence: 97, status: 'Extracted' },
        countryOfOrigin: { value: 'MISSING (Not declared on package)', confidence: 99, status: 'Missing' }
      },
      complianceScore: 72,
      complianceStatus: 'NON-COMPLIANT',
      ruleChecks: [
        { ruleId: 'LMPC-R6-1A', name: 'Importer Name & Address', status: 'PASSED', confidence: 96, explanation: 'Importer identity and address present.' },
        { ruleId: 'LMPC-R6-1B', name: 'Generic Commodity Name', status: 'PASSED', confidence: 97, explanation: 'True Wireless Earbuds generic description included.' },
        { ruleId: 'LMPC-R6-1C', name: 'Net Quantity in Numbers (N)', status: 'PASSED', confidence: 95, explanation: 'Item count declared in standard symbol "N" conforming to Rule 12.' },
        { ruleId: 'LMPC-R6-1D', name: 'Month & Year of Import', status: 'PASSED', confidence: 96, explanation: 'Import date 08/2026 declared.' },
        { ruleId: 'LMPC-R6-1E', name: 'MRP & Tax Declaration', status: 'PASSED', confidence: 98, explanation: 'MRP with inclusive of taxes clause present.' },
        { ruleId: 'LMPC-R6-1F', name: 'Customer Care Details', status: 'PASSED', confidence: 97, explanation: 'Email and helpline present.' },
        { ruleId: 'LMPC-R6-1G', name: 'Country of Origin for Imported Commodity', status: 'FAILED', confidence: 99, explanation: 'CRITICAL VIOLATION: Package is declared as an imported commodity by an importer, but fails to mention the mandatory "Country of Origin / Country of Manufacture" on the label, violating Rule 6(1)(g).' }
      ],
      violations: [
        {
          id: 'VIO-2026-0105',
          ruleId: 'LMPC-R6-1G',
          category: 'Origin of Goods',
          severity: 'Critical',
          detectedEvidence: 'Package declares imported status without origin country.',
          expectedCondition: 'Country of Origin / Made in [Country Name]',
          explanation: 'Non-declaration of Country of Origin on imported electronic equipment under Rule 6(1)(g) of LMPC Rules, 2011.',
          recommendedAction: 'Seizure notice / Compound proceeding under Section 36(1) of Legal Metrology Act.',
          status: 'Confirmed'
        }
      ]
    },
    {
      id: 'SAMPLE-05',
      name: 'Royal Heritage Aged Basmati Rice (5kg)',
      category: 'Packaged Food & Confectionery',
      brand: 'Royal Agro Mills Ltd.',
      barcode: '8906655443322',
      expectedStatus: 'COMPLIANT',
      image: 'assets/images/label-rice.svg',
      rawOcrText: `ROYAL HERITAGE BASMATI RICE
Aged Long Grain Traditional Basmati Rice
Milled & Packed By: Royal Agro Mills Ltd, Grand Trunk Road, Karnal - 132001
Net Quantity: 5 kg | Unit Sale Price (USP): ₹ 115.00 / kg
MRP: ₹ 575.00 (Inclusive of all taxes)
Date of Packing: 08/2026 | Best Before 24 Months
Consumer Care: support@royalbasmati.in | Tel: 1800-180-2244
Country of Origin: India | FSSAI Lic. No. 10012064000189`,
      ocrConfidence: 99.1,
      ocrTimeMs: 360,
      boundingBoxes: [
        { text: 'ROYAL HERITAGE BASMATI RICE', box: [50, 40, 500, 40], confidence: 99 },
        { text: 'Milled & Packed By: Royal Agro...', box: [70, 150, 460, 25], confidence: 98 },
        { text: 'Net Quantity: 5 kg...', box: [70, 180, 400, 25], confidence: 99 },
        { text: 'MRP: ₹ 575.00 (Inclusive of all taxes)', box: [70, 210, 380, 25], confidence: 99 }
      ],
      aiExtracted: {
        productName: { value: 'Royal Heritage Aged Basmati Rice', confidence: 99, status: 'Extracted' },
        category: { value: 'Packaged Food & Confectionery', confidence: 98, status: 'Extracted' },
        manufacturer: { value: 'Royal Agro Mills Ltd, Grand Trunk Road, Karnal - 132001, Haryana', confidence: 99, status: 'Extracted' },
        netQuantity: { value: '5 kg', confidence: 99, status: 'Extracted' },
        mrp: { value: '₹ 575.00 (Inclusive of all taxes)', confidence: 99, status: 'Extracted' },
        mfgDate: { value: '08/2026', confidence: 98, status: 'Extracted' },
        unitSalePrice: { value: '₹ 115.00 / kg', confidence: 98, status: 'Extracted' },
        customerCare: { value: 'support@royalbasmati.in, 1800-180-2244', confidence: 99, status: 'Extracted' },
        countryOfOrigin: { value: 'India', confidence: 99, status: 'Extracted' }
      },
      complianceScore: 100,
      complianceStatus: 'COMPLIANT',
      ruleChecks: [
        { ruleId: 'LMPC-R6-1A', name: 'Mill & Packer Name & Address', status: 'PASSED', confidence: 99, explanation: 'Full miller and packaging address in Karnal present.' },
        { ruleId: 'LMPC-R6-1B', name: 'Generic Commodity Name', status: 'PASSED', confidence: 99, explanation: 'Traditional Basmati Rice commodity declared.' },
        { ruleId: 'LMPC-R6-1C', name: 'Net Quantity Standard Units', status: 'PASSED', confidence: 99, explanation: 'Standard mass 5 kg in metric units.' },
        { ruleId: 'LMPC-R6-1D', name: 'Month & Year of Packing', status: 'PASSED', confidence: 98, explanation: '08/2026 declared.' },
        { ruleId: 'LMPC-R6-1DA', name: 'Unit Sale Price (USP)', status: 'PASSED', confidence: 98, explanation: 'USP properly printed as ₹ 115.00 / kg.' },
        { ruleId: 'LMPC-R6-1E', name: 'MRP & Tax Declaration', status: 'PASSED', confidence: 99, explanation: 'Declared with full statutory tax statement.' },
        { ruleId: 'LMPC-R6-1F', name: 'Customer Care Details', status: 'PASSED', confidence: 99, explanation: 'Support email and toll-free helpline active.' },
        { ruleId: 'LMPC-R6-1G', name: 'Country of Origin', status: 'PASSED', confidence: 99, explanation: 'Country of origin India declared.' }
      ],
      violations: []
    }
  ],

  // Historical Inspections
  inspections: [
    {
      id: 'INS-2026-8801',
      productName: 'NutriCrunch Almond & Honey Cookies (200g)',
      category: 'Packaged Food & Confectionery',
      brand: 'NutriCrunch Foods Ltd.',
      inspector: 'Rajesh Sharma (EMP-8842)',
      date: '2026-09-08T10:30:00',
      location: 'Reliance Supermarket, Bandra West, Mumbai',
      complianceStatus: 'NON-COMPLIANT',
      score: 78,
      violationsCount: 1,
      reviewStatus: 'Confirmed Violation',
      reportId: 'REP-2026-8801',
      barcode: '8901234567890'
    },
    {
      id: 'INS-2026-8802',
      productName: 'PureDrop Refined Sunflower Cooking Oil (1 Litre)',
      category: 'Edible Oils & Commodities',
      brand: 'PureDrop Agro Refineries',
      inspector: 'Priya Sundaram (EMP-9104)',
      date: '2026-09-08T12:15:00',
      location: 'D-Mart Supercenter, Koramangala, Bengaluru',
      complianceStatus: 'COMPLIANT',
      score: 100,
      violationsCount: 0,
      reviewStatus: 'Verified Compliant',
      reportId: 'REP-2026-8802',
      barcode: '8901122334455'
    },
    {
      id: 'INS-2026-8803',
      productName: 'GlowCare Herbal Brightening Face Wash (100ml)',
      category: 'Cosmetics & Personal Care',
      brand: 'GlowCare Botanicals Ltd.',
      inspector: 'Amitabh Verma (EMP-7731)',
      date: '2026-09-09T09:45:00',
      location: 'Health & Glow Pharmacy, Connaught Place, New Delhi',
      complianceStatus: 'REVIEW REQUIRED',
      score: 84,
      violationsCount: 0,
      reviewStatus: 'Pending Human Verification',
      reportId: 'REP-2026-8803',
      barcode: '8908877665544'
    },
    {
      id: 'INS-2026-8804',
      productName: 'SoundMax Active Noise-Cancelling Earbuds Pro',
      category: 'Electronics & Hardware',
      brand: 'SoundMax Audio Ltd.',
      inspector: 'Rajesh Sharma (EMP-8842)',
      date: '2026-09-09T14:20:00',
      location: 'Croma Megastore, Phoenix Mall, Pune',
      complianceStatus: 'NON-COMPLIANT',
      score: 72,
      violationsCount: 1,
      reviewStatus: 'Escalated to Senior Inspector',
      reportId: 'REP-2026-8804',
      barcode: '8909988776611'
    },
    {
      id: 'INS-2026-8805',
      productName: 'AgroGold Premium Basmati Rice (5kg)',
      category: 'Packaged Food & Confectionery',
      brand: 'AgroGold Grains India',
      inspector: 'Kavita Patel (EMP-9220)',
      date: '2026-09-10T11:00:00',
      location: 'Big Bazaar, Navrangpura, Ahmedabad',
      complianceStatus: 'COMPLIANT',
      score: 98,
      violationsCount: 0,
      reviewStatus: 'Verified Compliant',
      reportId: 'REP-2026-8805',
      barcode: '8903344556677'
    },
    {
      id: 'INS-2026-8806',
      productName: 'MaxClean Antibacterial Detergent Bar (250g)',
      category: 'Household & Cleaning',
      brand: 'CleanCorp India',
      inspector: 'Amitabh Verma (EMP-7731)',
      date: '2026-09-10T15:30:00',
      location: 'Spencer Retail, Salt Lake, Kolkata',
      complianceStatus: 'NON-COMPLIANT',
      score: 65,
      violationsCount: 2,
      reviewStatus: 'Notice Issued',
      reportId: 'REP-2026-8806',
      barcode: '8905566778899'
    }
  ],

  // Mock Users
  users: [
    {
      id: 'USR-01',
      employeeId: 'EMP-8842',
      name: 'Rajesh Sharma',
      email: 'inspector@metrology.gov.in',
      phone: '+91 98765 43210',
      department: 'Enforcement Zone 1 (West)',
      role: 'Inspector',
      status: 'Active',
      lastLogin: '2026-09-10T20:15:00'
    },
    {
      id: 'USR-02',
      employeeId: 'EMP-9104',
      name: 'Priya Sundaram',
      email: 'senior.inspector@metrology.gov.in',
      phone: '+91 98765 43211',
      department: 'Standards & Compliance Directorate',
      role: 'Senior Inspector',
      status: 'Active',
      lastLogin: '2026-09-10T18:40:00'
    },
    {
      id: 'USR-03',
      employeeId: 'EMP-7700',
      name: 'Dr. Alok Nath',
      email: 'admin@metrology.gov.in',
      phone: '+91 98765 43212',
      department: 'Central Legal Metrology Administration',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2026-09-10T21:10:00'
    }
  ],

  // Mock Notifications
  notifications: [
    {
      id: 'NOTIF-01',
      title: 'Violation Confirmed on Imported Commodity',
      message: 'Inspection INS-2026-8804 for SoundMax Earbuds was flagged for missing Country of Origin declaration.',
      severity: 'Critical',
      type: 'violation',
      timestamp: '2026-09-10T14:35:00',
      read: false,
      inspectionId: 'INS-2026-8804'
    },
    {
      id: 'NOTIF-02',
      title: 'Low OCR Confidence Requires Human Review',
      message: 'Inspection INS-2026-8803 (GlowCare Face Wash) has low contrast text in manufacturer section.',
      severity: 'Medium',
      type: 'review',
      timestamp: '2026-09-10T10:00:00',
      read: false,
      inspectionId: 'INS-2026-8803'
    },
    {
      id: 'NOTIF-03',
      title: 'Official Compliance Report Ready',
      message: 'Government Inspection Report REP-2026-8802 has been digitally signed and archived.',
      severity: 'Low',
      type: 'report',
      timestamp: '2026-09-09T17:20:00',
      read: true,
      inspectionId: 'INS-2026-8802'
    }
  ],

  // System Services Health
  systemServices: [
    {
      name: 'Flask REST API Gateway',
      endpoint: 'http://localhost:5000/api',
      status: 'Online',
      responseTime: '42 ms',
      uptime: '99.98%',
      version: 'v2.4.0',
      description: 'Central REST endpoints routing inspection lifecycles.'
    },
    {
      name: 'OCR Processing Pipeline',
      endpoint: 'Tesseract 5.3 + EasyOCR Core',
      status: 'Online',
      responseTime: '380 ms',
      uptime: '99.95%',
      version: 'v5.3.4',
      description: 'Text bounding box segmentation and dual-language extraction.'
    },
    {
      name: 'Gemini Metrology AI Engine',
      endpoint: 'Gemini 1.5 Flash Microservice',
      status: 'Online',
      responseTime: '610 ms',
      uptime: '99.99%',
      version: 'Gemini-1.5-Flash',
      description: 'LMPC 2011 rule compliance extraction & entity parsing.'
    },
    {
      name: 'Legal Metrology Rules Database',
      endpoint: 'PostgreSQL 16 High-Availability',
      status: 'Online',
      responseTime: '12 ms',
      uptime: '100%',
      version: 'PG-16.2',
      description: 'Statutory rules catalog, audit trails, and inspection records.'
    },
    {
      name: 'Inspection Evidence Storage',
      endpoint: 'Encrypted S3 / MinIO Gov-Vault',
      status: 'Online',
      responseTime: '85 ms',
      uptime: '99.99%',
      version: 'MinIO-2024',
      description: 'Tamper-evident photographic evidence & report PDF storage.'
    },
    {
      name: 'n8n Workflow Automation',
      endpoint: 'n8n Enterprise Webhook Listener',
      status: 'Online',
      responseTime: '120 ms',
      uptime: '99.90%',
      version: 'n8n-1.35',
      description: 'Automated notice issuance, senior inspector dispatch, and SMS alerts.'
    }
  ]
};

// Initialize persistent mock collections in Storage if empty
if (!Storage.get(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST)) {
  Storage.set(CONFIG.STORAGE_KEYS.INSPECTIONS_LIST, MockData.inspections);
}
if (!Storage.get(CONFIG.STORAGE_KEYS.RULES_LIST)) {
  Storage.set(CONFIG.STORAGE_KEYS.RULES_LIST, MockData.rules);
}
if (!Storage.get(CONFIG.STORAGE_KEYS.USERS_LIST)) {
  Storage.set(CONFIG.STORAGE_KEYS.USERS_LIST, MockData.users);
}
if (!Storage.get(CONFIG.STORAGE_KEYS.NOTIFICATIONS)) {
  Storage.set(CONFIG.STORAGE_KEYS.NOTIFICATIONS, MockData.notifications);
}
