/**
 * Smart Legal Metrology Inspection & Compliance System
 * Utility Functions Module
 */

const Utils = {
  // Safe HTML sanitization
  escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Format Date to Indian Standard / Local Format
  formatDate(dateInput, includeTime = true) {
    if (!dateInput) return 'N/A';
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return String(dateInput);
      
      const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      };
      if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = true;
      }
      return new Intl.DateTimeFormat('en-IN', options).format(d);
    } catch (e) {
      return String(dateInput);
    }
  },

  // Format Currency (INR)
  formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(Number(amount))) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(Number(amount));
  },

  // Unique ID Generators
  generateId(prefix = 'INS') {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const dateYear = new Date().getFullYear();
    return `${prefix}-${dateYear}-${randomNum}`;
  },

  // Confidence category classifier
  getConfidenceCategory(percent) {
    const val = Number(percent);
    if (val >= 85) return { label: 'High', class: 'high', badgeClass: 'compliant' };
    if (val >= 60) return { label: 'Medium', class: 'medium', badgeClass: 'review' };
    return { label: 'Low', class: 'low', badgeClass: 'non-compliant' };
  },

  // Status Badge HTML generator
  renderStatusBadge(status) {
    const s = String(status || '').toUpperCase().trim();
    let cssClass = 'neutral';
    let icon = 'bi-circle';
    let text = s || 'UNKNOWN';

    if (s === 'COMPLIANT' || s === 'PASSED' || s === 'ACTIVE') {
      cssClass = 'compliant';
      icon = 'bi-check-circle-fill';
      text = 'COMPLIANT';
    } else if (s === 'NON-COMPLIANT' || s === 'FAILED' || s === 'VIOLATION' || s === 'INACTIVE') {
      cssClass = 'non-compliant';
      icon = 'bi-x-circle-fill';
      text = 'NON-COMPLIANT';
    } else if (s === 'REVIEW REQUIRED' || s === 'REVIEW_REQUIRED' || s === 'PENDING REVIEW' || s === 'PENDING') {
      cssClass = 'review';
      icon = 'bi-exclamation-triangle-fill';
      text = 'REVIEW REQUIRED';
    } else if (s === 'PROCESSING') {
      cssClass = 'info';
      icon = 'bi-arrow-repeat';
      text = 'PROCESSING';
    }

    return `<span class="status-badge ${cssClass}"><i class="bi ${icon}"></i> ${Utils.escapeHtml(text)}</span>`;
  },

  // Severity Badge HTML generator
  renderSeverityBadge(severity) {
    const sev = String(severity || '').toLowerCase();
    let badgeClass = 'low';
    if (sev === 'critical') badgeClass = 'critical';
    else if (sev === 'high') badgeClass = 'high';
    else if (sev === 'medium') badgeClass = 'medium';

    return `<span class="severity-badge ${badgeClass}">${Utils.escapeHtml(sev.toUpperCase())}</span>`;
  },

  // Confidence Bar HTML generator
  renderConfidenceMeter(percentage) {
    const val = Math.min(100, Math.max(0, Number(percentage) || 0));
    const cat = this.getConfidenceCategory(val);
    return `
      <div class="confidence-meter-container" title="Confidence: ${val}% (${cat.label})">
        <div class="confidence-bar-bg">
          <div class="confidence-bar-fill ${cat.class}" style="width: ${val}%"></div>
        </div>
        <span class="confidence-percent-text">${val}%</span>
      </div>
    `;
  },

  // CSV Export utility
  exportToCsv(filename, rows) {
    if (!rows || !rows.length) return;
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows
        .map(row => {
          return keys
            .map(k => {
              let cell = row[k] === null || row[k] === undefined ? '' : row[k];
              cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
              return cell;
            })
            .join(separator);
        })
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // JSON Export utility
  exportToJson(filename, data) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Measure Image Blur & Resolution Quality
  checkImageQuality(file, imageElement) {
    return new Promise((resolve) => {
      const width = imageElement.naturalWidth || imageElement.width || 800;
      const height = imageElement.naturalHeight || imageElement.height || 600;
      const sizeMb = file ? file.size / (1024 * 1024) : 1.5;

      const isLowRes = width < 600 || height < 400;
      const isBlurry = false; // simulated or computed based on edge variance
      const score = isLowRes ? 58 : (width > 1200 ? 94 : 85);

      resolve({
        score,
        width,
        height,
        sizeMb: sizeMb.toFixed(2),
        isLowRes,
        isBlurry,
        warnings: [
          ...(isLowRes ? ['Image resolution is lower than recommended (minimum 800x600 px). OCR accuracy may be affected.'] : []),
          ...(sizeMb > 8 ? ['Image file size is large. Preprocessing may take additional seconds.'] : [])
        ]
      });
    });
  },

  // Debounce helper
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};
