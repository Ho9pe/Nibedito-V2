'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DUMMY_IMAGES } from '@/constants/dummyData';

export default function HeroSection({ user }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Discover Your Style <span className="highlight">at Nibedito</span>
        </h1>
        <p className="hero-description">
          Explore our curated collection of premium products designed for your lifestyle
        </p>
        {!user && (
          <div className="hero-cta">
            <Link href="/login" className="btn btn-primary btn-glow">
              Start Shopping
            </Link>
            <Link href="/register" className="btn btn-outline btn-hover-slide">
              Join Us
            </Link>
          </div>
        )}
      </div>
      <div className="hero-image-wrapper">
        <Image 
          src={DUMMY_IMAGES.hero}
          alt="Premium Gift Collection"
          width={600}
          height={100}
          priority
          className="hero-img"
        />
      </div>
    </section>
  );
}
