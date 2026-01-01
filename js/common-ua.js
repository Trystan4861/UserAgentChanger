/**
 * ua.js - User Agent utilities for User-Agent Changer Extension
 * Handles user agent related operations
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
// INITIALIZE
// ============================================================================

// Make functions available globally
window.uaReady = true;
console.log('ua.js loaded successfully');
