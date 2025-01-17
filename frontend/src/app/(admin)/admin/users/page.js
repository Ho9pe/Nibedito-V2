'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { adminService } from '@/services/adminService';
import UserFilters from '@/components/admin/users/UserFilters';
import UsersTable from '@/components/admin/users/UsersTable';
import ConfirmDialog from '@/components/admin/users/ConfirmDialog';

export default function UsersPage() {
    const router = useRouter();
    const { admin, isLoading } = useAdminAuth();
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });
    const [filters, setFilters] = useState({
        search: '',
        filter: 'all',
        sortBy: 'createdAt',
        order: 'desc'
    });
    const [dialogConfig, setDialogConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        actionType: '',
        onConfirm: null
    });

    useEffect(() => {
        if (!isLoading && !admin) {
            router.push('/admin-login');
        }
    }, [isLoading, admin, router]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await adminService.getAllUsers({
                    page: pagination.page,
                    limit: pagination.limit,
                    ...filters
                });
                setUsers(response.payload.users);
                setPagination(prev => ({
                    ...prev,
                    total: response.payload.pagination.total,
                    pages: response.payload.pagination.pages
                }));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (admin) {
            fetchUsers();
        }
    }, [admin, pagination.page, pagination.limit, filters]);

    const showConfirmDialog = (config) => {
        setDialogConfig({ ...config, isOpen: true });
    };

    const closeDialog = () => {
        setDialogConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleBanUser = async (userId) => {
        const user = users.find(u => u._id === userId);
        showConfirmDialog({
            title: 'Ban User',
            message: `Are you sure you want to ban ${user.name}? They will no longer be able to access their account.`,
            actionType: 'ban',
            onConfirm: async () => {
                try {
                    await adminService.banUser(userId);
                    const response = await adminService.getAllUsers({
                        page: pagination.page,
                        limit: pagination.limit,
                        ...filters
                    });
                    setUsers(response.payload.users);
                    closeDialog();
                } catch (error) {
                    console.error('Error banning user:', error);
                }
            }
        });
    };

    const handleUnbanUser = async (userId) => {
        const user = users.find(u => u._id === userId);
        showConfirmDialog({
            title: 'Unban User',
            message: `Are you sure you want to unban ${user.name}? They will regain access to their account.`,
            actionType: 'unban',
            onConfirm: async () => {
                try {
                    await adminService.unbanUser(userId);
                    const response = await adminService.getAllUsers({
                        page: pagination.page,
                        limit: pagination.limit,
                        ...filters
                    });
                    setUsers(response.payload.users);
                    closeDialog();
                } catch (error) {
                    console.error('Error unbanning user:', error);
                }
            }
        });
    };

    const handleDeleteUser = async (userId) => {
        const user = users.find(u => u._id === userId);
        showConfirmDialog({
            title: 'Delete User',
            message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
            actionType: 'delete',
            onConfirm: async () => {
                try {
                    await adminService.deleteUser(userId);
                    const response = await adminService.getAllUsers({
                        page: pagination.page,
                        limit: pagination.limit,
                        ...filters
                    });
                    setUsers(response.payload.users);
                    closeDialog();
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            }
        });
    };

    if (isLoading || !admin) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-users">
            <UserFilters filters={filters} setFilters={setFilters} />
            <UsersTable 
                users={users} 
                pagination={pagination}
                setPagination={setPagination}
                onBanUser={handleBanUser}
                onUnbanUser={handleUnbanUser}
                onDeleteUser={handleDeleteUser}
            />
            <ConfirmDialog 
                isOpen={dialogConfig.isOpen}
                onClose={closeDialog}
                onConfirm={dialogConfig.onConfirm}
                title={dialogConfig.title}
                message={dialogConfig.message}
                actionType={dialogConfig.actionType}
            />
        </div>
    );
} 