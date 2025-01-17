'use client';

import { FiSearch, FiFilter, FiRotateCcw } from 'react-icons/fi';

export default function UserFilters({ filters, setFilters }) {
    const handleSearch = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, filter: e.target.value }));
    };

    const handleSortChange = (e) => {
        setFilters(prev => ({ ...prev, sortBy: e.target.value }));
    };

    const handleOrderChange = (e) => {
        setFilters(prev => ({ ...prev, order: e.target.value }));
    };

    const handleReset = () => {
        setFilters({
            search: '',
            filter: 'all',
            sortBy: 'createdAt',
            order: 'desc'
        });
    };

    return (
        <div className="user-filters">
            <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={filters.search}
                    onChange={handleSearch}
                />
            </div>

            <div className="filter-group">
                <select value={filters.filter} onChange={handleFilterChange}>
                    <option value="all">All Users</option>
                    <option value="active">Active Users</option>
                    <option value="banned">Banned Users</option>
                </select>

                <select value={filters.sortBy} onChange={handleSortChange}>
                    <option value="createdAt">Join Date</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                </select>

                <select value={filters.order} onChange={handleOrderChange}>
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>

                <button onClick={handleReset} className="reset-btn">
                    <FiRotateCcw />
                    Reset
                </button>
            </div>
        </div>
    );
} 