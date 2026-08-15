const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../database/database');
const Joi = require('joi');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_task_dashboard_jwt_key_2026';
const JWT_EXPIRES_IN = '7d';

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Admin', 'Member').default('Member'),
  avatar_url: Joi.string().uri().allow(null, '').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

class AuthService {
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  async register(data) {
    const { error, value } = registerSchema.validate(data);
    if (error) {
      const err = new Error(error.details[0].message);
      err.statusCode = 400;
      throw err;
    }

    const { name, email, password, role, avatar_url } = value;

    // Check if user exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      const err = new Error('Email is already registered');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatar = avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    const res = await query(
      `INSERT INTO users (name, email, password_hash, role, avatar_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, avatar_url, created_at`,
      [name, email, passwordHash, role || 'Member', avatar]
    );

    const user = res.rows[0];
    const token = this.generateToken(user);

    return { user, token };
  }

  async login(data) {
    const { error, value } = loginSchema.validate(data);
    if (error) {
      const err = new Error(error.details[0].message);
      err.statusCode = 400;
      throw err;
    }

    const { email, password } = value;

    const res = await query(
      `SELECT id, name, email, password_hash, role, avatar_url, created_at
       FROM users WHERE email = $1`,
      [email]
    );

    if (res.rows.length === 0) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const user = res.rows[0];

    // If user has no password_hash (e.g. legacy/seed), verify with default 'password123'
    let isValid = false;
    if (user.password_hash) {
      isValid = await bcrypt.compare(password, user.password_hash);
    } else {
      isValid = password === 'password123';
    }

    if (!isValid) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const { password_hash: _ph, ...safeUser } = user;
    const token = this.generateToken(safeUser);

    return { user: safeUser, token };
  }

  async getCurrentUser(userId) {
    const res = await query(
      `SELECT id, name, email, role, avatar_url, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (res.rows.length === 0) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    return res.rows[0];
  }
}

module.exports = new AuthService();
