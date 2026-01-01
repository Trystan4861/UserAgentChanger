/**
 * utils.js - General utility functions for User-Agent Changer Extension
 * Shared utility functions used across the extension
 */

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
window.utilsReady = true;
console.log('utils.js loaded successfully');
