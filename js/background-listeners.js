/**
 * Event Listeners Module
 * Handles all Chrome extension event listeners
 */

/**
 * Listen for messages from popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setUserAgent') {
    setUserAgent(request.userAgent, request.tabId || null).then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep channel open for async response
  } else if (request.action === 'getBadgeInfo') {
    updateBadgeForTab(request.tabId).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

/**
 * Listen for storage changes to update badge and permanent spoofs
 */
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    // Update permanent spoof rules when they change
    if (changes.permanentSpoofs) {
      applyPermanentSpoofs();
    }
    // Update rules when settings change (permanentOverride)
    if (changes.permanentOverride) {
      applyPermanentSpoofs();
    }
    // Update badge when global setting changes
    if (changes.globalUserAgent) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          updateBadgeForTab(tabs[0].id);
        }
      });
    }
  }
});

/**
 * Listen for tab activation to update badge
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
  updateBadgeForTab(activeInfo.tabId);
});

/**
 * Listen for tab updates to refresh badge
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    updateBadgeForTab(tabId);
  }
});

/**
 * Clean up session rules when tabs are closed
 */
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  try {
    // Remove tab-specific storage
    await chrome.storage.local.remove([`tab_${tabId}`]);
    
    // Remove the session rule for this specific tab if it exists
    const existingRules = await chrome.declarativeNetRequest.getSessionRules();
    const tabRule = existingRules.find(rule => rule.id === tabId);
    
    if (tabRule) {
      await chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds: [tabId]
      });
      console.log(`Removed session rule for closed tab: ${tabId}`);
    }
  } catch (error) {
    console.error('Error cleaning up tab rule:', error);
  }
});

/**
 * Initialize on install
 */
chrome.runtime.onInstalled.addListener(async () => {
  // Get and store the real user agent
  await getRealUserAgent();
  
  // Migrate old data if necessary
  const result = await chrome.storage.local.get(['activeId']);
  if (result.activeId && !await chrome.storage.local.get(['globalUserAgent']).then(r => r.globalUserAgent)) {
    // Migrate activeId to globalUserAgent if it doesn't exist
    await chrome.storage.local.set({ globalUserAgent: result.activeId });
  }
  
  // Initialize permanent spoofs first
  await initializePermanentSpoofs();
  
  // Update badge for current tab
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]) {
    await updateBadgeForTab(tabs[0].id);
  }
});

/**
 * Initialize on browser startup (not just on install)
 */
chrome.runtime.onStartup.addListener(async () => {
  console.log('Extension starting up...');
  // Get and store the real user agent (updates if browser version changed)
  await getRealUserAgent();
  await initializePermanentSpoofs();
  
  // Update badge for all tabs
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      await updateBadgeForTab(tab.id);
    }
  }
});

/**
 * Initialize on startup (immediate execution)
 */
(async () => {
  await initializePermanentSpoofs();
  
  // Update badge for current active tab
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]) {
    await updateBadgeForTab(tabs[0].id);
  }
})();
