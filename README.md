# Campus Room Scheduler

> A modern, cross-platform room scheduling and booking application designed for campus deployment on tablets, iPads, and desktop computers.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Electron](https://img.shields.io/badge/Electron-33.2.0-47848f.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

## 📋 Overview

Campus Room Scheduler is an Electron-based application that enables efficient room booking and scheduling for educational institutions. The app can be deployed on devices outside classrooms (tablets/iPads) for quick room reservations, as well as on desktop computers for administrative management.

### ✨ Features (2025 Update)

- 🗓️ **Interactive Calendar** - Multiple calendar views (day, week, month)
- 📱 **Tablet-Optimized UI** - Touch-friendly interface for kiosk deployments
- 🏫 **Multi-Room Support** - Manage multiple rooms and resources
- ⚡ **Real-time Availability** - Check room availability instantly
- 🔄 **Conflict Detection** - Prevent double-bookings automatically
- 📊 **Schedule Management** - Add, edit, and delete bookings
- 🎨 **Modern UI** - Clean, responsive design with dark mode support
- 🔒 **Updated Security** - Latest Electron with security patches

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PedSch/Senior-Project-I-2-CSCI492-493.git
   cd Senior-Project-I-2-CSCI492-493
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```

### Development Mode

Run with live reload for development:
```bash
npm run dev
```

## 📦 Building for Production

### Build for all platforms
```bash
npm run build
```

### Platform-specific builds
```bash
npm run package-mac    # macOS
npm run package-win    # Windows
npm run package-linux  # Linux
```

Built applications will be in the `release-builds/` directory.

## 🛠️ Technology Stack

- **Electron 33.2.0** - Cross-platform desktop framework
- **FullCalendar 6.x** - Advanced calendar component
- **Electron Store 11.x** - Data persistence
- **Materialize CSS** - UI framework
- **Modern JavaScript (ES6+)** - Clean, maintainable code

## 📁 Project Structure

```
campus-scheduler/
├── main.js                 # Main Electron process
├── mainWindow.html         # Main application window
├── Schedule.html           # Schedule management view
├── addWindow.html          # Add booking dialog
├── calendar/               # Calendar component
│   ├── Calendar.html
│   ├── Calendar.js
│   └── Calendar.css
├── scheduling/             # Advanced scheduling features
│   ├── MyFirstSchedule.html
│   └── MyFirstSchedule.js
├── time-todo/              # Time management module
├── assets/                 # Static assets
│   ├── css/
│   ├── icons/
│   └── js/
└── package.json
```

## 🔧 Configuration

### Environment Variables

Set `NODE_ENV=production` for production builds (automatically handled by build scripts).

### Customization

- **Icons**: Replace files in `assets/icons/` with your institution's branding
- **Themes**: Modify CSS files in `assets/css/` and `calendar/themes/`
- **Rooms**: Configure available rooms in the data store (future database integration)

## 🆕 What's New in v2.0.0

### Major Updates
- ⬆️ **Electron updated** from v11 to v33 (4 years of improvements!)
- 🔒 **Security patches** - All dependencies updated to latest secure versions
- 🎨 **FullCalendar upgraded** to v6 with better performance
- 📝 **Modern JavaScript** - Cleaner, more maintainable code
- 🛠️ **Better tooling** - ESLint, Prettier, modern build system
- 📱 **Improved responsiveness** - Better tablet/iPad support
- 🔧 **Development tools** - Hot reload, better debugging

### Breaking Changes
- Node.js 18+ now required
- Some legacy APIs replaced with modern equivalents
- Database structure will change in future updates

## 🗺️ Roadmap

### Phase 2 - Core Features (In Progress)
- [ ] User authentication system
- [ ] Role-based permissions (admin/faculty/student)
- [ ] SQLite database integration
- [ ] Advanced booking features (recurring events, waitlist)

### Phase 3 - Enterprise Features
- [ ] Email notifications
- [ ] Calendar export (iCal format)
- [ ] QR code quick booking
- [ ] Multi-location support
- [ ] Analytics dashboard

### Phase 4 - Deployment
- [ ] Kiosk mode for tablets
- [ ] Auto-update system
- [ ] Cloud sync capabilities
- [ ] Mobile companion app

## 🤝 Contributing

This was a senior project from 2021, now being modernized in 2025. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Original Senior Project Team (2021)
- Updated and modernized (2025)

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- Calendar powered by [FullCalendar](https://fullcalendar.io/)
- UI components from [Materialize](https://materializecss.com/)

---

**Note**: This application is being actively modernized. Version 2.0.0 focuses on security updates and dependency modernization. Additional features are being added incrementally.
