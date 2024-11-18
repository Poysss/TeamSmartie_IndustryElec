import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const authService = {
  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/student/login`, {
        studentUsername: username,
        studentPassword: password
      });
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/student/add`, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        studentEmail: userData.email,
        studentUsername: userData.username,
        studentPassword: userData.password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
};

export default authService;