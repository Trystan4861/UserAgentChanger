/**
 * validations.js - Validation utilities for User-Agent Changer Extension
 * Handles all validation logic for user inputs and data structures
 */

// ============================================================================
// USER AGENT VALIDATION
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

// ============================================================================
// DOMAIN VALIDATION
// ============================================================================

/**
 * Validate a domain pattern (basic version)
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
// COLOR VALIDATION
// ============================================================================

/**
 * Validate hex color code
 * @param {string} color - Color code to validate
 * @returns {boolean} - True if valid
 */
function isValidHexColor(color) {
  return /^#[0-9A-F]{6}$/i.test(color);
}

// ============================================================================
// INITIALIZE
// ============================================================================

// Make functions available globally
window.validationsReady = true;
console.log('validations.js loaded successfully');
