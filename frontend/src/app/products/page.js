'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import { productService } from '@/services/productService';

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const fetchProducts = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await productService.getAllProducts({
                page,
                limit: 12,
                search: searchParams.get('search') || '',
                category: searchParams.get('category') || ''
            });
            setProducts(response.products);
            setPagination({
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                hasNextPage: response.hasNextPage,
                hasPreviousPage: response.hasPreviousPage
            });
        } catch (err) {
            setError(err.message || 'Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(pagination.currentPage);
    }, [searchParams]);

    const handlePageChange = (newPage) => {
        fetchProducts(newPage);
    };

    return (
        <main className="products-page">
            <div className="container">
                <header className="page-header">
                    <h1 className="page-title">All Products</h1>
                    <p className="page-subtitle">Explore our wide range of products</p>
                </header>

                <ProductGrid
                    products={products}
                    isLoading={isLoading}
                    error={error}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                />
            </div>
        </main>
    );
}
