/**
 * User Agent Management Module
 * Handles getting the real user agent and constructing user agent strings
 */

/**
 * Function to get the real user agent from the browser
 * Uses Service Worker's own navigator.userAgent which is always available
 * @returns {Promise<string>} The real user agent string
 */
async function getRealUserAgent() {
  try {
    // Try to get from session storage first (cached for this browser session)
    const result = await chrome.storage.session.get(['defaultUserAgent']);
    if (result.defaultUserAgent) {
      return result.defaultUserAgent;
    }
    
    // Get the real UA from the service worker's own navigator object
    // This is the browser's actual UA and doesn't require any permissions
    const realUA = navigator.userAgent;
    
    // Store it in session storage for this browser session
    await chrome.storage.session.set({ defaultUserAgent: realUA });
    
    console.log('Real user agent obtained:', realUA);
    return realUA;
  } catch (error) {
    console.error('Error getting real user agent:', error);
    // Ultimate fallback - but this should never happen
    return navigator.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  }
}

/**
 * Update the real user agent cache
 * This refreshes the stored UA to ensure it's current
 * Called automatically on extension startup and can be called manually
 */
async function updateRealUserAgent() {
  try {
    const realUA = navigator.userAgent;
    await chrome.storage.session.set({ defaultUserAgent: realUA });
    console.log('Updated real user agent:', realUA);
    return realUA;
  } catch (error) {
    console.error('Error updating real user agent:', error);
    return null;
  }
}

/**
 * Set user-agent using declarativeNetRequest
 * @param {Object} userAgent - User agent object with id, userAgent, and mode
 * @param {number} tabId - Tab ID to set the user agent for
 */
async function setUserAgent(userAgent, tabId = null) {
  try {
    if (!tabId) {
      throw new Error('tabId is required for setUserAgent');
    }
    
    // Get existing session rules (tab-specific rules MUST use session scope for tabIds support)
    const existingRules = await chrome.declarativeNetRequest.getSessionRules();
    
    // If 'default' or 'auto' is selected, it's a global setting
    // Remove any tab-specific rule for this tab
    if (userAgent.id === 'default' || userAgent.id === 'auto') {
      // Remove tab-specific rule if exists
      const tabRuleId = tabId; // Use tabId as rule ID
      const tabRule = existingRules.find(rule => rule.id === tabRuleId);
      
      if (tabRule) {
        await chrome.declarativeNetRequest.updateSessionRules({
          removeRuleIds: [tabRuleId]
        });
      }
      
      // Update badge for this tab
      await updateBadgeForTab(tabId);
      return;
    }
    
    // For specific user-agent selection, create a tab-specific rule
    // Determine the final user-agent string
    let finalUserAgent;
    
    if (userAgent.mode === 'append') {
      const defaultUA = await getRealUserAgent();
      finalUserAgent = defaultUA + ' ' + userAgent.userAgent;
    } else {
      finalUserAgent = userAgent.userAgent;
    }
    
    // Manual selection always has priority 4 (highest)
    const priority = 4;
    
    // Use tabId as ruleId for per-tab rules
    const ruleId = tabId;
    
    // Remove existing rule for this tab if any
    const existingTabRule = existingRules.find(rule => rule.id === ruleId);
    if (existingTabRule) {
      await chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds: [ruleId]
      });
    }
    
    // Add new session rule to modify User-Agent header for this specific tab
    const newRule = {
      id: ruleId,
      priority: priority,
      action: {
        type: 'modifyHeaders',
        requestHeaders: [
          {
            header: 'user-agent',
            operation: 'set',
            value: finalUserAgent
          }
        ]
      },
      condition: {
        urlFilter: '*',
        tabIds: [tabId], // This is ONLY supported in session rules
        resourceTypes: [
          'main_frame',
          'sub_frame',
          'stylesheet',
          'script',
          'image',
          'font',
          'object',
          'xmlhttprequest',
          'ping',
          'csp_report',
          'media',
          'websocket',
          'webtransport',
          'webbundle',
          'other'
        ]
      }
    };
    
    await chrome.declarativeNetRequest.updateSessionRules({
      addRules: [newRule]
    });
    
    // Update badge for this tab
    await updateBadgeForTab(tabId);
    
  } catch (error) {
    console.error('Error setting user-agent:', error);
    throw error;
  }
}

/**
 * Get the User-Agent string for a given userAgentId
 * @param {string} userAgentId - ID of the user-agent
 * @returns {Promise<string|null>} - User-Agent string or null if not found
 */
async function getUserAgentString(userAgentId) {
  try {
    const result = await chrome.storage.local.get(['userAgents']);
    const userAgents = result.userAgents || [];
    const ua = userAgents.find(u => u.id === userAgentId);
    
    if (!ua || !ua.userAgent) {
      return null;
    }
    
    // Handle append mode
    if (ua.mode === 'append') {
      const defaultUA = await getRealUserAgent();
      return defaultUA + ' ' + ua.userAgent;
    }
    
    return ua.userAgent;
  } catch (error) {
    console.error('Error getting user-agent string:', error);
    return null;
  }
}
