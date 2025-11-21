# Developer Quick Reference

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm start

# Run with live reload
npm run dev

# Build for production
npm run build
```

## 📂 File Locations

### Main Process
- `main.js` - Application entry point
- `preload.js` - Secure IPC bridge
- `config.js` - App configuration

### Core Modules (`/src`)
- `DataStore.js` - Data persistence
- `Window.js` - Window helper
- `MenuBuilder.js` - Menu system
- `utils.js` - Utility functions

### Renderers (`/renderer`)
- `mainWindow.js` - Main window logic
- `schedule.js` - Schedule logic

### HTML Views
- `mainWindow.html` - Main interface
- `Schedule.html` - Schedule view
- `addWindow.html` - Add item dialog
- `calendar/Calendar.html` - Calendar view

## 🔌 IPC Communication

### Send from Renderer to Main
```javascript
// In renderer (uses preload bridge)
window.electronAPI.addItem('Room 101');
window.electronAPI.openSchedule();
window.electronAPI.openCalendar();
```

### Receive in Main Process
```javascript
// In main.js
ipcMain.on('item:add', (event, item) => {
  // Handle the event
});
```

### Send from Main to Renderer
```javascript
// In main.js
mainWindow.webContents.send('item:add', item);
```

### Receive in Renderer
```javascript
// In renderer (uses preload bridge)
window.electronAPI.onItemAdd((item) => {
  // Handle the update
});
```

## 💾 Data Store Usage

### Names
```javascript
// Get all names
const names = dataStore.getNames();

// Add a name
dataStore.addName('Room 101');

// Delete a name
dataStore.deleteName('Room 101');

// Clear all names
dataStore.clearNames();
```

### Rooms
```javascript
// Get all rooms
const rooms = dataStore.getRooms();

// Add a room
dataStore.addRoom({
  name: 'Conference Room A',
  capacity: 20,
  building: 'Main Hall',
  floor: 2,
  equipment: ['Projector', 'Whiteboard']
});

// Get room by ID
const room = dataStore.getRoomById('room-123');

// Update room
dataStore.updateRoom('room-123', { capacity: 25 });

// Delete room
dataStore.deleteRoom('room-123');
```

### Bookings
```javascript
// Add booking
dataStore.addBooking({
  roomId: 'room-123',
  title: 'Team Meeting',
  startTime: '2025-11-21T14:00:00',
  endTime: '2025-11-21T15:00:00',
  bookedBy: 'John Doe'
});

// Check availability
const isAvailable = dataStore.isRoomAvailable(
  'room-123',
  '2025-11-21T14:00:00',
  '2025-11-21T15:00:00'
);

// Get all bookings for a room
const bookings = dataStore.getBookingsByRoom('room-123');

// Delete booking
dataStore.deleteBooking('booking-123');
```

## 🪟 Window Management

### Create Windows
```javascript
// Create main window
createMainWindow();

// Create schedule window
createScheduleWindow();

// Create add window
createAddWindow();

// Create calendar window
createCalendarWindow();
```

### Window Properties
```javascript
const window = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, 'preload.js')
  }
});
```

## 🎨 UI Components

### Navigation Sidebar
```javascript
// Open sidebar
openNav();

// Close sidebar
closeNav();
```

### Schedule List
```javascript
// Items are displayed in a Materialize collection
<ul class="collection">
  <li class="collection-item">Room 101</li>
</ul>
```

## 🛠️ Utility Functions

```javascript
const utils = require('./src/utils');

// Format date
utils.formatDate(new Date());
// Output: "Thursday, November 21, 2025"

// Format time
utils.formatTime(new Date());
// Output: "02:30 PM"

// Generate ID
utils.generateId('room');
// Output: "room-1700582400000-abc123def"

// Sanitize input
utils.sanitizeInput('<script>alert("xss")</script>');
// Output: "scriptalert("xss")/script"

// Check time overlap
utils.timeRangesOverlap(start1, end1, start2, end2);
// Returns: boolean

// Debounce function
const debouncedSave = utils.debounce(saveData, 300);
```

## ⌨️ Keyboard Shortcuts

### Global
- `Ctrl/Cmd + Q` - Quit
- `Ctrl/Cmd + N` - New Item
- `Ctrl/Cmd + Shift + Delete` - Clear Items
- `Ctrl/Cmd + R` - Reload
- `Ctrl/Cmd + I` - Toggle DevTools (dev mode)

### Navigation
- `Ctrl/Cmd + 1` - Open Schedule
- `Ctrl/Cmd + 2` - Open Calendar
- `Ctrl/Cmd + 3` - Open Time Sorter
- `Escape` - Close Sidebar

## 🐛 Debugging

### Enable DevTools
```javascript
// In development mode
mainWindow.webContents.openDevTools();

// Or use keyboard shortcut
// Ctrl/Cmd + I
```

### Console Logging
```javascript
// Main process (appears in terminal)
console.log('Main process:', data);

// Renderer process (appears in DevTools)
console.log('Renderer:', data);
```

### Error Handling
```javascript
// Catch errors in try-catch
try {
  dataStore.addName(name);
} catch (error) {
  console.error('Error:', error);
  dialog.showErrorBox('Error', error.message);
}
```

## 📝 Configuration

### Edit `config.js`
```javascript
module.exports = {
  windows: {
    main: {
      width: 1200,  // Change default width
      height: 800   // Change default height
    }
  },
  
  calendar: {
    minTime: '08:00:00',  // Start time
    maxTime: '20:00:00'   // End time
  }
};
```

## 🔒 Security Checklist

- ✅ `nodeIntegration: false`
- ✅ `contextIsolation: true`
- ✅ `enableRemoteModule: false`
- ✅ Use preload script for IPC
- ✅ Validate all user input
- ✅ Sanitize data before storing
- ✅ Use HTTPS for external resources

## 📦 Building

### For Current Platform
```bash
npm run build
```

### For Specific Platform
```bash
npm run package-mac     # macOS
npm run package-win     # Windows
npm run package-linux   # Linux
```

### Output Location
```
release-builds/
  ├── Campus Room Scheduler-darwin-x64/
  ├── Campus Room Scheduler-win32-ia32/
  └── Campus Room Scheduler-linux-x64/
```

## 🧪 Testing

### Manual Testing
1. Install dependencies: `npm install`
2. Run app: `npm start`
3. Test each window:
   - Main window loads
   - Schedule window opens
   - Add item works
   - Calendar loads
4. Test data persistence:
   - Add items
   - Close app
   - Reopen - items should persist

### Check for Errors
1. Open DevTools (`Ctrl/Cmd + I`)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Application > Storage for data

## 📚 Common Tasks

### Add a New IPC Event

**1. In preload.js:**
```javascript
contextBridge.exposeInMainWorld('electronAPI', {
  // Add new method
  myNewEvent: (data) => ipcRenderer.send('my-event', data)
});
```

**2. In main.js:**
```javascript
ipcMain.on('my-event', (event, data) => {
  // Handle the event
  console.log('Received:', data);
});
```

**3. In renderer:**
```javascript
window.electronAPI.myNewEvent({ foo: 'bar' });
```

### Add a New Window

**1. Create HTML file:**
```html
<!-- myWindow.html -->
<!DOCTYPE html>
<html>
<head><title>My Window</title></head>
<body>
  <h1>Hello World</h1>
  <script src="./renderer/myWindow.js"></script>
</body>
</html>
```

**2. Add creation function in main.js:**
```javascript
function createMyWindow() {
  myWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  myWindow.loadFile('myWindow.html');
}
```

**3. Add menu item:**
```javascript
// In MenuBuilder.js
{
  label: 'My Window',
  click: onOpenMyWindow
}
```

### Add Data to Store

**1. Update schema in DataStore.js:**
```javascript
const schema = {
  // Add new field
  myData: {
    type: 'array',
    default: []
  }
};
```

**2. Add methods:**
```javascript
getMyData() {
  return this.get('myData', []);
}

addMyData(item) {
  const data = this.getMyData();
  data.push(item);
  this.set('myData', data);
  return this;
}
```

## 🆘 Troubleshooting

### App won't start
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### Data not persisting
- Check `~/.config/campus-scheduler/` (Linux/Mac)
- Check `%APPDATA%/campus-scheduler/` (Windows)
- Ensure write permissions

### DevTools won't open
- Check if `isDev` is true
- Ensure developer menu is enabled
- Try keyboard shortcut: `Ctrl/Cmd + I`

### IPC not working
- Verify preload script is loaded
- Check `window.electronAPI` exists
- Look for errors in DevTools console

## 📖 Documentation

- `README.md` - Overview & getting started
- `ARCHITECTURE.md` - System architecture
- `MIGRATION.md` - Upgrade guide
- `SECURITY.md` - Security practices
- `CHANGELOG.md` - Version history

---

**Need help?** Check the documentation or open an issue on GitHub!
