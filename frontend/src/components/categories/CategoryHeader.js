'use client';

import Image from 'next/image';
import { FiBox } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';

export default function CategoryHeader({ category, isLoading, productCount }) {
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!category) {
        return null;
    }

    return (
        <header className="category-header">
            <div className="category-banner">
                {category.image && (
                    <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="category-banner-img"
                        sizes="100vw"
                        priority
                    />
                )}
                <div className="category-banner-overlay">
                    <h1 className="category-title">{category.name}</h1>
                    <p className="category-description">{category.description}</p>
                    <div className="category-stats">
                        <FiBox />
                        <span>{productCount} Products</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
