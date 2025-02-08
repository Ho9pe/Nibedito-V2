'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/services/categoryService';
import { getImageUrl } from '@/utils/imageUtils';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const activeCategories = await categoryService.getActiveCategories();
                setCategories([
                    { name: 'All Categories', slug: 'all' }, 
                    ...activeCategories
                ]);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const searchParams = new URLSearchParams();

        if (searchQuery) {
            searchParams.set('search', searchQuery);
        }

        if (selectedCategory && selectedCategory !== 'all') {
            router.push(`/products/category/${selectedCategory}?${searchParams.toString()}`);
        } else {
            router.push(`/products?${searchParams.toString()}`);
        }
    };

    const renderProfileLink = () => {
        if (!user) return null;

        return (
            <Link href="/dashboard" className="profile-link">
                {user.profilePicture ? (
                    <Image
                        src={getImageUrl(user.profilePicture)}
                        alt={user.name}
                        width={35}
                        height={35}
                        className="nav-profile-image"
                        priority={true}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div className="nav-profile-default">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </Link>
        );
    };

    const CartCount = () => {
        const { cart } = useCart();
        const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
        
        return (
            <Link href="/cart" className="nav-link cart-link">
                <FiShoppingCart />
                {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </Link>
        );
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link href="/" className="nav-logo">
                    <Image
                        src="/images/logo-white.png"
                        alt="Nibedito"
                        width={120}
                        height={40}
                        priority
                    />
                </Link>

                <div className="search-container">
                    <form onSubmit={handleSearch} className="search-form">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="category-select"
                        >
                            {categories.map((category) => (
                                <option key={category.slug} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <div className="search-input-wrapper">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary search-button">
                            Search
                        </button>
                    </form>
                </div>

                <div className="nav-links">
                    <Link href="/products" className="nav-link">
                        Products
                    </Link>

                    {user ? (
                        <>
                            <CartCount />
                            {renderProfileLink()}
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="btn btn-outline">
                                Login
                            </Link>
                            <Link href="/register" className="btn btn-primary">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}