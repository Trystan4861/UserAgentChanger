// i18n utility functions
const i18n = {
  // Get message from chrome.i18n
  getMessage: (key, substitutions) => {
    return chrome.i18n.getMessage(key, substitutions) || key;
  },

  // Get current language
  getLanguage: async () => {
    const result = await chrome.storage.local.get('language');
    return result.language || chrome.i18n.getUILanguage().split('-')[0];
  },

  // Set language
  setLanguage: async (lang) => {
    await chrome.storage.local.set({ language: lang });
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
  },

  // Initialize i18n on page load
  init: () => {
    // Translate immediately
    i18n.translatePage();
    
    // Set document language
    const lang = chrome.i18n.getUILanguage().split('-')[0];
    document.documentElement.lang = lang;
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', i18n.init);
} else {
  i18n.init();
}
