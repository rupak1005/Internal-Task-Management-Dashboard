import apiClient from './api';

export const authService = {
  async register(data) {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async login(credentials) {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  async getMe() {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  async getAuditLogs(params = {}) {
    const res = await apiClient.get('/audit-logs', { params });
    return res.data;
  },

  async getTaskActivity(taskId) {
    const res = await apiClient.get(`/tasks/${taskId}/activity`);
    return res.data;
  }
};
