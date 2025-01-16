'use client';

import Image from 'next/image';
import { DUMMY_IMAGES } from '@/constants/dummyData';
import { getImageUrl } from '@/utils/imageUtils';

export default function ProductSlider() {
  return (
    <section className="trending-section">
      <div className="section-header">
        <h2 className="section-title">Trending <span className="highlight">Now</span></h2>
        <p className="section-subtitle">Discover our most popular products</p>
      </div>
      <div className="product-grid">
        {DUMMY_IMAGES.products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <Image 
                src={getImageUrl(product.image)}
                alt={product.name}
                width={300}
                height={300}
                className="product-img"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="product-overlay">
                <button className="btn btn-primary btn-cart">
                  <span className="cart-icon">🛒</span>
                  <span className="cart-text">Add to Cart</span>
                </button>
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <p className="product-price">${product.price}</p>
                <span className="product-rating">★ {product.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 