/**
 * storage.js - Chrome Storage utilities for User-Agent Changer Extension
 * Handles all chrome.storage.local operations
 */

// ============================================================================
// BASIC STORAGE OPERATIONS
// ============================================================================

/**
 * Get data from chrome.storage.local
 * @param {string|string[]|null} keys - Keys to retrieve (null for all)
 * @returns {Promise<object>} - Retrieved data
 */
async function getStorage(keys = null) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => {
      resolve(result);
    });
  });
}

/**
 * Set data in chrome.storage.local
 * @param {object} items - Items to store
 * @returns {Promise<void>}
 */
async function setStorage(items) {
  return new Promise((resolve) => {
    chrome.storage.local.set(items, () => {
      resolve();
    });
  });
}

/**
 * Remove data from Chrome storage
 * @param {string|array} keys - Keys to remove
 * @returns {Promise<void>}
 */
function removeStorage(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(keys, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

// ============================================================================
// USER AGENT STORAGE
// ============================================================================

/**
 * Get all user agents from storage
 * @returns {Promise<Array>} - Array of user agents
 */
async function getUserAgents() {
  const result = await getStorage(['userAgents']);
  return result.userAgents || [];
}

/**
 * Save user agents to storage
 * @param {Array} userAgents - Array of user agents to save
 * @returns {Promise<void>}
 */
async function saveUserAgents(userAgents) {
  await setStorage({ userAgents });
}

/**
 * Get the currently active user agent ID
 * @returns {Promise<string>} - Active user agent ID
 */
async function getActiveId() {
  const result = await getStorage(['activeId']);
  return result.activeId || 'default';
}

/**
 * Set the active user agent ID
 * @param {string} id - User agent ID to set as active
 * @returns {Promise<void>}
 */
async function setActiveId(id) {
  await setStorage({ activeId: id });
}

/**
 * Find a user agent by ID
 * @param {string} id - User agent ID
 * @returns {Promise<object|null>} - User agent object or null if not found
 */
async function findUserAgentById(id) {
  const userAgents = await getUserAgents();
  return userAgents.find(ua => ua.id === id) || null;
}

/**
 * Get the current active user agent
 * @returns {Promise<object|null>} - Active user agent object or null
 */
async function getActiveUserAgent() {
  const data = await getStorage('activeUserAgent');
  return data.activeUserAgent || null;
}

/**
 * Set the active user agent
 * @param {object|null} userAgent - User agent object to set as active
 * @returns {Promise<void>}
 */
async function setActiveUserAgent(userAgent) {
  await setStorage({ activeUserAgent: userAgent });
}

// ============================================================================
// PERMANENT SPOOF STORAGE
// ============================================================================

/**
 * Get all permanent spoofs from storage
 * @returns {Promise<array>} - Array of permanent spoof objects
 */
async function getPermanentSpoofs() {
  const data = await getStorage('permanentSpoofs');
  return data.permanentSpoofs || [];
}

/**
 * Save permanent spoofs to storage
 * @param {array} spoofs - Array of permanent spoof objects
 * @returns {Promise<void>}
 */
async function savePermanentSpoofs(spoofs) {
  await setStorage({ permanentSpoofs: spoofs });
}

// ============================================================================
// EXPORT/IMPORT FUNCTIONS
// ============================================================================

/**
 * Export all settings to a JSON object
 * @returns {Promise<object>} - Settings object
 */
async function exportSettings() {
  const userAgents = await getUserAgents();
  const permanentSpoofs = await getPermanentSpoofs();
  const activeUserAgent = await getActiveUserAgent();
  
  return {
    version: chrome.runtime.getManifest().version,
    exportDate: new Date().toISOString(),
    userAgents,
    permanentSpoofs,
    activeUserAgent
  };
}

/**
 * Import settings from a JSON object
 * @param {object} settings - Settings object to import
 * @returns {Promise<object>} - { success: boolean, message: string }
 */
async function importSettings(settings) {
  try {
    // Validate settings structure
    if (!settings || typeof settings !== 'object') {
      throw new Error('Invalid settings format');
    }
    
    // Import user agents if present
    if (Array.isArray(settings.userAgents)) {
      await saveUserAgents(settings.userAgents);
    }
    
    // Import permanent spoofs if present
    if (Array.isArray(settings.permanentSpoofs)) {
      await savePermanentSpoofs(settings.permanentSpoofs);
    }
    
    // Import active user agent if present
    if (settings.activeUserAgent) {
      await setActiveUserAgent(settings.activeUserAgent);
    }
    
    return {
      success: true,
      message: 'Settings imported successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// ============================================================================
// INITIALIZE
// ============================================================================

// Make functions available globally
window.storageReady = true;
console.log('storage.js loaded successfully');
