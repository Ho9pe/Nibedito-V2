'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth';
import Error from '@/components/common/Error';

export default function ActivateAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      activateAccount();
    }
  }, [token]);

  const activateAccount = async () => {
    try {
      await authService.activateAccount(token);
      setStatus({
        type: 'success',
        message: 'Account activated successfully! Redirecting to login...'
      });
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to activate account. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      {isLoading ? (
        <div className="loading">Activating your account...</div>
      ) : (
        <Error 
          type={status.type} 
          message={status.message}
          action={status.type === 'error' ? '/register' : null}
        />
      )}
    </div>
  );
} 