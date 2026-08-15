const { query } = require('../database/database');

class UserRepository {
  async findAll() {
    const res = await query('SELECT id, name, email, role, avatar_url, created_at FROM users ORDER BY name ASC');
    return res.rows;
  }

  async findById(id) {
    const res = await query('SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async findByEmail(email) {
    const res = await query('SELECT id, name, email, role, avatar_url, created_at FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    return res.rows[0] || null;
  }

  async create({ name, email, role = 'Member', avatar_url = null }) {
    const res = await query(
      `INSERT INTO users (name, email, role, avatar_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, avatar_url, created_at`,
      [name, email, role, avatar_url]
    );
    return res.rows[0];
  }

  async count() {
    const res = await query('SELECT COUNT(*)::int AS count FROM users');
    return res.rows[0].count;
  }
}

module.exports = new UserRepository();
