'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const API_URL = 'http://localhost:3001';

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart(null);
            setLoading(false);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const response = await fetch(`${API_URL}/api/cart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    setCart(null);
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.success) {
                setCart(data.payload.cart);
            } else {
                throw new Error(data.message || 'Failed to fetch cart');
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1, variant = null) => {
        try {
            const response = await fetch(`${API_URL}/api/cart/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ productId, quantity, variant })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setCart(data.payload.cart);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to add to cart:', error);
            return false;
        }
    };

    const updateCartItem = async (itemId, quantity) => {
        try {
            const response = await fetch(`${API_URL}/api/cart/items`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, quantity })

            });
            const data = await response.json();
            setCart(data.payload.cart);
            return true;
        } catch (error) {
            console.error('Failed to update cart:', error);
            return false;
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const response = await fetch(`${API_URL}/api/cart/items/${itemId}`, { method: 'DELETE' });
            setCart(prev => ({
                ...prev,

                items: prev.items.filter(item => item._id !== itemId)
            }));
            return true;
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            return false;
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        try {
            const response = await fetch(`${API_URL}/api/cart/items/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQuantity })
            });
            const data = await response.json();
            setCart(data.payload.cart);
            return true;
        } catch (error) {
            console.error('Failed to update quantity:', error);
            return false;
        }
    };

    const clearCart = async () => {
        try {
            const response = await fetch(`${API_URL}/api/cart`, { method: 'DELETE' });
            setCart(null);
            return true;
        } catch (error) {
            console.error('Failed to clear cart:', error);
            return false;
        }

    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            updateCartItem,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
