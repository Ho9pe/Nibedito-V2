'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryHeader from '@/components/categories/CategoryHeader';
import CategoryFilters from '@/components/categories/CategoryFilters';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';

export default function CategoryPage() {
    const { slug } = useParams();
    const searchParams = useSearchParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setIsLoading(true);
                const categoryData = await categoryService.getCategory(slug);
                setCategory(categoryData);

                const productsData = await productService.getProductsByCategory(slug, {
                    search: searchParams.get('search') || '',
                    sort: searchParams.get('sort') || 'newest',
                    minPrice: searchParams.get('minPrice'),
                    maxPrice: searchParams.get('maxPrice')
                });
                setProducts(productsData.products);
            } catch (err) {
                setError(err.message || 'Failed to fetch category data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryData();
    }, [slug, searchParams]);

    return (
        <main className="category-page">
            <div className="container">
                <CategoryHeader
                    category={category}
                    isLoading={isLoading}
                    productCount={products.length}
                />
                <CategoryFilters />
                <ProductGrid
                    products={products}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </main>
    );
}
