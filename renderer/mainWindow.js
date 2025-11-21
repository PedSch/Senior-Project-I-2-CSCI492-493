/**
 * Main Window Renderer Script
 * Handles UI interactions for the main application window
 */

'use strict';

// ========== Navigation Functions ==========

/**
 * Open/close sidebar navigation
 */
function openNav() {
  const sidebar = document.getElementById('SideBarNav');
  const main = document.getElementById('main');
  
  if (sidebar && main) {
    sidebar.style.width = '250px';
    main.style.marginLeft = '250px';
  }
}

function closeNav() {
  const sidebar = document.getElementById('SideBarNav');
  const main = document.getElementById('main');
  
  if (sidebar && main) {
    sidebar.style.width = '0';
    main.style.marginLeft = '0';
  }
}

// ========== Page Navigation ==========

/**
 * Navigate to internal pages
 */
function navigateTo(page) {
  // For now, use direct navigation
  // In future, we'll use IPC to open windows
  if (window.electronAPI) {
    switch(page) {
      case 'schedule':
        window.electronAPI.openSchedule();
        break;
      case 'rooms':
        window.location.href = 'rooms.html';
        break;
      case 'bookings':
        window.location.href = 'bookings.html';
        break;
      case 'calendar':
        window.electronAPI.openCalendar();
        break;
      case 'full-calendar':
        window.location.href = './scheduling/MyFirstSchedule.html';
        break;
      case 'time-sorter':
        window.electronAPI.openTimeSorter();
        break;
      default:
        console.log('Unknown page:', page);
    }
  } else {
    // Fallback for direct navigation
    window.location.href = page;
  }
}

// ========== Initialization ==========

document.addEventListener('DOMContentLoaded', () => {
  console.log('Main window loaded');
  
  // Add click handlers to navigation links
  const scheduleLinks = document.querySelectorAll('a[href="Schedule.html"]');
  scheduleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.electronAPI) {
        window.electronAPI.openSchedule();
      }
    });
  });
  
  const calendarLinks = document.querySelectorAll('a[href*="Calendar.html"]');
  calendarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.electronAPI) {
        window.electronAPI.openCalendar();
      }
    });
  });

  // Display current date/time
  updateDateTime();
  setInterval(updateDateTime, 1000);
});

/**
 * Update date/time display
 */
function updateDateTime() {
  const dateTimeElement = document.getElementById('current-datetime');
  if (dateTimeElement) {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
  }
}

// ========== Keyboard Shortcuts ==========

document.addEventListener('keydown', (e) => {
  // Close sidebar with Escape
  if (e.key === 'Escape') {
    closeNav();
  }
  
  // Quick navigation with number keys (when Ctrl/Cmd is held)
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
    switch(e.key) {
      case '1':
        e.preventDefault();
        if (window.electronAPI) window.electronAPI.openSchedule();
        break;
      case '2':
        e.preventDefault();
        if (window.electronAPI) window.electronAPI.openCalendar();
        break;
      case '3':
        e.preventDefault();
        if (window.electronAPI) window.electronAPI.openTimeSorter();
        break;
    }
  }
});

// Make functions available globally
window.openNav = openNav;
window.closeNav = closeNav;
window.navigateTo = navigateTo;
