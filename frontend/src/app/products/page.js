'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiGrid, FiList, FiFilter } from 'react-icons/fi';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilter';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterVisible, setIsFilterVisible] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        category: '',
        sort: 'newest'
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
    });
    const [categories, setCategories] = useState([]);

    const fetchProducts = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await productService.getAllProducts({
                page,
                limit: 12,
                search: searchParams.get('search') || '',
                category: filters.category || '',
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                sort: filters.sort
            });
            
            setProducts(response.payload.products);
            setPagination({
                currentPage: response.payload.currentPage,
                totalPages: response.payload.totalPages,
                hasNextPage: response.payload.hasNextPage,
                hasPreviousPage: response.payload.hasPreviousPage
            });
        } catch (err) {
            setError(err.message || 'Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(1);
    }, [searchParams, filters]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const activeCategories = await categoryService.getActiveCategories();
                console.log('Fetched categories:', activeCategories);
                setCategories(activeCategories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        fetchProducts(1);
    };

    const handlePageChange = (newPage) => {
        fetchProducts(newPage);
    };

    return (
        <main className="products-page">
            <div className="products-container">
                <header className="products-header">
                    <div className="header-content">
                        <h1 className="page-title">Our Products</h1>
                        {searchParams.get('search') && (
                            <p className="search-results">
                                Search results for: "{searchParams.get('search')}"
                            </p>
                        )}
                    </div>
                    <div className="view-controls">
                        <button 
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <FiGrid />
                        </button>
                        <button 
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <FiList />
                        </button>
                        <button 
                            className="filter-toggle-btn"
                            onClick={() => setIsFilterVisible(!isFilterVisible)}
                        >
                            <FiFilter />
                            Filters
                        </button>
                    </div>
                </header>
                <div className={`products-layout ${isFilterVisible ? 'with-filters' : 'no-filters'}`}>
                    {isFilterVisible && (
                        <aside className="filters-sidebar">
                            <ProductFilters 
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                categories={categories}
                            />
                        </aside>
                    )}

                    <section className={`products-content ${viewMode}`}>
                        <ProductGrid
                            products={products}
                            isLoading={isLoading}
                            error={error}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            viewMode={viewMode}
                        />
                    </section>
                </div>
            </div>
        </main>
    );
}
