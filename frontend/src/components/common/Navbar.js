'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Electronics',
    'Fashion',
    'Books',
    'Home & Living',
    'Sports',
    'Beauty'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', searchQuery, 'Category:', selectedCategory);
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
                <option key={category} value={category.toLowerCase()}>
                  {category}
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
              <Link href="/cart" className="nav-link cart-link">
                <FiShoppingCart />
                <span className="cart-count">3</span>
              </Link>
              <Link href="/dashboard" className="nav-link profile-link">
                {user.profilePicture ? (
                  <Image 
                    src={user.profilePicture}
                    alt="Profile"
                    width={35}
                    height={35}
                    className="profile-picture"
                  />
                ) : (
                  <FiUser />
                )}
              </Link>
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