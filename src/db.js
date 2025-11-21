/**
 * SQLite Database Layer (Phase 5)
 * Provides persistence for rooms, bookings, users, recurring bookings
 */
'use strict';

const path = require('path');
const Database = require('better-sqlite3');

class DB {
  constructor(dbFile = 'campus_scheduler.db') {
    const dbPath = path.join(process.cwd(), dbFile);
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.init();
  }

  init() {
    // Rooms
    this.db.prepare(`CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      building TEXT,
      floor INTEGER,
      equipment TEXT
    )`).run();

    // Bookings
    this.db.prepare(`CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      roomId TEXT NOT NULL,
      title TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      bookedBy TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      description TEXT,
      createdAt TEXT NOT NULL,
      recurrenceId TEXT,
      FOREIGN KEY(roomId) REFERENCES rooms(id)
    )`).run();

    // Recurrence patterns
    this.db.prepare(`CREATE TABLE IF NOT EXISTS recurrences (
      id TEXT PRIMARY KEY,
      rule TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )`).run();

    // Users
    this.db.prepare(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      createdAt TEXT NOT NULL
    )`).run();
  }

  // ========== Rooms ==========
  getRooms() {
    return this.db.prepare('SELECT * FROM rooms').all().map(r => ({
      ...r,
      equipment: r.equipment ? r.equipment.split(',').filter(Boolean) : []
    }));
  }

  addRoom(room) {
    const id = room.id || `room-${Date.now()}`;
    this.db.prepare(`INSERT INTO rooms (id,name,capacity,building,floor,equipment) VALUES (?,?,?,?,?,?)`)   
      .run(id, room.name, room.capacity, room.building || '', room.floor || 1, (room.equipment || []).join(','));
    return id;
  }

  updateRoom(id, updates) {
    const existing = this.getRoomById(id);
    if (!existing) throw new Error('Room not found');
    const merged = { ...existing, ...updates };
    this.db.prepare(`UPDATE rooms SET name=?, capacity=?, building=?, floor=?, equipment=? WHERE id=?`) 
      .run(merged.name, merged.capacity, merged.building || '', merged.floor || 1, (merged.equipment || []).join(','), id);
  }

  deleteRoom(id) {
    this.db.prepare('DELETE FROM rooms WHERE id=?').run(id);
  }

  getRoomById(id) {
    const r = this.db.prepare('SELECT * FROM rooms WHERE id=?').get(id);
    if (!r) return null;
    return { ...r, equipment: r.equipment ? r.equipment.split(',').filter(Boolean) : [] };
  }

  // ========== Bookings ==========
  getBookings() { return this.db.prepare('SELECT * FROM bookings').all(); }
  getBookingById(id) { return this.db.prepare('SELECT * FROM bookings WHERE id=?').get(id); }
  getBookingsByRoom(roomId) { return this.db.prepare('SELECT * FROM bookings WHERE roomId=?').all(roomId); }

  addBooking(b) {
    const id = b.id || `booking-${Date.now()}`;
    this.db.prepare(`INSERT INTO bookings (id,roomId,title,startTime,endTime,bookedBy,status,description,createdAt,recurrenceId)
      VALUES (?,?,?,?,?,?,?,?,?,?)`).run(
        id,
        b.roomId,
        b.title,
        b.startTime,
        b.endTime,
        b.bookedBy,
        b.status || 'confirmed',
        b.description || '',
        new Date().toISOString(),
        b.recurrenceId || null
      );
    return id;
  }

  updateBooking(id, updates) {
    const existing = this.getBookingById(id);
    if (!existing) throw new Error('Booking not found');
    const merged = { ...existing, ...updates };
    this.db.prepare(`UPDATE bookings SET roomId=?, title=?, startTime=?, endTime=?, bookedBy=?, status=?, description=?, recurrenceId=? WHERE id=?`).run(
      merged.roomId,
      merged.title,
      merged.startTime,
      merged.endTime,
      merged.bookedBy,
      merged.status,
      merged.description || '',
      merged.recurrenceId || null,
      id
    );
  }

  deleteBooking(id) { this.db.prepare('DELETE FROM bookings WHERE id=?').run(id); }

  isRoomAvailable(roomId, startTime, endTime, excludeId) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const rows = this.getBookingsByRoom(roomId);
    return !rows.some(b => {
      if (excludeId && b.id === excludeId) return false;
      const bStart = new Date(b.startTime).getTime();
      const bEnd = new Date(b.endTime).getTime();
      return start < bEnd && end > bStart;
    });
  }

  // ========== Users (Phase 6 Prep) ==========
  addUser(user) {
    const id = user.id || `user-${Date.now()}`;
    this.db.prepare(`INSERT INTO users (id,username,passwordHash,role,createdAt) VALUES (?,?,?,?,?)`)
      .run(id, user.username, user.passwordHash, user.role || 'user', new Date().toISOString());
    return id;
  }
  getUserByUsername(username) { return this.db.prepare('SELECT * FROM users WHERE username=?').get(username); }

  // ========== Backup / Restore ==========
  exportAll() {
    return {
      rooms: this.getRooms(),
      bookings: this.getBookings(),
      exportedAt: new Date().toISOString()
    };
  }

  importAll(data) {
    this.db.prepare('DELETE FROM rooms').run();
    this.db.prepare('DELETE FROM bookings').run();
    (data.rooms || []).forEach(r => this.addRoom(r));
    (data.bookings || []).forEach(b => this.addBooking(b));
  }
}

module.exports = DB;
