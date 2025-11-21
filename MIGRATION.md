# Migration Guide: v1.0.0 → v2.0.0

This guide helps you upgrade from the 2021 version (v1.0.0) to the modernized 2025 version (v2.0.0).

## ⚠️ Breaking Changes

### 1. Node.js & npm Requirements
- **Old**: Node.js 12+ 
- **New**: Node.js 18+ required
- **Action**: Update Node.js before upgrading

### 2. Build System
- **Old**: electron-packager
- **New**: electron-builder
- **Action**: Use new build commands

### 3. Package Changes
- **Removed**: 150+ auto-installed transitive dependencies
- **Updated**: All core dependencies to latest versions
- **Action**: Delete `node_modules/` and `package-lock.json` before upgrading

## 📋 Step-by-Step Migration

### Step 1: Backup Your Data
```bash
# Backup any existing data
cp -r ~/.config/csci492 ~/.config/csci492.backup
# Or on Windows: %APPDATA%/csci492
```

### Step 2: Check Node.js Version
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher
```

If needed, update Node.js:
```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

### Step 3: Clean Installation
```bash
# Navigate to project directory
cd Senior-Project-I-2-CSCI492-493

# Remove old dependencies
rm -rf node_modules package-lock.json

# Install new dependencies
npm install
```

### Step 4: Test the Application
```bash
# Run in development mode
npm start

# Verify all features work:
# - Main menu loads
# - Schedule window opens
# - Calendar displays
# - Adding items works
```

### Step 5: Update Build Scripts

**Old scripts (don't use these):**
```json
{
  "scripts": {
    "package-mac": "electron-packager . Digital Signage --overwrite...",
    "package-win": "electron-packager . Digital Signage --overwrite...",
    "package-linux": "electron-packager . Digital Signage --overwrite..."
  }
}
```

**New scripts (automatically updated):**
```json
{
  "scripts": {
    "package-mac": "electron-builder --mac",
    "package-win": "electron-builder --win",
    "package-linux": "electron-builder --linux"
  }
}
```

### Step 6: Build for Production
```bash
# Build for your platform
npm run package-mac     # macOS
npm run package-win     # Windows  
npm run package-linux   # Linux

# Or build for all platforms
npm run build
```

## 🔄 Code Changes

### IPC Communication

**Old Pattern:**
```javascript
// main.js
app.on('ready', function() {
  mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true }
  });
});
```

**New Pattern:**
```javascript
// main.js
app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false
    }
  });
});
```

### Menu Construction

**Old Pattern:**
```javascript
accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q'
```

**New Pattern:**
```javascript
accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q'
// Uses strict equality
```

## 📦 Dependency Changes

### Removed Dependencies
These are no longer needed (they were transitive deps):
- asar, chromium-pickle-js, electron-osx-sign
- 140+ other packages (automatically managed by npm)

### Core Dependencies Updated
| Package | Old Version | New Version |
|---------|-------------|-------------|
| electron | 11.1.0 | 33.2.0 |
| @fullcalendar/daygrid | 5.5.0 | 6.1.15 |
| electron-store | 2.0.0 | 11.0.2 |
| lodash | 4.17.20 | 4.17.21 |

### New Dev Dependencies
- `electron-builder` - Modern build system
- `eslint` - Code quality
- `prettier` - Code formatting
- `jest` - Testing framework (ready for future tests)

## ⚙️ Configuration Changes

### New Config Files Added
- `.eslintrc.json` - Code linting rules
- `.prettierrc.json` - Code formatting rules
- `.gitignore` - Better ignore patterns
- `.npmrc` - npm configuration

### Updated Files
- `package.json` - Completely reorganized
- `main.js` - Modernized Electron APIs
- `README.md` - Comprehensive documentation

## 🐛 Known Issues & Solutions

### Issue 1: "Cannot find module 'electron'"
**Solution:** Delete `node_modules` and run `npm install` again

### Issue 2: Calendar not loading
**Solution:** Calendar path changed from `cal/` to `calendar/`
- This is fixed in the new version

### Issue 3: Build fails on macOS
**Solution:** Install Xcode Command Line Tools:
```bash
xcode-select --install
```

### Issue 4: Build fails on Windows
**Solution:** Install Windows Build Tools:
```bash
npm install --global windows-build-tools
```

## 🔍 Testing Checklist

After migration, verify:

- [ ] Application starts without errors
- [ ] Main window displays correctly
- [ ] Sidebar navigation works
- [ ] Schedule window opens
- [ ] Can add schedule items
- [ ] Can remove items (double-click)
- [ ] Can clear all items
- [ ] Calendar view loads
- [ ] Full scheduling calendar works
- [ ] Day calendar works
- [ ] Time sorter module loads
- [ ] Menus work correctly
- [ ] Keyboard shortcuts work
- [ ] Application quits properly

## 📊 Performance Improvements

You should notice:
- **Faster startup** - Electron 33 is significantly faster
- **Better memory usage** - Removed unnecessary dependencies
- **Smoother UI** - Updated Chromium version
- **Better rendering** - FullCalendar 6 performance improvements

## 🆘 Troubleshooting

### Clean Slate Installation
If migration fails, try a clean installation:

```bash
# Backup project
cd ..
cp -r Senior-Project-I-2-CSCI492-493 Senior-Project-BACKUP

# Fresh clone
git clone https://github.com/PedSch/Senior-Project-I-2-CSCI492-493.git
cd Senior-Project-I-2-CSCI492-493
npm install
npm start
```

### Still Having Issues?

1. Check Node.js version: `node --version` (must be 18+)
2. Clear npm cache: `npm cache clean --force`
3. Remove and reinstall: `rm -rf node_modules package-lock.json && npm install`
4. Check for errors: Open DevTools (Ctrl+I / Cmd+I)

## 📝 Data Migration

### electron-store Data
Data stored in electron-store will be preserved, but:
- Location remains the same
- Format is compatible
- API calls might need updates in future versions

**Data Location:**
- macOS: `~/Library/Application Support/csci492/`
- Windows: `%APPDATA%/csci492/`
- Linux: `~/.config/csci492/`

## 🎯 Next Steps

After successful migration:

1. **Explore new features** - Check the updated README
2. **Read the roadmap** - See what's coming next
3. **Test thoroughly** - Verify all your use cases
4. **Update documentation** - If you have custom docs
5. **Plan for v2.1.0** - Authentication & database features coming

## 📚 Additional Resources

- [CHANGELOG.md](CHANGELOG.md) - Detailed list of changes
- [README.md](README.md) - Updated documentation
- [SECURITY.md](SECURITY.md) - Security improvements
- [Electron Migration Guide](https://www.electronjs.org/docs/latest/breaking-changes)

---

**Questions?** Open an issue on GitHub with the `migration` label.

Last Updated: November 21, 2025
