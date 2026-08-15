import api from './api';

export const externalService = {
  async getExternalUsers() {
    const res = await api.get('/external/users');
    return res.data;
  }
};
