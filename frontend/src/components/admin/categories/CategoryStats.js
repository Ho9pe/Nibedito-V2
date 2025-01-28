'use client';

import { FiBox, FiActivity, FiCalendar } from 'react-icons/fi';

export default function CategoryStats({ categories }) {
    const totalCategories = categories?.length || 0;
    const activeCategories = categories?.filter(cat => cat.isActive !== false).length || 0;
    const totalProducts = categories?.reduce((sum, cat) => sum + (cat.productCount || 0), 0) || 0;

    return (
        <div className="category-stats-grid">
            <div className="stat-card">
                <div className="stat-icon">
                    <FiBox size={24} color="white" />
                </div>
                <div className="stat-content">
                    <h3>Total Categories</h3>
                    <p>{totalCategories}</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">
                    <FiActivity size={24} color="white" />
                </div>
                <div className="stat-content">
                    <h3>Active Categories</h3>
                    <p>{activeCategories}</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">
                    <FiCalendar size={24} color="white" />
                </div>
                <div className="stat-content">
                    <h3>Total Products</h3>
                    <p>{totalProducts}</p>
                </div>
            </div>
        </div>
    );
} 