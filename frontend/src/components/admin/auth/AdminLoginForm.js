'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Error from '@/components/common/Error';
import { FiMail, FiLock } from 'react-icons/fi';

export default function AdminLoginForm() {
    const router = useRouter();
    const { loginAdmin } = useAdminAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await loginAdmin(formData);
            router.push('/admin/dashboard');
        } catch (error) {
            setError(error.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-auth-form">
            {error && (
                <Error
                    type="error"
                    message={error}
                    className="mb-4"
                />
            )}

            <div className="form-group">
                <div className="input-wrapper">
                    {!formData.email && <FiMail className="input-icon" />}
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Admin Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="admin-input"
                    />
                </div>
            </div>

            <div className="form-group">
                <div className="input-wrapper">
                    {!formData.password && <FiLock className="input-icon" />}
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="admin-input"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="admin-auth-button"
                disabled={isLoading}
            >
                {isLoading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
        </form>
    );
} 