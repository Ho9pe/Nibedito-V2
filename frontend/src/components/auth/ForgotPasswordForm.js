'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/services/auth';
import Error from '@/components/common/Error';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await authService.forgotPassword(email);
      setStatus({
        type: 'success',
        message: 'Password reset instructions have been sent to your email.'
      });
      setEmail('');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {status.message && (
        <Error 
          type={status.type}
          message={status.message}
          action={status.type === 'error' ? '/forgot-password' : null}
        />
      )}

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <button 
        type="submit" 
        className="auth-button"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Reset Instructions'}
      </button>

      <p className="auth-redirect">
        Remember your password? <Link href="/login">Sign in</Link>
      </p>
    </form>
  );
}