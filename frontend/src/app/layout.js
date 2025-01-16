import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';
import './styles/home.css';
import './styles/auth.css';
import './styles/navbar.css'
import './styles/variables.css'
import './styles/error.css'
import './styles/dashboard.css'
import Navbar from '@/components/common/Navbar';

export const metadata = {
  title: 'E-commerce App',
  description: 'Your one-stop shop for everything',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}