'use client';

import { useState } from 'react';
import { authService } from '@/services/auth';
import Error from '@/components/common/Error';

export default function VerificationStatus({ user }) {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleResendVerification = async () => {
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await authService.resendVerificationEmail(user.email);
      setStatus({
        type: 'success',
        message: 'Verification email has been sent. Please check your inbox.'
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to send verification email.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-card">
      <h2>Verification Status</h2>
      
      {status.message && (
        <Error 
          type={status.type}
          message={status.message}
          className="mb-4"
        />
      )}

      <div className="verification-grid">
        <div className="verification-item">
          <div className="status-header">
            <h3>Email Status</h3>
            <span className={`status-badge ${user.verificationStatus.email ? 'verified' : 'pending'}`}>
              {user.verificationStatus.email ? 'Verified' : 'Pending'}
            </span>
          </div>
          <p>{user.email}</p>
          {!user.verificationStatus.email && (
            <button
              onClick={handleResendVerification}
              className="btn-secondary mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Resend Verification Email'}
            </button>
          )}
        </div>

        <div className="verification-item">
          <div className="status-header">
            <h3>Phone Status</h3>
            <span className={`status-badge ${user.verificationStatus.phone ? 'verified' : 'pending'}`}>
              {user.verificationStatus.phone ? 'Verified' : 'Pending'}
            </span>
          </div>
          <p>{user.phone}</p>
          {!user.verificationStatus.phone && (
            <p className="text-muted">Phone verification coming soon</p>
          )}
        </div>
      </div>
    </div>
  );
} 