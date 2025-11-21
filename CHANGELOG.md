# Changelog

All notable changes to the Campus Room Scheduler project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-21

### 🎉 Major Modernization Release

This release focuses on updating all dependencies, fixing security vulnerabilities, and modernizing the codebase after 4 years.

### ✨ Added
- Modern build system with electron-builder
- ESLint for code quality
- Prettier for code formatting
- Comprehensive README documentation
- .gitignore for better repository hygiene
- Development mode with live reload
- Better error handling
- Modern menu system with keyboard shortcuts
- Improved window management
- DevTools toggle in development mode

### ⬆️ Updated
- **Electron**: v11.1.0 → v33.2.0 (major security & performance improvements)
- **FullCalendar**: v5.5.0 → v6.1.15 (better performance, new features)
- **electron-store**: v2.0.0 → v11.0.2 (modern API, better data handling)
- **lodash**: v4.17.20 → v4.17.21 (security patch)
- All 130+ outdated dependencies updated to latest stable versions

### 🔒 Security
- Fixed multiple security vulnerabilities in dependencies
- Updated deprecated Electron APIs
- Removed outdated and vulnerable packages
- Improved Content Security Policy preparation

### 🔧 Changed
- Modernized JavaScript syntax (ES6+)
- Improved code organization and readability
- Better async/await patterns
- Cleaner IPC communication
- Updated build scripts for modern electron-builder
- Reorganized package.json (removed bloat, only essential dependencies)
- Platform-specific menu improvements
- Window lifecycle management improvements

### 🗑️ Removed
- 150+ unnecessary dependencies that were auto-installed
- Deprecated electron-packager scripts (replaced with electron-builder)
- Legacy code patterns
- Unused configuration directories

### 📝 Documentation
- Complete README rewrite with modern badges and structure
- Added installation instructions
- Added development guidelines
- Added project roadmap
- Added technology stack documentation

### 🐛 Fixed
- Calendar path resolution (cal/ → calendar/)
- Window close behavior on different platforms
- Memory leaks in window management
- IPC event handler safety checks
- macOS-specific menu issues

### 🚧 Known Issues
- contextIsolation is disabled (will be enabled in future update for security)
- Some components still use legacy patterns (will be refactored)
- No database implementation yet (using electron-store)
- No authentication system yet

### 📋 Migration Notes
**Breaking Changes:**
- Node.js 18+ required (was Node.js 12+)
- npm 9+ required
- Old package-lock.json should be deleted and regenerated
- Build commands changed (electron-packager → electron-builder)

**Upgrade Steps:**
1. Backup your data if any exists
2. Delete `node_modules/` and `package-lock.json`
3. Run `npm install`
4. Test the application with `npm start`

---

## [1.0.0] - 2021

### Initial Release
- Basic Electron application structure
- Main window with sidebar navigation
- Schedule management interface
- Add item functionality
- Calendar integration
- Time sorting module
- Full scheduling calendar view
- Day calendar view
- Basic IPC communication
- Cross-platform packaging scripts

### Features
- Schedule item addition
- Schedule item removal (double-click)
- Clear all items
- Multiple calendar views
- Materialize CSS UI framework
- Font Awesome icons
- Responsive sidebar navigation

---

## Roadmap

### [2.1.0] - Planned
**Focus: Room Booking Core Features**
- [ ] Room availability checking
- [ ] Booking conflict detection
- [ ] Multi-room support
- [ ] Reservation system
- [ ] Database migration from electron-store to SQLite

### [2.2.0] - Planned
**Focus: User Management**
- [ ] User authentication
- [ ] Role-based permissions
- [ ] Booking approval workflow
- [ ] User profiles

### [2.3.0] - Planned
**Focus: Advanced Scheduling**
- [ ] Recurring events
- [ ] Email notifications
- [ ] iCal export
- [ ] Waiting list
- [ ] Booking history

### [3.0.0] - Planned
**Focus: Kiosk & Deployment**
- [ ] Tablet/iPad kiosk mode
- [ ] Touch-optimized UI
- [ ] Auto-refresh
- [ ] QR code scanning
- [ ] Auto-update system
- [ ] CI/CD pipeline
- [ ] Comprehensive testing suite

---

**Legend:**
- ✨ Added - New features
- ⬆️ Updated - Changes to existing functionality
- 🔒 Security - Security improvements
- 🔧 Changed - Refactored or improved code
- 🗑️ Removed - Removed features or code
- 🐛 Fixed - Bug fixes
- 📝 Documentation - Documentation changes
