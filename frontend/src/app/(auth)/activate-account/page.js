'use client';

import { useSearchParams } from 'next/navigation';
import ActivateAccountForm from '@/components/auth/ActivateAccountForm';

export default function ActivateAccountPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Invalid Activation Link</h1>
          <p className="auth-subtitle">
            The activation link is invalid or has expired. Please request a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Activate Account</h1>
        <p className="auth-subtitle">Please wait while we activate your account</p>
        <ActivateAccountForm token={token} />
      </div>
    </div>
  );
} 