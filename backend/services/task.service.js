const taskRepository = require('../repositories/task.repository');
const commentRepository = require('../repositories/comment.repository');
const userRepository = require('../repositories/user.repository');
const auditService = require('./audit.service');

class TaskService {
  async getTasks(queryParams) {
    return await taskRepository.findPaginated(queryParams);
  }

  async getTaskById(id) {
    const task = await taskRepository.findById(id);
    if (!task) {
      const error = new Error(`Task with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    const comments = await commentRepository.findByTaskId(id);
    const activity = await auditService.getTaskActivity(id);
    return {
      ...task,
      comments,
      activity
    };
  }

  async createTask(data, actor = null) {
    if (data.assigned_to) {
      const user = await userRepository.findById(data.assigned_to);
      if (!user) {
        const error = new Error(`Assigned user with ID ${data.assigned_to} does not exist`);
        error.statusCode = 400;
        throw error;
      }
    }
    const newTask = await taskRepository.create(data);

    // Audit log
    await auditService.log({
      taskId: newTask.id,
      userId: actor?.id || null,
      userName: actor?.name || 'System',
      userAvatar: actor?.avatar_url || null,
      action: 'CREATED',
      details: `Created task "${newTask.title}" with status "${newTask.status}" and priority "${newTask.priority}".`,
      newValues: { title: newTask.title, status: newTask.status, priority: newTask.priority, assigned_to: newTask.assigned_to }
    });

    return await this.getTaskById(newTask.id);
  }

  async updateTask(id, data, actor = null) {
    const existing = await taskRepository.findById(id);
    if (!existing) {
      const error = new Error(`Task with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    if (data.assigned_to) {
      const user = await userRepository.findById(data.assigned_to);
      if (!user) {
        const error = new Error(`Assigned user with ID ${data.assigned_to} does not exist`);
        error.statusCode = 400;
        throw error;
      }
    }

    await taskRepository.update(id, data);

    // Audit log changes
    const changes = [];
    if (data.title && data.title !== existing.title) changes.push(`title: "${existing.title}" → "${data.title}"`);
    if (data.status && data.status !== existing.status) changes.push(`status: "${existing.status}" → "${data.status}"`);
    if (data.priority && data.priority !== existing.priority) changes.push(`priority: "${existing.priority}" → "${data.priority}"`);
    if (data.assigned_to !== undefined && data.assigned_to !== existing.assigned_to) {
      changes.push(`assignee: ${existing.assigned_to || 'None'} → ${data.assigned_to || 'None'}`);
    }

    await auditService.log({
      taskId: id,
      userId: actor?.id || null,
      userName: actor?.name || 'System',
      userAvatar: actor?.avatar_url || null,
      action: 'UPDATED',
      details: changes.length > 0 ? `Updated ${changes.join(', ')}` : 'Updated task details',
      oldValues: { title: existing.title, status: existing.status, priority: existing.priority, assigned_to: existing.assigned_to },
      newValues: data
    });

    return await this.getTaskById(id);
  }

  async patchStatus(id, status, actor = null) {
    const existing = await taskRepository.findById(id);
    if (!existing) {
      const error = new Error(`Task with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    await taskRepository.patchStatus(id, status);

    // Audit log
    await auditService.log({
      taskId: id,
      userId: actor?.id || null,
      userName: actor?.name || 'System',
      userAvatar: actor?.avatar_url || null,
      action: 'STATUS_CHANGED',
      details: `Moved status from "${existing.status.replace('_', ' ')}" to "${status.replace('_', ' ')}"`,
      oldValues: { status: existing.status },
      newValues: { status }
    });

    return await this.getTaskById(id);
  }

  async deleteTask(id, actor = null) {
    const existing = await taskRepository.findById(id);
    if (!existing) {
      const error = new Error(`Task with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    await auditService.log({
      taskId: null,
      userId: actor?.id || null,
      userName: actor?.name || 'System',
      userAvatar: actor?.avatar_url || null,
      action: 'DELETED',
      details: `Permanently removed task #${id} ("${existing.title}")`,
      oldValues: existing
    });

    await taskRepository.delete(id);
    return { message: `Task ${id} deleted successfully`, id: Number(id) };
  }

  async addComment(taskId, userId, commentText, actor = null) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      const error = new Error(`Task with ID ${taskId} not found`);
      error.statusCode = 404;
      throw error;
    }
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error(`User with ID ${userId} not found`);
      error.statusCode = 404;
      throw error;
    }

    const comment = await commentRepository.create(taskId, userId, commentText);

    // Audit log
    await auditService.log({
      taskId,
      userId: actor?.id || userId,
      userName: actor?.name || user.name,
      userAvatar: actor?.avatar_url || user.avatar_url,
      action: 'NOTE_ADDED',
      details: `Added note: "${commentText.substring(0, 50)}${commentText.length > 50 ? '...' : ''}"`
    });

    return comment;
  }
}

module.exports = new TaskService();
