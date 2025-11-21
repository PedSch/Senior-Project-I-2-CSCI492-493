/**
 * Schedule Window Renderer Script
 * Handles schedule management UI
 */

'use strict';

// ========== State Management ==========

let scheduleItems = [];

// ========== DOM Elements ==========

const ul = document.querySelector('ul');

// ========== Event Handlers ==========

/**
 * Initialize event listeners
 */
function init() {
  if (!window.electronAPI) {
    console.error('Electron API not available');
    return;
  }

  // Listen for item additions
  window.electronAPI.onItemAdd((item) => {
    addItemToList(item);
  });

  // Listen for clear command
  window.electronAPI.onItemClear(() => {
    clearAllItems();
  });

  // Listen for initial names data
  window.electronAPI.onNames((names) => {
    names.forEach(name => addItemToList(name));
  });

  // Setup UI event listeners
  setupUIListeners();
}

/**
 * Setup UI event listeners
 */
function setupUIListeners() {
  if (!ul) return;

  // Show empty state initially if needed
  if (ul.children.length === 0) {
    showEmptyState();
  }
}

// ========== Item Management ==========

/**
 * Add item to the list with enhanced UI and toast notifications
 */
function addItemToList(item) {
  if (!ul) return;

  ul.className = 'collection';
  
  const li = document.createElement('li');
  li.className = 'collection-item schedule-item';
  
  // Create item content
  const itemContent = document.createElement('div');
  itemContent.className = 'schedule-item-content';
  
  const itemTitle = document.createElement('div');
  itemTitle.className = 'schedule-item-title';
  itemTitle.textContent = item.name || item;
  
  const itemMeta = document.createElement('div');
  itemMeta.className = 'schedule-item-meta';
  itemMeta.textContent = new Date().toLocaleString();
  
  itemContent.appendChild(itemTitle);
  itemContent.appendChild(itemMeta);
  
  // Create remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn-small red schedule-item-action';
  removeBtn.innerHTML = '<i class="material-icons" style="font-size:16px">delete</i>';
  removeBtn.title = 'Remove item';
  removeBtn.addEventListener('click', () => removeItem(li, item));
  
  li.appendChild(itemContent);
  li.appendChild(removeBtn);
  ul.appendChild(li);
  scheduleItems.push(item);

  // Scroll to new item
  li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Show toast notification
  if (typeof toast !== 'undefined') {
    toast.success(`Added: ${item.name || item}`, 'Item Added');
  }
}

/**
 * Remove item from list with animation and toast feedback
 */
function removeItem(element, item) {
  const itemText = typeof item === 'object' ? item.name : item;
  
  element.classList.add('removing');
  
  setTimeout(() => {
    element.remove();
    scheduleItems = scheduleItems.filter(i => {
      const name = typeof i === 'object' ? i.name : i;
      return name !== itemText;
    });
    
    if (ul.children.length === 0) {
      ul.className = '';
      showEmptyState();
    }
    
    // Show toast notification
    if (typeof toast !== 'undefined') {
      toast.success(`Removed: ${itemText}`, 'Item Removed');
    }
  }, 300);
}

/**
 * Clear all items with confirmation
 */
function clearAllItems() {
  if (!ul) return;
  
  const itemCount = ul.children.length;
  
  if (itemCount === 0) {
    if (typeof toast !== 'undefined') {
      toast.info('Schedule is already empty');
    }
    return;
  }
  
  // Confirm before clearing
  const confirmed = confirm(`Are you sure you want to remove all ${itemCount} item(s)?`);
  
  if (confirmed) {
    ul.innerHTML = '';
    ul.className = '';
    scheduleItems = [];
    showEmptyState();
    
    if (typeof toast !== 'undefined') {
      toast.success(`Cleared ${itemCount} item(s)`, 'Schedule Cleared');
    }
  }
}

/**
 * Show empty state message
 */
function showEmptyState() {
  if (!ul || ul.children.length > 0) return;
  
  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state';
  emptyState.innerHTML = `
    <div class="empty-state-icon">📅</div>
    <h5 class="empty-state-title">No Schedule Items</h5>
    <p class="empty-state-message">Add your first schedule item to get started</p>
  `;
  ul.appendChild(emptyState);
}

// ========== Navigation ==========

function openNav() {
  const sidebar = document.getElementById('SideBarNav');
  const schedule = document.getElementById('Schedule');
  
  if (sidebar && schedule) {
    sidebar.style.width = '250px';
    schedule.style.marginLeft = '250px';
  }
}

function closeNav() {
  const sidebar = document.getElementById('SideBarNav');
  const schedule = document.getElementById('Schedule');
  
  if (sidebar && schedule) {
    sidebar.style.width = '0';
    schedule.style.marginLeft = '0';
  }
}

// ========== Initialization ==========

document.addEventListener('DOMContentLoaded', init);

// Make navigation functions global
window.openNav = openNav;
window.closeNav = closeNav;
