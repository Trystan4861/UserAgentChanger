/**
 * version.js - Version utilities for User-Agent Changer Extension
 * Handles extension version display and management
 */

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
// INITIALIZE
// ============================================================================

// Make functions available globally
window.versionReady = true;
console.log('version.js loaded successfully');
