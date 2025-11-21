/**
 * Modern Window Manager Class
 * Replaces Window.js with improved error handling and modern patterns
 */

'use strict';

const { BrowserWindow } = require('electron');
const path = require('path');

/**
 * Default window configuration
 */
const defaultProps = {
  width: 800,
  height: 900,
  show: false,
  backgroundColor: '#ffffff',
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, '..', 'preload.js'),
  },
};

/**
 * Window class extending BrowserWindow with modern patterns
 */
class Window extends BrowserWindow {
  /**
   * Create a new window
   * @param {Object} options - Window options
   * @param {string} options.file - HTML file to load
   * @param {Object} options.windowSettings - Additional window settings
   */
  constructor({ file, ...windowSettings }) {
    // Merge default props with custom settings
    super({ ...defaultProps, ...windowSettings });

    this.filePath = file;
    
    // Load the HTML file
    this.loadHTMLFile(file);

    // Show window when ready (prevents flicker)
    this.once('ready-to-show', () => {
      this.show();
    });

    // Error handling
    this.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error(`Failed to load ${file}:`, errorDescription);
    });

    // Handle crashed renderer process
    this.webContents.on('render-process-gone', (event, details) => {
      console.error('Renderer process gone:', details);
    });
  }

  /**
   * Load HTML file
   * @param {string} file - Path to HTML file
   */
  async loadHTMLFile(file) {
    try {
      const filePath = path.join(__dirname, '..', file);
      await this.loadFile(filePath);
    } catch (error) {
      console.error(`Error loading file ${file}:`, error);
    }
  }

  /**
   * Toggle developer tools
   */
  toggleDevTools() {
    if (this.webContents.isDevToolsOpened()) {
      this.webContents.closeDevTools();
    } else {
      this.webContents.openDevTools();
    }
  }

  /**
   * Send message to renderer process
   * @param {string} channel - IPC channel
   * @param {*} data - Data to send
   */
  send(channel, data) {
    if (this.webContents && !this.webContents.isDestroyed()) {
      this.webContents.send(channel, data);
    }
  }

  /**
   * Reload the window
   */
  reload() {
    if (this.webContents && !this.webContents.isDestroyed()) {
      this.webContents.reload();
    }
  }

  /**
   * Focus the window
   */
  focus() {
    if (!this.isDestroyed()) {
      if (this.isMinimized()) {
        this.restore();
      }
      super.focus();
    }
  }
}

module.exports = Window;
