'use client';

export default function Newsletter() {
  return (
    <section className="newsletter-section">
      <div className="newsletter-content">
        <h2 className="section-title">Stay <span className="highlight">Updated</span></h2>
        <p className="section-subtitle">Subscribe to our newsletter for exclusive offers and updates</p>
        <form className="newsletter-form">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="newsletter-input"
            required 
          />
          <button type="submit" className="btn btn-primary btn-glow">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
} 