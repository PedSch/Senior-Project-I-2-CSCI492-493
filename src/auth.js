/**
 * Auth Layer (Phase 6)
 * Provides user creation and login verification using bcryptjs.
 */
'use strict';

const bcrypt = require('bcryptjs');
const DB = require('./db');

class AuthService {
  constructor(db = new DB()) {
    this.db = db;
    this.sessions = new Map(); // token -> { userId, role, username }
  }

  async createUser({ username, password, role }) {
    if (this.db.getUserByUsername(username)) throw new Error('Username exists');
    const hash = await bcrypt.hash(password, 10);
    const id = this.db.addUser({ username, passwordHash: hash, role });
    return { id, username, role };
  }

  async login(username, password) {
    const user = this.db.getUserByUsername(username);
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error('Invalid credentials');
    const token = `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const session = { userId: user.id, role: user.role, username: user.username, createdAt: Date.now() };
    this.sessions.set(token, session);
    return { token, ...session };
  }

  validate(token) { return this.sessions.get(token) || null; }
  logout(token) { this.sessions.delete(token); }
}

module.exports = AuthService;
