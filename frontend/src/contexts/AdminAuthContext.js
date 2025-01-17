'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

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
            const response = await adminService.login(credentials);
            if (response?.admin) {
                setAdmin(response.admin);
                return response;
            }
            throw new Error('Invalid response from server');
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
            throw error;
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