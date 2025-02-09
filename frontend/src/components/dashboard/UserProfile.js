'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FiCamera } from 'react-icons/fi';
import Error from '@/components/common/Error';
import userService from '@/services/userService';
import { uploadImage, getImageUrl } from '@/utils/imageUtils';
import axios from '@/utils/axios';

export default function UserProfile({ user: initialUser }) {
    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const API_URL = 'http://localhost:3001/api';
    useEffect(() => {
        if (user && Object.keys(user).length > 0) {
            setFormData({

                name: user.name || '',
                phone: user.phone || '',
                street: user?.addresses?.[0]?.street || '',
                city: user?.addresses?.[0]?.city || '',
                state: user?.addresses?.[0]?.state || '',
                postalCode: user?.addresses?.[0]?.postalCode || ''
            });
            setIsLoading(false);
        }
    }, [user]);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type and size
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setStatus({
                type: 'error',
                message: 'Please upload a valid image file (JPEG, PNG, or WebP)'
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setStatus({
                type: 'error',
                message: 'Image size should be less than 5MB'
            });
            return;
        }

        try {
            setIsUploading(true);
            setStatus({ type: '', message: '' });

            const formData = new FormData();
            formData.append('profilePicture', file);

            const response = await axios.put(
                `${API_URL}/users/profile/${user._id}`,
                formData,
                {
                    headers: {

                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to upload image');
            }

            // Update local user state and localStorage
            setUser(response.data.payload.user);
            localStorage.setItem('user', JSON.stringify(response.data.payload.user));

            setStatus({
                type: 'success',
                message: 'Profile picture updated successfully'
            });
        } catch (err) {
            console.error('Profile picture upload error:', err);
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'Failed to upload image'
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

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
        setStatus({ type: '', message: '' });

        try {
            // Update user profile (name and phone)
            const updatedUser = await userService.updateProfile(user._id, {
                name: formData.name,
                phone: formData.phone
            });

            // Handle address update/creation
            const addressData = {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                isDefault: true
            };

            if (user.addresses?.[0]?._id) {
                await userService.updateAddress(user._id, user.addresses[0]._id, addressData);
            } else {
                await userService.addAddress(user._id, addressData);
            }

            setStatus({
                type: 'success',
                message: 'Profile updated successfully'
            });
            setIsEditing(false);

            // Update local storage with the latest user data
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // Force a page refresh to update the UI with new data
            window.location.reload();
        } catch (error) {
            console.error('Profile update error:', error);
            setStatus({
                type: 'error',
                message: error.message || 'Failed to update profile'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !formData) {
        return (
            <div className="dashboard-card">
                <h2>Profile Information</h2>
                <div className="loading-spinner">Loading profile data...</div>
            </div>
        );
    }

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
                <div className="profile-image-container">
                    <div className="profile-image-wrapper" onClick={handleImageClick}>
                        {user.profilePicture ? (
                            <Image
                                src={getImageUrl(user.profilePicture)}
                                alt={user.name}
                                width={120}
                                height={120}
                                className="profile-image"
                                priority={true}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="default-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="profile-image-overlay">
                            <FiCamera className="camera-icon" />
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                    />
                    {isUploading && <div className="upload-status">Uploading...</div>}
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

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="street">Street Address</label>
                            <input
                                type="text"
                                id="street"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postalCode">Postal Code</label>
                            <input
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="city-state-row">
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="state">State</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </div>
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
                        <span>
                            {user.addresses?.[0] ? (
                                <>
                                    {user.addresses[0].street}, {user.addresses[0].city},
                                    {user.addresses[0].state} {user.addresses[0].postalCode}
                                </>
                            ) : (
                                'Not provided'
                            )}
                        </span>
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