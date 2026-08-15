require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./database/database');
const { requestLogger } = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');

// Route Imports
const tasksRouter = require('./routes/tasks.routes');
const usersRouter = require('./routes/users.routes');
const dashboardRouter = require('./routes/dashboard.routes');
const externalRouter = require('./routes/external.routes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id']
}));
app.use(express.json());
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Task Management API'
  });
});

// API Routes
app.use('/api/dashboard', dashboardRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);
app.use('/api/external', externalRouter);

// 404 and Global Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 Task Management API running on port ${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log(`📋 Dashboard:    http://localhost:${PORT}/api/dashboard`);
      console.log(`📌 Tasks API:    http://localhost:${PORT}/api/tasks`);
      console.log(`👥 Users API:    http://localhost:${PORT}/api/users`);
      console.log(`🌐 External API: http://localhost:${PORT}/api/external/users`);
      console.log(`=========================================`);
    });
  } catch (err) {
    console.error('[Server Startup Error]:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
