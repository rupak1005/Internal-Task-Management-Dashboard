import api from './api';

export const usersService = {
  async getUsers() {
    const res = await api.get('/users');
    return res.data.data;
  },

  async createUser(userData) {
    const res = await api.post('/users', userData);
    return res.data.data;
  }
};
