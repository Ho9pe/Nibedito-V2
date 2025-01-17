import axios from '@/utils/axios';

export const adminService = {
    async login(credentials) {
        try {
            const { data } = await axios.post('/admin/login', credentials);
            if (data.success && data.payload?.adminInfo) {
                localStorage.setItem('admin', JSON.stringify(data.payload.adminInfo));
                return { admin: data.payload.adminInfo };
            }
            throw new Error(data.message || 'Login failed');
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || 'Login failed');
            }
            throw error;
        }
    },

    async logout() {
        try {
            await axios.post('/admin/logout');
        } finally {
            localStorage.removeItem('admin');
        }
    },

    async getCurrentAdmin() {
        const adminStr = localStorage.getItem('admin');
        if (!adminStr) return null;
        return JSON.parse(adminStr);
    },

    async getUserStats() {
        const { data } = await axios.get('/admin/stats/users');
        return data.payload;
    },

    async getRecentOrders() {
        const { data } = await axios.get('/admin/orders/recent');
        return data.payload;
    },

    async getDashboardStats() {
        const { data } = await axios.get('/admin/stats/dashboard');
        return data.payload;
    },

    async getAllUsers(params) {
        const { page, limit, search, filter, sortBy, order } = params;
        const query = new URLSearchParams({
            page: page || 1,
            limit: limit || 10,
            ...(search && { search }),
            ...(filter && { filter }),
            ...(sortBy && { sortBy }),
            ...(order && { order })
        });

        const { data } = await axios.get(`/admin/users?${query}`);
        return data;
    },

    async banUser(userId) {
        try {
            const { data } = await axios.put(`/admin/users/${userId}/ban`);
            if (data.success) {
                return data.payload;
            }
            throw new Error(data.message || 'Failed to ban user');
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to ban user');
        }
    },

    async unbanUser(userId) {
        try {
            const { data } = await axios.put(`/admin/users/${userId}/unban`);
            if (data.success) {
                return data.payload;
            }
            throw new Error(data.message || 'Failed to unban user');
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to unban user');
        }
    },

    async deleteUser(userId) {
        const { data } = await axios.delete(`/admin/users/${userId}`);
        return data;
    },

    async getUserById(userId) {
        const { data } = await axios.get(`/admin/users/${userId}`);
        return data;
    },

    async updateUser(userId, userData) {
        const { data } = await axios.patch(`/admin/users/${userId}`, userData);
        return data;
    }
};