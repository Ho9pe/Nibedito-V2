'use client';

import { useState } from 'react';
import { authService } from '@/services/auth';
import Error from '@/components/common/Error';

export default function SecuritySettings() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({
        type: 'error',
        message: 'New passwords do not match'
      });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await authService.changePassword(formData.currentPassword, formData.newPassword);
      setStatus({
        type: 'success',
        message: 'Password changed successfully'
      });
      setIsChangingPassword(false);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to change password'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-card">
      <h2>Security Settings</h2>
      
      {status.message && (
        <Error 
          type={status.type}
          message={status.message}
          className="mb-4"
        />
      )}

      {isChangingPassword ? (
        <form onSubmit={handleSubmit} className="security-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => setIsChangingPassword(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button 
          onClick={() => setIsChangingPassword(true)}
          className="btn-primary"
        >
          Change Password
        </button>
      )}
    </div>
  );
} 