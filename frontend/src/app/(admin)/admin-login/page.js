'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLoginForm from '@/components/admin/auth/AdminLoginForm';

export default function AdminLoginPage() {
    const router = useRouter();
    const { admin, isLoading } = useAdminAuth();

    useEffect(() => {
        if (!isLoading && admin) {
            router.push('/admin/dashboard');
        }
    }, [isLoading, admin, router]);

    if (isLoading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="admin-auth-container">
            <div className="admin-auth-card">
                <h1>Admin Portal</h1>
                <p className="auth-subtitle">Login to manage your ecommerce platform</p>
                <AdminLoginForm />
            </div>
        </div>
    );
}