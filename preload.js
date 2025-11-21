/**
 * Preload Script - Secure IPC Bridge
 * This script runs in a privileged context and exposes safe APIs to the renderer
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Schedule item operations
  addItem: (item) => ipcRenderer.send('item:add', item),
  onItemAdd: (callback) => ipcRenderer.on('item:add', (event, item) => callback(item)),
  onItemClear: (callback) => ipcRenderer.on('item:clear', () => callback()),
  
  // Room/Name operations
  onNames: (callback) => ipcRenderer.on('names', (event, names) => callback(names)),
  
  // Navigation
  openSchedule: () => ipcRenderer.send('open-schedule'),
  openCalendar: () => ipcRenderer.send('open-calendar'),
  openTimeSorter: () => ipcRenderer.send('open-time-sorter'),
  
  // Utility
  platform: process.platform,
  
  // Remove listeners (cleanup)
  removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
});

// Log when preload script is loaded
console.log('Preload script loaded successfully');
