'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Error from '@/components/common/Error';

export default function UserProfile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading || !formData) {
    return (
      <div className="dashboard-card">
        <h2>Profile Information</h2>
        <div className="loading-spinner">Loading profile data...</div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setStatus({
        type: 'success',
        message: 'Profile updated successfully'
      });
      setIsEditing(false);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-card">
      <h2>Profile Information</h2>
      
      {status.message && (
        <Error 
          type={status.type}
          message={status.message}
          className="mb-4"
        />
      )}

      <div className="profile-header">
        <div className="profile-image">
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt={user.name}
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <div className="default-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <div className="detail-item">
            <span className="label">Phone:</span>
            <span>{user.phone || 'Not provided'}</span>
          </div>
          <div className="detail-item">
            <span className="label">Address:</span>
            <span>{user.address || 'Not provided'}</span>
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="btn-primary mt-4"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
} 