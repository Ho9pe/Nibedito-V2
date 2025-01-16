'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Error from '@/components/common/Error';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await login(formData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: error.message || 'Failed to login. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {errors.general && (
        <Error 
          type="error" 
          message={errors.general}
          className="mb-4"
        />
      )}

      <div className="form-group">
        <label htmlFor="emailOrPhone">Email or Phone</label>
        <input
          type="text"
          id="emailOrPhone"
          name="emailOrPhone"
          value={formData.emailOrPhone}
          onChange={handleChange}
          className={errors.emailOrPhone ? 'error' : ''}
          required
        />
        {errors.emailOrPhone && (
          <span className="error-message">{errors.emailOrPhone}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'error' : ''}
          required
        />
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}
      </div>

      <Link href="/forgot-password" className="forgot-password">
        Forgot Password?
      </Link>

      <button 
        type="submit" 
        className="auth-button" 
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="auth-redirect">
        Don't have an account? <Link href="/register">Register</Link>
      </p>
    </form>
  );
}