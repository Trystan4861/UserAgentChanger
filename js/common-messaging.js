/**
 * messaging.js - Messaging utilities for User-Agent Changer Extension
 * Handles communication between frontend and background scripts
 */

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
// INITIALIZE
// ============================================================================

// Make functions available globally
window.messagingReady = true;
console.log('messaging.js loaded successfully');
