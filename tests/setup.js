/**
 * Test setup
 */

// Mock Electron in tests
global.mockElectron = {
  app: {
    getPath: jest.fn(() => '/tmp/test-data')
  },
  ipcMain: {
    handle: jest.fn(),
    on: jest.fn()
  },
  BrowserWindow: jest.fn()
};
