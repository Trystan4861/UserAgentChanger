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

// Update page title with i18n
function updatePageTitle() {
  document.title = i18n.getMessage('pageTitle') || 'User-Agent Changer';
}

// Initialize - wait for i18n to be ready
document.addEventListener('DOMContentLoaded', async () => {
  await i18n.ready;
  updatePageTitle();
  loadExtensionVersion();
  await initializeUserAgents();
  await updateDefaultUserAgentTranslation();
  await loadUserAgents();
  await loadPermanentSpoofs();
  await setupLanguageSelector();
  await setupThemeSelector();
  await setupNavigationMenu();
  await setupImportExport();
  setupEventListeners();
});

// Load and display extension version
function loadExtensionVersion() {
  const manifest = chrome.runtime.getManifest();
  const versionElement = document.getElementById('extensionVersion');
  const aboutVersionElement = document.getElementById('aboutVersion');
  
  if (versionElement) {
    versionElement.textContent = `v${manifest.version}`;
  }
  
  if (aboutVersionElement) {
    aboutVersionElement.textContent = manifest.version;
  }
}

// Initialize default user-agents if none exist
async function initializeUserAgents() {
  const result = await chrome.storage.local.get(['userAgents', 'activeId']);
  
  if (!result.userAgents) {
    await chrome.storage.local.set({
      userAgents: getDefaultUserAgents(),
      activeId: 'default'
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

// Setup language selector
async function setupLanguageSelector() {
  const select = document.getElementById('languageSelect');
  const currentLang = await i18n.getLanguage();
  
  // Set current language
  select.value = currentLang;
  
  // Add change event listener
  select.addEventListener('change', async (e) => {
    const newLang = e.target.value;
    
    // Save the language preference
    await i18n.setLanguage(newLang);
    
    // Show notification
    showNotification(i18n.getMessage('languageChanged'), 'info');
    
    // Wait a bit and reload
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  });
}

// Setup theme selector
async function setupThemeSelector() {
  const select = document.getElementById('themeSelect');
  const result = await chrome.storage.local.get('theme');
  const currentTheme = result.theme || 'auto';
  
  // Set current theme
  select.value = currentTheme;
  
  // Apply the theme
  applyTheme(currentTheme);
  
  // Add change event listener
  select.addEventListener('change', async (e) => {
    const newTheme = e.target.value;
    
    // Save the theme preference
    await chrome.storage.local.set({ theme: newTheme });
    
    // Apply the theme
    applyTheme(newTheme);
    
    // Show notification
    showNotification(i18n.getMessage('themeChanged'), 'success');
  });
}

// Apply theme
function applyTheme(theme) {
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

// Setup navigation menu
async function setupNavigationMenu() {
  const menuItems = document.querySelectorAll('.menu-item');
  
  // Load last active section or default to 'custom-user-agents'
  const result = await chrome.storage.local.get('activeSection');
  const activeSection = result.activeSection || 'custom-user-agents';
  
  // Show the active section
  showSection(activeSection);
  
  // Add click listeners to menu items
  menuItems.forEach(item => {
    item.addEventListener('click', async () => {
      const sectionId = item.getAttribute('data-section');
      showSection(sectionId);
      
      // Save the active section
      await chrome.storage.local.set({ activeSection: sectionId });
    });
  });
}

// Show a specific section and hide others
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Show the selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Update menu active state
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-section') === sectionId) {
      item.classList.add('active');
    }
  });
}

// Setup event listeners
function setupEventListeners() {
  // Form submission
  document.getElementById('addUserAgentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await addUserAgent();
  });
  
  // Update preview when alias changes
  document.getElementById('alias').addEventListener('input', updateBadgePreview);
  
  // Permanent Spoof form submission
  const spoofForm = document.getElementById('addPermanentSpoofForm');
  if (spoofForm) {
    spoofForm.addEventListener('submit', addPermanentSpoof);
  }
  
  // Reset extension button
  const resetBtn = document.getElementById('resetExtensionBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetExtension);
  }
  
  // Initial preview
  updateBadgePreview();
}

// Update badge preview
function updateBadgePreview() {
  const preview = document.getElementById('badgePreview');
  const alias = document.getElementById('alias').value.toUpperCase() || 'TEST';
  
  // Always use black background and white text
  preview.textContent = alias;
  preview.style.color = '#ffffff';
  preview.style.backgroundColor = '#000000';
}

// Load and display user-agents
async function loadUserAgents() {
  const result = await chrome.storage.local.get('userAgents');
  const userAgents = result.userAgents || getDefaultUserAgents();
  
  setupUserAgentSelector(userAgents);
  
  const listContainer = document.getElementById('userAgentsList');
  listContainer.innerHTML = '';
  
  if (userAgents.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <p>${i18n.getMessage('noUserAgents')}</p>
      </div>
    `;
    return;
  }
  
  // Filter out default and auto user agents (special internal user agents)
  const customUserAgents = userAgents.filter(ua => ua.id !== 'default' && ua.id !== 'auto');
  
  customUserAgents.forEach(ua => {
    const card = createUserAgentCard(ua);
    listContainer.appendChild(card);
  });
}

// Create user-agent card element
function createUserAgentCard(ua) {
  const card = document.createElement('div');
  card.className = `user-agent-card${ua.id === 'default' ? ' default' : ''}`;
  
  const modeText = ua.mode === 'append' ? i18n.getMessage('modeAppend') : i18n.getMessage('modeReplace');
  
  // For default user-agent, show the actual browser user-agent
  let preview;
  if (ua.id === 'default') {
    preview = navigator.userAgent;
  } else {
    preview = ua.userAgent ? ua.userAgent : i18n.getMessage('defaultUserAgentPreview');
  }
    
  // Badge colors
  const badgeTextColor = '#ffffff';
  const badgeBgColor = '#000';
  
  const modeClass = ua.mode === 'append' ? 'mode-append' : 'mode-replace';
  
  // For default user-agent, don't show badge or badge colors info
  const badgeSection = ua.id === 'default' ? '' : `
    <div class="card-title">
      <h3>${ua.name}</h3>
      <div class="card-badge" style="color: ${badgeTextColor}; background-color: ${badgeBgColor};">
        ${ua.alias}
      </div>
    </div>
  `;
  
  const defaultBadgeSection = ua.id === 'default' ? `
    <div class="card-title">
      <h3>${ua.name}</h3>
    </div>
  ` : '';
  
  // For default user-agent, don't show mode info
  const modeInfoRow = ua.id === 'default' ? '' : `
    <div class="info-row">
      <span class="info-label">${i18n.getMessage('modeLabel')}</span>
      <span class="mode-badge ${modeClass}">${modeText}</span>
    </div>
  `;
  
  card.innerHTML = `
    <div class="card-header">
      ${ua.id === 'default' ? defaultBadgeSection : badgeSection}
      <div class="card-actions">
        ${ua.id !== 'default' ? `<button class="btn btn-danger" data-id="${ua.id}">🗑️ <span data-i18n="deleteButton">${i18n.getMessage('deleteButton')}</span></button>` : ''}
      </div>
    </div>
    <div class="card-info">
      ${modeInfoRow}
    </div>
    <div class="user-agent-preview">${preview}</div>
  `;
  
  // Add delete event listener
  if (ua.id !== 'default') {
    const deleteBtn = card.querySelector('.btn-danger');
    deleteBtn.addEventListener('click', () => deleteUserAgent(ua.id));
  }
  
  return card;
}

// Add new user-agent
async function addUserAgent() {
  const alias = document.getElementById('alias').value.trim().toUpperCase();
  const name = document.getElementById('name').value.trim();
  const mode = document.getElementById('mode').value;
  const userAgent = document.getElementById('userAgent').value.trim();
  
  // Always use black background and white text for user-defined badges
  const badgeBgColor = '#000000';
  const badgeTextColor = '#ffffff';
  
  if (!alias || !name || !userAgent) {
    alert(i18n.getMessage('fillAllFields'));
    return;
  }
  
  const result = await chrome.storage.local.get('userAgents');
  const userAgents = result.userAgents || [];
  
    // Validate name (first, as it appears first in the form)
    const nameValidation = validateName(name, userAgents);
    if (!nameValidation.isValid) {
      showNotification(nameValidation.error, 'error');
      return;
    }

    // Validate alias (second, as it appears second in the form)
    const aliasValidation = validateAlias(alias, userAgents);
    if (!aliasValidation.isValid) {
      showNotification(aliasValidation.error, 'error');
      return;
    }
  
  const newUserAgent = {
    id: Date.now().toString(),
    name,
    alias,
    userAgent,
    mode
  };
  
  userAgents.push(newUserAgent);
  await chrome.storage.local.set({ userAgents });
  
  // Clear form
  document.getElementById('addUserAgentForm').reset();
  updateBadgePreview();
  
  // Reload list
  await loadUserAgents();
  
  // Show success message
  showNotification(i18n.getMessage('userAgentAdded'), 'success');
}

// Delete user-agent
async function deleteUserAgent(id) {
  if (!confirm(i18n.getMessage('confirmDelete'))) {
    return;
  }
  
  const result = await chrome.storage.local.get(['userAgents', 'activeId']);
  let userAgents = result.userAgents || [];
  const activeId = result.activeId;
  
  // Remove the user-agent
  userAgents = userAgents.filter(ua => ua.id !== id);
  
  // If the deleted user-agent was active, set default as active
  const updates = { userAgents };
  if (activeId === id) {
    updates.activeId = 'default';
    
    // Notify background to reset to default
    chrome.runtime.sendMessage({
      action: 'setUserAgent',
      userAgent: userAgents.find(ua => ua.id === 'default')
    });
  }
  
  await chrome.storage.local.set(updates);
  
  // Reload list
  await loadUserAgents();
  
  showNotification(i18n.getMessage('userAgentDeleted'), 'success');
}


// Permanent Spoof List Functions
async function loadPermanentSpoofs() {
  const result = await chrome.storage.local.get(['permanentSpoofs', 'userAgents']);
  const spoofs = result.permanentSpoofs || [];
  const userAgents = result.userAgents || getDefaultUserAgents();

  const listContainer = document.getElementById('permanentSpoofsList');
  if (!listContainer) return;

  listContainer.innerHTML = '';

  if (spoofs.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-spoofs">
        <p>No hay spoofs permanentes configurados</p>
        <small>Usa el formulario de arriba para agregar uno</small>
      </div>
    `;
    return;
  }

  spoofs.forEach(spoof => {
    const ua = userAgents.find(u => u.id === spoof.userAgentId);
    if (!ua) return;

    const card = createSpoofCard(spoof, ua);
    listContainer.appendChild(card);
  });

  setupUserAgentSelector(userAgents);
}

function setupUserAgentSelector(userAgents) {
  const select = document.getElementById('spoofUserAgent');
  if (!select) return;

  // Clear previous options
  select.innerHTML = '';

  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = i18n.getMessage('selectUserAgentOption') || 'Selecciona un User-Agent';
  select.appendChild(defaultOption);

  // Add all user agents (except default)
  // Filter out default and auto user agents (special internal user agents)
  const customUserAgents = userAgents.filter(ua => ua.id !== 'default' && ua.id !== 'auto');
  
  customUserAgents.forEach(ua => {
    if (ua.id !== 'default') {
      const option = document.createElement('option');
      option.value = ua.id;
      option.textContent = `${ua.name} (${ua.alias})`;
      select.appendChild(option);
    }
  });

  // Remove old listeners and add new one
  const newSelect = select.cloneNode(true);
  select.parentNode.replaceChild(newSelect, select);
  newSelect.addEventListener('change', updateSpoofPreview);
}

async function updateSpoofPreview() {
  const select = document.getElementById('spoofUserAgent');
  const previewContainer = document.getElementById('spoofPreviewContainer');
  const preview = document.getElementById('spoofPreview');

  if (!select || !previewContainer || !preview) return;

  const selectedId = select.value;

  if (!selectedId) {
    previewContainer.style.display = 'none';
    return;
  }

  const result = await chrome.storage.local.get('userAgents');
  const userAgents = result.userAgents || [];
  const ua = userAgents.find(u => u.id === selectedId);

  if (ua) {
    previewContainer.style.display = 'block';
    preview.textContent = ua.userAgent;
  }
}

function createSpoofCard(spoof, ua) {
  const card = document.createElement('div');
  card.className = 'spoof-card';
  
  // Ensure domain has protocol for the link
  let linkDomain = spoof.domain;
  if (!linkDomain.startsWith('http://') && !linkDomain.startsWith('https://')) {
    linkDomain = 'https://' + linkDomain;
  }
  
  card.innerHTML = `
    <div class="spoof-header">
      <a href="${linkDomain}" target="_blank" rel="noopener noreferrer" class="spoof-domain" title="${i18n.getMessage('openInNewTab') || 'Abrir en nueva pestaña'}">${spoof.domain}</a>
      <button class="btn btn-danger" data-id="${spoof.id}">🗑️ ${i18n.getMessage('deleteButton')}</button>
    </div>
    <div class="spoof-info">
      <div class="spoof-info-row">
        <span class="spoof-info-label">${i18n.getMessage('labelSelectUserAgent')}</span>
        <div class="spoof-ua-display">
          <span class="spoof-ua-name" data-spoof-id="${spoof.id}">${ua.name}</span>
          <select class="spoof-ua-select hidden" data-spoof-id="${spoof.id}">
            <option value="">${i18n.getMessage('selectUserAgentOption') || 'Selecciona un User-Agent'}</option>
          </select>
          <button class="spoof-ua-edit-btn" data-spoof-id="${spoof.id}" title="Editar User-Agent">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="spoof-preview">
      <label>${i18n.getMessage('userAgentPreview')}</label>
      <div class="user-agent-preview">${ua.userAgent}</div>
    </div>
  `;
  
  const deleteBtn = card.querySelector('.btn-danger');
  deleteBtn.addEventListener('click', () => deletePermanentSpoof(spoof.id));
  
  const editBtn = card.querySelector('.spoof-ua-edit-btn');
  editBtn.addEventListener('click', () => editSpoofUserAgent(spoof.id, card));
  
  return card;
}

async function addPermanentSpoof(e) {
  e.preventDefault();
  
  const domain = document.getElementById('spoofDomain').value.trim();
  const userAgentId = document.getElementById('spoofUserAgent').value;
  
  if (!domain || !userAgentId) {
    alert(i18n.getMessage('fillAllFields'));
    return;
  }
  
  const result = await chrome.storage.local.get('permanentSpoofs');
  const spoofs = result.permanentSpoofs || [];
  
  if (spoofs.some(s => s.domain === domain)) {
    alert('Este dominio ya tiene un spoof configurado');
    return;
  }
  
  const newSpoof = {
    id: Date.now().toString(),
    domain,
    userAgentId,
    enabled: true
  };
  
  spoofs.push(newSpoof);
  await chrome.storage.local.set({ permanentSpoofs: spoofs });
  
  document.getElementById('addPermanentSpoofForm').reset();
  document.getElementById('spoofPreview').style.display = 'none';
  
  await loadPermanentSpoofs();
  showNotification('Spoof permanente agregado correctamente', 'success');
}

async function deletePermanentSpoof(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar este spoof permanente?')) {
    return;
  }
  
  const result = await chrome.storage.local.get('permanentSpoofs');
  let spoofs = result.permanentSpoofs || [];
  
  spoofs = spoofs.filter(s => s.id !== id);
  await chrome.storage.local.set({ permanentSpoofs: spoofs });
  
  await loadPermanentSpoofs();
  showNotification('Spoof permanente eliminado correctamente', 'success');
}

// Import/Export Functions
async function setupImportExport() {
  const importFile = document.getElementById('importFile');
  const exportBtn = document.getElementById('exportBtn');
  const confirmImportBtn = document.getElementById('confirmImportBtn');
  const dropArea = document.getElementById('drop-area');
  const selectedFileName = document.getElementById('selectedFileName');
  
  if (!importFile || !exportBtn) return;
  
  // Setup drag and drop
  dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('drag-over');
  });

  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('drag-over');
  });

  dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/json') {
        selectedFileName.textContent = file.name;
        handleFileImport(file);
      } else {
        alert(i18n.getMessage('invalidFileType'));
      }
    }
  });
  
  // File selection handler
  importFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    selectedFileName.textContent = file.name;
    
    try {
      const text = await file.text();
      
      // Add a small delay to ensure file is fully loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const data = JSON.parse(text);
      
      // Validate and show preview
      if (validateImportData(data)) {
        showImportPreview(data);
      } else {
        showNotification(i18n.getMessage('importErrorInvalidFormat') || 'El archivo no tiene un formato válido', 'error');
        importFile.value = '';
        selectedFileName.textContent = '';
      }
    } catch (error) {
      console.error('Import error:', error);
      showNotification(i18n.getMessage('importErrorReadFile') || 'Error al leer el archivo. Asegúrate de que sea un JSON válido.', 'error');
      importFile.value = '';
      selectedFileName.textContent = '';
    }
  });
  
  // Export button handler
  exportBtn.addEventListener('click', exportSettings);
  
  // Confirm import button handler
  if (confirmImportBtn) {
    confirmImportBtn.addEventListener('click', confirmImport);
  }
}

// Handle file import (from drag-and-drop or file selection)
async function handleFileImport(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (validateImportData(data)) {
        showImportPreview(data);
      } else {
        showImportError(i18n.getMessage('importErrorInvalidFormat'));
      }
    } catch (error) {
      showImportError(i18n.getMessage('importErrorReadFile'));
    }
  };
  reader.readAsText(file);
}

function validateImportData(data) {
  // Check basic structure
  if (!data || typeof data !== 'object') return false;
  
  // At least one of these should exist
  if (!data.userAgents && !data.permanentSpoofs) return false;
  
  // Validate userAgents if present
  if (data.userAgents) {
    if (!Array.isArray(data.userAgents)) return false;
    
    for (const ua of data.userAgents) {
      if (!ua.id || !ua.name || !ua.alias) return false;
      if (ua.mode && !['replace', 'append'].includes(ua.mode)) return false;
    }
  }
  
  // Validate permanentSpoofs if present
  if (data.permanentSpoofs) {
    if (!Array.isArray(data.permanentSpoofs)) return false;
    
    for (const spoof of data.permanentSpoofs) {
      if (!spoof.id || !spoof.domain || !spoof.userAgentId) return false;
    }
  }
  
  return true;
}

function showImportPreview(data) {
  const previewContainer = document.getElementById('importPreview');
  const previewContent = document.getElementById('importPreviewContent');
  const importSection = document.getElementById('importSection');
  const exportSection = document.getElementById('exportSection');
  
  if (!previewContainer || !previewContent) return;
  
  // Hide the import and export sections
  if (importSection) {
    importSection.style.display = 'none';
  }
  if (exportSection) {
    exportSection.style.display = 'none';
  }
  
  // Filter out default user agent from preview
  const userAgentsToShow = data.userAgents ? data.userAgents.filter(ua => ua.id !== 'default') : [];
  
  const version = data.version || 'Unknown';
  const exportDate = data.exportDate ? new Date(data.exportDate).toLocaleString() : 'Unknown';
  
  // Build user agents selection list
  let userAgentsHTML = '';
  if (userAgentsToShow.length > 0) {
    userAgentsHTML = `
      <div class="import-selection-section">
        <div class="import-section-header">
          <h3>📱 ${i18n.getMessage('userAgentsLabel') || 'User-Agents'}</h3>
          <div class="import-section-info">
            <span class="count-badge">${userAgentsToShow.length}</span>
            <button type="button" class="btn-link toggle-ua-btn">
              ${i18n.getMessage('selectAll') || 'Seleccionar todos'}
            </button>
          </div>
        </div>
        <div class="import-selection-list">
          ${userAgentsToShow.map(ua => `
            <div class="import-selection-item">
              <label class="import-checkbox-label">
                <input type="checkbox" class="import-ua-checkbox" value="${ua.id}" checked>
                <div class="import-item-content">
                  <div class="import-item-header">
                    <span class="import-item-name">${ua.name}</span>
                    <span class="import-item-badge" style="background: '#000'; color: '#ffffff'};">
                      ${ua.alias}
                    </span>
                  </div>
                  <div class="import-item-details">${ua.userAgent}</div>
                </div>
              </label>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Build permanent spoofs selection list
  let spoofsHTML = '';
  if (data.permanentSpoofs && data.permanentSpoofs.length > 0) {
    spoofsHTML = `
      <div class="import-selection-section">
        <div class="import-section-header">
          <h3>📌 ${i18n.getMessage('permanentSpoofListTitle') || 'Permanent Spoofs'}</h3>
          <div class="import-section-info">
            <span class="count-badge">${data.permanentSpoofs.length}</span>
            <button type="button" class="btn-link toggle-spoofs-btn">
              ${i18n.getMessage('selectAll') || 'Seleccionar todos'}
            </button>
          </div>
        </div>
        <div class="import-selection-list">
          ${data.permanentSpoofs.map(spoof => {
            const ua = userAgentsToShow.find(u => u.id === spoof.userAgentId);
            return `
              <div class="import-selection-item">
                <label class="import-checkbox-label">
                  <input type="checkbox" class="import-spoof-checkbox" value="${spoof.id}" checked>
                  <div class="import-item-content">
                    <div class="import-item-header">
                      <span class="import-item-name">🌐 ${spoof.domain}</span>
                    </div>
                    ${ua ? `
                      <div class="import-item-details">→ ${ua.name} (${ua.alias})</div>
                    ` : `
                      <div class="import-item-details warning">
                        ⚠️ User-Agent ${spoof.userAgentId} ${i18n.getMessage('notFoundLabel') || 'no encontrado'}
                      </div>
                    `}
                  </div>
                </label>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  previewContent.innerHTML = `
    <div class="import-preview-header">
      <div class="import-preview-title">
        <h2>${i18n.getMessage('importPreviewTitle') || 'Vista Previa de Importación'}</h2>
        <div class="import-metadata">
          <span>📦 v${version}</span>
          <span>📅 ${exportDate}</span>
        </div>
      </div>
    </div>
    
    <div class="import-selection-container">
      ${userAgentsHTML}
      ${spoofsHTML}
      
      ${!userAgentsHTML && !spoofsHTML ? `
        <div class="preview-empty">
          ${i18n.getMessage('noDataToImport') || 'No hay datos para importar'}
        </div>
      ` : ''}
    </div>
    
    <div class="import-actions-bar">
      <button class="btn btn-secondary cancel-import-btn">
        ${i18n.getMessage('cancelButton') || 'Cancelar'}
      </button>
      <button class="btn btn-primary confirm-import-btn">
        ${i18n.getMessage('confirmImportButton') || 'Confirmar Importación'}
      </button>
    </div>
  `;
  
  previewContainer.style.display = 'block';
  
  // Store data for import
  previewContainer.dataset.importData = JSON.stringify(data);
  
  // Add event listeners to dynamically created buttons
  setTimeout(() => {
    const toggleUABtn = previewContent.querySelector('.toggle-ua-btn');
    const toggleSpoofsBtn = previewContent.querySelector('.toggle-spoofs-btn');
    const cancelBtn = previewContent.querySelector('.cancel-import-btn');
    const confirmBtn = previewContent.querySelector('.confirm-import-btn');
    
    if (toggleUABtn) {
      toggleUABtn.addEventListener('click', window.toggleAllUserAgents);
    }
    
    if (toggleSpoofsBtn) {
      toggleSpoofsBtn.addEventListener('click', window.toggleAllSpoofs);
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', window.cancelImport);
    }
    
    if (confirmBtn) {
      confirmBtn.addEventListener('click', window.confirmImportSelected);
    }
  }, 0);
}

// Toggle all user agents checkboxes
window.toggleAllUserAgents = function() {
  const checkboxes = document.querySelectorAll('.import-ua-checkbox');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  
  checkboxes.forEach(cb => {
    cb.checked = !allChecked;
  });
};

// Toggle all spoofs checkboxes
window.toggleAllSpoofs = function() {
  const checkboxes = document.querySelectorAll('.import-spoof-checkbox');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  
  checkboxes.forEach(cb => {
    cb.checked = !allChecked;
  });
};

// Confirm import with selected items
window.confirmImportSelected = async function() {
  const previewContainer = document.getElementById('importPreview');
  const importData = JSON.parse(previewContainer.dataset.importData || '{}');
  const importFile = document.getElementById('importFile');
  const selectedFileName = document.getElementById('selectedFileName');
  
  // Get selected user agents
  const selectedUACheckboxes = document.querySelectorAll('.import-ua-checkbox:checked');
  const selectedUAIds = Array.from(selectedUACheckboxes).map(cb => cb.value);
  
  // Get selected spoofs
  const selectedSpoofCheckboxes = document.querySelectorAll('.import-spoof-checkbox:checked');
  const selectedSpoofIds = Array.from(selectedSpoofCheckboxes).map(cb => cb.value);
  
  try {
    const result = await chrome.storage.local.get(['userAgents', 'permanentSpoofs']);
    let existingUserAgents = result.userAgents || getDefaultUserAgents();
    let existingSpoofs = result.permanentSpoofs || [];
    
    // Filter imported user agents by selection
    const selectedUserAgents = (importData.userAgents || []).filter(ua => 
      selectedUAIds.includes(ua.id) && ua.id !== 'default'
    );
    
    // Filter imported spoofs by selection
    const selectedSpoofs = (importData.permanentSpoofs || []).filter(spoof => 
      selectedSpoofIds.includes(spoof.id)
    );
    
    // Merge with existing data (avoid duplicates)
    const existingUAIds = new Set(existingUserAgents.map(ua => ua.id));
    const newUserAgents = selectedUserAgents.filter(ua => !existingUAIds.has(ua.id));
    
    const existingSpoofDomains = new Set(existingSpoofs.map(s => s.domain));
    const newSpoofs = selectedSpoofs.filter(s => !existingSpoofDomains.has(s.domain));
    
    // Combine with existing
    const finalUserAgents = [...existingUserAgents, ...newUserAgents];
    const finalSpoofs = [...existingSpoofs, ...newSpoofs];
    
    // Handle settings import (including theme)
    const settingsToImport = {};
    if (importData.settings) {
      if (importData.settings.theme) {
        settingsToImport.theme = importData.settings.theme;
        // Apply the imported theme
        applyTheme(importData.settings.theme);
      }
    }
    
    // Save to storage
    await chrome.storage.local.set({
      userAgents: finalUserAgents,
      permanentSpoofs: finalSpoofs,
      ...settingsToImport
    });
    
    // Reload UI
    await loadUserAgents();
    await loadPermanentSpoofs();
    
    // Reset and hide preview
    importFile.value = '';
    selectedFileName.textContent = '';
    previewContainer.style.display = 'none';
    
    // Show import and export sections again
    const importSection = document.getElementById('importSection');
    const exportSection = document.getElementById('exportSection');
    if (importSection) importSection.style.display = 'block';
    if (exportSection) exportSection.style.display = 'block';
    
    // Show success message
    const count = newUserAgents.length + newSpoofs.length;
    showNotification(`${count} elementos importados correctamente`, 'success');
    
  } catch (error) {
    console.error('Import error:', error);
    showNotification('Error al importar la configuración', 'error');
  }
};

// Cancel import and return to file selection
window.cancelImport = function() {
  const previewContainer = document.getElementById('importPreview');
  const importSection = document.getElementById('importSection');
  const exportSection = document.getElementById('exportSection');
  const importFile = document.getElementById('importFile');
  const selectedFileName = document.getElementById('selectedFileName');
  
  // Hide preview
  if (previewContainer) {
    previewContainer.style.display = 'none';
  }
  
  // Show import and export sections again using grid
  const importExportContent = document.querySelector('#import-export .content');
  if (importExportContent) {
    importExportContent.style.display = 'grid';
  }
  
  if (importSection) {
    importSection.style.display = '';
  }
  if (exportSection) {
    exportSection.style.display = '';
  }
  
  // Clear file input
  if (importFile) {
    importFile.value = '';
  }
  
  if (selectedFileName) {
    selectedFileName.textContent = '';
  }
};

function showImportError(message) {
  const previewContainer = document.getElementById('importPreview');
  const previewContent = document.getElementById('importPreviewContent');
  
  if (!previewContainer || !previewContent) return;
  
  previewContent.innerHTML = `
    <div class="import-error">
      ${message}
    </div>
  `;
  
  previewContainer.style.display = 'block';
  
  setTimeout(() => {
    previewContainer.style.display = 'none';
  }, 5000);
}

async function confirmImport() {
  const previewContainer = document.getElementById('importPreview');
  const importData = JSON.parse(previewContainer.dataset.importData || '{}');
  const importFile = document.getElementById('importFile');
  const selectedFileName = document.getElementById('selectedFileName');
  
  // Get selected import mode
  const importMode = document.querySelector('input[name="importMode"]:checked').value;
  
  try {
    const result = await chrome.storage.local.get(['userAgents', 'permanentSpoofs']);
    let existingUserAgents = result.userAgents || getDefaultUserAgents();
    let existingSpoofs = result.permanentSpoofs || [];
    
    let newUserAgents = existingUserAgents;
    let newSpoofs = existingSpoofs;
    
    switch (importMode) {
      case 'replace':
        // Replace everything
        newUserAgents = importData.userAgents || getDefaultUserAgents();
        newSpoofs = importData.permanentSpoofs || [];
        break;
        
      case 'merge':
        // Merge: add new items, skip duplicates
        if (importData.userAgents) {
          const existingIds = new Set(existingUserAgents.map(ua => ua.id));
          const toAdd = importData.userAgents.filter(ua => !existingIds.has(ua.id));
          newUserAgents = [...existingUserAgents, ...toAdd];
        }
        
        if (importData.permanentSpoofs) {
          const existingDomains = new Set(existingSpoofs.map(s => s.domain));
          const toAdd = importData.permanentSpoofs.filter(s => !existingDomains.has(s.domain));
          newSpoofs = [...existingSpoofs, ...toAdd];
        }
        break;
        
      case 'userAgentsOnly':
        // Only import user agents
        if (importData.userAgents) {
          newUserAgents = importData.userAgents;
        }
        break;
        
      case 'spoofOnly':
        // Only import permanent spoofs
        if (importData.permanentSpoofs) {
          newSpoofs = importData.permanentSpoofs;
        }
        break;
    }
    
    // Ensure default user agent exists
    if (!newUserAgents.find(ua => ua.id === 'default')) {
      newUserAgents.unshift(getDefaultUserAgents()[0]);
    }
    
    // Save to storage
    await chrome.storage.local.set({
      userAgents: newUserAgents,
      permanentSpoofs: newSpoofs
    });
    
    // Reload UI
    await loadUserAgents();
    await loadPermanentSpoofs();
    
    // Reset form
    importFile.value = '';
    selectedFileName.textContent = '';
    previewContainer.style.display = 'none';
    
    // Show success message
    showNotification(i18n.getMessage('importSuccess') || 'Configuración importada correctamente', 'success');
    
  } catch (error) {
    console.error('Import error:', error);
    showImportError('Error al importar la configuración');
  }
}

async function editSpoofUserAgent(spoofId, card) {
  const result = await chrome.storage.local.get('userAgents');
  const userAgents = result.userAgents || [];
  
  // Filter out default and auto user agents
  const customUserAgents = userAgents.filter(ua => ua.id !== 'default' && ua.id !== 'auto');
  
  // Get references to the elements
  const nameSpan = card.querySelector(`.spoof-ua-name[data-spoof-id="${spoofId}"]`);
  const select = card.querySelector(`.spoof-ua-select[data-spoof-id="${spoofId}"]`);
  const editBtn = card.querySelector(`.spoof-ua-edit-btn[data-spoof-id="${spoofId}"]`);
  
  if (!nameSpan || !select || !editBtn) return;
  
  // Populate the select with user agents
  select.innerHTML = `<option value="">${i18n.getMessage('selectUserAgentOption') || 'Selecciona un User-Agent'}</option>`;
  customUserAgents.forEach(ua => {
    const option = document.createElement('option');
    option.value = ua.id;
    option.textContent = `${ua.name} (${ua.alias})`;
    select.appendChild(option);
  });
  
  // Toggle visibility
  nameSpan.classList.add('hidden');
  select.classList.remove('hidden');
  editBtn.classList.add('hidden');
  
  // Focus on the select
  select.focus();
  
  // Handle selection change
  const handleChange = async () => {
    const selectedUAId = select.value;
    
    if (selectedUAId) {
      // Update the permanent spoof
      const spoofResult = await chrome.storage.local.get('permanentSpoofs');
      let spoofs = spoofResult.permanentSpoofs || [];
      
      const spoofIndex = spoofs.findIndex(s => s.id === spoofId);
      if (spoofIndex !== -1) {
        spoofs[spoofIndex].userAgentId = selectedUAId;
        await chrome.storage.local.set({ permanentSpoofs: spoofs });
        
        // Reload the list to reflect changes
        await loadPermanentSpoofs();
        
        showNotification('User-Agent actualizado correctamente', 'success');
      }
    } else {
      // User cancelled, restore original view
      nameSpan.classList.remove('hidden');
      select.classList.add('hidden');
      editBtn.classList.remove('hidden');
    }
  };
  
  // Handle blur (when user clicks outside)
  const handleBlur = () => {
    // Small delay to allow click on option to register
    setTimeout(() => {
      if (!select.value || select.value === '') {
        nameSpan.classList.remove('hidden');
        select.classList.add('hidden');
        editBtn.classList.remove('hidden');
      }
    }, 150);
  };
  
  // Add event listeners
  select.addEventListener('change', handleChange);
  select.addEventListener('blur', handleBlur);
}

async function resetExtension() {
  if (!confirm('¿Estás seguro de que quieres resetear la extensión? Se eliminarán todos los User-Agents personalizados y Spoofs Permanentes. Esta acción no se puede deshacer.')) {
    return;
  }
  
  try {
    // Clear all storage
    await chrome.storage.local.clear();
    
    // Reinitialize with defaults
    await chrome.storage.local.set({
      userAgents: getDefaultUserAgents(),
      activeId: 'default'
    });
    
    // Reload the page to refresh all data
    showNotification('Extensión reseteada correctamente', 'success');
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
    
  } catch (error) {
    console.error('Reset error:', error);
    showNotification('Error al resetear la extensión', 'error');
  }
}

async function exportSettings() {
  try {
    const result = await chrome.storage.local.get(['userAgents', 'permanentSpoofs', 'activeSection', 'permanentOverride', 'perTabSpoof', 'theme']);
    
    const manifest = chrome.runtime.getManifest();
    
    // Filter out default and auto user agents from export (special internal user agents)
    const userAgentsToExport = (result.userAgents || [])
      .filter(ua => ua.id !== 'default' && ua.id !== 'auto')
      .map(ua => {
        // Remove unnecessary badge color fields (all badges are now black with white text)
        const { badgeBgColor, badgeTextColor, ...cleanUA } = ua;
        return cleanUA;
      });
    
    const exportData = {
      version: manifest.version,
      exportDate: new Date().toISOString(),
      userAgents: userAgentsToExport,
      permanentSpoofs: result.permanentSpoofs || [],
      settings: {
        activeSection: result.activeSection || 'custom-user-agents',
        permanentOverride: result.permanentOverride || false,
        perTabSpoof: result.perTabSpoof || false,
        theme: result.theme || 'auto'
      }
    };
    
    // Create JSON blob
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `useragent-changer-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(i18n.getMessage('exportSuccess') || 'Configuración exportada correctamente', 'success');
    
  } catch (error) {
    console.error('Export error:', error);
    alert('Error al exportar la configuración');
  }
}
