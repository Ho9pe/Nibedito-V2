import axios from '@/utils/axios';

const userService = {
    async getUserById(userId) {
        try {
            const { data } = await axios.get(`/users/${userId}`);
            if (data.success && data.payload?.user) {
                return data.payload.user;
            }
            throw new Error(data.message || 'Failed to fetch user');
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user');
        }
    },

    async updateProfile(userId, userData) {
        try {
            const { data } = await axios.put(`/users/update/${userId}`, userData);
            if (data.success && data.payload?.user) {
                localStorage.setItem('user', JSON.stringify(data.payload.user));
                return data.payload.user;
            }
            throw new Error(data.message || 'Failed to update profile');
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
    },

    async updateAddress(userId, addressId, addressData) {
        try {
            const { data } = await axios.put(`/users/${userId}/addresses/${addressId}`, addressData);
            if (data.success && data.payload?.user) {
                localStorage.setItem('user', JSON.stringify(data.payload.user));
                return data.payload.user;
            }
            throw new Error(data.message || 'Failed to update address');
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update address');
        }
    },

    async addAddress(userId, addressData) {
        try {
            const { data } = await axios.post(`/users/${userId}/addresses`, addressData);
            if (data.success && data.payload?.user) {
                localStorage.setItem('user', JSON.stringify(data.payload.user));
                return data.payload.user;
            }
            throw new Error(data.message || 'Failed to add address');
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to add address');
        }
    },

    async deleteAddress(userId, addressId) {
        try {
            const { data } = await axios.delete(`/users/${userId}/addresses/${addressId}`);
            if (data.success && data.payload?.user) {
                localStorage.setItem('user', JSON.stringify(data.payload.user));
                return data.payload.user;
            }
            throw new Error(data.message || 'Failed to delete address');
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete address');
        }
    }
};

export default userService; 