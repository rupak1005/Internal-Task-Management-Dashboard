const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { query, initDatabase, pool } = require('../database/database');

async function seed() {
  console.log('[Seeder]: Starting database seeding...');
  await initDatabase();

  const seedFilePath = path.resolve(__dirname, '../../seed_data.json');
  if (!fs.existsSync(seedFilePath)) {
    console.error(`[Seeder Error]: Seed file not found at ${seedFilePath}`);
    process.exit(1);
  }

  const seedData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'));

  // Clean existing data for fresh seed
  await query('TRUNCATE TABLE audit_logs, comments, tasks, users RESTART IDENTITY CASCADE;');

  const defaultPasswordHash = bcrypt.hashSync('password123', 10);

  // 1. Insert Users
  const userMap = new Map(); // email -> user_id
  const userObjectMap = new Map();
  for (const u of seedData.users) {
    const res = await query(
      `INSERT INTO users (name, email, password_hash, role, avatar_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, avatar_url`,
      [u.name, u.email, defaultPasswordHash, u.role || 'Member', u.avatar_url || null]
    );
    userMap.set(res.rows[0].email, res.rows[0].id);
    userObjectMap.set(res.rows[0].id, res.rows[0]);
  }
  console.log(`[Seeder]: Inserted ${seedData.users.length} users with password 'password123'.`);

  // 2. Insert Tasks
  const taskIds = [];
  const now = new Date();

  for (const t of seedData.tasks) {
    let assignedId = null;
    if (t.assigned_to_email && userMap.has(t.assigned_to_email)) {
      assignedId = userMap.get(t.assigned_to_email);
    }

    let dueDate = null;
    if (typeof t.due_offset_days === 'number') {
      const d = new Date(now);
      d.setDate(d.getDate() + t.due_offset_days);
      dueDate = d.toISOString();
    }

    const res = await query(
      `INSERT INTO tasks (title, description, status, priority, assigned_to, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [t.title, t.description || '', t.status || 'pending', t.priority || 'medium', assignedId, dueDate]
    );
    const taskId = res.rows[0].id;
    taskIds.push(taskId);

    // Initial audit log for task creation
    const adminUser = userObjectMap.get(1) || { name: 'Alex Morgan', avatar_url: null };
    await query(
      `INSERT INTO audit_logs (task_id, user_id, user_name, user_avatar, action, details, new_values)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        taskId,
        1,
        adminUser.name,
        adminUser.avatar_url,
        'CREATED',
        `Task "${t.title}" created with status ${t.status || 'pending'} and priority ${t.priority || 'medium'}.`,
        JSON.stringify({ status: t.status, priority: t.priority, title: t.title })
      ]
    );
  }
  console.log(`[Seeder]: Inserted ${seedData.tasks.length} tasks and audit logs.`);

  // 3. Insert Comments
  let commentCount = 0;
  for (const c of seedData.comments) {
    const taskId = taskIds[c.task_index];
    const userId = userMap.get(c.user_email);
    const userObj = userObjectMap.get(userId);

    if (taskId && userId) {
      await query(
        `INSERT INTO comments (task_id, user_id, comment)
         VALUES ($1, $2, $3)`,
        [taskId, userId, c.comment]
      );
      commentCount++;

      // Audit log for comment
      if (userObj) {
        await query(
          `INSERT INTO audit_logs (task_id, user_id, user_name, user_avatar, action, details)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            taskId,
            userId,
            userObj.name,
            userObj.avatar_url,
            'NOTE_ADDED',
            `Added note: "${c.comment.substring(0, 50)}${c.comment.length > 50 ? '...' : ''}"`
          ]
        );
      }
    }
  }
  console.log(`[Seeder]: Inserted ${commentCount} comments.`);
  console.log('[Seeder]: Database successfully seeded!');
}

if (require.main === module) {
  seed()
    .then(() => {
      pool.end();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seeder Failed]:', err);
      pool.end();
      process.exit(1);
    });
}

module.exports = { seed };
