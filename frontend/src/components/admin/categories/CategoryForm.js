'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiUpload, FiX } from 'react-icons/fi';
import { categoryService } from '@/services/categoryService';

export default function CategoryForm({ category, onSuccess, onError, onCancel }) {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || '',
        image: null
    });
    const [preview, setPreview] = useState(category?.image || null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            onError('Image size should be less than 2MB');
            return;
        }

        setFormData(prev => ({ ...prev, image: file }));
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.name.trim()) {
                throw new Error('Category name is required');
            }

            if (!formData.description.trim()) {
                throw new Error('Category description is required');
            }

            if (!category && !formData.image) {
                throw new Error('Category image is required');
            }

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name.trim());
            formDataToSend.append('description', formData.description.trim());
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            let response;
            if (category) {
                response = await categoryService.updateCategory(category.slug, formDataToSend);
            } else {
                response = await categoryService.createCategory(formDataToSend);
            }

            if (response && response.category) {
                onSuccess(response.category);
                // Cleanup preview URL
                if (preview) {
                    URL.revokeObjectURL(preview);
                }
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Category submission error:', error);
            onError(error.message || 'Failed to save category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
                <label htmlFor="name">Category Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Enter category name"
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="form-textarea"
                    placeholder="Enter category description"
                />
            </div>

            <div className="form-group">
                <label htmlFor="image">Category Image</label>
                <label htmlFor="image" className="image-upload-container">
                    {preview ? (
                        <div className="image-preview">
                            <Image
                                src={preview}
                                alt="Preview"
                                width={200}
                                height={200}
                                className="preview-img"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setPreview(null);
                                    setFormData(prev => ({ ...prev, image: null }));
                                }}
                                className="remove-image"
                            >
                                <FiX />
                            </button>
                        </div>
                    ) : (
                        <div className="upload-placeholder">
                            <input
                                type="file"
                                id="image"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <FiUpload className="upload-icon" />
                            <span>Click to upload image</span>
                        </div>
                    )}
                </label>
            </div>

            <div className="form-actions">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
                </button>
            </div>
        </form>
    );
} 