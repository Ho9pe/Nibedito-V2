'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminStats from '@/components/admin/dashboard/AdminStats';
import RecentOrders from '@/components/admin/dashboard/RecentOrders';
import UserOverview from '@/components/admin/dashboard/UserOverview';
import AdminProfile from '@/components/admin/dashboard/AdminProfile';

export default function AdminDashboardPage() {
    const router = useRouter();
    const { admin, isLoading } = useAdminAuth();
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        if (!isLoading && admin) {
            setIsDataLoaded(true);
        }
    }, [isLoading, admin]);

    useEffect(() => {
        if (!isLoading && !admin) {
            router.push('/admin-login');
        }
    }, [isLoading, admin, router]);

    if (isLoading || !admin || !isDataLoaded) {
        return <div className="admin-loading">Loading dashboard...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="admin-profile">
                    <span className="admin-greeting">Welcome, {admin.name}</span>
                    <span className="admin-role">Super Admin</span>
                </div>
            </div>

            <div className="admin-content">
                <section className="admin-section">
                    <h2 className="section-title">Profile Information</h2>
                    <AdminProfile admin={admin} />
                </section>
                
                <section className="admin-section">
                    <h2 className="section-title">Overview</h2>
                    <AdminStats />
                </section>

                <section className="admin-section">
                    <div className="admin-grid">
                        <div className="grid-item">
                            <h2 className="section-title">Recent Orders</h2>
                            <RecentOrders />
                        </div>
                        <div className="grid-item">
                            <h2 className="section-title">User Overview</h2>
                            <UserOverview />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
} 