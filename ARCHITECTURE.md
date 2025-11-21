# Code Architecture - Campus Room Scheduler v2.0

## Overview

The Campus Room Scheduler has been completely modernized with secure architecture, better code organization, and modern JavaScript patterns.

## Architecture Diagram

```
Campus Room Scheduler
├── Main Process (main.js)
│   ├── Window Management
│   ├── IPC Handlers
│   ├── Menu System
│   └── Data Store Integration
│
├── Preload Script (preload.js)
│   └── Secure Context Bridge
│
├── Renderer Processes
│   ├── mainWindow.html + renderer/mainWindow.js
│   ├── Schedule.html + renderer/schedule.js
│   ├── addWindow.html (inline script)
│   └── Calendar.html
│
├── Core Modules (/src)
│   ├── DataStore.js - Data persistence
│   ├── Window.js - Window class (optional)
│   ├── MenuBuilder.js - Menu construction
│   └── utils.js - Helper functions
│
└── Configuration
    └── config.js - App settings
```

## Security Model

### Context Isolation

**ENABLED** - Renderer processes run in isolated contexts for security.

```javascript
webPreferences: {
  nodeIntegration: false,      // ✅ Disabled
  contextIsolation: true,      // ✅ Enabled
  enableRemoteModule: false,   // ✅ Disabled
  preload: path.join(__dirname, 'preload.js')
}
```

### IPC Communication Flow

```
Renderer Process
    ↓ (via window.electronAPI)
Preload Script (Context Bridge)
    ↓ (secure IPC)
Main Process
    ↓
Data Store / System API
```

## File Structure

### Main Process Files

#### `main.js`
- **Purpose**: Entry point for Electron app
- **Responsibilities**:
  - Create and manage windows
  - Handle IPC communication
  - Setup application menu
  - Manage data store
  - Handle app lifecycle

**Key Functions**:
- `createMainWindow()` - Creates main application window
- `createScheduleWindow()` - Creates schedule management window
- `createAddWindow()` - Creates add item dialog
- `createCalendarWindow()` - Creates calendar view

#### `preload.js`
- **Purpose**: Secure bridge between renderer and main process
- **Responsibilities**:
  - Expose safe IPC methods to renderer
  - Prevent direct Node.js access from renderer
  - Provide controlled API surface

**Exposed API**:
```javascript
window.electronAPI = {
  addItem: (item) => {},
  onItemAdd: (callback) => {},
  onItemClear: (callback) => {},
  onNames: (callback) => {},
  openSchedule: () => {},
  openCalendar: () => {},
  openTimeSorter: () => {},
  platform: string,
  removeListener: (channel, callback) => {}
}
```

### Core Modules (`/src`)

#### `DataStore.js`
- **Purpose**: Data persistence and management
- **Technology**: electron-store v11
- **Features**:
  - Schema validation
  - CRUD operations for names, rooms, bookings
  - Conflict detection
  - Data import/export

**Key Methods**:
```javascript
// Names
getNames()
addName(name)
deleteName(name)
clearNames()

// Rooms
getRooms()
addRoom(room)
getRoomById(id)
updateRoom(id, updates)
deleteRoom(id)

// Bookings
getBookings()
addBooking(booking)
getBookingById(id)
getBookingsByRoom(roomId)
isRoomAvailable(roomId, startTime, endTime)
updateBooking(id, updates)
deleteBooking(id)

// Utility
exportData()
importData(data)
clearAll()
```

#### `MenuBuilder.js`
- **Purpose**: Construct application menus
- **Features**:
  - Platform-specific menus (macOS vs Windows/Linux)
  - Developer menu for development mode
  - Keyboard shortcuts
  - Dynamic menu handlers

**Key Functions**:
- `buildMenuTemplate(handlers)` - Build main menu
- `buildDeveloperMenu()` - Build dev menu

#### `Window.js` (Optional Helper)
- **Purpose**: Base window class with common functionality
- **Features**:
  - Default security settings
  - Error handling
  - DevTools management
  - Safe IPC sending

#### `utils.js`
- **Purpose**: Common utility functions
- **Functions**:
  - `formatDate(date, options)` - Format dates
  - `formatTime(time)` - Format times
  - `generateId(prefix)` - Generate unique IDs
  - `sanitizeInput(input)` - Sanitize user input
  - `timeRangesOverlap()` - Check time conflicts
  - `debounce(func, wait)` - Debounce functions
  - And more...

### Renderer Files

#### `mainWindow.html` + `renderer/mainWindow.js`
- **Purpose**: Main application interface
- **Features**:
  - Dashboard with quick access cards
  - Navigation sidebar
  - Live date/time display
  - Keyboard shortcuts

#### `Schedule.html` + `renderer/schedule.js`
- **Purpose**: Schedule management interface
- **Features**:
  - Display schedule items
  - Add/remove items
  - Double-click to delete
  - Timestamp tracking

#### `addWindow.html`
- **Purpose**: Add schedule item dialog
- **Features**:
  - Modal window
  - Input validation
  - Materialize CSS styling

### Configuration

#### `config.js`
- **Purpose**: Centralized application configuration
- **Sections**:
  - App info
  - Window configurations
  - Feature flags
  - Security settings
  - Calendar settings
  - Booking rules

## Data Flow

### Adding a Schedule Item

```
1. User clicks "Add Item" button
   ↓
2. Main process creates addWindow
   ↓
3. User enters name/room and submits
   ↓
4. Renderer calls window.electronAPI.addItem(item)
   ↓
5. Preload script sends 'item:add' IPC message
   ↓
6. Main process receives IPC message
   ↓
7. DataStore.addName(item) - Saves to disk
   ↓
8. Main process broadcasts 'item:add' to all windows
   ↓
9. Schedule window receives update via electronAPI.onItemAdd()
   ↓
10. UI updates with new item
```

### Window Creation Flow

```
1. User requests window (menu, shortcut, or button)
   ↓
2. Main process checks if window already exists
   ↓
3. If exists: focus existing window
   If not: create new window
   ↓
4. Load HTML file
   ↓
5. Attach preload script
   ↓
6. Window ready-to-show event fires
   ↓
7. Show window (prevents flicker)
   ↓
8. Send initial data (if needed)
```

## Modern JavaScript Patterns Used

### 1. Arrow Functions
```javascript
const createWindow = () => {
  // Modern arrow function syntax
};
```

### 2. Destructuring
```javascript
const { app, BrowserWindow, Menu } = require('electron');
```

### 3. Template Literals
```javascript
const message = `User ${name} booked room ${roomId}`;
```

### 4. Async/Await
```javascript
async loadHTMLFile(file) {
  try {
    await this.loadFile(filePath);
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
  }
}
```

### 5. Spread Operator
```javascript
const newRoom = { ...defaultRoom, ...customSettings };
```

### 6. Optional Chaining
```javascript
window?.webContents?.send('update', data);
```

### 7. Nullish Coalescing
```javascript
const value = userInput ?? defaultValue;
```

### 8. ES6 Classes
```javascript
class DataStore extends Store {
  constructor(settings) {
    super({ ...settings, schema });
  }
}
```

## Error Handling

### Main Process
```javascript
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  dialog.showErrorBox('Application Error', error.message);
});
```

### Renderer Process
```javascript
window.addEventListener('error', (event) => {
  console.error('Renderer error:', event.error);
});
```

### IPC Errors
```javascript
try {
  dataStore.addName(item);
  // Success
} catch (error) {
  console.error('Error adding item:', error);
  dialog.showErrorBox('Error', 'Failed to add item');
}
```

## Testing Strategy

### Unit Tests (Future)
- Test DataStore methods
- Test utility functions
- Test menu builders

### Integration Tests (Future)
- Test IPC communication
- Test window creation
- Test data persistence

### E2E Tests (Future)
- Test complete user workflows
- Test multi-window scenarios

## Migration from v1.0

### Key Changes

1. **Node Integration**: Disabled → Use preload script
2. **IPC**: Direct require('electron') → Context bridge API
3. **Data Store**: Simple key-value → Structured schema
4. **Windows**: Inline scripts → External renderer files
5. **Menu**: Inline definition → MenuBuilder module
6. **Security**: Loose → Strict (context isolation)

### Breaking Changes

- Renderer processes can no longer `require('electron')`
- Must use `window.electronAPI` for IPC
- Old data format needs migration

## Best Practices

### 1. Security
- ✅ Always use context isolation
- ✅ Disable nodeIntegration in renderers
- ✅ Validate all user input
- ✅ Sanitize data before storing

### 2. Performance
- ✅ Lazy load windows (create on demand)
- ✅ Reuse existing windows when possible
- ✅ Use debouncing for frequent operations
- ✅ Clean up event listeners

### 3. Code Organization
- ✅ Separate concerns (main/renderer/preload)
- ✅ Use modules for reusable code
- ✅ Keep files focused and small
- ✅ Document complex logic

### 4. Error Handling
- ✅ Try-catch for all async operations
- ✅ User-friendly error messages
- ✅ Log errors for debugging
- ✅ Graceful degradation

## Future Enhancements

### Phase 3: UI/UX
- Modern CSS framework
- Responsive design
- Dark mode
- Better animations

### Phase 4: Room Booking
- Full booking system
- Conflict detection UI
- Room management
- Availability calendar

### Phase 5: Backend
- SQLite database
- Data sync
- Backup/restore
- Migration tools

### Phase 6: Multi-user
- Authentication
- User roles
- Permissions
- Approval workflows

## Resources

- [Electron Security](https://www.electronjs.org/docs/latest/tutorial/security)
- [Context Isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)
- [IPC Communication](https://www.electronjs.org/docs/latest/tutorial/ipc)
- [electron-store](https://github.com/sindresorhus/electron-store)

---

**Last Updated**: November 21, 2025  
**Version**: 2.0.0  
**Status**: Active Development
