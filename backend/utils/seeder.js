const fs = require('fs');
const path = require('path');
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
  await query('TRUNCATE TABLE comments, tasks, users RESTART IDENTITY CASCADE;');

  // 1. Insert Users
  const userMap = new Map(); // email -> user_id
  for (const u of seedData.users) {
    const res = await query(
      `INSERT INTO users (name, email, role, avatar_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email`,
      [u.name, u.email, u.role || 'Member', u.avatar_url || null]
    );
    userMap.set(res.rows[0].email, res.rows[0].id);
  }
  console.log(`[Seeder]: Inserted ${seedData.users.length} users.`);

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
    taskIds.push(res.rows[0].id);
  }
  console.log(`[Seeder]: Inserted ${seedData.tasks.length} tasks.`);

  // 3. Insert Comments
  let commentCount = 0;
  for (const c of seedData.comments) {
    const taskId = taskIds[c.task_index];
    const userId = userMap.get(c.user_email);

    if (taskId && userId) {
      await query(
        `INSERT INTO comments (task_id, user_id, comment)
         VALUES ($1, $2, $3)`,
        [taskId, userId, c.comment]
      );
      commentCount++;
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
