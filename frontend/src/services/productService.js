import axios from 'axios';
import { API_URL } from '@/config/constants';

const PRODUCT_URL = `${API_URL}/products`;

export const productService = {
    getAllProducts: async (params = {}) => {
        try {
            const response = await axios.get(PRODUCT_URL, { params });
            return response.data.payload;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getProduct: async (slug) => {
        try {
            const response = await axios.get(`${PRODUCT_URL}/${slug}`);
            return response.data.payload.product;
        } catch (error) {
            throw error.response?.data || error.message;
        }
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
    }
};
