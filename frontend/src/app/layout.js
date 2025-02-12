import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { CartProvider } from '@/contexts/CartContext';
import './globals.css';
import './styles/home.css';
import './styles/auth.css';
import './styles/navbar.css'
import './styles/variables.css'
import './styles/error.css'
import './styles/dashboard.css'
import './styles/category.css'
import './styles/confirm-dialog.css'
import './styles/product-filters.css'
import './styles/products.css'
import './styles/product-details.css'


import AdminRouteHandler from '@/components/admin/common/AdminRouteHandler';

export const metadata = {
    title: 'E-commerce App',
    description: 'Your one-stop shop for everything',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <CartProvider>
                        <AdminAuthProvider>
                            <AdminRouteHandler>
                                {children}
                            </AdminRouteHandler>
                        </AdminAuthProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}