/**
 * End-to-End Tests for Campus Scheduler
 * Using Playwright with Electron
 */

const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');
const path = require('path');

test.describe('Campus Scheduler E2E', () => {
  let electronApp;
  let window;

  test.beforeAll(async () => {
    electronApp = await electron.launch({
      args: [path.join(__dirname, '../main.js.new')],
      env: { NODE_ENV: 'test' }
    });
    window = await electronApp.firstWindow();
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('should launch application', async () => {
    const title = await window.title();
    expect(title).toContain('Campus');
  });

  test('should open rooms window', async () => {
    // Click rooms navigation
    await window.click('text=Rooms');
    
    // Wait for new window
    const [roomsWindow] = await Promise.all([
      electronApp.waitForEvent('window'),
    ]);
    
    const roomsTitle = await roomsWindow.title();
    expect(roomsTitle).toContain('Room');
  });

  test('should create a room', async () => {
    // Navigate to rooms
    await window.click('text=Rooms');
    const [roomsWindow] = await Promise.all([
      electronApp.waitForEvent('window'),
    ]);
    
    // Fill room form
    await roomsWindow.fill('#roomName', 'Test Room');
    await roomsWindow.fill('#capacity', '25');
    await roomsWindow.click('button[type="submit"]');
    
    // Verify room appears in list
    await expect(roomsWindow.locator('text=Test Room')).toBeVisible();
  });

  test('should create a booking', async () => {
    // Navigate to bookings
    await window.click('text=Bookings');
    const [bookingsWindow] = await Promise.all([
      electronApp.waitForEvent('window'),
    ]);
    
    // Wait for calendar to load
    await bookingsWindow.waitForSelector('.fc-daygrid');
    
    // Click on calendar slot
    await bookingsWindow.click('.fc-daygrid-day');
    
    // Fill booking form (assuming modal opens)
    await bookingsWindow.waitForSelector('#bookingTitle');
    await bookingsWindow.fill('#bookingTitle', 'Team Meeting');
    await bookingsWindow.click('button:has-text("Save")');
    
    // Verify booking appears
    await expect(bookingsWindow.locator('text=Team Meeting')).toBeVisible();
  });
});
