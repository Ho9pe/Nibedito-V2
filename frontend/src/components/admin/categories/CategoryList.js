'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiCheck, FiX, FiBox } from 'react-icons/fi';
import { categoryService } from '@/services/categoryService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CategoryForm from './CategoryForm';

export default function CategoryList({ categories, isLoading, onUpdateSuccess, onError }) {
    const [editingCategory, setEditingCategory] = useState(null);

    const handleDelete = async (slug) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        
        try {
            await categoryService.deleteCategory(slug);
            onUpdateSuccess('Category deleted successfully');
        } catch (error) {
            onError(error.message);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="category-list">
            {categories.map(category => (
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
                                        <div className="status-badge-wrapper">
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
                                            onClick={() => handleDelete(category.slug)}
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
        </div>
    );
} 