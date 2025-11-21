/**
 * Room Management Renderer
 * Handles room CRUD operations
 */

'use strict';

// State
let rooms = [];
let editingRoomId = null;
let deletingRoomId = null;

// DOM Elements
const roomGrid = document.getElementById('room-grid');
const emptyState = document.getElementById('empty-state');
const roomModal = document.getElementById('room-modal');
const deleteModal = document.getElementById('delete-modal');
const roomForm = document.getElementById('room-form');
const searchInput = document.getElementById('search-rooms');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadRooms();
  setupEventListeners();
  initializeMaterialize();
});

/**
 * Initialize Materialize components
 */
function initializeMaterialize() {
  // Initialize form labels
  M.updateTextFields();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      filterRooms(query);
    });
  }
  
  // Form submission
  if (roomForm) {
    roomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveRoom();
    });
  }
  
  // Close modals on backdrop click
  roomModal?.addEventListener('click', (e) => {
    if (e.target === roomModal) {
      closeRoomModal();
    }
  });
  
  deleteModal?.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });
  
  // Listen for room updates from main process
  if (window.electronAPI?.onRoomsUpdate) {
    window.electronAPI.onRoomsUpdate((updatedRooms) => {
      rooms = updatedRooms;
      renderRooms();
    });
  }
}

/**
 * Load rooms from main process
 */
async function loadRooms() {
  try {
    if (window.electronAPI?.getRooms) {
      rooms = await window.electronAPI.getRooms();
      renderRooms();
    } else {
      console.error('electronAPI.getRooms not available');
      if (typeof toast !== 'undefined') {
        toast.error('Unable to load rooms', 'Error');
      }
    }
  } catch (error) {
    console.error('Error loading rooms:', error);
    if (typeof toast !== 'undefined') {
      toast.error('Failed to load rooms', 'Error');
    }
  }
}

/**
 * Render rooms to grid
 */
function renderRooms(roomsToRender = rooms) {
  if (!roomGrid) return;
  
  roomGrid.innerHTML = '';
  
  if (roomsToRender.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';
  
  roomsToRender.forEach(room => {
    const card = createRoomCard(room);
    roomGrid.appendChild(card);
  });
}

/**
 * Create room card element
 */
function createRoomCard(room) {
  const card = document.createElement('div');
  card.className = 'room-card';
  card.onclick = () => viewRoomDetails(room);
  
  card.innerHTML = `
    <div class="room-card-header">
      <h6 class="room-name">${escapeHtml(room.name)}</h6>
      <div class="room-actions">
        <button class="btn-small blue" onclick="event.stopPropagation(); editRoom('${room.id}')" title="Edit">
          <i class="fa fa-edit"></i>
        </button>
        <button class="btn-small red" onclick="event.stopPropagation(); deleteRoom('${room.id}')" title="Delete">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>
    <div class="room-info">
      <div class="room-info-item">
        <i class="fa fa-users room-info-icon"></i>
        <span>Capacity: ${room.capacity}</span>
      </div>
      ${room.building ? `
        <div class="room-info-item">
          <i class="fa fa-building room-info-icon"></i>
          <span>${escapeHtml(room.building)}${room.floor ? `, Floor ${room.floor}` : ''}</span>
        </div>
      ` : ''}
      ${room.equipment && room.equipment.length > 0 ? `
        <div class="equipment-tags">
          ${room.equipment.map(eq => `<span class="equipment-tag">${escapeHtml(eq)}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
  
  return card;
}

/**
 * Filter rooms by search query
 */
function filterRooms(query) {
  if (!query) {
    renderRooms();
    return;
  }
  
  const filtered = rooms.filter(room => {
    const searchableText = [
      room.name,
      room.building,
      room.capacity?.toString(),
      ...(room.equipment || [])
    ].join(' ').toLowerCase();
    
    return searchableText.includes(query);
  });
  
  renderRooms(filtered);
}

/**
 * Open add room modal
 */
function openAddRoomModal() {
  editingRoomId = null;
  document.getElementById('modal-title').textContent = 'Add Room';
  document.getElementById('room-form').reset();
  document.getElementById('room-id').value = '';
  roomModal.classList.add('active');
  
  // Focus first input
  setTimeout(() => {
    document.getElementById('room-name')?.focus();
  }, 100);
}

/**
 * Edit room
 */
function editRoom(roomId) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;
  
  editingRoomId = roomId;
  document.getElementById('modal-title').textContent = 'Edit Room';
  document.getElementById('room-id').value = room.id;
  document.getElementById('room-name').value = room.name;
  document.getElementById('room-capacity').value = room.capacity;
  document.getElementById('room-building').value = room.building || '';
  document.getElementById('room-floor').value = room.floor || 1;
  document.getElementById('room-equipment').value = (room.equipment || []).join(', ');
  
  roomModal.classList.add('active');
  M.updateTextFields();
  
  // Focus first input
  setTimeout(() => {
    document.getElementById('room-name')?.focus();
  }, 100);
}

/**
 * Save room (add or update)
 */
async function saveRoom() {
  const roomData = {
    id: document.getElementById('room-id').value || undefined,
    name: document.getElementById('room-name').value.trim(),
    capacity: parseInt(document.getElementById('room-capacity').value),
    building: document.getElementById('room-building').value.trim(),
    floor: parseInt(document.getElementById('room-floor').value) || 1,
    equipment: document.getElementById('room-equipment').value
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0)
  };
  
  if (!roomData.name || !roomData.capacity) {
    if (typeof toast !== 'undefined') {
      toast.warning('Please fill in required fields', 'Validation Error');
    }
    return;
  }
  
  try {
    if (editingRoomId) {
      // Update existing room
      if (window.electronAPI?.updateRoom) {
        await window.electronAPI.updateRoom(editingRoomId, roomData);
        if (typeof toast !== 'undefined') {
          toast.success(`Updated ${roomData.name}`, 'Room Updated');
        }
      }
    } else {
      // Add new room
      if (window.electronAPI?.addRoom) {
        await window.electronAPI.addRoom(roomData);
        if (typeof toast !== 'undefined') {
          toast.success(`Added ${roomData.name}`, 'Room Added');
        }
      }
    }
    
    closeRoomModal();
    await loadRooms();
  } catch (error) {
    console.error('Error saving room:', error);
    if (typeof toast !== 'undefined') {
      toast.error('Failed to save room', 'Error');
    }
  }
}

/**
 * Delete room
 */
function deleteRoom(roomId) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;
  
  deletingRoomId = roomId;
  document.getElementById('delete-room-name').textContent = room.name;
  deleteModal.classList.add('active');
}

/**
 * Confirm delete
 */
async function confirmDelete() {
  if (!deletingRoomId) return;
  
  try {
    if (window.electronAPI?.deleteRoom) {
      await window.electronAPI.deleteRoom(deletingRoomId);
      if (typeof toast !== 'undefined') {
        toast.success('Room deleted', 'Success');
      }
      closeDeleteModal();
      await loadRooms();
    }
  } catch (error) {
    console.error('Error deleting room:', error);
    if (typeof toast !== 'undefined') {
      toast.error('Failed to delete room', 'Error');
    }
  }
}

/**
 * View room details (future: navigate to booking view)
 */
function viewRoomDetails(room) {
  // Future: Navigate to booking calendar for this room
  console.log('View details for room:', room);
  if (typeof toast !== 'undefined') {
    toast.info(`Click "Book" to reserve ${room.name}`, 'Room Details');
  }
}

/**
 * Close room modal
 */
function closeRoomModal() {
  roomModal.classList.remove('active');
  editingRoomId = null;
  roomForm.reset();
}

/**
 * Close delete modal
 */
function closeDeleteModal() {
  deleteModal.classList.remove('active');
  deletingRoomId = null;
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
window.openAddRoomModal = openAddRoomModal;
window.editRoom = editRoom;
window.deleteRoom = deleteRoom;
window.confirmDelete = confirmDelete;
window.closeRoomModal = closeRoomModal;
window.closeDeleteModal = closeDeleteModal;
window.saveRoom = saveRoom;
window.viewRoomDetails = viewRoomDetails;
