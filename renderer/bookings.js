/**
 * Booking Management Renderer
 * Handles booking CRUD operations and calendar integration
 */

'use strict';

// State
let bookings = [];
let rooms = [];
let calendar = null;
let currentBooking = null;
let editingBookingId = null;

// DOM Elements
const bookingModal = document.getElementById('booking-modal');
const viewModal = document.getElementById('view-booking-modal');
const bookingForm = document.getElementById('booking-form');
const roomFilter = document.getElementById('room-filter');
const statusFilter = document.getElementById('status-filter');
const conflictWarning = document.getElementById('conflict-warning');
const conflictMessage = document.getElementById('conflict-message');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeCalendar();
  loadData();
  setupEventListeners();
  initializeMaterialize();
});

/**
 * Initialize Materialize components
 */
function initializeMaterialize() {
  M.updateTextFields();
  M.textareaAutoResize(document.getElementById('booking-description'));
}

/**
 * Initialize FullCalendar
 */
function initializeCalendar() {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;
  
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotMinTime: '07:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    nowIndicator: true,
    selectable: true,
    selectMirror: true,
    editable: true,
    eventClick: handleEventClick,
    select: handleDateSelect,
    eventDrop: handleEventDrop,
    eventResize: handleEventResize,
    height: 'auto',
    events: []
  });
  
  calendar.render();
}

/**
 * Load rooms and bookings
 */
async function loadData() {
  await Promise.all([loadRooms(), loadBookings()]);
}

/**
 * Load rooms
 */
async function loadRooms() {
  try {
    if (window.electronAPI?.getRooms) {
      rooms = await window.electronAPI.getRooms();
      populateRoomSelects();
    }
  } catch (error) {
    console.error('Error loading rooms:', error);
    if (typeof toast !== 'undefined') {
      toast.error('Failed to load rooms', 'Error');
    }
  }
}

/**
 * Load bookings
 */
async function loadBookings() {
  try {
    if (window.electronAPI?.getBookings) {
      bookings = await window.electronAPI.getBookings();
      updateCalendar();
    }
  } catch (error) {
    console.error('Error loading bookings:', error);
    if (typeof toast !== 'undefined') {
      toast.error('Failed to load bookings', 'Error');
    }
  }
}

/**
 * Populate room select dropdowns
 */
function populateRoomSelects() {
  const selects = [
    document.getElementById('booking-room'),
    roomFilter
  ];
  
  selects.forEach(select => {
    if (!select) return;
    
    // Keep first option (placeholder or "All Rooms")
    const firstOption = select.options[0];
    select.innerHTML = '';
    if (firstOption) {
      select.appendChild(firstOption);
    }
    
    rooms.forEach(room => {
      const option = document.createElement('option');
      option.value = room.id;
      option.textContent = `${room.name} (${room.capacity} capacity)`;
      select.appendChild(option);
    });
  });
}

/**
 * Update calendar with bookings
 */
function updateCalendar() {
  if (!calendar) return;
  
  const events = bookings
    .filter(booking => {
      const roomMatch = !roomFilter.value || booking.roomId === roomFilter.value;
      const statusMatch = !statusFilter.value || booking.status === statusFilter.value;
      return roomMatch && statusMatch;
    })
    .map(booking => {
      const room = rooms.find(r => r.id === booking.roomId);
      return {
        id: booking.id,
        title: `${booking.title} - ${room?.name || 'Unknown Room'}`,
        start: booking.startTime,
        end: booking.endTime,
        backgroundColor: getStatusColor(booking.status),
        borderColor: getStatusColor(booking.status),
        extendedProps: {
          booking: booking,
          room: room
        }
      };
    });
  
  calendar.removeAllEvents();
  calendar.addEventSource(events);
}

/**
 * Get color based on booking status
 */
function getStatusColor(status) {
  const colors = {
    confirmed: '#1976d2',
    pending: '#ffa726',
    cancelled: '#e57373'
  };
  return colors[status] || colors.confirmed;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Filters
  roomFilter?.addEventListener('change', updateCalendar);
  statusFilter?.addEventListener('change', updateCalendar);
  
  // Form validation
  const startInput = document.getElementById('booking-start');
  const endInput = document.getElementById('booking-end');
  const roomInput = document.getElementById('booking-room');
  
  [startInput, endInput, roomInput].forEach(input => {
    input?.addEventListener('change', checkForConflicts);
  });
  
  // Modal backdrop clicks
  bookingModal?.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeBookingModal();
  });
  
  viewModal?.addEventListener('click', (e) => {
    if (e.target === viewModal) closeViewModal();
  });
  
  // Form submission
  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveBooking();
  });
}

/**
 * Handle calendar date selection
 */
function handleDateSelect(selectInfo) {
  openBookingModal(selectInfo.start, selectInfo.end);
}

/**
 * Handle event click
 */
function handleEventClick(clickInfo) {
  const booking = clickInfo.event.extendedProps.booking;
  viewBookingDetails(booking);
}

/**
 * Handle event drop (drag)
 */
async function handleEventDrop(dropInfo) {
  const booking = dropInfo.event.extendedProps.booking;
  const newStart = dropInfo.event.start.toISOString();
  const newEnd = dropInfo.event.end.toISOString();
  
  try {
    // Check for conflicts
    if (window.electronAPI?.checkRoomAvailability) {
      const available = await window.electronAPI.checkRoomAvailability(
        booking.roomId,
        newStart,
        newEnd,
        booking.id
      );
      
      if (!available) {
        dropInfo.revert();
        if (typeof toast !== 'undefined') {
          toast.error('Time slot not available', 'Conflict');
        }
        return;
      }
    }
    
    // Update booking
    if (window.electronAPI?.updateBooking) {
      await window.electronAPI.updateBooking(booking.id, {
        startTime: newStart,
        endTime: newEnd
      });
      
      if (typeof toast !== 'undefined') {
        toast.success('Booking updated', 'Success');
      }
      
      await loadBookings();
    }
  } catch (error) {
    console.error('Error updating booking:', error);
    dropInfo.revert();
    if (typeof toast !== 'undefined') {
      toast.error('Failed to update booking', 'Error');
    }
  }
}

/**
 * Handle event resize
 */
async function handleEventResize(resizeInfo) {
  const booking = resizeInfo.event.extendedProps.booking;
  const newEnd = resizeInfo.event.end.toISOString();
  
  try {
    // Check for conflicts
    if (window.electronAPI?.checkRoomAvailability) {
      const available = await window.electronAPI.checkRoomAvailability(
        booking.roomId,
        booking.startTime,
        newEnd,
        booking.id
      );
      
      if (!available) {
        resizeInfo.revert();
        if (typeof toast !== 'undefined') {
          toast.error('Time slot not available', 'Conflict');
        }
        return;
      }
    }
    
    // Update booking
    if (window.electronAPI?.updateBooking) {
      await window.electronAPI.updateBooking(booking.id, {
        endTime: newEnd
      });
      
      if (typeof toast !== 'undefined') {
        toast.success('Booking updated', 'Success');
      }
      
      await loadBookings();
    }
  } catch (error) {
    console.error('Error updating booking:', error);
    resizeInfo.revert();
    if (typeof toast !== 'undefined') {
      toast.error('Failed to update booking', 'Error');
    }
  }
}

/**
 * Open booking modal
 */
function openBookingModal(startDate = null, endDate = null) {
  editingBookingId = null;
  document.getElementById('modal-title').textContent = 'New Booking';
  bookingForm.reset();
  document.getElementById('booking-id').value = '';
  
  // Set default times
  if (startDate) {
    document.getElementById('booking-start').value = formatDateTimeLocal(startDate);
  }
  if (endDate) {
    document.getElementById('booking-end').value = formatDateTimeLocal(endDate);
  }
  
  conflictWarning.style.display = 'none';
  bookingModal.classList.add('active');
  M.updateTextFields();
  
  setTimeout(() => {
    document.getElementById('booking-title')?.focus();
  }, 100);
}

/**
 * Check for booking conflicts
 */
async function checkForConflicts() {
  const roomId = document.getElementById('booking-room').value;
  const startTime = document.getElementById('booking-start').value;
  const endTime = document.getElementById('booking-end').value;
  
  if (!roomId || !startTime || !endTime) {
    conflictWarning.style.display = 'none';
    return;
  }
  
  try {
    if (window.electronAPI?.checkRoomAvailability) {
      const available = await window.electronAPI.checkRoomAvailability(
        roomId,
        new Date(startTime).toISOString(),
        new Date(endTime).toISOString(),
        editingBookingId
      );
      
      if (!available) {
        const room = rooms.find(r => r.id === roomId);
        conflictWarning.style.display = 'block';
        conflictMessage.textContent = `${room?.name || 'This room'} is already booked for the selected time slot.`;
        document.getElementById('save-booking-btn').disabled = true;
      } else {
        conflictWarning.style.display = 'none';
        document.getElementById('save-booking-btn').disabled = false;
      }
    }
  } catch (error) {
    console.error('Error checking availability:', error);
  }
}

/**
 * Save booking
 */
async function saveBooking() {
  const bookingData = {
    id: document.getElementById('booking-id').value || undefined,
    title: document.getElementById('booking-title').value.trim(),
    roomId: document.getElementById('booking-room').value,
    startTime: new Date(document.getElementById('booking-start').value).toISOString(),
    endTime: new Date(document.getElementById('booking-end').value).toISOString(),
    bookedBy: document.getElementById('booking-by').value.trim(),
    description: document.getElementById('booking-description').value.trim(),
    status: 'confirmed'
  };
  
  if (!bookingData.title || !bookingData.roomId || !bookingData.startTime || !bookingData.endTime || !bookingData.bookedBy) {
    if (typeof toast !== 'undefined') {
      toast.warning('Please fill in all required fields', 'Validation Error');
    }
    return;
  }
  
  // Validate end time is after start time
  if (new Date(bookingData.endTime) <= new Date(bookingData.startTime)) {
    if (typeof toast !== 'undefined') {
      toast.warning('End time must be after start time', 'Validation Error');
    }
    return;
  }
  
  try {
    if (editingBookingId) {
      // Update existing booking
      if (window.electronAPI?.updateBooking) {
        await window.electronAPI.updateBooking(editingBookingId, bookingData);
        if (typeof toast !== 'undefined') {
          toast.success('Booking updated', 'Success');
        }
      }
    } else {
      // Add new booking
      if (window.electronAPI?.addBooking) {
        await window.electronAPI.addBooking(bookingData);
        if (typeof toast !== 'undefined') {
          const room = rooms.find(r => r.id === bookingData.roomId);
          toast.success(`Booked ${room?.name || 'room'}`, 'Booking Created');
        }
      }
    }
    
    closeBookingModal();
    await loadBookings();
  } catch (error) {
    console.error('Error saving booking:', error);
    if (typeof toast !== 'undefined') {
      toast.error('Failed to save booking', 'Error');
    }
  }
}

/**
 * View booking details
 */
function viewBookingDetails(booking) {
  currentBooking = booking;
  const room = rooms.find(r => r.id === booking.roomId);
  
  document.getElementById('view-modal-title').textContent = booking.title;
  document.getElementById('view-modal-body').innerHTML = `
    <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
      <div>
        <strong>Room:</strong> ${escapeHtml(room?.name || 'Unknown')}
      </div>
      <div>
        <strong>Start:</strong> ${formatDateTime(booking.startTime)}
      </div>
      <div>
        <strong>End:</strong> ${formatDateTime(booking.endTime)}
      </div>
      <div>
        <strong>Booked By:</strong> ${escapeHtml(booking.bookedBy)}
      </div>
      ${booking.description ? `
        <div>
          <strong>Description:</strong><br>
          ${escapeHtml(booking.description)}
        </div>
      ` : ''}
      <div>
        <strong>Status:</strong> 
        <span class="badge badge-${booking.status}">${booking.status}</span>
      </div>
    </div>
  `;
  
  viewModal.classList.add('active');
}

/**
 * Edit current booking
 */
function editCurrentBooking() {
  if (!currentBooking) return;
  
  closeViewModal();
  editingBookingId = currentBooking.id;
  
  document.getElementById('modal-title').textContent = 'Edit Booking';
  document.getElementById('booking-id').value = currentBooking.id;
  document.getElementById('booking-title').value = currentBooking.title;
  document.getElementById('booking-room').value = currentBooking.roomId;
  document.getElementById('booking-start').value = formatDateTimeLocal(new Date(currentBooking.startTime));
  document.getElementById('booking-end').value = formatDateTimeLocal(new Date(currentBooking.endTime));
  document.getElementById('booking-by').value = currentBooking.bookedBy;
  document.getElementById('booking-description').value = currentBooking.description || '';
  
  bookingModal.classList.add('active');
  M.updateTextFields();
  M.textareaAutoResize(document.getElementById('booking-description'));
  
  checkForConflicts();
}

/**
 * Delete current booking
 */
async function deleteCurrentBooking() {
  if (!currentBooking) return;
  
  const confirmed = confirm(`Are you sure you want to delete this booking?\n\n${currentBooking.title}`);
  if (!confirmed) return;
  
  try {
    if (window.electronAPI?.deleteBooking) {
      await window.electronAPI.deleteBooking(currentBooking.id);
      if (typeof toast !== 'undefined') {
        toast.success('Booking deleted', 'Success');
      }
      closeViewModal();
      await loadBookings();
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    if (typeof toast !== 'undefined') {
      toast.error('Failed to delete booking', 'Error');
    }
  }
}

/**
 * Close booking modal
 */
function closeBookingModal() {
  bookingModal.classList.remove('active');
  editingBookingId = null;
  bookingForm.reset();
  conflictWarning.style.display = 'none';
  document.getElementById('save-booking-btn').disabled = false;
}

/**
 * Close view modal
 */
function closeViewModal() {
  viewModal.classList.remove('active');
  currentBooking = null;
}

/**
 * Format date for datetime-local input
 */
function formatDateTimeLocal(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Format date for display
 */
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions global for onclick handlers
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.closeViewModal = closeViewModal;
window.saveBooking = saveBooking;
window.editCurrentBooking = editCurrentBooking;
window.deleteCurrentBooking = deleteCurrentBooking;
