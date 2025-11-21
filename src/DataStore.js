/**
 * Modern Store Manager for Campus Scheduler
 * Replaces DataStoreName.js with modern patterns
 */

'use strict';

const Store = require('electron-store');

/**
 * Schema for data validation
 */
const schema = {
  names: {
    type: 'array',
    items: {
      type: 'string',
    },
    default: [],
  },
  rooms: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        capacity: { type: 'number' },
        building: { type: 'string' },
        floor: { type: 'number' },
        equipment: { type: 'array', items: { type: 'string' } },
      },
    },
    default: [],
  },
  bookings: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        roomId: { type: 'string' },
        title: { type: 'string' },
        startTime: { type: 'string' },
        endTime: { type: 'string' },
        bookedBy: { type: 'string' },
        status: { type: 'string' },
      },
    },
    default: [],
  },
};

/**
 * DataStore class for managing application data
 */
class DataStore extends Store {
  constructor(settings) {
    super({
      ...settings,
      schema,
      name: 'campus-scheduler-data',
    });
  }

  // ========== Names Management ==========
  
  /**
   * Get all names
   * @returns {string[]}
   */
  getNames() {
    return this.get('names', []);
  }

  /**
   * Add a new name
   * @param {string} name
   * @returns {DataStore}
   */
  addName(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Name must be a non-empty string');
    }
    
    const names = this.getNames();
    if (!names.includes(name)) {
      names.push(name);
      this.set('names', names);
    }
    return this;
  }

  /**
   * Delete a name
   * @param {string} name
   * @returns {DataStore}
   */
  deleteName(name) {
    const names = this.getNames().filter(n => n !== name);
    this.set('names', names);
    return this;
  }

  /**
   * Clear all names
   * @returns {DataStore}
   */
  clearNames() {
    this.set('names', []);
    return this;
  }

  // ========== Rooms Management ==========

  /**
   * Get all rooms
   * @returns {object[]}
   */
  getRooms() {
    return this.get('rooms', []);
  }

  /**
   * Add a new room
   * @param {object} room
   * @returns {DataStore}
   */
  addRoom(room) {
    const rooms = this.getRooms();
    const roomId = room.id || `room-${Date.now()}`;
    
    const newRoom = {
      id: roomId,
      name: room.name || 'Unnamed Room',
      capacity: room.capacity || 0,
      building: room.building || '',
      floor: room.floor || 1,
      equipment: room.equipment || [],
    };
    
    rooms.push(newRoom);
    this.set('rooms', rooms);
    return this;
  }

  /**
   * Get room by ID
   * @param {string} id
   * @returns {object|null}
   */
  getRoomById(id) {
    return this.getRooms().find(room => room.id === id) || null;
  }

  /**
   * Update a room
   * @param {string} id
   * @param {object} updates
   * @returns {DataStore}
   */
  updateRoom(id, updates) {
    const rooms = this.getRooms().map(room => 
      room.id === id ? { ...room, ...updates } : room
    );
    this.set('rooms', rooms);
    return this;
  }

  /**
   * Delete a room
   * @param {string} id
   * @returns {DataStore}
   */
  deleteRoom(id) {
    const rooms = this.getRooms().filter(room => room.id !== id);
    this.set('rooms', rooms);
    return this;
  }

  // ========== Bookings Management ==========

  /**
   * Get all bookings
   * @returns {object[]}
   */
  getBookings() {
    return this.get('bookings', []);
  }

  /**
   * Add a new booking
   * @param {object} booking
   * @returns {DataStore}
   */
  addBooking(booking) {
    const bookings = this.getBookings();
    const bookingId = booking.id || `booking-${Date.now()}`;
    
    const newBooking = {
      id: bookingId,
      roomId: booking.roomId,
      title: booking.title || 'Untitled Event',
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookedBy: booking.bookedBy || 'Unknown',
      status: booking.status || 'confirmed',
      createdAt: new Date().toISOString(),
    };
    
    bookings.push(newBooking);
    this.set('bookings', bookings);
    return this;
  }

  /**
   * Get booking by ID
   * @param {string} id
   * @returns {object|null}
   */
  getBookingById(id) {
    return this.getBookings().find(booking => booking.id === id) || null;
  }

  /**
   * Get bookings for a specific room
   * @param {string} roomId
   * @returns {object[]}
   */
  getBookingsByRoom(roomId) {
    return this.getBookings().filter(booking => booking.roomId === roomId);
  }

  /**
   * Check if a room is available for a time slot
   * @param {string} roomId
   * @param {string} startTime - ISO string
   * @param {string} endTime - ISO string
   * @returns {boolean}
   */
  isRoomAvailable(roomId, startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const bookings = this.getBookingsByRoom(roomId);
    
    return !bookings.some(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      
      // Check for overlap
      return (start < bookingEnd && end > bookingStart);
    });
  }

  /**
   * Update a booking
   * @param {string} id
   * @param {object} updates
   * @returns {DataStore}
   */
  updateBooking(id, updates) {
    const bookings = this.getBookings().map(booking => 
      booking.id === id ? { ...booking, ...updates } : booking
    );
    this.set('bookings', bookings);
    return this;
  }

  /**
   * Delete a booking
   * @param {string} id
   * @returns {DataStore}
   */
  deleteBooking(id) {
    const bookings = this.getBookings().filter(booking => booking.id !== id);
    this.set('bookings', bookings);
    return this;
  }

  /**
   * Clear all bookings
   * @returns {DataStore}
   */
  clearBookings() {
    this.set('bookings', []);
    return this;
  }

  // ========== Utility Methods ==========

  /**
   * Clear all data (use with caution!)
   * @returns {DataStore}
   */
  clearAll() {
    this.clear();
    return this;
  }

  /**
   * Export all data
   * @returns {object}
   */
  exportData() {
    return {
      names: this.getNames(),
      rooms: this.getRooms(),
      bookings: this.getBookings(),
      exportedAt: new Date().toISOString(),
    };
  }

  /**
   * Import data (replaces existing data)
   * @param {object} data
   * @returns {DataStore}
   */
  importData(data) {
    if (data.names) this.set('names', data.names);
    if (data.rooms) this.set('rooms', data.rooms);
    if (data.bookings) this.set('bookings', data.bookings);
    return this;
  }
}

module.exports = DataStore;
