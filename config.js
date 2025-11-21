/**
 * Application Configuration
 * Centralized configuration for the Campus Room Scheduler
 */

'use strict';

module.exports = {
  // Application Info
  app: {
    name: 'Campus Room Scheduler',
    version: '2.0.0',
    description: 'Modern room booking and scheduling for campus',
  },

  // Window Configurations
  windows: {
    main: {
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
    },
    schedule: {
      width: 1000,
      height: 700,
      minWidth: 600,
      minHeight: 400,
    },
    calendar: {
      width: 900,
      height: 950,
      minWidth: 700,
      minHeight: 600,
    },
    addItem: {
      width: 400,
      height: 350,
      resizable: false,
    },
  },

  // Data Store Configuration
  dataStore: {
    name: 'campus-scheduler',
    encryptionKey: null, // Set to enable encryption
  },

  // Feature Flags
  features: {
    multiUser: false, // Coming in future version
    authentication: false, // Coming in future version
    cloudSync: false, // Coming in future version
    notifications: false, // Coming in future version
  },

  // Development Settings
  development: {
    devTools: true,
    liveReload: true,
    verboseLogging: true,
  },

  // Production Settings
  production: {
    devTools: false,
    liveReload: false,
    verboseLogging: false,
    errorReporting: true,
  },

  // Security Settings
  security: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    webSecurity: true,
  },

  // Calendar Settings
  calendar: {
    defaultView: 'dayGridMonth',
    firstDay: 0, // Sunday
    slotDuration: '00:30:00', // 30 minute slots
    minTime: '07:00:00',
    maxTime: '22:00:00',
  },

  // Room Booking Settings
  booking: {
    minDuration: 30, // minutes
    maxDuration: 480, // minutes (8 hours)
    advanceBookingDays: 90,
    allowPastBooking: false,
  },
};
