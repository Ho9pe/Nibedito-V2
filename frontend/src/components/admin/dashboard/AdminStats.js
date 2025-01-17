'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiShoppingBag, FiDollarSign, FiBox } from 'react-icons/fi';
import { adminService } from '@/services/adminService';

export default function AdminStats() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        isLoading: true,
        error: null
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getDashboardStats();
                setStats({
                    ...data,
                    isLoading: false,
                    error: null
                });
            } catch (error) {
                setStats(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message
                }));
            }
        };

        fetchStats();
    }, []);

    if (stats.isLoading) {
        return <div className="admin-stats-loading">Loading stats...</div>;
    }

    if (stats.error) {
        return <div className="admin-stats-error">Error loading stats: {stats.error}</div>;
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: FiUsers,
            color: 'blue'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: FiShoppingBag,
            color: 'green'
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toFixed(2)}`,
            icon: FiDollarSign,
            color: 'purple'
        },
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: FiBox,
            color: 'orange'
        }
    ];

    return (
        <div className="admin-stats">
            {statCards.map((stat, index) => (
                <div key={index} className={`stat-card ${stat.color}`}>
                    <div className="stat-icon">
                        <stat.icon size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{stat.title}</h3>
                        <p>{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
} 