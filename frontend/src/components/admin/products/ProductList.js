'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { FiBox, FiTag, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ProductList({ products, isLoading, pagination, onPageChange, onProductClick }) {
    useEffect(() => {
        const descriptions = document.querySelectorAll('.product-description');
        descriptions.forEach(desc => {
            if (desc.scrollHeight > desc.clientHeight) {
                desc.classList.add('truncated');
            } else {
                desc.classList.remove('truncated');
            }
        });
    }, [products]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="product-list">
            <div className="products-grid">
                {products.map((product) => (
                    <div 
                        key={product._id} 
                        className="product-card"
                        onClick={() => onProductClick(product.slug)}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="product-image">
                            <Image
                                src={product.thumbnailImage}
                                alt={product.name}
                                width={200}
                                height={200}
                                className="thumbnail"
                            />
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-description">{product.description}</p>
                            <div className="product-meta">
                                <span className="price">
                                    <FiTag /> ${product.price}
                                </span>
                                <span className="variants">
                                    <FiBox /> {product.variants?.length || 0} Variants
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    disabled={!pagination.previousPage}
                    className="btn btn-icon"
                >
                    <FiChevronLeft />
                </button>
                <span className="page-info">
                    Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    disabled={!pagination.nextPage}
                    className="btn btn-icon"
                >
                    <FiChevronRight />
                </button>
            </div>
        </div>
    );
} 