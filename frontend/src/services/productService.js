import axios from '@/utils/axios';
import { API_URL } from '@/config/constants';

const PRODUCT_URL = `${API_URL}/products`;

export const productService = {
    async createProduct(formData) {
        const response = await fetch(PRODUCT_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create product');
        }

        return response.json();
    },

    getAllProducts: async ({ page = 1, limit = 10, search = '', category = '' }) => {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search && { search }),
            ...(category && { category })
        });

        const response = await fetch(`${PRODUCT_URL}?${queryParams}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch products');
        }

        return response.json();
    },

    getProduct: async (slug) => {
        const response = await fetch(`${PRODUCT_URL}/${slug}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch product');
        }

        const data = await response.json();
        return data.payload.product;
    },

    getProductsByCategory: async (categorySlug, params = {}) => {
        try {
            const response = await axios.get(`${PRODUCT_URL}`, {
                params: { ...params, category: categorySlug }
            });
            return response.data.payload;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateProduct: async (slug, formData) => {
        try {
            const response = await fetch(`${PRODUCT_URL}/${slug}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update product');
            }

            return response.json();
        } catch (error) {
            throw error;
        }
    },

    deleteProduct: async (slug) => {
        try {
            const response = await fetch(`${PRODUCT_URL}/${slug}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete product');
            }

            return response.json();
        } catch (error) {
            throw error;
        }
    }
};
