/**
 * Badge Management Module
 * Handles badge display and updates for tabs
 */

/**
 * Check if a URL matches a permanent spoof domain
 * @param {string} url - The URL to check
 * @param {string} domain - The domain pattern to match against
 * @returns {boolean} - True if the URL matches the domain pattern
 */
function urlMatchesDomain(url, domain) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;
    
    // Remove protocol from domain if present
    domain = domain.replace(/^https?:\/\//, '');
    
    // Check if domain has a path
    const hasPath = domain.includes('/');
    
    if (hasPath) {
      // Extract domain and path parts
      const [domainPart, ...pathParts] = domain.split('/');
      const pathPattern = pathParts.join('/');
      
      // Check if hostname matches
      if (!hostname.includes(domainPart.replace('*.', ''))) {
        return false;
      }
      
      // Check if pathname matches
      if (pathPattern && pathPattern !== '*') {
        const cleanPath = pathPattern.replace('*', '');
        if (!pathname.startsWith('/' + cleanPath)) {
          return false;
        }
      }
      return true;
    }
    
    // Handle wildcard subdomain
    if (domain.startsWith('*.')) {
      const baseDomain = domain.substring(2);
      return hostname.endsWith(baseDomain);
    } else if (domain.startsWith('*')) {
      const baseDomain = domain.substring(1);
      return hostname.includes(baseDomain);
    } else {
      // Exact match or subdomain match
      return hostname === domain || hostname.endsWith('.' + domain);
    }
  } catch (error) {
    console.error('Error matching URL:', error);
    return false;
  }
}

/**
 * Find if a tab's URL has an active permanent spoof
 * @param {number} tabId - The tab ID
 * @returns {Promise<object|null>} - The matching spoof object or null
 */
async function findActiveSpoofForTab(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab || !tab.url) {
      return null;
    }
    
    const result = await chrome.storage.local.get(['permanentSpoofs', 'userAgents']);
    const permanentSpoofs = result.permanentSpoofs || [];
    const userAgents = result.userAgents || [];
    
    // Find first enabled spoof that matches the tab's URL
    for (const spoof of permanentSpoofs) {
      if (spoof.enabled && urlMatchesDomain(tab.url, spoof.domain)) {
        const ua = userAgents.find(u => u.id === spoof.userAgentId);
        if (ua) {
          return { spoof, userAgent: ua };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding active spoof:', error);
    return null;
  }
}

/**
 * Update badge for a specific tab based on the new logic
 * @param {number} tabId - The tab ID
 */
async function updateBadgeForTab(tabId) {
  try {
    const result = await chrome.storage.local.get(['userAgents', 'globalUserAgent', `tab_${tabId}`]);
    const userAgents = result.userAgents || [];
    const globalUserAgent = result.globalUserAgent || 'default';
    const tabUserAgent = result[`tab_${tabId}`] || null;
    
    // Check if this tab has a specific UA set (manual selection)
    if (tabUserAgent) {
      const ua = userAgents.find(u => u.id === tabUserAgent);
      if (ua) {
        await chrome.action.setBadgeText({ text: ua.alias, tabId });
        await chrome.action.setBadgeBackgroundColor({ 
          color: '#000', // Black background for manual selections
          tabId 
        });
        await chrome.action.setTitle({ 
          title: `User-Agent Changer\nActivo: ${ua.name}`,
          tabId
        });
        return;
      }
    }
    
    // No tab-specific UA, check global setting
    if (globalUserAgent === 'default') {
      // Default: no badge
      await chrome.action.setBadgeText({ text: '', tabId });
      await chrome.action.setTitle({ 
        title: 'User-Agent Changer\nActivo: Predeterminado',
        tabId
      });
    } else if (globalUserAgent === 'auto') {
      // Auto: check if there's a domain spoof for this tab
      const activeSpoofInfo = await findActiveSpoofForTab(tabId);
      
      if (activeSpoofInfo) {
        // Show spoof UA badge with green background
        const ua = activeSpoofInfo.userAgent;
        await chrome.action.setBadgeText({ text: ua.alias, tabId });
        await chrome.action.setBadgeBackgroundColor({ color: '#00AA00', tabId });
        await chrome.action.setTitle({ 
          title: `User-Agent Changer\nAuto - Spoof activo: ${ua.name}`,
          tabId
        });
      } else {
        // Show AUTO with red background
        await chrome.action.setBadgeText({ text: 'AUTO', tabId });
        await chrome.action.setBadgeBackgroundColor({ color: '#FF0000', tabId });
        await chrome.action.setTitle({ 
          title: 'User-Agent Changer\nModo Auto (sin spoof para este dominio)',
          tabId
        });
      }
    } else {
      // Specific global UA selected
      const ua = userAgents.find(u => u.id === globalUserAgent);
      if (ua) {
        await chrome.action.setBadgeText({ text: ua.alias, tabId });
        await chrome.action.setBadgeBackgroundColor({ 
          color: '#000',
          tabId 
        });
        await chrome.action.setTitle({ 
          title: `User-Agent Changer\nActivo (global): ${ua.name}`,
          tabId
        });
      }
    }
  } catch (error) {
    console.error('Error updating badge for tab:', error);
  }
}
