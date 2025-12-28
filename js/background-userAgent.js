/**
 * User Agent Management Module
 * Handles getting the real user agent and constructing user agent strings
 */

/**
 * Function to get the real user agent from the browser
 * @returns {Promise<string>} The real user agent string
 */
async function getRealUserAgent() {
  try {
    // Try to get from storage first
    const result = await chrome.storage.local.get(['defaultUserAgent']);
    if (result.defaultUserAgent) {
      return result.defaultUserAgent;
    }
    
    // If not in storage, get it by executing a script in a tab
    const tabs = await chrome.tabs.query({});
    if (tabs.length > 0) {
      // Find a tab with a valid URL (not chrome:// or extension pages)
      const validTab = tabs.find(tab => 
        tab.url && 
        (tab.url.startsWith('http://') || tab.url.startsWith('https://'))
      );
      
      if (validTab) {
        const results = await chrome.scripting.executeScript({
          target: { tabId: validTab.id },
          func: () => navigator.userAgent
        });
        
        if (results && results[0] && results[0].result) {
          const realUA = results[0].result;
          // Store it for future use
          await chrome.storage.local.set({ defaultUserAgent: realUA });
          return realUA;
        }
      }
    }
    
    // Fallback: create a new tab to get the UA
    const newTab = await chrome.tabs.create({ url: 'about:blank', active: false });
    const results = await chrome.scripting.executeScript({
      target: { tabId: newTab.id },
      func: () => navigator.userAgent
    });
    
    if (results && results[0] && results[0].result) {
      const realUA = results[0].result;
      await chrome.storage.local.set({ defaultUserAgent: realUA });
      await chrome.tabs.remove(newTab.id);
      return realUA;
    }
    
    // Ultimate fallback
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  } catch (error) {
    console.error('Error getting real user agent:', error);
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
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
