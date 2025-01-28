'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

export default function CategoryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' }
    ];

    const handleSortChange = (e) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', e.target.value);
        router.push(`?${params.toString()}`);
    };

    const handlePriceFilter = (min, max) => {
        const params = new URLSearchParams(searchParams);
        params.set('minPrice', min);
        params.set('maxPrice', max);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="category-filters">
            <div className="filter-group">
                <div className="filter-header">
                    <FiFilter />
                    <span>Filters</span>
                </div>
                <div className="price-filter">
                    <label>Price Range</label>
                    <div className="price-inputs">
                        <input
                            type="number"
                            placeholder="Min"
                            onChange={(e) => handlePriceFilter(e.target.value, searchParams.get('maxPrice'))}
                            value={searchParams.get('minPrice') || ''}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            onChange={(e) => handlePriceFilter(searchParams.get('minPrice'), e.target.value)}
                            value={searchParams.get('maxPrice') || ''}
                        />
                    </div>
                </div>
            </div>

            <div className="sort-group">
                <label>Sort by</label>
                <div className="select-wrapper">
                    <select
                        value={searchParams.get('sort') || 'newest'}
                        onChange={handleSortChange}
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <FiChevronDown className="select-icon" />
                </div>
            </div>
        </div>
    );
}
