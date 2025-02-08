'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiBox, FiTag, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { productService } from '@/services/productService';
import ProductForm from './ProductForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmDialog from '@/components/common/ConfirmDialog';

export default function ProductList({ products, isLoading, pagination, onPageChange, onUpdateSuccess, onError }) {
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        // Check for text truncation and add class accordingly
        const descriptions = document.querySelectorAll('.product-description');
        descriptions.forEach(desc => {
            if (desc.scrollHeight > desc.clientHeight) {
                desc.classList.add('truncated');
            } else {
                desc.classList.remove('truncated');
            }
        });
    }, [products]);

    const handleDelete = async () => {
        try {
            await productService.deleteProduct(deletingProduct.slug);
            onUpdateSuccess('Product deleted successfully');
            setShowDeleteDialog(false);
            setDeletingProduct(null);
        } catch (error) {
            onError(error.message);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="product-list">
            {editingProduct ? (
                <ProductForm
                    product={editingProduct}
                    onSuccess={() => {
                        setEditingProduct(null);
                        onUpdateSuccess();
                    }}
                    onError={onError}
                    onCancel={() => setEditingProduct(null)}
                />
            ) : (
                <>
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
                                        <span className="price">
                                            <FiTag /> ${product.price}
                                        </span>
                                        <span className="variants">
                                            <FiBox /> {product.variants?.length || 0} Variants
                                        </span>
                                    </div>
                                    <div className="product-actions">
                                        <button
                                            onClick={() => setEditingProduct(product)}
                                            className="btn btn-icon btn-edit"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeletingProduct(product);
                                                setShowDeleteDialog(true);
                                            }}
                                            className="btn btn-icon btn-delete"
                                        >
                                            <FiTrash2 />
                                        </button>
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
                </>
            )}

            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDeleteDialog(false);
                    setDeletingProduct(null);
                }}
            />
        </div>
    );
} 