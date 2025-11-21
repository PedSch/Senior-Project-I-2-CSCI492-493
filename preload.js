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
  
  // Room CRUD operations
  getRooms: () => ipcRenderer.invoke('rooms:get'),
  addRoom: (room) => ipcRenderer.invoke('rooms:add', room),
  updateRoom: (id, updates) => ipcRenderer.invoke('rooms:update', id, updates),
  deleteRoom: (id) => ipcRenderer.invoke('rooms:delete', id),
  getRoomById: (id) => ipcRenderer.invoke('rooms:getById', id),
  onRoomsUpdate: (callback) => ipcRenderer.on('rooms:updated', (event, rooms) => callback(rooms)),
  
  // Booking CRUD operations
  getBookings: () => ipcRenderer.invoke('bookings:get'),
  addBooking: (booking) => ipcRenderer.invoke('bookings:add', booking),
  updateBooking: (id, updates) => ipcRenderer.invoke('bookings:update', id, updates),
  deleteBooking: (id) => ipcRenderer.invoke('bookings:delete', id),
  getBookingById: (id) => ipcRenderer.invoke('bookings:getById', id),
  getBookingsByRoom: (roomId) => ipcRenderer.invoke('bookings:getByRoom', roomId),
  checkRoomAvailability: (roomId, startTime, endTime, excludeBookingId) => 
    ipcRenderer.invoke('bookings:checkAvailability', roomId, startTime, endTime, excludeBookingId),
  onBookingsUpdate: (callback) => ipcRenderer.on('bookings:updated', (event, bookings) => callback(bookings)),
  
  // Auth operations
  createUser: (username, password, role) => ipcRenderer.invoke('auth:createUser', { username, password, role }),
  login: (username, password) => ipcRenderer.invoke('auth:login', { username, password }),
  validateSession: (token) => ipcRenderer.invoke('auth:validate', token),
  logout: (token) => ipcRenderer.invoke('auth:logout', token),
  
  // Export/Import operations
  exportIcal: () => ipcRenderer.invoke('export:ical'),
  exportBackup: () => ipcRenderer.invoke('export:backup'),
  importRestore: (data) => ipcRenderer.invoke('import:restore', data),
  
  // Navigation
  openSchedule: () => ipcRenderer.send('open-schedule'),
  openCalendar: () => ipcRenderer.send('open-calendar'),
  openTimeSorter: () => ipcRenderer.send('open-time-sorter'),
  openRooms: () => ipcRenderer.send('open-rooms'),
  openBookings: () => ipcRenderer.send('open-bookings'),
  openKiosk: () => ipcRenderer.send('open-kiosk'),
  
  // Utility
  platform: process.platform,
  
  // Remove listeners (cleanup)
  removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
});

// Log when preload script is loaded
console.log('Preload script loaded successfully');
