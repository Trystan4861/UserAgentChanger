/**
 * Permanent Spoofs Module
 * Handles permanent domain-based user agent spoofing
 */

/**
 * Convert domain pattern to URL pattern for declarativeNetRequest
 * Supports wildcards like *.example.com and specific paths like localhost/core/*
 * @param {string} domain - Domain pattern (e.g., "google.com", "*.amazon.com", or "localhost/core/*")
 * @returns {string} - URL pattern for declarativeNetRequest
 */
function getDomainPattern(domain) {
  // Remove protocol if present
  domain = domain.replace(/^https?:\/\//, '');
  
  // Check if domain contains a path (has a slash after the domain part)
  const hasPath = domain.includes('/');
  
  if (hasPath) {
    // Handle paths like "gomflo.dev/user-agent" or "example.com/api/*"
    if (!domain.endsWith('*')) {
      // Add * at the end to match everything under that path
      domain = domain + '*';
    }
    return `*://${domain}`;
  }
  
  // Remove trailing slash for domain-only patterns
  domain = domain.replace(/\/$/, '');
  
  // Remove www. prefix if present (we'll create patterns for both)
  const hasWww = domain.startsWith('www.');
  if (hasWww) {
    domain = domain.substring(4); // Remove 'www.'
  }
  
  // Handle wildcard subdomain
  if (domain.startsWith('*.')) {
    // *.example.com -> *://*.example.com/*
    return `*://${domain}/*`;
  } else if (domain.startsWith('*')) {
    // *example.com -> *://*example.com/*
    return `*://${domain}/*`;
  } else {
    // example.com -> *://*.example.com/* (match all subdomains including www and bare domain)
    return `*://*.${domain}/*`;
  }
}

/**
 * Update permanent spoof rules in declarativeNetRequest
 * Rules for permanent spoofs start at ID 1000
 * Only applies rules when globalUserAgent is set to 'auto'
 */
async function updatePermanentSpoofRules() {
  try {
    const result = await chrome.storage.local.get([
      'permanentSpoofs', 
      'globalUserAgent'
    ]);
    const permanentSpoofs = result.permanentSpoofs || [];
    const globalUserAgent = result.globalUserAgent || 'default';
    
    // Get existing dynamic rules (permanent spoofs use dynamic rules, not session)
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    
    // Identify permanent spoof rules (ID >= 1000)
    const permanentRuleIds = existingRules
      .filter(rule => rule.id >= 1000)
      .map(rule => rule.id);
    
    // Si NO estamos en modo AUTO, eliminar todas las reglas de spoofs permanentes
    if (globalUserAgent !== 'auto') {
      if (permanentRuleIds.length > 0) {
        await chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: permanentRuleIds
        });
        console.log('Removed all permanent spoof rules (not in AUTO mode)');
      }
      return; // Salir sin crear nuevas reglas
    }
    
    // SOLO si estamos en modo AUTO, crear reglas para spoofs activos
    const newRules = [];
    let ruleId = 1000; // Start IDs at 1000 for permanent spoofs
    
    for (const spoof of permanentSpoofs) {
      if (!spoof.enabled) {
        continue; // Skip disabled spoofs
      }
      
      const userAgentString = await getUserAgentString(spoof.userAgentId);
      if (!userAgentString) {
        console.warn(`User-Agent not found for spoof: ${spoof.domain}`);
        continue;
      }
      
      // Create URL pattern from domain
      const urlPattern = getDomainPattern(spoof.domain);
      
      // Priority system:
      // - Manual selection (session rules with tabIds) = priority 4 (highest, overrides everything)
      // - Permanent spoofs = priority 2 (applies when no manual selection for that tab)
      // Note: permanentOverride setting is not used in new implementation
      const priority = 2;
      
      const rule = {
        id: ruleId,
        priority: priority,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            {
              header: 'user-agent',
              operation: 'set',
              value: userAgentString
            }
          ]
        },
        condition: {
          urlFilter: urlPattern,
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

      newRules.push(rule);
      ruleId++; // Increment after adding the rule
    }
    
    // Remove old rules and add new ones in a single atomic operation
    const updateOptions = {};
    if (permanentRuleIds.length > 0) {
      updateOptions.removeRuleIds = permanentRuleIds;
    }
    if (newRules.length > 0) {
      updateOptions.addRules = newRules;
    }
    
    if (Object.keys(updateOptions).length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules(updateOptions);
      console.log(`Updated ${newRules.length} permanent spoof rules`);
    }
    
  } catch (error) {
    console.error('Error updating permanent spoof rules:', error);
  }
}

/**
 * Apply all permanent spoofs
 * This function is called when permanent spoofs change in storage
 */
async function applyPermanentSpoofs() {
  await updatePermanentSpoofRules();
}

/**
 * Initialize permanent spoofs on extension startup
 */
async function initializePermanentSpoofs() {
  try {
    // Apply permanent spoofs
    await applyPermanentSpoofs();
  } catch (error) {
    console.error('Error initializing permanent spoofs:', error);
  }
}
