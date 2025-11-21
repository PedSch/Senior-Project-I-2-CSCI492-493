/**
 * Toast Notification System
 * Provides user feedback through toast notifications
 */

class ToastManager {
  constructor() {
    this.container = this.createContainer();
    this.toasts = [];
  }

  /**
   * Create toast container
   */
  createContainer() {
    let container = document.querySelector('.toast-container');
    
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    return container;
  }

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - Type: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duration in milliseconds (0 = persistent)
   * @param {string} title - Optional title
   */
  show(message, type = 'info', duration = 4000, title = '') {
    const toast = this.createToast(message, type, title);
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto-remove if duration is set
    if (duration > 0) {
      setTimeout(() => this.remove(toast), duration);
    }

    return toast;
  }

  /**
   * Create toast element
   */
  createToast(message, type, title) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = this.getIcon(type);
    
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${this.escapeHtml(title)}</div>` : ''}
        <div class="toast-message">${this.escapeHtml(message)}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    // Add close button event
    toast.querySelector('.toast-close').addEventListener('click', () => {
      this.remove(toast);
    });

    return toast;
  }

  /**
   * Get icon for toast type
   */
  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }

  /**
   * Remove a toast
   */
  remove(toast) {
    toast.classList.add('removing');
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
      
      const index = this.toasts.indexOf(toast);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    }, 300);
  }

  /**
   * Remove all toasts
   */
  removeAll() {
    this.toasts.forEach(toast => this.remove(toast));
  }

  /**
   * Helper methods for specific toast types
   */
  success(message, title = 'Success', duration = 4000) {
    return this.show(message, 'success', duration, title);
  }

  error(message, title = 'Error', duration = 6000) {
    return this.show(message, 'error', duration, title);
  }

  warning(message, title = 'Warning', duration = 5000) {
    return this.show(message, 'warning', duration, title);
  }

  info(message, title = '', duration = 4000) {
    return this.show(message, 'info', duration, title);
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
  .toast {
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }
  
  .toast.show {
    transform: translateX(0);
    opacity: 1;
  }
  
  .toast.removing {
    transform: translateX(400px);
    opacity: 0;
  }
`;
document.head.appendChild(style);

// Create global instance
const toast = new ToastManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ToastManager;
}
