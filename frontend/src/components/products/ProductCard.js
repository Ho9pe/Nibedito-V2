'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useEffect } from 'react';

export default function ProductCard({ product }) {
    const {
        slug,
        name,
        description,
        price,
        thumbnailImage,
        averageRating
    } = product;

    useEffect(() => {
        const description = document.querySelector(`#product-${product._id} .product-description`);
        if (description && description.scrollHeight > description.clientHeight) {
            description.classList.add('truncated');
        }
    }, [product]);

    return (
        <div id={`product-${product._id}`} className="product-card">
            <div className="product-image">
                <Image
                    src={thumbnailImage}
                    alt={name}
                    width={300}
                    height={300}
                    className="product-img"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="product-overlay">
                    <button className="btn btn-primary btn-cart">
                        <FiShoppingCart />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
            <Link href={`/products/${slug}`} className="product-info">
                <h3 className="product-name">{name}</h3>
                <p className="product-description">{description}</p>
                <div className="product-footer">
                    <p className="product-price">${price.toFixed(2)}</p>
                    <span className="product-rating">
                        <FiStar /> {averageRating.toFixed(1)}
                    </span>
                </div>
            </Link>
        </div>
    );
}
