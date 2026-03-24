'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Image as ImageIcon,
    LogOut,
    Lock,
    User,
    ArrowRight,
    ArrowLeft,
    Search,
    ShoppingBag,
    Menu,
    X,
    Eye,
    EyeOff,
    Sparkles,
    MessageSquare,
    Users
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import '@/src/styles/Admin.css';
import '@/src/styles/AuthModern.css';
import { loginAdmin, logoutAdmin, checkAdminStatus } from './actions';

export default function AdminLayout({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const checkAuth = async () => {
            const fastCheck = sessionStorage.getItem('ambre_admin_session');
            if (fastCheck === 'active') {
                setIsAuthenticated(true);
                setIsCheckingAuth(false);
                // Trust the session implicitly on mount to avoid refresh-flicker
                return;
            }

            try {
                const isAuth = await checkAdminStatus();
                if (isAuth) {
                    sessionStorage.setItem('ambre_admin_session', 'active');
                    setIsAuthenticated(true);
                } else {
                    // Only clear if we are 100% sure the cookie is GONE
                    const stillActive = sessionStorage.getItem('ambre_admin_session');
                    if (!stillActive) {
                        setIsAuthenticated(false);
                    }
                }
            } catch (err) {
                console.error('Auth verify skipped.', err);
                // Keep the current state on error to avoid flickering out
            } finally {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogout = async () => {
        await logoutAdmin();
        setIsAuthenticated(false);
        sessionStorage.removeItem('ambre_admin_session');
        router.push('/login');
    };

    const spinnerScreen = (
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }} suppressHydrationWarning>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(212,175,55,0.1)', borderTop: '3px solid #d4af37', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: '#d4af37', fontSize: '0.85rem', fontFamily: 'var(--font-heading)', fontWeight: '700', letterSpacing: '1px' }}>AMBRE SESSION SYNCING...</p>
            </div>
        </div>
    );

    if (!mounted || isCheckingAuth) return spinnerScreen;

    if (!isAuthenticated) {
        const handleAdminLogin = async (e) => {
            e.preventDefault();
            setIsLoading(true);
            setError('');
            try {
                const res = await loginAdmin(username, password);
                if (res.success) {
                    sessionStorage.setItem('ambre_admin_session', 'active');
                    setIsAuthenticated(true);
                } else {
                    setError(res.error || 'Invalid credentials.');
                }
            } catch (err) {
                setError('Login failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d0d', padding: '1rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', background: '#1a1a1a', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <Lock size={28} color="#d4af37" />
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-heading, serif)', color: '#fff', fontSize: '1.8rem', margin: '0 0 0.3rem' }}>Admin Access</h1>
                        <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>Enter your admin credentials to continue</p>
                    </div>

                    <form onSubmit={handleAdminLogin}>
                        <div style={{ marginBottom: '1.2rem', position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }} />
                            <input
                                type="text"
                                placeholder="Admin Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Admin Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                style={{ width: '100%', padding: '1rem 3rem 1rem 3rem', background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 0 }}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {error && (
                            <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        )}

                        <motion.button
                            type="submit"
                            whileTap={{ scale: 0.97 }}
                            disabled={isLoading}
                            style={{ width: '100%', padding: '1rem', background: isLoading ? '#333' : '#d4af37', color: '#1a1a1a', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '700', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            {isLoading
                                ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(0,0,0,0.2)', borderTop: '2px solid #1a1a1a', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                : <><span>Login to Admin</span> <ArrowRight size={18} /></>
                            }
                        </motion.button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <Link href="/" style={{ color: '#666', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Website</Link>
                    </div>
                </motion.div>
            </div>
        );
    }


    return (
        <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Mobile Header */}
            <header className="admin-mobile-header">
                <div className="mobile-header-left">
                    <button
                        className="mobile-header-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <span className="mobile-brand-title">Admin Panel</span>
                </div>
            </header>

            {/* Sidebar Backdrop (Mobile Only) */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        className="admin-sidebar-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 999
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'mobile-show' : ''}`}>
                <div style={{ marginBottom: '50px', padding: '0 20px' }}>
                    <div className="admin-sidebar-brand" style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Ambre Admin</div>
                    <div className="admin-sidebar-title" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Control Panel</div>
                </div>

                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '10px' }}>
                            <Link href="/admin" style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
                                <motion.div
                                    whileHover={{
                                        background: 'rgba(212, 175, 55, 0.15)',
                                        color: '#fff'
                                    }}
                                    className={`nav-item ${pathname === '/admin' ? 'active' : ''}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        color: pathname === '/admin' ? '#fff' : '#888',
                                        background: pathname === '/admin' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                                        fontWeight: '600',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <LayoutDashboard size={20} color={pathname === '/admin' ? '#d4af37' : '#888'} />
                                    <span>Order Dashboard</span>
                                </motion.div>
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link href="/admin/media" style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
                                <motion.div
                                    whileHover={{
                                        background: 'rgba(212, 175, 55, 0.15)',
                                        color: '#fff'
                                    }}
                                    className={`nav-item ${pathname === '/admin/media' ? 'active' : ''}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        color: pathname === '/admin/media' ? '#fff' : '#888',
                                        background: pathname === '/admin/media' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                                        fontWeight: '600',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <ImageIcon size={20} color={pathname === '/admin/media' ? '#d4af37' : '#888'} />
                                    <span>Media Library</span>
                                </motion.div>
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link href="/admin/inventory" style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
                                <motion.div
                                    whileHover={{
                                        background: 'rgba(212, 175, 55, 0.15)',
                                        color: '#fff'
                                    }}
                                    className={`nav-item ${pathname === '/admin/inventory' ? 'active' : ''}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        color: pathname === '/admin/inventory' ? '#fff' : '#888',
                                        background: pathname === '/admin/inventory' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                                        fontWeight: '600',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <Sparkles size={20} color={pathname === '/admin/inventory' ? '#d4af37' : '#888'} />
                                    <span>Inventory Hub</span>
                                </motion.div>
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link href="/admin/queries" style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
                                <motion.div
                                    whileHover={{
                                        background: 'rgba(212, 175, 55, 0.15)',
                                        color: '#fff'
                                    }}
                                    className={`nav-item ${pathname === '/admin/queries' ? 'active' : ''}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        color: pathname === '/admin/queries' ? '#fff' : '#888',
                                        background: pathname === '/admin/queries' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                                        fontWeight: '600',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <MessageSquare size={20} color={pathname === '/admin/queries' ? '#d4af37' : '#888'} />
                                    <span>Support Queries</span>
                                </motion.div>
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link href="/admin/subscribers" style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
                                <motion.div
                                    whileHover={{
                                        background: 'rgba(212, 175, 55, 0.15)',
                                        color: '#fff'
                                    }}
                                    className={`nav-item ${pathname === '/admin/subscribers' ? 'active' : ''}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        color: pathname === '/admin/subscribers' ? '#fff' : '#888',
                                        background: pathname === '/admin/subscribers' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                                        fontWeight: '600',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <Users size={20} color={pathname === '/admin/subscribers' ? '#d4af37' : '#888'} />
                                    <span>Subscribers</span>
                                </motion.div>
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link href="/admin/site-designer" style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
                                <motion.div
                                    whileHover={{
                                        background: 'rgba(212, 175, 55, 0.15)',
                                        color: '#fff'
                                    }}
                                    className={`nav-item ${pathname === '/admin/site-designer' ? 'active' : ''}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        color: pathname === '/admin/site-designer' ? '#fff' : '#888',
                                        background: pathname === '/admin/site-designer' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                                        fontWeight: '600',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <Sparkles size={20} color={pathname === '/admin/site-designer' ? '#d4af37' : '#888'} />
                                    <span>Design Studio</span>
                                </motion.div>
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link href="/admin/products" style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
                                <motion.div
                                    whileHover={{
                                        background: 'rgba(239, 68, 68, 0.15)',
                                        color: '#fff'
                                    }}
                                    className={`nav-item ${pathname === '/admin/products' ? 'active' : ''}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        color: pathname === '/admin/products' ? '#ef4444' : '#888',
                                        background: pathname === '/admin/products' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                                        fontWeight: '600',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <ShoppingBag size={20} color={pathname === '/admin/products' ? '#ef4444' : '#888'} />
                                    <span>Product Manager</span>
                                </motion.div>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '20px', paddingBottom: '20px' }}>
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{
                            background: '#ef4444',
                            color: '#fff',
                            boxShadow: '0 8px 20px rgba(239, 68, 68, 0.2)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 20px',
                            borderRadius: '16px',
                            color: '#ef4444',
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.1)',
                            cursor: 'pointer',
                            fontWeight: '700',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            fontSize: '0.95rem'
                        }}
                    >
                        <LogOut size={20} strokeWidth={2.5} />
                        <span>Sign Out</span>
                    </motion.button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main-content">
                {children}
            </main>
        </div>
    );
}
