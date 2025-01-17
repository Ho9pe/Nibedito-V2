'use client';

import { FiUser, FiMail, FiPhone, FiShield } from 'react-icons/fi';

export default function AdminProfile({ admin }) {
    const defaultInfo = {
        name: admin?.name || 'Admin User',
        email: admin?.email || 'No email provided',
        phone: admin?.phone || 'Not Provided',
        role: admin?.role || 'admin'
    };

    return (
        <div className="admin-profile-section">
            <div className="admin-profile-header">
                <div className="profile-avatar">
                    <FiUser className="avatar-icon" />
                </div>
                <div className="profile-title">
                    <h2>{defaultInfo.name}</h2>
                    <span className="profile-role">{defaultInfo.role}</span>
                </div>
            </div>
            
            <div className="admin-info-container">
                <div className="info-item">
                    <FiMail className="info-icon" />
                    <div className="info-content">
                        <label>Email Address</label>
                        <p>{defaultInfo.email}</p>
                    </div>
                </div>
                <div className="info-item">
                    <FiPhone className="info-icon" />
                    <div className="info-content">
                        <label>Phone Number</label>
                        <p className="info-text-muted">{defaultInfo.phone}</p>
                    </div>
                </div>
                <div className="info-item">
                    <FiShield className="info-icon" />
                    <div className="info-content">
                        <label>Account Type</label>
                        <p className="info-text-capitalize">{defaultInfo.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 