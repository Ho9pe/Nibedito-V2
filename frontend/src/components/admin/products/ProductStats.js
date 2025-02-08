import { FiBox, FiDollarSign, FiPackage, FiGrid } from 'react-icons/fi';

export default function ProductStats({ totalStats }) {
    const stats = [
        {
            title: 'Total Products',
            value: totalStats.totalProducts,
            icon: <FiBox />,
            color: 'blue'
        },
        {
            title: 'Total Value',
            value: `$${totalStats.totalValue.toLocaleString()}`,
            icon: <FiDollarSign />,
            color: 'green'
        },
        {
            title: 'Total Variants',
            value: totalStats.totalVariants,
            icon: <FiPackage />,
            color: 'purple'
        },
        {
            title: 'Active Categories',
            value: totalStats.activeCategories,
            icon: <FiGrid />,
            color: 'orange'
        }
    ];

    return (
        <div className="stats-container">
            {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                    <div className={`stat-icon stat-${stat.color}`}>
                        {stat.icon}
                    </div>
                    <div className="stat-content">
                        <p className="stat-title">{stat.title}</p>
                        <h3 className="stat-value">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
} 