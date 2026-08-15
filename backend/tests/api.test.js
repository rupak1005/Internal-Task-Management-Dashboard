const http = require('http');
const app = require('../server');
const { initDatabase, pool } = require('../database/database');
const { seed } = require('../utils/seeder');

let server;
const PORT = 8001;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(message);
  } else {
    console.log(`  ✓ ${message}`);
  }
}

async function runTests() {
  console.log('\n========================================');
  console.log('🧪 RUNNING BACKEND API INTEGRATION TESTS');
  console.log('========================================\n');

  try {
    await initDatabase();
    await seed();

    await new Promise((resolve) => {
      server = app.listen(PORT, resolve);
    });
    console.log(`Test server running on port ${PORT}\n`);

    // 1. Health check
    console.log('[Test 1]: Health Check');
    const health = await request('GET', '/health');
    assert(health.status === 200, 'Health check returns 200 OK');
    assert(health.data.status === 'healthy', 'Status is healthy');

    // 2. Dashboard metrics
    console.log('\n[Test 2]: Dashboard Metrics');
    const dashboard = await request('GET', '/api/dashboard');
    assert(dashboard.status === 200, 'GET /api/dashboard returns 200');
    assert(dashboard.data.success === true, 'Response indicates success');
    assert(typeof dashboard.data.data.metrics.total === 'number', 'Total tasks metric is present');
    assert(dashboard.data.data.metrics.total >= 16, 'Total tasks count >= 16');
    assert(typeof dashboard.data.data.metrics.overdue === 'number', 'Overdue metric calculated');
    assert(Array.isArray(dashboard.data.data.status_distribution), 'Status distribution is array');
    assert(Array.isArray(dashboard.data.data.priority_distribution), 'Priority distribution is array');

    // 3. User Listing & Creation
    console.log('\n[Test 3]: Users API');
    const users = await request('GET', '/api/users');
    assert(users.status === 200, 'GET /api/users returns 200');
    assert(Array.isArray(users.data.data), 'Users list is array');
    assert(users.data.data.length >= 5, 'Found at least 5 users in seed');
    const firstUserId = users.data.data[0].id;

    const newUserRes = await request('POST', '/api/users', {
      name: 'Jordan Lee',
      email: `jordan.lee.${Date.now()}@test.io`,
      role: 'Member'
    });
    assert(newUserRes.status === 201, 'POST /api/users returns 201 Created');
    assert(newUserRes.data.data.name === 'Jordan Lee', 'Created user name matches');

    // 4. Tasks Filtering & Pagination
    console.log('\n[Test 4]: Tasks Pagination & Query Filters');
    const tasksPage1 = await request('GET', '/api/tasks?page=1&limit=5');
    assert(tasksPage1.status === 200, 'GET /api/tasks?page=1&limit=5 returns 200');
    assert(tasksPage1.data.data.length === 5, 'Page limit respected (5 items)');
    assert(tasksPage1.data.pagination.page === 1, 'Pagination page = 1');
    assert(tasksPage1.data.pagination.limit === 5, 'Pagination limit = 5');
    assert(tasksPage1.data.pagination.total_pages > 1, 'Multiple pages exist');

    // Filter by status
    const inProgressTasks = await request('GET', '/api/tasks?status=in_progress');
    assert(inProgressTasks.status === 200, 'Status filter returns 200');
    assert(inProgressTasks.data.data.every(t => t.status === 'in_progress'), 'All returned tasks have status=in_progress');

    // Filter by priority
    const urgentTasks = await request('GET', '/api/tasks?priority=urgent');
    assert(urgentTasks.status === 200, 'Priority filter returns 200');
    assert(urgentTasks.data.data.every(t => t.priority === 'urgent'), 'All returned tasks have priority=urgent');

    // Search query
    const searchRes = await request('GET', '/api/tasks?search=database');
    assert(searchRes.status === 200, 'Search query returns 200');
    assert(searchRes.data.data.length > 0, 'Search found matching task');
    assert(
      searchRes.data.data.some(t => t.title.toLowerCase().includes('database') || (t.description && t.description.toLowerCase().includes('database'))),
      'Search result contains database in title/description'
    );

    // 5. Task CRUD
    console.log('\n[Test 5]: Task CRUD Operations');
    // Validation failure test
    const invalidTask = await request('POST', '/api/tasks', { description: 'Missing title' });
    assert(invalidTask.status === 400, 'Task creation without title returns 400 Bad Request');

    // Successful creation
    const createdTask = await request('POST', '/api/tasks', {
      title: 'Automated Test Task Pipeline',
      description: 'End-to-end integration test item created via automated suite',
      status: 'pending',
      priority: 'high',
      assigned_to: firstUserId,
      due_date: new Date(Date.now() + 86400000 * 5).toISOString()
    });
    assert(createdTask.status === 201, 'POST /api/tasks returns 201 Created');
    const newTaskId = createdTask.data.data.id;
    assert(typeof newTaskId === 'number', 'New task ID is numeric');

    // Get task detail
    const taskDetail = await request('GET', `/api/tasks/${newTaskId}`);
    assert(taskDetail.status === 200, 'GET /api/tasks/:id returns 200');
    assert(taskDetail.data.data.title === 'Automated Test Task Pipeline', 'Title matches');
    assert(Array.isArray(taskDetail.data.data.comments), 'Comments array included');

    // Update task
    const updatedTask = await request('PUT', `/api/tasks/${newTaskId}`, {
      title: 'Updated Test Task Title',
      status: 'in_progress',
      priority: 'urgent'
    });
    assert(updatedTask.status === 200, 'PUT /api/tasks/:id returns 200');
    assert(updatedTask.data.data.title === 'Updated Test Task Title', 'Updated title persisted');
    assert(updatedTask.data.data.status === 'in_progress', 'Updated status persisted');

    // Patch status
    const patchedStatus = await request('PATCH', `/api/tasks/${newTaskId}/status`, {
      status: 'completed'
    });
    assert(patchedStatus.status === 200, 'PATCH /api/tasks/:id/status returns 200');
    assert(patchedStatus.data.data.status === 'completed', 'Status patched to completed');

    // Add comment
    const commentRes = await request('POST', `/api/tasks/${newTaskId}/comments`, {
      user_id: firstUserId,
      comment: 'Verification comment added during test execution.'
    });
    assert(commentRes.status === 201, 'POST /api/tasks/:id/comments returns 201 Created');
    assert(commentRes.data.data.comment === 'Verification comment added during test execution.', 'Comment content matches');
    assert(commentRes.data.data.user_name !== undefined, 'Author name populated');

    // Delete task
    const deleteRes = await request('DELETE', `/api/tasks/${newTaskId}`);
    assert(deleteRes.status === 200, 'DELETE /api/tasks/:id returns 200');
    const afterDelete = await request('GET', `/api/tasks/${newTaskId}`);
    assert(afterDelete.status === 404, 'Deleted task returns 404 Not Found');

    // 6. External Users API
    console.log('\n[Test 6]: External Users Integration Endpoint');
    const externalRes = await request('GET', '/api/external/users');
    assert(externalRes.status === 200, 'GET /api/external/users returns 200');
    assert(externalRes.data.success === true, 'External user fetch is successful');
    assert(Array.isArray(externalRes.data.data), 'External user list is array');
    assert(externalRes.data.data.length > 0, 'External user list is populated');
    assert(externalRes.data.data[0].companyName !== undefined, 'Company name is mapped');

    console.log('\n========================================');
    console.log('🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY!');
    console.log('========================================\n');
  } catch (err) {
    console.error('Test suite failed:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    await pool.end();
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
