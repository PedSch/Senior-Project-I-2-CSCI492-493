# Quick Start Guide

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

## First-Time Setup

### 1. Migrate Legacy Data (Optional)
If you have existing electron-store data:
```bash
node src/migrateFromStore.js
```

### 2. Configure SMTP (Optional)
Create a `.env` file for email notifications:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM=scheduler@yourdomain.com
```

### 3. Create First Admin User
Use the auth APIs in the app or run:
```javascript
// In renderer console after app starts:
await electronAPI.createUser('admin', 'password123', 'admin');
```

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# All tests with coverage
npm run test:all

# Lint code
npm run lint

# Format code
npm run format
```

## Building for Production

```bash
# macOS
npm run package-mac

# Windows
npm run package-win

# Linux
npm run package-linux

# All platforms
npm run build
```

Output will be in `release-builds/` directory.

## Key Features

### Room Management
- Create, edit, delete rooms
- Capacity tracking
- Equipment lists
- Building/floor organization

### Bookings
- FullCalendar interface
- Drag-and-drop scheduling
- Conflict detection
- Time slot validation
- Email confirmations (when configured)

### Recurring Bookings
```javascript
// Create daily recurrence
await electronAPI.createDailyRecurrence(startDate, { count: 10 });

// Create weekly (Mon/Wed/Fri)
await electronAPI.createWeeklyRecurrence(startDate, { 
  byweekday: [0, 2, 4], 
  count: 15 
});

// Expand occurrences
const { occurrences } = await electronAPI.expandRecurrence(rule, {
  windowStart: new Date('2025-12-01'),
  windowEnd: new Date('2025-12-31'),
  dtstart: new Date('2025-12-01T10:00:00'),
  duration: 60
});
```

### Kiosk Mode
- Fullscreen display
- Touch-optimized UI
- Auto-lock after 60s idle
- 30s reset countdown
- Quick booking workflow

### Export/Backup
```javascript
// Export as iCal
const { data } = await electronAPI.exportIcal();
// Save to file or send to calendar apps

// Backup all data
const backup = await electronAPI.exportBackup();
// Save JSON to file

// Restore from backup
await electronAPI.importRestore(backupData);
```

## Troubleshooting

### Database Issues
Delete `campus_scheduler.db` and restart to reset database.

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Native Module Issues (better-sqlite3)
```bash
# Rebuild for Electron
npm rebuild better-sqlite3 --runtime=electron --target=33.2.0 --disturl=https://electronjs.org/headers
```

## Development Mode

Enable hot reload:
```bash
npm run dev
```

DevTools will open automatically in development mode.

## Project Structure

```
.
├── src/                    # Core services
│   ├── db.js              # SQLite database
│   ├── auth.js            # Authentication
│   ├── recurrence.js      # RRULE handling
│   ├── notify.js          # Email notifications
│   └── exportCalendar.js  # iCal export
├── renderer/              # Renderer scripts
│   ├── rooms.js
│   ├── bookings.js
│   ├── kiosk.js
│   └── ...
├── tests/                 # Unit tests
├── e2e/                   # E2E tests
├── assets/                # Static assets
├── main.js.new            # Main process
├── preload.js             # Preload bridge
└── package.json
```

## Support

Check `IMPLEMENTATION_COMPLETE.md` for full documentation.
