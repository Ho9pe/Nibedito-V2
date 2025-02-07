import { FiBox, FiDollarSign, FiPackage, FiGrid } from 'react-icons/fi';

export default function ProductStats({ products = [], totalStats = {} }) {
    const stats = {
        totalProducts: totalStats.totalProducts || 0,
        totalValue: totalStats.totalValue || 0,
        totalVariants: totalStats.totalVariants || 0,
        activeCategories: totalStats.activeCategories || 0
    };

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-icon">
                    <FiBox />
                </div>
                <div className="stat-content">
                    <h3>Total Products</h3>
                    <p>{stats.totalProducts}</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">
                    <FiDollarSign />
                </div>
                <div className="stat-content">
                    <h3>Total Value</h3>
                    <p>${stats.totalValue.toFixed(2)}</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">
                    <FiPackage />
                </div>
                <div className="stat-content">
                    <h3>Total Variants</h3>
                    <p>{stats.totalVariants}</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">
                    <FiGrid />
                </div>
                <div className="stat-content">
                    <h3>Categories Used</h3>
                    <p>{stats.activeCategories}</p>
                </div>
            </div>
        </div>
    );
} 