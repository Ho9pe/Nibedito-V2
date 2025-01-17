'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { FiUser, FiUserCheck, FiUserX, FiUsers } from 'react-icons/fi';

export default function UserOverview() {
    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        bannedUsers: 0,
        recentRegistrations: 0,
        verificationStats: {
            emailVerified: 0,
            phoneVerified: 0
        },
        isLoading: true,
        error: null
    });

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const response = await adminService.getUserStats();
                setUserStats({
                    ...response.payload,
                    isLoading: false,
                    error: null
                });
            } catch (error) {
                setUserStats(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message
                }));
            }
        };

        fetchUserStats();
    }, []);

    if (userStats.isLoading) {
        return <div className="user-overview-loading">Loading user stats...</div>;
    }

    if (userStats.error) {
        return <div className="user-overview-error">Error: {userStats.error}</div>;
    }

    return (
        <div className="user-overview">
            <div className="user-stats-grid">
                <div className="user-stat-card">
                    <FiUsers className="stat-icon" />
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p>{userStats.totalUsers}</p>
                        <small>New: +{userStats.recentRegistrations} this week</small>
                    </div>
                </div>
                <div className="user-stat-card">
                    <FiUserCheck className="stat-icon active" />
                    <div className="stat-info">
                        <h3>Active Users</h3>
                        <p>{userStats.activeUsers}</p>
                        <small>Verified: {userStats.verificationStats.emailVerified}</small>
                    </div>
                </div>
                <div className="user-stat-card">
                    <FiUserX className="stat-icon banned" />
                    <div className="stat-info">
                        <h3>Banned Users</h3>
                        <p>{userStats.bannedUsers}</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 