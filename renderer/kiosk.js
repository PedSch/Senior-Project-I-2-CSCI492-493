/**
 * Kiosk Mode Renderer (Phase 8)
 * Simplified booking interface with idle timeout and auto-lock
 */

const { electronAPI } = window;

// State
let idleTimer = null;
let resetTimer = null;
let resetCountdown = 30;
const IDLE_TIMEOUT = 60000; // 60 seconds
const RESET_TIMEOUT = 30000; // 30 seconds

// Elements
const form = document.getElementById('bookingForm');
const roomSelect = document.getElementById('room');
const titleInput = document.getElementById('title');
const bookedByInput = document.getElementById('bookedBy');
const durationSelect = document.getElementById('duration');
const submitBtn = document.getElementById('submitBtn');
const idleOverlay = document.getElementById('idleOverlay');
const resetTimerEl = document.getElementById('resetTimer');
const successMessage = document.getElementById('successMessage');
const clock = document.getElementById('clock');

// Clock
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  clock.textContent = `${time} · ${date}`;
}

setInterval(updateClock, 1000);
updateClock();

// Load rooms
async function loadRooms() {
  try {
    const rooms = await electronAPI.getRooms();
    roomSelect.innerHTML = '<option value="">-- Choose a room --</option>';
    rooms.forEach(room => {
      const option = document.createElement('option');
      option.value = room.id;
      option.textContent = `${room.name} (Capacity: ${room.capacity})`;
      roomSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load rooms:', error);
  }
}

// Idle management
function resetIdleTimer() {
  clearTimeout(idleTimer);
  clearTimeout(resetTimer);
  idleOverlay.classList.remove('active');
  resetCountdown = 30;
  resetTimerEl.textContent = resetCountdown;
  
  idleTimer = setTimeout(() => {
    showIdleOverlay();
  }, IDLE_TIMEOUT);
}

function showIdleOverlay() {
  idleOverlay.classList.add('active');
  
  const interval = setInterval(() => {
    resetCountdown--;
    resetTimerEl.textContent = resetCountdown;
    
    if (resetCountdown <= 0) {
      clearInterval(interval);
      resetForm();
      resetIdleTimer();
    }
  }, 1000);
  
  resetTimer = setTimeout(() => {
    clearInterval(interval);
  }, RESET_TIMEOUT);
}

function resetForm() {
  form.reset();
  idleOverlay.classList.remove('active');
}

// Activity listeners
['click', 'touchstart', 'keydown', 'mousemove'].forEach(event => {
  document.addEventListener(event, resetIdleTimer);
});

// Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const roomId = roomSelect.value;
  const title = titleInput.value.trim();
  const bookedBy = bookedByInput.value.trim();
  const duration = parseInt(durationSelect.value);
  
  if (!roomId || !title || !bookedBy) return;
  
  const now = new Date();
  const startTime = now.toISOString();
  const endTime = new Date(now.getTime() + duration * 60000).toISOString();
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Checking availability...';
  
  try {
    // Check availability
    const available = await electronAPI.checkRoomAvailability(roomId, startTime, endTime);
    
    if (!available) {
      alert('Sorry, this room is not available at this time. Please choose another room or time.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book Now';
      return;
    }
    
    // Create booking
    await electronAPI.addBooking({
      roomId,
      title,
      bookedBy,
      startTime,
      endTime,
      description: 'Kiosk booking',
      status: 'confirmed'
    });
    
    // Show success
    successMessage.classList.add('active');
    setTimeout(() => {
      successMessage.classList.remove('active');
      resetForm();
      resetIdleTimer();
    }, 3000);
    
  } catch (error) {
    console.error('Booking error:', error);
    alert('Failed to create booking. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Book Now';
  }
});

// Initialize
loadRooms();
resetIdleTimer();

// Offline cache (basic service worker would go here in production)
// For now, we rely on Electron's offline capabilities
