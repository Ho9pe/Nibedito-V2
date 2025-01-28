import axios from '@/utils/axios';
import { API_URL } from '@/config/constants';

const CATEGORY_URL = `${API_URL}/categories`;

export const categoryService = {
    createCategory: async (formData) => {
        try {
            const { data } = await axios.post('/categories', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data.payload;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create category');
        }
    },

    updateCategory: async (slug, formData) => {
        try {
            const { data } = await axios.put(`/categories/${slug}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data.payload;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update category');
        }
    },

    getAllCategories: async () => {
        try {
            const { data } = await axios.get('/categories');
            return data.payload;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch categories');
        }
    },

    getActiveCategories: async () => {
        try {
            const { categories } = await categoryService.getAllCategories();
            return categories.filter(category => category.isActive);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch active categories');
        }
    },

    deleteCategory: async (slug) => {
        try {
            const { data } = await axios.delete(`/categories/${slug}`);
            return data.payload;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete category');
        }
    },

    getCategory: async (slug) => {
        try {
            const response = await axios.get(`${CATEGORY_URL}/${slug}`);
            return response.data.payload.category;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};
