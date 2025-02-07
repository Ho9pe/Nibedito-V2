'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';
import CategoryList from '@/components/admin/categories/CategoryList';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import CategoryStats from '@/components/admin/categories/CategoryStats';
import { categoryService } from '@/services/categoryService';
import CategoryTester from '@/components/admin/categories/CategoryTester';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import Error from '@/components/common/Error';

export default function CategoriesPage() {
    const router = useRouter();
    const { admin, isLoading } = useAdminAuth();
    const [isAddMode, setIsAddMode] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    useEffect(() => {
        if (!isLoading && !admin) {
            router.push('/admin/login');
        }
    }, [admin, isLoading, router]);

    const fetchCategories = async () => {
        try {
            setIsLoadingCategories(true);
            const data = await categoryService.getAllCategories();
            setCategories(data.categories);
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
        fetchCategories();
    }, []);

    const clearStatus = () => {
        setStatus({ type: '', message: '' });
    };

    useEffect(() => {
        if (status.message) {
            const timer = setTimeout(clearStatus, 5000); // Clear message after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleUpdateSuccess = async (message, updatedCategories = null) => {
        if (updatedCategories) {
            // If we have updated categories, use them directly
            setCategories(updatedCategories);
        } else {
            // Otherwise fetch fresh data
            try {
                setIsLoadingCategories(true);
                const data = await categoryService.getAllCategories();
                setCategories(data.categories);
            } catch (error) {
                handleError(error.message);
            } finally {
                setIsLoadingCategories(false);
            }
        }
        
        setStatus({
            type: 'success',
            message: message || 'Operation completed successfully'
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleError = (message) => {
        setStatus({
            type: 'error',
            message: message || 'An error occurred'
        });
        // Ensure error message is visible
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading || !admin) {
        return null;
    }

    return (
        <div className="admin-categories">
            <div className="admin-header">
                <h1>Category Management</h1>
                <button 
                    className="btn btn-primary"
                    onClick={() => {
                        setIsAddMode(!isAddMode);
                        clearStatus();
                    }}
                >
                    {isAddMode ? 'Cancel' : 'Add New Category'}
                </button>
            </div>

            {status.message && (
                <Error 
                    type={status.type}
                    message={status.message}
                    onClose={clearStatus}
                />
            )}

            {!isAddMode && !isLoadingCategories && (
                <CategoryStats categories={categories} />
            )}

            {isAddMode && (
                <CategoryForm 
                    onSuccess={(category) => {
                        setIsAddMode(false);
                        handleUpdateSuccess('Category created successfully');
                    }}
                    onError={handleError}
                />
            )}

            <CategoryList 
                categories={categories}
                isLoading={isLoadingCategories}
                onUpdateSuccess={handleUpdateSuccess}
                onError={handleError}
            />

            <CategoryTester />
        </div>
    );
} 