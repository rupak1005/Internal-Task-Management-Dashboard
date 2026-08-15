import api from './api';

export const tasksService = {
  async getDashboardMetrics(userId = null) {
    const params = userId ? { user_id: userId } : {};
    const res = await api.get('/dashboard', { params });
    return res.data.data;
  },

  async getTasks(params = {}) {
    const res = await api.get('/tasks', { params });
    return {
      items: res.data.data,
      pagination: res.data.pagination
    };
  },

  async getTaskById(id) {
    const res = await api.get(`/tasks/${id}`);
    return res.data.data;
  },

  async createTask(taskData) {
    const res = await api.post('/tasks', taskData);
    return res.data.data;
  },

  async updateTask(id, taskData) {
    const res = await api.put(`/tasks/${id}`, taskData);
    return res.data.data;
  },

  async patchStatus(id, status) {
    const res = await api.patch(`/tasks/${id}/status`, { status });
    return res.data.data;
  },

  async deleteTask(id) {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },

  async addComment(taskId, { userId, comment }) {
    const res = await api.post(`/tasks/${taskId}/comments`, {
      user_id: userId,
      comment
    });
    return res.data.data;
  }
};
