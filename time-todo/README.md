# Electron Todo App

A simple todo app made with Electron - Tutorial Project

## Overview

This is a standalone Electron-based todo application created as a learning assignment. It demonstrates basic Electron concepts including:
- Main and renderer processes
- IPC communication
- Data persistence with electron-store
- Multiple windows

## Requirements

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

## Setup

1. **Navigate to the time-todo directory**
   ```bash
   cd time-todo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## How to Run

Start the application:
```bash
npm start
```

## Features

- Add new todo items
- Delete todo items
- Persistent storage (todos are saved locally)
- Clean, simple UI

## Project Structure

```
time-todo/
├── mainTime.js          # Main process entry point
├── Window.js            # Window creation helper
├── DataStore.js         # Data persistence layer
├── renderer/            # Renderer process files
│   ├── index.html       # Main todo list view
│   ├── index.js         # Main window logic
│   ├── add.html         # Add todo view
│   └── add.js           # Add todo logic
├── package.json         # Project dependencies
└── README.md            # This file
```

## Original Tutorial

This project was based on a tutorial. For more information, see the [original tutorial](https://medium.com/@codedraken).

**Note**: Check the [Electron Breaking Changes page](https://github.com/electron/electron/blob/master/docs/api/breaking-changes.md) if something doesn't work in future versions.
