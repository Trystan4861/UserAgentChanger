/**
 * notify.js - Notification system for User-Agent Changer Extension
 * Handles displaying user notifications
 */

/**
 * Create an HTML element with optional attributes and content
 * @param {string} tag - HTML tag name
 * @param {object} attributes - Element attributes
 * @param {string|Node|Node[]} content - Element content
 * @returns {HTMLElement} - Created element
 */
function createElement(tag, attributes = {}, content = null) {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Set content
  if (content !== null) {
    if (typeof content === 'string') {
      element.textContent = content;
    } else if (Array.isArray(content)) {
      content.forEach(child => {
        if (child instanceof Node) {
          element.appendChild(child);
        }
      });
    } else if (content instanceof Node) {
      element.appendChild(content);
    }
  }
  
  return element;
}

/**
 * Show a notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success', 'error', 'info')
 * @param {number} duration - Duration in milliseconds (0 for permanent)
 */
function showNotification(message, type = 'info', duration = 3000) {
  // Remove existing notifications
  const existing = document.querySelectorAll('.notification');
  existing.forEach(el => el.remove());
  
  // Create notification element
  const notification = createElement('div', {
    className: `notification notification-${type}`
  }, message);
  
  document.body.appendChild(notification);
  
  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      notification.classList.add('notification-fade-out');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

// Make functions available globally
window.notifyReady = true;
console.log('notify.js loaded successfully');
