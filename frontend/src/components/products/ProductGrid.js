'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ProductGrid({ products, isLoading, error, pagination, onPageChange }) {
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="empty-container">
                <p className="empty-message">No products found</p>
            </div>
        );
    }

    return (
        <div className="products-section">
            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
            
            {pagination && (
                <div className="pagination">
                    <button 
                        className="pagination-btn"
                        disabled={!pagination.previousPage}
                        onClick={() => onPageChange(pagination.previousPage)}
                    >
                        <FiChevronLeft />
                        Previous
                    </button>
                    
                    <span className="pagination-info">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button 
                        className="pagination-btn"
                        disabled={!pagination.nextPage}
                        onClick={() => onPageChange(pagination.nextPage)}
                    >
                        Next
                        <FiChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}
