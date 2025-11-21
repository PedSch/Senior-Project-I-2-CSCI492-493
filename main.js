//the main process entry 
'use strict';

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
// const Window = require('./Window'); // Commented out - not used in current code
// const DataStoreName = require('./DataStoreName'); // Will be refactored

// Set environment
const isDev = process.env.NODE_ENV !== 'production';
process.env.NODE_ENV = isDev ? 'development' : 'production';

// Enable live reload in development
if (isDev) {
  try {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
      hardResetMethod: 'exit',
    });
  } catch (err) {
    console.log('Electron reload not available');
  }
}

// Store instance (will be initialized with electron-store v11)
// const NameData = new DataStoreName({ name: 'Name main' }); // Will refactor with new store

// Window references
let mainWindow;
let addWindow;
let scheduleWindow;
let calendarWindow;

// App ready event - using modern syntax
app.whenReady().then(() => {
  createMainWindow();

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // On macOS, re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Create main window function
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // TODO: Enable in future for security
      enableRemoteModule: false,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'mainWindow.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Quit app when main window closed (except on macOS)
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
// Create schedule window
function createScheduleWindow() {
  scheduleWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  scheduleWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'Schedule.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  // Initialize with names when ready
  scheduleWindow.webContents.on('did-finish-load', () => {
    // scheduleWindow.webContents.send('names', NameData.names); // Will refactor
  });

  scheduleWindow.on('closed', () => {
    scheduleWindow = null;
  });
}

// Create add item window
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 350,
    title: 'Add Schedule Time',
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'addWindow.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  addWindow.on('closed', () => {
    addWindow = null;
  });
}
// IPC: Catch item:add event
ipcMain.on('item:add', (e, item) => {
  if (mainWindow) {
    mainWindow.webContents.send('item:add', item);
  }
  if (addWindow) {
    addWindow.close();
  }
});

// Create calendar window
function createCalendarWindow() {
  calendarWindow = new BrowserWindow({
    width: 900,
    height: 950,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  calendarWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'calendar', 'Calendar.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  calendarWindow.on('closed', () => {
    calendarWindow = null;
  });
} 

//menu settings 
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        accelerator: 'CmdOrCtrl+N',
        click() {
          createAddWindow();
        },
      },
      {
        label: 'Clear Items',
        click() {
          if (scheduleWindow) {
            scheduleWindow.webContents.send('item:clear');
          }
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        },
      },
    ],
  },
];

//edit menu template 
mainMenuTemplate.push({
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
});

// View menu
mainMenuTemplate.push({
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
});
// Add macOS specific menu
if (process.platform === 'darwin') {
  mainMenuTemplate.unshift({
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

// Add developer tools in development mode
if (isDev) {
  mainMenuTemplate.push({
    label: 'Developer',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        },
      },
      { role: 'reload' },
    ],
  });
}

// Window menu
mainMenuTemplate.push({
  label: 'Window',
  submenu: [
    { role: 'minimize' },
    { role: 'close' },
    { type: 'separator' },
    {
      label: 'Schedule',
      click() {
        if (!scheduleWindow) {
          createScheduleWindow();
        } else {
          scheduleWindow.focus();
        }
      },
    },
    {
      label: 'Calendar',
      click() {
        if (!calendarWindow) {
          createCalendarWindow();
        } else {
          calendarWindow.focus();
        }
      },
    },
  ],
});

// Help menu
mainMenuTemplate.push({
  label: 'Help',
  submenu: [
    {
      label: 'Learn More',
      click() {
        require('electron').shell.openExternal('https://github.com/PedSch/Senior-Project-I-2-CSCI492-493');
      },
    },
  ],
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
