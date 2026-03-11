// api/auth.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Store token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

const getToken = () => {
  return localStorage.getItem('token');
};

const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const authAPI = {
  // Register
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        return { success: true, data };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        return { success: false, error: 'Cannot connect to server. Please ensure the backend server is running on port 5000.' };
      }
      return { success: false, error: 'Network error. Please check if the server is running.' };
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        return { success: true, data };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        return { success: false, error: 'Cannot connect to server. Please ensure the backend server is running on port 5000.' };
      }
      return { success: false, error: 'Network error. Please check if the server is running.' };
    }
  },

  // Logout
  logout: () => {
    removeToken();
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!getToken();
  },

  // Get current user
  getCurrentUser: () => {
    return getUser();
  },

  // Get token
  getToken: () => {
    return getToken();
  },

  // Get current user from server
  getMe: async () => {
    try {
      const token = getToken();
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true, data };
      } else {
        removeToken();
        return { success: false, error: data.message || 'Authentication failed' };
      }
    } catch (error) {
      console.error('GetMe error:', error);
      if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        return { success: false, error: 'Cannot connect to server. Please ensure the backend server is running.' };
      }
      return { success: false, error: 'Network error' };
    }
  },
};
