'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FiMinus, FiPlus, FiShoppingCart, FiStar } from 'react-icons/fi';
import { productService } from '@/services/productService';
import { useCart } from '@/contexts/CartContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ImageMagnifier from '@/components/products/ImageMagnifier';

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await productService.getProduct(slug);
                setProduct(data);
                setSelectedImage(data.thumbnailImage);
                if (data.variants?.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);
        if (variant.images?.length > 0) {
            setSelectedImage(variant.images[0]);
        }
        setQuantity(1); // Reset quantity when variant changes
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-container">{error}</div>;
    if (!product) return null;

    return (
        <main className="product-details-page">
            <div className="container">
                <div className="product-details-grid">
                    <div className="product-gallery">
                        <div className="main-image">
                            <ImageMagnifier
                                src={selectedImage || product.thumbnailImage}
                                alt={product.name}
                                width={600}
                                height={600}
                            />
                        </div>
                        <div className="image-thumbnails">
                            <button 
                                className={`thumbnail-btn ${selectedImage === product.thumbnailImage ? 'active' : ''}`}
                                onClick={() => setSelectedImage(product.thumbnailImage)}
                            >
                                <Image
                                    src={product.thumbnailImage}
                                    alt="Main product"
                                    width={100}
                                    height={100}
                                />
                            </button>
                            {selectedVariant?.images?.map((image, idx) => (
                                <button
                                    key={idx}
                                    className={`thumbnail-btn ${selectedImage === image ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <Image
                                        src={image}
                                        alt={`Variant ${idx + 1}`}
                                        width={100}
                                        height={100}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="product-info">
                        <h1 className="product-title">{product.name}</h1>
                        <div className="product-meta">
                            <div className="price-rating">
                                <span className="product-price">
                                    ${selectedVariant?.price || product.price}
                                </span>
                                <span className="product-rating">
                                    <FiStar /> {product.averageRating || 0}
                                </span>
                            </div>
                            {product.category && (
                                <span className="product-category">
                                    Category: {product.category.name}
                                </span>
                            )}
                        </div>

                        <p className="product-description">{product.description}</p>

                        {product.variants?.length > 0 && (
                            <div className="variants-section">
                                <h3>Available Variants</h3>
                                <div className="variants-list">
                                    {product.variants.map((variant, index) => (
                                        <label 
                                            key={index}
                                            className={`variant-item ${selectedVariant === variant ? 'active' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="variant"
                                                checked={selectedVariant === variant}
                                                onChange={() => handleVariantSelect(variant)}
                                                disabled={variant.quantity === 0}
                                            />
                                            <div className="variant-preview">
                                                <Image
                                                    src={variant.images[0] || product.thumbnailImage}
                                                    alt={variant.color}
                                                    width={50}
                                                    height={50}
                                                />
                                            </div>
                                            <div className="variant-details">
                                                <div className="variant-main-info">
                                                    <span className="variant-color">{variant.color}</span>
                                                    <span className="variant-size">{variant.size}</span>
                                                </div>
                                                <div className="variant-meta">
                                                    <span className="variant-price">${variant.price}</span>
                                                    {variant.quantity === 0 && (
                                                        <span className="out-of-stock">Out of Stock</span>
                                                    )}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="purchase-section">
                            <div className="quantity-selector">
                                <button 
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <FiMinus />
                                </button>
                                <span>{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    disabled={selectedVariant && quantity >= selectedVariant.quantity}
                                >
                                    <FiPlus />
                                </button>
                            </div>
                            <button 
                                className="add-to-cart-btn"
                                onClick={() => addToCart(product, selectedVariant, quantity)}
                                disabled={selectedVariant?.quantity === 0}
                            >
                                <FiShoppingCart />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
} 