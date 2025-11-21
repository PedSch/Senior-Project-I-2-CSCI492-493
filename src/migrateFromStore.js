/**
 * Migration script: electron-store -> SQLite (Phase 5)
 * Reads existing electron-store JSON and loads into SQLite.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const DB = require('./db');

function locateElectronStoreFiles() {
  // electron-store default path could vary; we attempt common patterns in userData
  const candidates = [];
  const cwd = process.cwd();
  // Heuristic: look for *.json in project root and data/ folder
  const rootFiles = fs.readdirSync(cwd).filter(f => f.endsWith('.json'));
  rootFiles.forEach(f => candidates.push(path.join(cwd, f)));
  const dataDir = path.join(cwd, 'data');
  if (fs.existsSync(dataDir)) {
    fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).forEach(f => candidates.push(path.join(dataDir, f)));
  }
  return candidates;
}

function extractData(files) {
  const rooms = []; const bookings = []; const names = [];
  files.forEach(file => {
    try {
      const raw = JSON.parse(fs.readFileSync(file, 'utf-8'));
      // Heuristic field matching
      if (Array.isArray(raw.rooms)) raw.rooms.forEach(r => rooms.push(r));
      if (Array.isArray(raw.bookings)) raw.bookings.forEach(b => bookings.push(b));
      if (Array.isArray(raw.names)) raw.names.forEach(n => names.push(n));
    } catch (e) {
      // ignore malformed
    }
  });
  return { rooms, bookings, names };
}

function migrate() {
  const db = new DB();
  const files = locateElectronStoreFiles();
  const data = extractData(files);

  // Insert rooms
  data.rooms.forEach(r => {
    try { db.addRoom(r); } catch (e) { /* ignore duplicates */ }
  });
  data.bookings.forEach(b => {
    try { db.addBooking(b); } catch (e) { /* ignore duplicates */ }
  });

  return { migratedRooms: data.rooms.length, migratedBookings: data.bookings.length };
}

if (require.main === module) {
  const result = migrate();
  console.log('Migration complete', result);
}

module.exports = migrate;
