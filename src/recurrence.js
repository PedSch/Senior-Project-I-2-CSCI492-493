/**
 * Recurrence Utilities (Phase 7)
 * RRULE-based recurring booking expansion
 */
'use strict';

const { RRule, RRuleSet, rrulestr } = require('rrule');
const DB = require('./db');

class RecurrenceService {
  constructor(db = new DB()) { this.db = db; }

  /**
   * Store an iCal RRULE string or RRule object
   * @param {string|object} rule - RRULE string or options object
   * @returns {string} recurrence ID
   */
  addRule(rule) {
    const id = `recur-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const ruleString = typeof rule === 'string' ? rule : JSON.stringify(rule);
    this.db.db.prepare('INSERT INTO recurrences (id, rule, createdAt) VALUES (?,?,?)')
      .run(id, ruleString, new Date().toISOString());
    return id;
  }

  /**
   * Expand a recurrence rule into individual occurrences
   * @param {string|object} rule - RRULE string or options
   * @param {object} options - Expansion options
   * @param {Date} options.windowStart - Start of time window
   * @param {Date} options.windowEnd - End of time window
   * @param {Date} options.dtstart - Recurrence start date
   * @param {number} options.duration - Event duration in minutes
   * @returns {Array<{start: Date, end: Date}>} Array of occurrences
   */
  expand(rule, { windowStart, windowEnd, dtstart, duration = 60 }) {
    try {
      let rrule;
      
      // Parse rule
      if (typeof rule === 'string') {
        // Handle RRULE string format
        rrule = rrulestr(rule, { dtstart: dtstart || new Date() });
      } else if (rule.freq) {
        // Handle RRule options object
        rrule = new RRule({
          ...rule,
          dtstart: dtstart || rule.dtstart || new Date()
        });
      } else {
        return [];
      }

      // Get occurrences within window
      const occurrences = rrule.between(
        windowStart || new Date(),
        windowEnd || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
        true // inclusive
      );

      // Map to start/end pairs
      return occurrences.map(start => ({
        start: start,
        end: new Date(start.getTime() + duration * 60000)
      }));
    } catch (error) {
      console.error('Recurrence expansion error:', error);
      return [];
    }
  }

  /**
   * Create a daily recurrence
   */
  createDaily(dtstart, { interval = 1, until, count } = {}) {
    return new RRule({
      freq: RRule.DAILY,
      dtstart,
      interval,
      until,
      count
    }).toString();
  }

  /**
   * Create a weekly recurrence
   */
  createWeekly(dtstart, { byweekday, interval = 1, until, count } = {}) {
    return new RRule({
      freq: RRule.WEEKLY,
      dtstart,
      byweekday,
      interval,
      until,
      count
    }).toString();
  }

  /**
   * Create a monthly recurrence
   */
  createMonthly(dtstart, { bymonthday, interval = 1, until, count } = {}) {
    return new RRule({
      freq: RRule.MONTHLY,
      dtstart,
      bymonthday,
      interval,
      until,
      count
    }).toString();
  }
}

module.exports = RecurrenceService;
