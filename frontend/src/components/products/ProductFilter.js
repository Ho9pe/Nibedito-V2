'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiFilter, FiChevronDown, FiChevronRight, FiX } from 'react-icons/fi';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default function ProductFilter({ filters, onFilterChange, categories }) {
    const [expandedSections, setExpandedSections] = useState({});
    const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Initialize price range from filters
        if (filters.minPrice || filters.maxPrice) {
            setPriceRange([
                Number(filters.minPrice) || 0,
                Number(filters.maxPrice) || 1000
            ]);
        }
    }, [filters.minPrice, filters.maxPrice]);

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'popular', label: 'Most Popular' }
    ];

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handlePriceRangeChange = (values) => {
        setPriceRange(values);
        // Debounce the filter change to prevent too many updates
        const timeoutId = setTimeout(() => {
            onFilterChange({
                minPrice: values[0],
                maxPrice: values[1]
            });
        }, 300);
        return () => clearTimeout(timeoutId);
    };

    const handleSortChange = (value) => {
        onFilterChange({ sort: value });
    };

    const handleCategorySelect = (categoryId) => {
        onFilterChange({ category: categoryId });
    };

    const clearFilters = () => {
        setPriceRange([0, 1000]);
        onFilterChange({
            minPrice: '',
            maxPrice: '',
            sort: 'newest',
            category: ''
        });
    };

    return (
        <div className="product-filters">
            <div className="filters-header">
                <div className="filters-title">
                    <FiFilter />
                    <h3>Filters</h3>
                </div>
                {(filters.minPrice || filters.maxPrice || filters.sort !== 'newest' || filters.category) && (
                    <button className="clear-filters" onClick={clearFilters}>
                        <FiX />
                        Clear All
                    </button>
                )}
            </div>

            <div className="filter-sections">
                {/* Price Range Section */}
                <div className="filter-section">
                    <button 
                        className="section-header" 
                        onClick={() => toggleSection('price')}
                    >
                        {expandedSections.price ? <FiChevronDown /> : <FiChevronRight />}
                        <h4>Price Range</h4>
                    </button>
                    {expandedSections.price && (
                        <div className="section-content">
                            <div className="price-slider">
                                <Slider
                                    range
                                    min={0}
                                    max={1000}
                                    value={priceRange}
                                    onChange={handlePriceRangeChange}
                                />
                                <div className="price-range-values">
                                    <span>${priceRange[0]}</span>
                                    <span>${priceRange[1]}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sort Section */}
                <div className="filter-section">
                    <button 
                        className="section-header" 
                        onClick={() => toggleSection('sort')}
                    >
                        {expandedSections.sort ? <FiChevronDown /> : <FiChevronRight />}
                        <h4>Sort By</h4>
                    </button>
                    {expandedSections.sort && (
                        <div className="section-content">
                            <div className="sort-options">
                                {sortOptions.map(option => (
                                    <button
                                        key={option.value}
                                        className={`sort-option ${filters.sort === option.value ? 'active' : ''}`}
                                        onClick={() => handleSortChange(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Categories Section */}
                {categories && categories.length > 0 && (
                    <div className="filter-section">
                        <button 
                            className="section-header" 
                            onClick={() => toggleSection('categories')}
                        >
                            {expandedSections.categories ? <FiChevronDown /> : <FiChevronRight />}
                            <h4>Categories</h4>
                        </button>
                        {expandedSections.categories && (
                            <div className="section-content">
                                <div className="category-options">
                                    {categories.map(category => (
                                        <button
                                            key={category._id}
                                            className={`category-option ${filters.category === category._id ? 'active' : ''}`}
                                            onClick={() => handleCategorySelect(category._id)}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
