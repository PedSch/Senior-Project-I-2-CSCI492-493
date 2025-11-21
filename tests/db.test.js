/**
 * Database Layer Tests
 */

const DB = require('../src/db');
const fs = require('fs');
const path = require('path');

describe('Database Layer', () => {
  let db;
  const testDbFile = 'test_campus_scheduler.db';

  beforeEach(() => {
    // Clean up test database
    if (fs.existsSync(testDbFile)) {
      fs.unlinkSync(testDbFile);
    }
    db = new DB(testDbFile);
  });

  afterEach(() => {
    db.db.close();
    if (fs.existsSync(testDbFile)) {
      fs.unlinkSync(testDbFile);
    }
  });

  describe('Rooms', () => {
    test('should add a room', () => {
      const room = {
        name: 'Test Room',
        capacity: 20,
        building: 'Main',
        floor: 1,
        equipment: ['projector', 'whiteboard']
      };
      
      const id = db.addRoom(room);
      expect(id).toBeDefined();
      
      const rooms = db.getRooms();
      expect(rooms).toHaveLength(1);
      expect(rooms[0].name).toBe('Test Room');
      expect(rooms[0].equipment).toEqual(['projector', 'whiteboard']);
    });

    test('should update a room', () => {
      const id = db.addRoom({ name: 'Room 1', capacity: 10 });
      db.updateRoom(id, { capacity: 25 });
      
      const room = db.getRoomById(id);
      expect(room.capacity).toBe(25);
      expect(room.name).toBe('Room 1');
    });

    test('should delete a room', () => {
      const id = db.addRoom({ name: 'Room 1', capacity: 10 });
      db.deleteRoom(id);
      
      const room = db.getRoomById(id);
      expect(room).toBeNull();
    });

    test('should get room by ID', () => {
      const id = db.addRoom({ name: 'Room 1', capacity: 10 });
      const room = db.getRoomById(id);
      
      expect(room).toBeDefined();
      expect(room.id).toBe(id);
      expect(room.name).toBe('Room 1');
    });
  });

  describe('Bookings', () => {
    let roomId;

    beforeEach(() => {
      roomId = db.addRoom({ name: 'Test Room', capacity: 20 });
    });

    test('should add a booking', () => {
      const booking = {
        roomId,
        title: 'Meeting',
        startTime: '2025-11-21T10:00:00Z',
        endTime: '2025-11-21T11:00:00Z',
        bookedBy: 'John Doe'
      };
      
      const id = db.addBooking(booking);
      expect(id).toBeDefined();
      
      const bookings = db.getBookings();
      expect(bookings).toHaveLength(1);
      expect(bookings[0].title).toBe('Meeting');
    });

    test('should check room availability', () => {
      db.addBooking({
        roomId,
        title: 'Existing',
        startTime: '2025-11-21T10:00:00Z',
        endTime: '2025-11-21T11:00:00Z',
        bookedBy: 'Jane'
      });

      // Conflict
      const available1 = db.isRoomAvailable(
        roomId,
        '2025-11-21T10:30:00Z',
        '2025-11-21T11:30:00Z'
      );
      expect(available1).toBe(false);

      // No conflict
      const available2 = db.isRoomAvailable(
        roomId,
        '2025-11-21T11:00:00Z',
        '2025-11-21T12:00:00Z'
      );
      expect(available2).toBe(true);
    });

    test('should update a booking', () => {
      const id = db.addBooking({
        roomId,
        title: 'Meeting',
        startTime: '2025-11-21T10:00:00Z',
        endTime: '2025-11-21T11:00:00Z',
        bookedBy: 'John'
      });

      db.updateBooking(id, { title: 'Updated Meeting' });
      
      const booking = db.getBookingById(id);
      expect(booking.title).toBe('Updated Meeting');
    });

    test('should delete a booking', () => {
      const id = db.addBooking({
        roomId,
        title: 'Meeting',
        startTime: '2025-11-21T10:00:00Z',
        endTime: '2025-11-21T11:00:00Z',
        bookedBy: 'John'
      });

      db.deleteBooking(id);
      
      const booking = db.getBookingById(id);
      expect(booking).toBeUndefined();
    });

    test('should get bookings by room', () => {
      const room2Id = db.addRoom({ name: 'Room 2', capacity: 15 });
      
      db.addBooking({
        roomId,
        title: 'Meeting 1',
        startTime: '2025-11-21T10:00:00Z',
        endTime: '2025-11-21T11:00:00Z',
        bookedBy: 'John'
      });

      db.addBooking({
        roomId: room2Id,
        title: 'Meeting 2',
        startTime: '2025-11-21T10:00:00Z',
        endTime: '2025-11-21T11:00:00Z',
        bookedBy: 'Jane'
      });

      const room1Bookings = db.getBookingsByRoom(roomId);
      expect(room1Bookings).toHaveLength(1);
      expect(room1Bookings[0].title).toBe('Meeting 1');
    });
  });

  describe('Export/Import', () => {
    test('should export all data', () => {
      db.addRoom({ name: 'Room 1', capacity: 10 });
      const data = db.exportAll();
      
      expect(data.rooms).toHaveLength(1);
      expect(data.exportedAt).toBeDefined();
    });

    test('should import data', () => {
      const data = {
        rooms: [
          { id: 'r1', name: 'Room 1', capacity: 10, equipment: [] }
        ],
        bookings: []
      };

      db.importAll(data);
      
      const rooms = db.getRooms();
      expect(rooms).toHaveLength(1);
      expect(rooms[0].name).toBe('Room 1');
    });
  });
});
