'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FiMinus, FiPlus, FiShoppingCart, FiStar } from 'react-icons/fi';
import { productService } from '@/services/productService';
import { useCart } from '@/contexts/CartContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await productService.getProduct(slug);
                setProduct(data);
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

    const handleAddToCart = async () => {
        const success = await addToCart(
            product._id,
            quantity,
            selectedVariant?._id
        );
        if (success) {
            // Show success message
        }
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
                            <Image
                                src={product.thumbnailImage}
                                alt={product.name}
                                width={600}
                                height={600}
                                priority
                            />
                        </div>
                        {/* Additional images grid */}
                    </div>

                    <div className="product-info">
                        <h1 className="product-title">{product.name}</h1>
                        <div className="product-meta">
                            <span className="product-price">${product.price}</span>
                            <span className="product-rating">
                                <FiStar /> {product.averageRating}
                            </span>
                        </div>
                        <p className="product-description">{product.description}</p>

                        {product.variants?.length > 0 && (
                            <div className="variant-selector">
                                {/* Variant selection UI */}
                            </div>
                        )}

                        <div className="quantity-selector">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="quantity-btn"
                            >
                                <FiMinus />
                            </button>
                            <span>{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="quantity-btn"
                            >
                                <FiPlus />
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="btn btn-primary btn-add-to-cart"
                        >
                            <FiShoppingCart />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
} 