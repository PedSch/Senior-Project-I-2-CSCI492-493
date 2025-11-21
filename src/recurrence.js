/**
 * Recurrence Utilities (Phase 7)
 * Minimal rule storage; expansion logic placeholder for future RRULE parsing.
 */
'use strict';

const DB = require('./db');

class RecurrenceService {
  constructor(db = new DB()) { this.db = db; }

  // Store an iCal RRULE string or JSON pattern
  addRule(rule) {
    const id = `recur-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.db.db.prepare('INSERT INTO recurrences (id, rule, createdAt) VALUES (?,?,?)')
      .run(id, typeof rule === 'string' ? rule : JSON.stringify(rule), new Date().toISOString());
    return id;
  }

  // Basic expansion placeholder (returns array of { start, end })
  expand(rule, { windowStart, windowEnd }) {
    // TODO: implement real RRULE parsing; currently returns empty
    return [];
  }
}

module.exports = RecurrenceService;
