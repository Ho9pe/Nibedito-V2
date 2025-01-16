'use client';

import { FEATURES } from '@/constants/dummyData';

export default function Features() {
  return (
    <section className="features-section">
      <div className="section-header">
        <h2 className="section-title">Why Choose <span className="highlight">Us</span></h2>
        <p className="section-subtitle">Experience the difference with our premium services</p>
      </div>
      <div className="features-container">
        {FEATURES.map((feature) => (
          <div key={feature.id} className="feature-card">
            <div className="feature-content">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">{feature.icon}</span>
              </div>
              <div className="feature-text">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 