'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/common/Navbar';

export default function AdminRouteHandler({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdminRoute && <Navbar />}
            {children}
        </>
    );
} 