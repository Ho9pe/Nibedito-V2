'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';
import CategoryList from '@/components/admin/categories/CategoryList';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import CategoryStats from '@/components/admin/categories/CategoryStats';
import Error from '@/components/common/Error';
import { categoryService } from '@/services/categoryService';

export default function CategoriesPage() {
    const router = useRouter();
    const { admin, isLoading } = useAdminAuth();
    const [isAddMode, setIsAddMode] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const fetchCategories = async () => {
        try {
            setIsLoadingCategories(true);
            const data = await categoryService.getAllCategories();
            if (data && data.categories) {
                setCategories(data.categories);
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.message || 'Failed to fetch categories'
            });
        } finally {
            setIsLoadingCategories(false);
        }
    };

    useEffect(() => {
        if (!isLoading && !admin) {
            router.push('/admin-login');
        } else if (admin) {
            fetchCategories();
        }
    }, [isLoading, admin, router]);

    if (isLoading || !admin) {
        return <div className="admin-loading">Loading...</div>;
    }

    return (
        <div className="admin-categories">
            <div className="admin-header">
                <h1>Category Management</h1>
                <button 
                    className="btn btn-primary"
                    onClick={() => setIsAddMode(!isAddMode)}
                >
                    {isAddMode ? 'Cancel' : 'Add New Category'}
                </button>
            </div>

            {!isAddMode && !isLoadingCategories && (
                <CategoryStats categories={categories} />
            )}

            {status.message && (
                <Error 
                    type={status.type}
                    message={status.message}
                    className="mb-4"
                />
            )}

            {isAddMode && (
                <CategoryForm 
                    onSuccess={(category) => {
                        setIsAddMode(false);
                        fetchCategories();
                        setStatus({
                            type: 'success',
                            message: 'Category created successfully'
                        });
                    }}
                    onError={(message) => {
                        setStatus({
                            type: 'error',
                            message: message || 'Failed to create category'
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            )}

            <CategoryList 
                categories={categories}
                isLoading={isLoadingCategories}
                onUpdateSuccess={(message) => {
                    fetchCategories();
                    setStatus({
                        type: 'success',
                        message: message || 'Category updated successfully'
                    });
                }}
                onError={(message) => {
                    setStatus({
                        type: 'error',
                        message
                    });
                }}
            />
        </div>
    );
} 