/**
 * Theme Management for Campus Room Scheduler
 * Handles dark mode toggle and theme persistence
 */

class ThemeManager {
  constructor() {
    this.currentTheme = this.getSavedTheme() || 'light';
    this.initializeTheme();
    this.setupToggleButton();
  }

  /**
   * Get saved theme from localStorage
   */
  getSavedTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
      return null;
    }
  }

  /**
   * Save theme to localStorage
   */
  saveTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.saveTheme(theme);
    this.updateToggleButton();
  }

  /**
   * Initialize theme on page load
   */
  initializeTheme() {
    // Check for system preference if no saved theme
    if (!this.currentTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
    }
    
    this.applyTheme(this.currentTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getSavedTheme()) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  /**
   * Setup theme toggle button
   */
  setupToggleButton() {
    // Create toggle button if it doesn't exist
    let toggleBtn = document.querySelector('.theme-toggle');
    
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.className = 'theme-toggle';
      toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
      toggleBtn.setAttribute('title', 'Toggle dark mode');
      document.body.appendChild(toggleBtn);
    }

    // Add click event listener
    toggleBtn.addEventListener('click', () => this.toggleTheme());
    
    // Update button on creation
    this.updateToggleButton();
  }

  /**
   * Update toggle button icon
   */
  updateToggleButton() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) return;

    const icon = this.currentTheme === 'light' ? '🌙' : '☀️';
    toggleBtn.innerHTML = icon;
    toggleBtn.setAttribute('title', 
      this.currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
    );
  }

  /**
   * Get current theme
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Set specific theme
   */
  setTheme(theme) {
    if (['light', 'dark', 'high-contrast'].includes(theme)) {
      this.applyTheme(theme);
    }
  }
}

// Initialize theme manager when DOM is ready
let themeManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
  });
} else {
  themeManager = new ThemeManager();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
