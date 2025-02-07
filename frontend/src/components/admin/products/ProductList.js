'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiBox, FiTag } from 'react-icons/fi';
import { productService } from '@/services/productService';
import ProductForm from './ProductForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmDialog from '@/components/common/ConfirmDialog';

export default function ProductList({ products, isLoading, pagination, onPageChange, onUpdateSuccess, onError }) {
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (slug) => {
        try {
            if (!confirm('Are you sure you want to delete this product?')) {
                return;
            }
            
            setIsDeleting(true);
            await productService.deleteProduct(slug);
            onUpdateSuccess('Product deleted successfully');
        } catch (error) {
            onError(error.message || 'Failed to delete product');
        } finally {
            setIsDeleting(false);
            setDeletingProduct(null);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="admin-products-list">
            {editingProduct && (
                <div className="edit-form-container">
                    <h2>Edit Product</h2>
                    <ProductForm
                        product={editingProduct}
                        onSuccess={(product) => {
                            setEditingProduct(null);
                            onUpdateSuccess('Product updated successfully');
                        }}
                        onError={(message) => {
                            onError(message);
                        }}
                        onCancel={() => setEditingProduct(null)}
                    />
                </div>
            )}

            <div className="products-grid">
                {products.map((product) => (
                    <div key={product._id} className="product-card">
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
                                <span className="product-price">
                                    <FiTag size={16} />
                                    ${product.price}
                                </span>
                                <span className="variant-count">
                                    <FiBox size={16} />
                                    {product.variants?.length || 0} Variants
                                </span>
                            </div>
                            <div className="category-badge">
                                <span className="category-name">
                                    {product.category?.name || 'Uncategorized'}
                                </span>
                            </div>
                            <div className="product-actions">
                                <button
                                    onClick={() => setEditingProduct(product)}
                                    className="btn btn-icon"
                                    title="Edit product"
                                >
                                    <FiEdit2 size={18} />
                                </button>
                                <button
                                    onClick={() => setDeletingProduct(product)}
                                    className="btn btn-icon btn-danger"
                                    title="Delete product"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {pagination && (
                <div className="pagination">
                    <button
                        className="btn"
                        disabled={!pagination.previousPage}
                        onClick={() => onPageChange(pagination.previousPage)}
                    >
                        Previous
                    </button>
                    <span>
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                        className="btn"
                        disabled={!pagination.nextPage}
                        onClick={() => onPageChange(pagination.nextPage)}
                    >
                        Next
                    </button>
                </div>
            )}

            {deletingProduct && (
                <ConfirmDialog
                    title="Delete Product"
                    message={`Are you sure you want to delete ${deletingProduct.name}?`}
                    isLoading={isDeleting}
                    onConfirm={() => handleDelete(deletingProduct.slug)}
                    onCancel={() => setDeletingProduct(null)}
                />
            )}
        </div>
    );
} 