/**
 * Utility Functions
 * Common helper functions used across the application
 */

'use strict';

/**
 * Format date to readable string
 * @param {Date|string} date
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
function formatDate(date, options = {}) {
  const defaultOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Format time to readable string
 * @param {Date|string} time
 * @returns {string}
 */
function formatTime(time) {
  const timeObj = time instanceof Date ? time : new Date(time);
  return timeObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date and time
 * @param {Date|string} datetime
 * @returns {string}
 */
function formatDateTime(datetime) {
  const dt = datetime instanceof Date ? datetime : new Date(datetime);
  return `${formatDate(dt)} at ${formatTime(dt)}`;
}

/**
 * Generate unique ID
 * @param {string} prefix
 * @returns {string}
 */
function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitize user input
 * @param {string} input
 * @returns {string}
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .substring(0, 500); // Limit length
}

/**
 * Check if two time ranges overlap
 * @param {Date} start1
 * @param {Date} end1
 * @param {Date} start2
 * @param {Date} end2
 * @returns {boolean}
 */
function timeRangesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && end1 > start2;
}

/**
 * Calculate duration between two times in minutes
 * @param {Date} start
 * @param {Date} end
 * @returns {number}
 */
function calculateDuration(start, end) {
  const diff = new Date(end) - new Date(start);
  return Math.floor(diff / (1000 * 60));
}

/**
 * Validate email address
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Deep clone an object
 * @param {Object} obj
 * @returns {Object}
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 * @param {Object} obj
 * @returns {boolean}
 */
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Capitalize first letter of string
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
  generateId,
  sanitizeInput,
  timeRangesOverlap,
  calculateDuration,
  isValidEmail,
  debounce,
  deepClone,
  isEmpty,
  capitalize,
};
