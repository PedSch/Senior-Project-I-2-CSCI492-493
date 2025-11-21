/**
 * Auth Service Tests
 */

const AuthService = require('../src/auth');
const DB = require('../src/db');
const fs = require('fs');

describe('AuthService', () => {
  let db;
  let authService;
  const testDbFile = 'test_auth.db';

  beforeEach(() => {
    if (fs.existsSync(testDbFile)) {
      fs.unlinkSync(testDbFile);
    }
    db = new DB(testDbFile);
    authService = new AuthService(db);
  });

  afterEach(() => {
    db.db.close();
    if (fs.existsSync(testDbFile)) {
      fs.unlinkSync(testDbFile);
    }
  });

  test('should create a user', async () => {
    const user = await authService.createUser({
      username: 'testuser',
      password: 'password123',
      role: 'admin'
    });

    expect(user).toBeDefined();
    expect(user.username).toBe('testuser');
    expect(user.role).toBe('admin');
  });

  test('should not create duplicate username', async () => {
    await authService.createUser({
      username: 'testuser',
      password: 'password123',
      role: 'user'
    });

    await expect(
      authService.createUser({
        username: 'testuser',
        password: 'different',
        role: 'user'
      })
    ).rejects.toThrow('Username exists');
  });

  test('should login with correct credentials', async () => {
    await authService.createUser({
      username: 'testuser',
      password: 'password123',
      role: 'user'
    });

    const session = await authService.login('testuser', 'password123');
    
    expect(session).toBeDefined();
    expect(session.token).toBeDefined();
    expect(session.username).toBe('testuser');
    expect(session.role).toBe('user');
  });

  test('should reject invalid credentials', async () => {
    await authService.createUser({
      username: 'testuser',
      password: 'password123',
      role: 'user'
    });

    await expect(
      authService.login('testuser', 'wrongpassword')
    ).rejects.toThrow('Invalid credentials');
  });

  test('should validate session token', async () => {
    await authService.createUser({
      username: 'testuser',
      password: 'password123',
      role: 'user'
    });

    const session = await authService.login('testuser', 'password123');
    const validated = authService.validate(session.token);
    
    expect(validated).toBeDefined();
    expect(validated.username).toBe('testuser');
  });

  test('should reject invalid token', () => {
    const validated = authService.validate('invalid-token');
    expect(validated).toBeNull();
  });

  test('should logout', async () => {
    await authService.createUser({
      username: 'testuser',
      password: 'password123',
      role: 'user'
    });

    const session = await authService.login('testuser', 'password123');
    authService.logout(session.token);
    
    const validated = authService.validate(session.token);
    expect(validated).toBeNull();
  });
});
