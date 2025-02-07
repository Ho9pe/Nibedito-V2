'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { API_URL } from '@/config/constants';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAdminAuth = async () => {
            try {
                const adminData = await adminService.getCurrentAdmin();
                if (adminData) {
                    setAdmin(adminData);
                }
            } catch (error) {
                console.error('Admin auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        initAdminAuth();
    }, []);

    const loginAdmin = async (credentials) => {
        try {
            const adminInfo = await adminService.login(credentials);
            setAdmin(adminInfo);
        } catch (error) {
            throw error;
        }
    };

    const logoutAdmin = async () => {
        try {
            await adminService.logout();
            setAdmin(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local state even if API call fails
            setAdmin(null);
        }
    };

    return (
        <AdminAuthContext.Provider value={{
            admin,
            loginAdmin,
            logoutAdmin,
            isLoading
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};