'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VerifyEmailForm from '@/components/auth/VerifyEmailForm';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const pendingEmail = sessionStorage.getItem('pendingVerification');
    if (!pendingEmail) {
      router.push('/register');
      return;
    }
    setEmail(pendingEmail);
  }, [router]);

  if (!email) {
    return null; // or loading state
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Verify Your Email</h1>
        <p className="auth-subtitle">
          We've sent a verification email to <strong>{email}</strong>
        </p>
        <VerifyEmailForm email={email} />
      </div>
    </div>
  );
} 