'use client';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Reset Password</h1>
        <p className="auth-subtitle">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
