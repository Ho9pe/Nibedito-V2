'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiCheck, FiX, FiBox } from 'react-icons/fi';
import { categoryService } from '@/services/categoryService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CategoryForm from './CategoryForm';
import ConfirmDialog from '@/components/common/ConfirmDialog';

export default function CategoryList({ categories, isLoading, onUpdateSuccess, onError }) {
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;
        
        try {
            setDeletingCategory(categoryToDelete.slug);
            const response = await categoryService.deleteCategory(categoryToDelete.slug);
            if (response.statusCode === 200) {
                await onUpdateSuccess(response.message || 'Category deleted successfully');
            } else {
                throw new Error(response.message || 'Failed to delete category');
            }
        } catch (error) {
            onError(error.message);
        } finally {
            setDeletingCategory(null);
            setShowDeleteDialog(false);
            setCategoryToDelete(null);
        }
    };

    const handleStatusToggle = async (category) => {
        try {
            const formData = new FormData();
            formData.append('isActive', !category.isActive);
            
            const response = await categoryService.updateCategory(category.slug, formData);
            if (response.statusCode === 200) {
                onUpdateSuccess('Category status updated successfully');
            }
        } catch (error) {
            onError(error.message);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="category-list">
            {categories
                .filter(category => category.slug !== deletingCategory)
                .map(category => (
                    <div key={category._id} className="category-item">
                        {editingCategory?.slug === category.slug ? (
                            <CategoryForm 
                                category={category}
                                onSuccess={() => {
                                    setEditingCategory(null);
                                    onUpdateSuccess();
                                }}
                                onError={onError}
                                onCancel={() => setEditingCategory(null)}
                            />
                        ) : (
                            <div className="category-content">
                                <div className="category-image-admin">
                                    {category.image ? (
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            width={120}
                                            height={120}
                                            className="category-thumb"
                                        />
                                    ) : (
                                        <div className="category-image-placeholder">
                                            {category.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="category-info">
                                    <div className="category-header">
                                        <div className="category-title">
                                            <h3>{category.name}</h3>
                                            <div className="status-badge-wrapper" onClick={() => handleStatusToggle(category)}>
                                                {category.isActive ? (
                                                    <span className="status-badge active">
                                                        <FiCheck size={14} />
                                                        <span>Active</span>
                                                    </span>
                                                ) : (
                                                    <span className="status-badge inactive">
                                                        <FiX size={14} />
                                                        <span>Inactive</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="category-description">{category.description}</p>
                                    <div className="category-footer">
                                        <span className="product-count">
                                            <FiBox size={16} />
                                            {category.productCount || 0} Products
                                        </span>
                                        <div className="category-actions">
                                            <button
                                                onClick={() => setEditingCategory(category)}
                                                className="btn btn-icon"
                                                title="Edit category"
                                            >
                                                <FiEdit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(category)}
                                                className="btn btn-icon btn-danger"
                                                title="Delete category"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            <ConfirmDialog 
                isOpen={showDeleteDialog}
                title="Delete Category"
                message={categoryToDelete ? 
                    `Are you sure you want to delete "${categoryToDelete.name}"? This action cannot be undone.` :
                    'Are you sure you want to delete this category?'
                }
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    setShowDeleteDialog(false);
                    setCategoryToDelete(null);
                }}
            />
        </div>
    );
} 