'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiX, FiUpload, FiPlus, FiTrash2, FiImage } from 'react-icons/fi';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Error from '@/components/common/Error';

export default function ProductForm({ product, onSuccess, onError, onCancel }) {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        category: product?.category?._id || '',
        shipping: product?.shipping ?? true,
        variants: product?.variants || []
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [error, setError] = useState('');

    const handleError = (message) => {
        setError(message);
        onError(message);
        // Scroll to top smoothly when error occurs
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAllCategories();
                setCategories(response.categories);
            } catch (error) {
                handleError('Failed to load categories');
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
        
        // Create preview URLs
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previewImages[index]);
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...formData.variants];
        updatedVariants[index] = {
            ...updatedVariants[index],
            [field]: value
        };
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { color: '', size: '', quantity: 0, images: [], imageIndices: [] }]
        }));
    };

    const removeVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Debug token
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        try {
            // Validation checks
            if (!formData.name.trim()) throw new Error('Product name is required');
            if (!formData.description.trim()) throw new Error('Description is required');
            if (!formData.price || formData.price <= 0) throw new Error('Valid price is required');
            if (!formData.category) throw new Error('Category is required');
            if (!images.length) throw new Error('At least one image is required');

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name.trim());
            formDataToSend.append('description', formData.description.trim());
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('shipping', formData.shipping);

            // Handle variants
            if (formData.variants.length > 0) {
                const variantsWithImages = formData.variants.map(variant => ({
                    color: variant.color,
                    size: variant.size,
                    quantity: Number(variant.quantity),
                    imageIndices: variant.imageIndices || []
                }));
                formDataToSend.append('variants', JSON.stringify(variantsWithImages));
            }

            // Append images
            images.forEach((image, index) => {
                formDataToSend.append('image', image);
            });

            console.log('FormData contents:');
            for (let pair of formDataToSend.entries()) {
                console.log(pair[0], pair[1]);
            }

            let response;
            if (product) {
                response = await productService.updateProduct(product.slug, formDataToSend);
            } else {
                response = await productService.createProduct(formDataToSend);
            }

            onSuccess(response);
        } catch (error) {
            console.error('Error details:', error);
            handleError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingCategories) return <LoadingSpinner />;

    return (
        <form onSubmit={handleSubmit} className="product-form">
            {error && (
                <div className="form-error-container">
                    <Error 
                        type="error"
                        message={error}
                        onClose={() => setError('')}
                    />
                </div>
            )}
            {/* Basic Information */}
            <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter product name"
                        required
                        minLength={3}
                        maxLength={300}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-textarea"
                        placeholder="Enter product description"
                        required
                        minLength={10}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="form-input"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="form-select"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="shipping"
                            checked={formData.shipping}
                            onChange={handleInputChange}
                        />
                        Available for Shipping
                    </label>
                </div>
            </div>

            {/* Images Section */}
            <div className="form-section">
                <h3>Product Images</h3>
                <div className="image-upload-section">
                    <label htmlFor="images" className="image-upload-container">
                        <input
                            type="file"
                            id="images"
                            onChange={handleImageChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                        <div className="upload-placeholder">
                            <FiUpload className="upload-icon" />
                            <span>Click to upload images</span>
                        </div>
                    </label>

                    {previewImages.length > 0 && (
                        <div className="image-previews">
                            {previewImages.map((preview, index) => (
                                <div key={index} className="image-preview">
                                    <Image
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        width={100}
                                        height={100}
                                        className="preview-img"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="remove-image"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Variants Section */}
            <div className="form-section">
                <div className="section-header">
                    <h3>Product Variants</h3>
                    <button
                        type="button"
                        onClick={addVariant}
                        className="btn btn-secondary btn-sm"
                    >
                        <FiPlus /> Add Variant
                    </button>
                </div>

                {formData.variants.map((variant, index) => (
                    <div key={index} className="variant-form">
                        <div className="variant-header">
                            <h4>Variant #{index + 1}</h4>
                            <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="btn btn-icon btn-danger"
                            >
                                <FiTrash2 />
                            </button>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Color</label>
                                <input
                                    type="text"
                                    value={variant.color}
                                    onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                    className="form-input"
                                    placeholder="Enter color"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Size</label>
                                <input
                                    type="text"
                                    value={variant.size}
                                    onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                    className="form-input"
                                    placeholder="Enter size"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    value={variant.quantity}
                                    onChange={(e) => handleVariantChange(index, 'quantity', parseInt(e.target.value))}
                                    className="form-input"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="variant-images">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    const startIndex = images.length;
                                    handleImageChange(e);
                                    const imageIndices = Array.from(e.target.files).map((_, i) => startIndex + i);
                                    handleVariantChange(index, 'imageIndices', imageIndices);
                                }}
                            />
                        </div>
                    </div>
                ))}
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
                    {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
} 