/**
 * commons.js - Shared utilities for User-Agent Changer Extension
 * Used by both popup.html and options.html
 */

// ============================================================================
// USER AGENT UTILITIES
// ============================================================================

/**
 * Generate a unique ID for user agents
 * @returns {string} - Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ============================================================================
// VERSION UTILITIES
// ============================================================================

/**
 * Get manifest version
 * @returns {string} - Extension version
 */
function getExtensionVersion() {
  return chrome.runtime.getManifest().version;
}

/**
 * Update version display in the UI
 */
function updateVersionDisplay() {
  const versionElements = document.querySelectorAll('#extensionVersion');
  const version = getExtensionVersion();
  versionElements.forEach(el => {
    el.textContent = `v${version}`;
  });
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate a user agent string
 * @param {string} userAgent - User agent string to validate
 * @returns {boolean} - True if valid
 */
function isValidUserAgent(userAgent) {
  return userAgent && typeof userAgent === 'string' && userAgent.trim().length > 0;
}

/**
 * Validate a domain pattern
 * @param {string} domain - Domain pattern to validate
 * @returns {boolean} - True if valid
 */
function isValidDomain(domain) {
  if (!domain || typeof domain !== 'string') {
    return false;
  }
  
  domain = domain.trim();
  
  // Remove protocol if present
  domain = domain.replace(/^https?:\/\//, '');
  
  // Basic validation: should contain at least one dot or be localhost
  return domain.length > 0 && (domain.includes('.') || domain.startsWith('localhost'));
}

/**
 * Validate hex color code
 * @param {string} color - Color code to validate
 * @returns {boolean} - True if valid
 */
function isValidHexColor(color) {
  return /^#[0-9A-F]{6}$/i.test(color);
}

/**
 * Validate a user agent object
 * @param {object} userAgent - User agent object to validate
 * @returns {object} - { valid: boolean, errors: array }
 */
function validateUserAgent(userAgent) {
  const errors = [];
  
  if (!userAgent.name || userAgent.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!userAgent.alias || userAgent.alias.trim() === '') {
    errors.push('Alias is required');
  } else if (userAgent.alias.length > 4) {
    errors.push('Alias must be 4 characters or less');
  }
  
  if (!userAgent.userAgent || userAgent.userAgent.trim() === '') {
    errors.push('User-Agent string is required');
  }
  
  if (!userAgent.mode || !['replace', 'append'].includes(userAgent.mode)) {
    errors.push('Invalid mode');
  }
  
  if (!userAgent.badgeBgColor || !/^#[0-9A-F]{6}$/i.test(userAgent.badgeBgColor)) {
    errors.push('Invalid badge background color');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate a domain pattern (extended version)
 * @param {string} domain - Domain pattern to validate
 * @returns {boolean} - True if valid
 */
function validateDomain(domain) {
  if (!domain || domain.trim() === '') {
    return false;
  }
  
  // Allow wildcards and paths
  // Examples: example.com, *.example.com, localhost/core/*
  const domainRegex = /^(\*\.)?[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)*(\/[^\s]*)?$/;
  return domainRegex.test(domain.trim());
}

// ============================================================================
// MESSAGING FUNCTIONS
// ============================================================================

/**
 * Send a message to the background script
 * @param {object} message - Message object to send
 * @returns {Promise<any>} - Response from background script
 */
function sendMessageToBackground(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} - Cloned object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} - Debounced function
 */
function debounce(func, wait) {
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

// ============================================================================
// INITIALIZE
// ============================================================================

// Make functions available globally
window.commonsReady = true;
console.log('commons.js loaded successfully');
