'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { FiHome, FiUsers, FiPackage, FiSettings, FiLogOut, FiGrid } from 'react-icons/fi';

export default function AdminNavbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { admin, logoutAdmin } = useAdminAuth();
    
    const isPublicRoute = pathname === '/admin-login';

    const handleLogout = async () => {
        try {
            await logoutAdmin();
            router.push('/admin-login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="admin-navbar">
            <div className="admin-navbar-container">
                <Link href={admin ? "/admin/dashboard" : "/"} className="admin-navbar-brand">
                    <Image
                        src="/images/logo-white.png"
                        alt="Nibedito Admin"
                        width={120}
                        height={40}
                        priority
                    />
                </Link>

                {!isPublicRoute && admin ? (
                    <>
                        <div className="admin-navbar-links">
                            <Link href="/admin/dashboard" className="admin-nav-link">
                                <FiHome /> Dashboard
                            </Link>
                            <Link href="/admin/users" className="admin-nav-link">
                                <FiUsers /> Users
                            </Link>
                            <Link href="/admin/categories" className="admin-nav-link">
                                <FiGrid /> Categories
                            </Link>
                            <Link href="/admin/products" className="admin-nav-link">
                                <FiPackage /> Products
                            </Link>
                            {admin.role === 'superadmin' && (
                                <Link href="/admin/settings" className="admin-nav-link">
                                    <FiSettings /> Settings
                                </Link>
                            )}
                        </div>

                        <div className="admin-navbar-profile">
                            <span className="admin-name">{admin.name}</span>
                            <button onClick={handleLogout} className="admin-nav-logout">
                                <FiLogOut /> Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="admin-navbar-links">
                        <Link href="/" className="admin-nav-link">
                            Back to Store
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
