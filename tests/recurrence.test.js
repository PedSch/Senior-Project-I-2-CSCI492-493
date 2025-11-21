/**
 * Recurrence Service Tests
 */

const RecurrenceService = require('../src/recurrence');
const DB = require('../src/db');
const fs = require('fs');
const { RRule } = require('rrule');

describe('RecurrenceService', () => {
  let db;
  let recurrenceService;
  const testDbFile = 'test_recurrence.db';

  beforeEach(() => {
    if (fs.existsSync(testDbFile)) {
      fs.unlinkSync(testDbFile);
    }
    db = new DB(testDbFile);
    recurrenceService = new RecurrenceService(db);
  });

  afterEach(() => {
    db.db.close();
    if (fs.existsSync(testDbFile)) {
      fs.unlinkSync(testDbFile);
    }
  });

  describe('Rule Storage', () => {
    test('should store a rule', () => {
      const rule = 'FREQ=DAILY;COUNT=10';
      const id = recurrenceService.addRule(rule);
      
      expect(id).toBeDefined();
      expect(id).toMatch(/^recur-/);
    });
  });

  describe('Daily Recurrence', () => {
    test('should create daily rule', () => {
      const dtstart = new Date('2025-11-21T10:00:00Z');
      const rule = recurrenceService.createDaily(dtstart, { count: 5 });
      
      expect(rule).toBeDefined();
      expect(rule).toContain('FREQ=DAILY');
      expect(rule).toContain('COUNT=5');
    });

    test('should expand daily rule', () => {
      const dtstart = new Date('2025-11-21T10:00:00Z');
      const rule = recurrenceService.createDaily(dtstart, { count: 5 });
      
      const occurrences = recurrenceService.expand(rule, {
        windowStart: new Date('2025-11-21T00:00:00Z'),
        windowEnd: new Date('2025-11-30T00:00:00Z'),
        dtstart,
        duration: 60
      });

      expect(occurrences).toHaveLength(5);
      expect(occurrences[0].start).toEqual(dtstart);
      
      // Each occurrence should be 1 day apart
      const day1 = occurrences[0].start.getTime();
      const day2 = occurrences[1].start.getTime();
      expect(day2 - day1).toBe(24 * 60 * 60 * 1000);
    });
  });

  describe('Weekly Recurrence', () => {
    test('should create weekly rule', () => {
      const dtstart = new Date('2025-11-21T10:00:00Z');
      const rule = recurrenceService.createWeekly(dtstart, {
        byweekday: [RRule.MO, RRule.WE, RRule.FR],
        count: 10
      });
      
      expect(rule).toBeDefined();
      expect(rule).toContain('FREQ=WEEKLY');
    });

    test('should expand weekly rule', () => {
      const dtstart = new Date('2025-11-21T10:00:00Z'); // Friday
      const rule = recurrenceService.createWeekly(dtstart, {
        byweekday: [RRule.FR],
        count: 3
      });
      
      const occurrences = recurrenceService.expand(rule, {
        windowStart: new Date('2025-11-01T00:00:00Z'),
        windowEnd: new Date('2025-12-31T00:00:00Z'),
        dtstart,
        duration: 60
      });

      expect(occurrences).toHaveLength(3);
      
      // Each should be a Friday (day 5)
      occurrences.forEach(occ => {
        expect(occ.start.getDay()).toBe(5); // Friday
      });
    });
  });

  describe('Monthly Recurrence', () => {
    test('should create monthly rule', () => {
      const dtstart = new Date('2025-11-21T10:00:00Z');
      const rule = recurrenceService.createMonthly(dtstart, {
        bymonthday: 21,
        count: 6
      });
      
      expect(rule).toBeDefined();
      expect(rule).toContain('FREQ=MONTHLY');
    });

    test('should expand monthly rule', () => {
      const dtstart = new Date('2025-11-21T10:00:00Z');
      const rule = recurrenceService.createMonthly(dtstart, {
        bymonthday: 21,
        count: 3
      });
      
      const occurrences = recurrenceService.expand(rule, {
        windowStart: new Date('2025-11-01T00:00:00Z'),
        windowEnd: new Date('2026-03-01T00:00:00Z'),
        dtstart,
        duration: 60
      });

      expect(occurrences).toHaveLength(3);
      
      // Each should be on the 21st
      occurrences.forEach(occ => {
        expect(occ.start.getDate()).toBe(21);
      });
    });
  });

  describe('Duration Handling', () => {
    test('should apply duration to occurrences', () => {
      const dtstart = new Date('2025-11-21T10:00:00Z');
      const rule = recurrenceService.createDaily(dtstart, { count: 3 });
      
      const occurrences = recurrenceService.expand(rule, {
        windowStart: new Date('2025-11-21T00:00:00Z'),
        windowEnd: new Date('2025-11-30T00:00:00Z'),
        dtstart,
        duration: 90 // 90 minutes
      });

      expect(occurrences).toHaveLength(3);
      
      occurrences.forEach(occ => {
        const durationMs = occ.end.getTime() - occ.start.getTime();
        expect(durationMs).toBe(90 * 60 * 1000); // 90 minutes in ms
      });
    });
  });
});
