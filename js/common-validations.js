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
// STRING NORMALIZATION
// ============================================================================

/**
 * Normalizes a string by converting it to lowercase and removing accents
 * @param {string} str - The string to normalize
 * @returns {string} The normalized string
 */
function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Checks if a string contains only alphanumeric characters and single spaces
 * @param {string} str - The string to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidAlphanumericWithSpaces(str) {
  // Check for invalid characters (only a-zA-Z0-9 and space allowed)
  if (!/^[a-zA-Z0-9 ]+$/.test(str)) {
    return false;
  }
  
  // Check for multiple consecutive spaces
  if (/  /.test(str)) {
    return false;
  }
  
  return true;
}

/**
 * Checks if an alias is reserved or already exists
 * @param {string} alias - The alias to check
 * @param {Array} userAgents - Array of existing user agents
 * @returns {Object} Object with isValid and error message
 */
function validateAlias(alias, userAgents) {
  const trimmedAlias = alias.trim();
  
  // Check for invalid characters
  if (!isValidAlphanumericWithSpaces(trimmedAlias)) {
    return { isValid: false, error: i18n.getMessage('validationAliasInvalidChars') };
  }
  
  const normalizedAlias = normalizeString(trimmedAlias);
  
  // Check for reserved words
  const reservedAliases = ['auto', 'def'];
  if (reservedAliases.includes(normalizedAlias)) {
    return { isValid: false, error: `"${trimmedAlias}" ${i18n.getMessage('validationAliasReserved')}` };
  }
  
  // Check if alias already exists
  const aliasExists = userAgents.some(ua => 
    normalizeString(ua.alias) === normalizedAlias
  );
  
  if (aliasExists) {
    return { isValid: false, error: i18n.getMessage('validationAliasExists') };
  }
  
  return { isValid: true };
}

/**
 * Checks if a name is reserved or already exists
 * @param {string} name - The name to check
 * @param {Array} userAgents - Array of existing user agents
 * @returns {Object} Object with isValid and error message
 */
function validateName(name, userAgents) {
  const trimmedName = name.trim();
  
  // Check for invalid characters
  if (!isValidAlphanumericWithSpaces(trimmedName)) {
    return { isValid: false, error: i18n.getMessage('validationNameInvalidChars') };
  }
  
  const normalizedName = normalizeString(trimmedName);
  
  // Check for reserved words
  const reservedNames = ['auto', 'default'];
  if (reservedNames.includes(normalizedName)) {
    return { isValid: false, error: `"${trimmedName}" ${i18n.getMessage('validationNameReserved')}` };
  }
  
  // Check if name already exists
  const nameExists = userAgents.some(ua => 
    normalizeString(ua.name) === normalizedName
  );
  
  if (nameExists) {
    return { isValid: false, error: i18n.getMessage('validationNameExists') };
  }
  
  return { isValid: true };
}

// ============================================================================
// INITIALIZE
// ============================================================================

// Make functions available globally
window.validationsReady = true;
console.log('validations.js loaded successfully');
