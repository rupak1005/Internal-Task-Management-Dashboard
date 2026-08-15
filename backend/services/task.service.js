const taskRepository = require('../repositories/task.repository');
const commentRepository = require('../repositories/comment.repository');
const userRepository = require('../repositories/user.repository');

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
    return {
      ...task,
      comments
    };
  }

  async createTask(data) {
    // If assignee provided, verify user exists
    if (data.assigned_to) {
      const user = await userRepository.findById(data.assigned_to);
      if (!user) {
        const error = new Error(`Assigned user with ID ${data.assigned_to} does not exist`);
        error.statusCode = 400;
        throw error;
      }
    }
    const newTask = await taskRepository.create(data);
    return await this.getTaskById(newTask.id);
  }

  async updateTask(id, data) {
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
    return await this.getTaskById(id);
  }

  async patchStatus(id, status) {
    const existing = await taskRepository.findById(id);
    if (!existing) {
      const error = new Error(`Task with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    await taskRepository.patchStatus(id, status);
    return await this.getTaskById(id);
  }

  async deleteTask(id) {
    const existing = await taskRepository.findById(id);
    if (!existing) {
      const error = new Error(`Task with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    await taskRepository.delete(id);
    return { message: `Task ${id} deleted successfully`, id: Number(id) };
  }

  async addComment(taskId, userId, commentText) {
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

    return await commentRepository.create(taskId, userId, commentText);
  }
}

module.exports = new TaskService();
