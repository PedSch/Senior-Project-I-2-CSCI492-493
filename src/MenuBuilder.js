/**
 * Menu Builder - Modern menu construction
 */

'use strict';

const { app, shell } = require('electron');

/**
 * Build application menu template
 * @param {Object} handlers - Menu action handlers
 * @returns {Array} Menu template
 */
function buildMenuTemplate(handlers = {}) {
  const {
    onAddItem,
    onClearItems,
    onOpenSchedule,
    onOpenCalendar,
    onOpenTimeSorter,
  } = handlers;

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Add Item',
          accelerator: 'CmdOrCtrl+N',
          click: onAddItem,
        },
        {
          label: 'Clear Items',
          accelerator: 'CmdOrCtrl+Shift+Delete',
          click: onClearItems,
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
        { type: 'separator' },
        {
          label: 'Schedule',
          accelerator: 'CmdOrCtrl+1',
          click: onOpenSchedule,
        },
        {
          label: 'Calendar',
          accelerator: 'CmdOrCtrl+2',
          click: onOpenCalendar,
        },
        {
          label: 'Time Sorter',
          accelerator: 'CmdOrCtrl+3',
          click: onOpenTimeSorter,
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://github.com/PedSch/Senior-Project-I-2-CSCI492-493');
          },
        },
        {
          label: 'Report Issue',
          click() {
            shell.openExternal('https://github.com/PedSch/Senior-Project-I-2-CSCI492-493/issues');
          },
        },
      ],
    },
  ];

  // macOS specific menu
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });
  }

  return template;
}

/**
 * Build developer menu (only in development)
 * @returns {Object} Developer menu
 */
function buildDeveloperMenu() {
  return {
    label: 'Developer',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: 'CmdOrCtrl+I',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.webContents.toggleDevTools();
          }
        },
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.reload();
          }
        },
      },
      { type: 'separator' },
      {
        label: 'Clear App Data',
        click() {
          const { dialog } = require('electron');
          dialog.showMessageBox({
            type: 'warning',
            message: 'This will clear all application data. Continue?',
            buttons: ['Cancel', 'Clear Data'],
          }).then(result => {
            if (result.response === 1) {
              // Clear data logic here
              console.log('Clearing app data...');
            }
          });
        },
      },
    ],
  };
}

module.exports = {
  buildMenuTemplate,
  buildDeveloperMenu,
};
