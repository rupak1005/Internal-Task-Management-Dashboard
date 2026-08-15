const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Internal Task & Management Operations API',
    version: '1.0.0',
    description: 'Enterprise REST API for task workflows, real-time analytics, user authentication, RBAC, audit logging, and external directory synchronization.',
    contact: {
      name: 'Engineering Operations Team',
      email: 'ops@company.internal'
    }
  },
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT Bearer token obtained from /api/auth/login or /api/auth/register'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Alex Morgan' },
          email: { type: 'string', example: 'alex.morgan@company.com' },
          role: { type: 'string', enum: ['Admin', 'Member'], example: 'Admin' },
          avatar_url: { type: 'string', example: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Implement distributed Redis cache' },
          description: { type: 'string', example: 'Set up cluster replication and cache invalidation' },
          status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'blocked'], example: 'in_progress' },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], example: 'high' },
          assigned_to: { type: 'integer', example: 2 },
          assignee_name: { type: 'string', example: 'Elena Rostova' },
          due_date: { type: 'string', format: 'date-time', nullable: true },
          comments_count: { type: 'integer', example: 3 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      AuditLog: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 42 },
          task_id: { type: 'integer', nullable: true, example: 1 },
          user_id: { type: 'integer', nullable: true, example: 1 },
          user_name: { type: 'string', example: 'Alex Morgan' },
          action: { type: 'string', example: 'STATUS_CHANGED' },
          details: { type: 'string', example: 'Moved status from "pending" to "in_progress"' },
          created_at: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Service Health Check',
        responses: {
          200: { description: 'API is healthy' }
        }
      }
    },
    '/api/auth/register': {
      post: {
        summary: 'Register new user',
        tags: ['Authentication & RBAC'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Marcus Vance' },
                  email: { type: 'string', example: 'marcus.vance@company.com' },
                  password: { type: 'string', example: 'password123' },
                  role: { type: 'string', enum: ['Admin', 'Member'], example: 'Member' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User registered successfully and JWT returned' },
          400: { description: 'Validation error' },
          409: { description: 'Email already exists' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Log in with email and password',
        tags: ['Authentication & RBAC'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'alex.morgan@company.com' },
                  password: { type: 'string', example: 'password123' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Authentication successful, returns JWT' },
          401: { description: 'Invalid email or password' }
        }
      }
    },
    '/api/auth/me': {
      get: {
        summary: 'Get current authenticated user profile',
        tags: ['Authentication & RBAC'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'User profile retrieved' },
          401: { description: 'Unauthorized / Missing token' }
        }
      }
    },
    '/api/tasks': {
      get: {
        summary: 'List paginated tasks with search, filter & sorting',
        tags: ['Tasks'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'priority', in: 'query', schema: { type: 'string' } },
          { name: 'assignee', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'sort_by', in: 'query', schema: { type: 'string', default: 'created_at' } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } }
        ],
        responses: {
          200: { description: 'List of tasks with pagination' }
        }
      },
      post: {
        summary: 'Create a new task',
        tags: ['Tasks'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Implement distributed rate limiter' },
                  description: { type: 'string' },
                  status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'blocked'] },
                  priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                  assigned_to: { type: 'integer', nullable: true },
                  due_date: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Task created' }
        }
      }
    },
    '/api/tasks/{id}': {
      get: {
        summary: 'Get task by ID with comments and activity timeline',
        tags: ['Tasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Task details' },
          404: { description: 'Task not found' }
        }
      },
      put: {
        summary: 'Update full task details',
        tags: ['Tasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Task updated' }
        }
      },
      delete: {
        summary: 'Delete task (Admin only when token provided)',
        tags: ['Tasks'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Task deleted' },
          403: { description: 'Forbidden for non-Admin' }
        }
      }
    },
    '/api/tasks/{id}/status': {
      patch: {
        summary: 'Patch task workflow status (Kanban & Quick toggle)',
        tags: ['Tasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'blocked'] }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Status updated' }
        }
      }
    },
    '/api/tasks/{id}/comments': {
      post: {
        summary: 'Add note/comment to task',
        tags: ['Tasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          201: { description: 'Comment created' }
        }
      }
    },
    '/api/tasks/{id}/activity': {
      get: {
        summary: 'Get chronological activity history for task',
        tags: ['Audit & History'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Activity history list' }
        }
      }
    },
    '/api/audit-logs': {
      get: {
        summary: 'List system-wide audit logs (Admin only)',
        tags: ['Audit & History'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'action', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Audit logs array' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' }
        }
      }
    },
    '/api/dashboard': {
      get: {
        summary: 'Get aggregated dashboard metrics and distributions',
        tags: ['Dashboard Analytics'],
        responses: {
          200: { description: 'Dashboard metrics payload' }
        }
      }
    },
    '/api/external/users': {
      get: {
        summary: 'Fetch transformed team directory from external JSONPlaceholder integration',
        tags: ['External Integration'],
        responses: {
          200: { description: 'External users payload' }
        }
      }
    }
  }
};

function setupSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
}

module.exports = { setupSwagger, swaggerDocument };
