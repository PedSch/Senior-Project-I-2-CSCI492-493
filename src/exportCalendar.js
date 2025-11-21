/**
 * Calendar Export (Phase 7)
 * Generates an iCal feed for bookings using ical-generator.
 */
'use strict';

const ical = require('ical-generator');
const DB = require('./db');

function exportICal({ prodId = '//CampusScheduler//EN', domain = 'example.com' } = {}) {
  const db = new DB();
  const cal = ical({ name: 'Campus Bookings', prodId });
  const now = Date.now();
  db.getBookings().forEach(b => {
    cal.createEvent({
      id: b.id,
      start: new Date(b.startTime),
      end: new Date(b.endTime),
      summary: b.title,
      description: b.description || '',
      timestamp: new Date(now),
      organizer: { name: b.bookedBy, email: `${b.bookedBy}@${domain}` }
    });
  });
  return cal.toString();
}

module.exports = { exportICal };
