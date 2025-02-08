'use client';

import { useState, useEffect, useRef } from 'react';
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
        shipping: product?.shipping || false,
        variants: product?.variants || []
    });
    const [thumbnailImage, setThumbnailImage] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [variantImages, setVariantImages] = useState({});
    const [variantPreviews, setVariantPreviews] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

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

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailImage(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleVariantImageChange = (variantIndex, e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            handleError('Maximum 5 images allowed per variant');
            return;
        }

        setVariantImages(prev => ({
            ...prev,
            [variantIndex]: files
        }));

        const previews = files.map(file => URL.createObjectURL(file));
        setVariantPreviews(prev => ({
            ...prev,
            [variantIndex]: previews
        }));
    };

    const removeVariantImage = (variantIndex, imageIndex) => {
        setVariantImages(prev => ({
            ...prev,
            [variantIndex]: prev[variantIndex].filter((_, i) => i !== imageIndex)
        }));

        setVariantPreviews(prev => ({
            ...prev,
            [variantIndex]: prev[variantIndex].filter((_, i) => i !== imageIndex)
        }));
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
        setIsLoading(true);

        try {
            if (!thumbnailImage) {
                throw new Error('Thumbnail image is required');
            }

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('shipping', formData.shipping);

            // Append thumbnail with specific name
            const thumbnailExtension = thumbnailImage.name.split('.').pop();
            const thumbnailBlob = new Blob([thumbnailImage], { type: thumbnailImage.type });
            formDataToSend.append('thumbnail', thumbnailBlob, `product-thumbnail.${thumbnailExtension}`);

            // Process variants and their images
            const variantsWithImageInfo = formData.variants.map((variant, index) => {
                const variantImagesInfo = variantImages[index]?.map((_, imgIndex) => imgIndex) || [];
                return {
                    ...variant,
                    imageIndices: variantImagesInfo
                };
            });

            formDataToSend.append('variants', JSON.stringify(variantsWithImageInfo));

            // Append variant images with specific names
            Object.entries(variantImages).forEach(([variantIndex, images]) => {
                images.forEach((image, imageIndex) => {
                    const extension = image.name.split('.').pop();
                    const blob = new Blob([image], { type: image.type });
                    formDataToSend.append(
                        'variantImages',
                        blob,
                        `product-variant-${variantIndex}-${imageIndex}.${extension}`
                    );
                });
            });

            if (product) {
                await productService.updateProduct(product.slug, formDataToSend);
            } else {
                await productService.createProduct(formDataToSend);
            }

            onSuccess();
        } catch (error) {
            handleError(error.message);
        } finally {
            setIsLoading(false);
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

            {/* Thumbnail Section */}
            <div className="form-section">
                <h3>Thumbnail Image</h3>
                <div className="thumbnail-upload">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="form-control"
                    />
                    {thumbnailPreview && (
                        <div className="thumbnail-preview">
                            <Image
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                width={200}
                                height={200}
                                className="preview-img"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setThumbnailImage(null);
                                    setThumbnailPreview('');
                                }}
                                className="remove-image"
                            >
                                <FiX />
                            </button>
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

                {formData.variants.map((variant, variantIndex) => (
                    <div key={variantIndex} className="variant-item">
                        <div className="variant-header">
                            <h4>Variant #{variantIndex + 1}</h4>
                            <button
                                type="button"
                                onClick={() => removeVariant(variantIndex)}
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
                                    onChange={(e) => handleVariantChange(variantIndex, 'color', e.target.value)}
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
                                    onChange={(e) => handleVariantChange(variantIndex, 'size', e.target.value)}
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
                                    onChange={(e) => handleVariantChange(variantIndex, 'quantity', parseInt(e.target.value))}
                                    className="form-input"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="variant-images">
                            <h4>Variant Images (Max 5)</h4>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleVariantImageChange(variantIndex, e)}
                                className="form-control"
                            />
                            <div className="image-previews">
                                {variantPreviews[variantIndex]?.map((preview, imageIndex) => (
                                    <div key={imageIndex} className="image-preview">
                                        <Image
                                            src={preview}
                                            alt={`Variant ${variantIndex} preview ${imageIndex}`}
                                            width={100}
                                            height={100}
                                            className="preview-img"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeVariantImage(variantIndex, imageIndex)}
                                            className="remove-image"
                                        >
                                            <FiX />
                                        </button>
                                    </div>
                                ))}
                            </div>
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
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
} 