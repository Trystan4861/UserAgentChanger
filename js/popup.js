// Default user-agents with badge colors - function to get them after i18n is loaded
const getDefaultUserAgents = () => [
  {
    id: 'default',
    name: i18n.getMessage('defaultUserAgent'),
    alias: 'DEF',
    userAgent: '',
    mode: 'replace'
  },
  {
    id: 'auto',
    name: i18n.getMessage('autoUserAgent'),
    alias: 'AUTO',
    userAgent: '',
    mode: 'auto'
  },
  {
    id: 'iphone',
    name: 'iPhone 14',
    alias: 'iOS',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    mode: 'replace'
  },
  {
    id: 'android',
    name: 'Android',
    alias: 'AND',
    userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
    mode: 'replace'
  }
];

// Initialize - wait for i18n to be ready
document.addEventListener('DOMContentLoaded', async () => {
  await i18n.ready;
  await applyTheme();
  loadExtensionVersion();
  await initializeUserAgents();
  await updateDefaultUserAgentTranslation();
  await loadUserAgents();
  setupEventListeners();
});

// Apply theme from storage
async function applyTheme() {
  const result = await chrome.storage.local.get('theme');
  const theme = result.theme || 'auto';
  
  const html = document.documentElement;
  
  if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark');
  } else if (theme === 'light') {
    html.setAttribute('data-theme', 'light');
  } else {
    // Auto: use browser preference
    html.removeAttribute('data-theme');
  }
}

// Load and display extension version
function loadExtensionVersion() {
  const manifest = chrome.runtime.getManifest();
  const versionElement = document.getElementById('extensionVersion');
  if (versionElement) {
    versionElement.textContent = `v${manifest.version}`;
  }
}

// Initialize default user-agents if none exist
async function initializeUserAgents() {
  const result = await chrome.storage.local.get(['userAgents', 'globalUserAgent']);
  
  if (!result.userAgents) {
    await chrome.storage.local.set({
      userAgents: getDefaultUserAgents(),
      globalUserAgent: 'default'
    });
  } else {
    // Ensure AUTO user-agent exists (for existing installations)
    const userAgents = result.userAgents;
    const hasAuto = userAgents.some(ua => ua.id === 'auto');
    
    if (!hasAuto) {
      const defaultUserAgents = getDefaultUserAgents();
      const autoUA = defaultUserAgents.find(ua => ua.id === 'auto');
      if (autoUA) {
        // Insert AUTO after DEFAULT
        const defaultIndex = userAgents.findIndex(ua => ua.id === 'default');
        if (defaultIndex !== -1) {
          userAgents.splice(defaultIndex + 1, 0, autoUA);
        } else {
          userAgents.unshift(autoUA);
        }
        await chrome.storage.local.set({ userAgents });
      }
    }
  }
  
  // Initialize globalUserAgent if not set
  if (!result.globalUserAgent) {
    await chrome.storage.local.set({ globalUserAgent: 'default' });
  }
}

// Update the default user agent translation when language changes
async function updateDefaultUserAgentTranslation() {
  const result = await chrome.storage.local.get('userAgents');
  if (!result.userAgents) return;
  
  const userAgents = result.userAgents;
  const defaultUA = userAgents.find(ua => ua.id === 'default');
  const autoUA = userAgents.find(ua => ua.id === 'auto');
  
  if (defaultUA) {
    // Update the name with the current language translation
    defaultUA.name = i18n.getMessage('defaultUserAgent');
  }
  
  if (autoUA) {
    // Update the name with the current language translation
    autoUA.name = i18n.getMessage('autoUserAgent');
  }
  
  if (defaultUA || autoUA) {
    await chrome.storage.local.set({ userAgents });
  }
}

// Load and display user-agents
async function loadUserAgents() {
  const result = await chrome.storage.local.get(['userAgents']);
  const userAgents = result.userAgents || getDefaultUserAgents();
  
  // Get current tab
  const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Get effective user agent for current tab
  const tabUA = await chrome.storage.local.get(`tab_${currentTab.id}`);
  const tabUserAgentId = tabUA[`tab_${currentTab.id}`];
  
  const globalUA = await chrome.storage.local.get('globalUserAgent');
  const globalUserAgentId = globalUA.globalUserAgent || 'default';
  
  // Active ID is tab-specific if exists, otherwise global
  const activeId = tabUserAgentId || globalUserAgentId;
  
  const listContainer = document.getElementById('userAgentsList');
  listContainer.innerHTML = '';
  
  if (userAgents.length === 0) {
    listContainer.innerHTML = `<div class="empty-state"><p>${i18n.getMessage('noUserAgents')}</p></div>`;
    return;
  }
  
  // Separate special user agents (default and auto) from custom ones
  const defaultUA = userAgents.find(ua => ua.id === 'default');
  const autoUA = userAgents.find(ua => ua.id === 'auto');
  const customUAs = userAgents.filter(ua => ua.id !== 'default' && ua.id !== 'auto');
  
  // Create special row for default and auto (2 columns)
  if (defaultUA && autoUA) {
    const specialRow = createSpecialUserAgentsRow(defaultUA, autoUA, activeId);
    listContainer.appendChild(specialRow);
  }
  
  // Add custom user agents
  customUAs.forEach(ua => {
    const item = createUserAgentItem(ua, activeId);
    listContainer.appendChild(item);
  });
}

// Create special row with DEFAULT and AUTO side by side
function createSpecialUserAgentsRow(defaultUA, autoUA, activeId) {
  const row = document.createElement('div');
  row.className = 'special-user-agents-row';
  
  // Create DEFAULT button (left column)
  const defaultBtn = document.createElement('div');
  defaultBtn.className = `user-agent-item special-item${defaultUA.id === activeId ? ' active' : ''}`;
  defaultBtn.dataset.id = defaultUA.id;
  defaultBtn.innerHTML = `
    <div class="user-agent-info">
      <div class="user-agent-name">${defaultUA.name}</div>
      <div class="user-agent-preview">${i18n.getMessage('defaultUserAgentPreview')}</div>
    </div>
  `;
  defaultBtn.addEventListener('click', () => activateUserAgent(defaultUA.id));
  
  // Create AUTO button (right column)
  const autoBtn = document.createElement('div');
  autoBtn.className = `user-agent-item special-item${autoUA.id === activeId ? ' active' : ''}`;
  autoBtn.dataset.id = autoUA.id;
  autoBtn.innerHTML = `
    <div class="user-agent-info">
      <div class="user-agent-name">${autoUA.name}</div>
    </div>
  `;
  autoBtn.addEventListener('click', () => activateUserAgent(autoUA.id));
  
  row.appendChild(defaultBtn);
  row.appendChild(autoBtn);
  
  return row;
}

// Create user-agent item element
function createUserAgentItem(ua, activeId) {
  const div = document.createElement('div');
  div.className = `user-agent-item${ua.id === activeId ? ' active' : ''}`;
  div.dataset.id = ua.id;
  
  // Badge colors
  const badgeTextColor = '#ffffff';
  const badgeBgColor = '#000';

  // Always show badge for custom user-agents
  const badgeHtml = `
    <div class="user-agent-badge" style="color: ${badgeTextColor}; background-color: ${badgeBgColor};">
      ${ua.alias}
    </div>
  `;
  
  div.innerHTML = `
    <div class="user-agent-info">
      <div class="user-agent-name">${ua.name}</div>
    </div>
    ${badgeHtml}
  `;
  
  div.addEventListener('click', () => activateUserAgent(ua.id));
  
  return div;
}

// Activate a user-agent
async function activateUserAgent(id) {
  // Get current tab
  const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (id === 'default' || id === 'auto') {
    // Store globally
    await chrome.storage.local.set({ globalUserAgent: id });
    // Remove per-tab setting if exists (global takes precedence)
    await chrome.storage.local.remove([`tab_${currentTab.id}`]);
  } else {
    // Store per-tab for specific user agents (manual selection)
    await chrome.storage.local.set({ [`tab_${currentTab.id}`]: id });
  }
  
  // Get the selected user-agent
  const result = await chrome.storage.local.get(['userAgents']);
  const userAgent = result.userAgents.find(ua => ua.id === id);
  
  // Send message to background script
  chrome.runtime.sendMessage({
    action: 'setUserAgent',
    userAgent: userAgent,
    tabId: currentTab.id
  });
  
  // Reload the list to update active state
  await loadUserAgents();
}

// Setup event listeners
function setupEventListeners() {
  // Manage button - open options page in new tab
  document.getElementById('manageBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'options.html' });
  });
}
