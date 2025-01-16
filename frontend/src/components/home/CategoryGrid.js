'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DUMMY_IMAGES } from '@/constants/dummyData';
import { getImageUrl } from '@/utils/imageUtils';

export default function CategoryGrid() {
  return (
    <section className="categories-section">
      <div className="section-header">
        <h2 className="section-title">Shop by <span className="highlight">Category</span></h2>
        <p className="section-subtitle">Explore our wide range of collections</p>
      </div>
      <div className="category-grid">
        {DUMMY_IMAGES.categories.map((category) => (
          <Link 
            href={`/category/${category.slug}`}
            key={category.id} 
            className="category-card"
          >
            <div className="category-image">
              <Image 
                src={getImageUrl(category.image)}
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