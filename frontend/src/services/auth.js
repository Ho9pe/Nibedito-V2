import axios from '@/utils/axios';

export const authService = {
  async login(formData) {
    try {
      console.log('Sending login request with:', formData);
      
      const { data } = await axios.post('/auth/login', {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password
      });
      
      console.log('Login response:', data);
      
      if (data.success && data.payload?.user) {
        localStorage.setItem('user', JSON.stringify(data.payload.user));
        if (data.payload.accessToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.payload.accessToken}`;
        }
        return {
          success: true,
          user: data.payload.user,
          message: data.message
        };
      }
      throw new Error(data.message || 'Authentication failed');
    } catch (error) {
      console.error('Login error details:', error.response?.data);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  async register(userData) {
    try {
      const { data } = await axios.post('/auth/process-register', userData);
      console.log('Server response:', data);
      
      if (data.statusCode === 200 || data.success) {
        return {
          success: true,
          message: data.message,
          email: userData.email
        };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please try again.');
      }
      // Something happened in setting up the request
      throw new Error('Failed to make registration request. Please try again.');
    }
  },

  async logout() {
    try {
      await axios.post('/auth/logout');
    } finally {
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  async getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      const { data } = await axios.get(`/users/${user._id}`);
      
      if (data.success && data.payload?.user) {
        localStorage.setItem('user', JSON.stringify(data.payload.user));
        return data.payload.user;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      this.logout();
      return null;
    }
  },

  async forgotPassword(email) {
    const { data } = await axios.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token, newPassword) {
    const { data } = await axios.post(`/auth/reset-password/${token}`, { 
      password: newPassword 
    });
    return data;
  },

  async activateAccount(token) {
    const { data } = await axios.post('/auth/activate-account', { token });
    return data;
  },

  async resendVerificationEmail(email) {
    try {
      const { data } = await axios.post('/auth/resend-verification', { email });
      return data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to resend verification email');
      }
      throw new Error(error.message || 'Network error occurred');
    }
  }
};