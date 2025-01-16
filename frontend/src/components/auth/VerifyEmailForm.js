'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authService } from '@/services/auth';
import Error from '@/components/common/Error';

export default function VerifyEmailForm({ email }) {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleResendEmail = async () => {
    setIsLoading(true);
    setStatus({ type: '', message: '' });
    setCanResend(false);
    setTimer(60);

    try {
      await authService.resendVerificationEmail(email);
      setStatus({
        type: 'success',
        message: 'Verification email has been resent. Please check your inbox.'
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to resend verification email.'
      });
      setCanResend(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('pendingVerification');
    };
  }, []);

  return (
    <div className="auth-form">
      <p className="verify-email-text">
        Please check your email and click on the verification link to activate your account.
      </p>

      {status.message && (
        <Error 
          type={status.type}
          message={status.message}
          className="mb-4"
        />
      )}

      <div className="resend-section">
        {!canResend ? (
          <p className="timer-text">
            Resend available in: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </p>
        ) : (
          <button 
            onClick={handleResendEmail}
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        )}
      </div>

      <p className="auth-redirect">
        Already verified? <Link href="/login">Sign in</Link>
      </p>
    </div>
  );
} 