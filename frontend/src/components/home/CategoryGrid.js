'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { categoryService } from '@/services/categoryService';

export default function CategoryGrid() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const activeCategories = await categoryService.getActiveCategories();
                setCategories(activeCategories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (isLoading) {
        return <div>Loading categories...</div>;
    }

    return (
        <section className="categories-section">
            <div className="section-header">
                <h2 className="section-title">Shop by <span className="highlight">Category</span></h2>
                <p className="section-subtitle">Explore our wide range of collections</p>
            </div>
            <div className="category-grid">
                {categories.map((category) => (
                    <Link 
                        href={`/category/${category.slug}`}
                        key={category._id} 
                        className="category-card"
                    >
                        <div className="category-image">
                            <Image 
                                src={category.image}
                                alt={category.name}
                                fill
                                className="category-img"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className="category-overlay">
                            <h3>{category.name}</h3>
                            <p>Shop Now →</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
} 