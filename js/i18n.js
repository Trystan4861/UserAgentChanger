// i18n utility functions
const i18n = {
  messages: {},
  currentLang: 'en',

  // Check if running in extension context
  isExtensionContext: () => {
    return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL;
  },

  // Load messages from JSON file
  loadMessages: async (lang) => {
    try {
      if (!i18n.isExtensionContext()) {
        console.warn('Not in extension context, using default messages');
        return false;
      }
      
      const response = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
      if (response.ok) {
        i18n.messages = await response.json();
        i18n.currentLang = lang;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading messages:', error);
      return false;
    }
  },

  // Get message from loaded messages
  getMessage: (key, substitutions) => {
    const messageObj = i18n.messages[key];
    if (!messageObj) return key;
    
    let message = messageObj.message || key;
    
    // Handle substitutions
    if (substitutions) {
      if (typeof substitutions === 'string') {
        message = message.replace('$1', substitutions);
      } else if (Array.isArray(substitutions)) {
        substitutions.forEach((sub, index) => {
          message = message.replace(`$${index + 1}`, sub);
        });
      }
    }
    
    return message;
  },

  // Get current language
  getLanguage: async () => {
    if (!i18n.isExtensionContext()) {
      // Default to browser language when not in extension context
      const browserLang = navigator.language || navigator.userLanguage || 'en';
      const langCode = browserLang.split('-')[0];
      const supportedLanguages = ['en', 'es'];
      return supportedLanguages.includes(langCode) ? langCode : 'en';
    }
    
    const result = await chrome.storage.local.get('language');
    
    // If no language is stored, use browser's language as default
    if (!result.language) {
      // Get browser language (e.g., 'es-ES' or 'en-US')
      const browserLang = navigator.language || navigator.userLanguage || 'en';
      // Extract just the language code (e.g., 'es' from 'es-ES')
      const langCode = browserLang.split('-')[0];
      
      // Check if we have translations for this language, otherwise default to 'en'
      const supportedLanguages = ['en', 'es']; // Add more as you support them
      const defaultLang = supportedLanguages.includes(langCode) ? langCode : 'en';
      
      // Store this as the user's preference for future use
      await chrome.storage.local.set({ language: defaultLang });
      
      return defaultLang;
    }
    
    return result.language;
  },

  // Set language
  setLanguage: async (lang) => {
    if (i18n.isExtensionContext()) {
      await chrome.storage.local.set({ language: lang });
    }
  },

  // Translate all elements with data-i18n attribute
  translatePage: () => {
    // Translate text content
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const message = i18n.getMessage(key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        // Don't change input values, only placeholders
      } else if (element.tagName === 'OPTION') {
        element.textContent = message;
      } else {
        element.textContent = message;
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const message = i18n.getMessage(key);
      element.placeholder = message;
    });

    // Translate titles
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const message = i18n.getMessage(key);
      element.title = message;
    });

    // Mark page as ready to prevent FOUC
    document.body.classList.add('i18n-ready');
  },

  // Initialize i18n on page load
  init: async () => {
    if (!i18n.isExtensionContext()) {
      console.warn('Running outside extension context - skipping i18n initialization');
      // Just mark as ready to show the page with hardcoded text
      document.body.classList.add('i18n-ready');
      return;
    }
    
    // Get the stored language preference
    const lang = await i18n.getLanguage();
    
    // Load messages for the selected language
    let loaded = await i18n.loadMessages(lang);
    
    // If the preferred language fails, fallback to default
    if (!loaded && lang !== 'en') {
      loaded = await i18n.loadMessages('en');
    }
    
    // Translate page
    i18n.translatePage();
    
    // Set document language
    document.documentElement.lang = i18n.currentLang;
  }
};

// Auto-initialize when DOM is ready - returns a promise
i18n.ready = (async () => {
  if (document.readyState === 'loading') {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
  }
  
  try {
    await i18n.init();
  } catch (error) {
    console.error('Error initializing i18n:', error);
    // Even if there's an error, mark as ready to prevent infinite spinner
    document.body.classList.add('i18n-ready');
  }
})();

// Fallback: ensure page is visible even if something goes wrong
setTimeout(() => {
  if (!document.body.classList.contains('i18n-ready')) {
    console.warn('i18n initialization timeout - forcing page display');
    document.body.classList.add('i18n-ready');
  }
}, 2000); // 2 second timeout
