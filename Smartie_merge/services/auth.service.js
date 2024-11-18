import axios from 'axios';

const API_URL = 'http://localhost:8080';

const authService = {
  async login(username, password) {
    try {
      // Get all students
      const response = await axios.get(`${API_URL}/student/get`);
      const students = response.data;
      
      // Find matching student
      const student = students.find(
        s => s.studentUsername === username && s.studentPassword === password
      );

      if (student) {
        // Add token-like authentication
        const userData = {
          ...student,
          token: btoa(`${username}:${password}`), // Simple token creation
        };
        
        // Store auth data
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        
        return userData;
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
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
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

export default authService;