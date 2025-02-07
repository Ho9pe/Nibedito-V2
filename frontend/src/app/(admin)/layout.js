'use client';

import AdminNavbar from '@/components/admin/common/AdminNavbar';
import '../styles/admin-navbar.css';
import '../styles/admin-dashboard.css';
import '../styles/admin.css';
import '../styles/admin-users.css';
import '../styles/admin-categories.css'
import '../styles/admin-products.css'
import '../styles/dialog.css'
import '../styles/error.css'

export default function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            <AdminNavbar />
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
