const userRepository = require('../repositories/user.repository');

class UserService {
  async getAllUsers() {
    return await userRepository.findAll();
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const error = new Error(`User with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async createUser(userData) {
    const existing = await userRepository.findByEmail(userData.email);
    if (existing) {
      const error = new Error(`A user with email ${userData.email} already exists`);
      error.statusCode = 409;
      throw error;
    }
    return await userRepository.create(userData);
  }
}

module.exports = new UserService();
