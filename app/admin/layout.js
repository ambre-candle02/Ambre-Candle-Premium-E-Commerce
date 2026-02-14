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
    EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import '@/src/styles/Admin.css';
import '@/src/styles/AuthModern.css';

export default function AdminLayout({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const session = sessionStorage.getItem('ambre_admin_session');
        if (session === 'active') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        const u = username.toLowerCase().trim();
        const p = password.trim();

        console.log("Admin Login Attempt:", { username: u });

        if (u === '@ambre02' && p === 'Ambre@012') {
            console.log("Admin Login Success!");
            sessionStorage.setItem('ambre_admin_session', 'active');
            setIsAuthenticated(true);
        } else {
            console.warn("Admin Login Failed: Invalid Credentials");
            alert('Invalid Credentials!\n\nUse EXACTLY these details:\nUser: @Ambre02\nPass: Ambre@012');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('ambre_admin_session');
        router.push('/admin');
    };

    if (!mounted) return <div style={{ minHeight: '100vh', background: '#f8f8f8' }} suppressHydrationWarning></div>;

    if (!isAuthenticated) {
        return (
            <div className="admin-layout" style={{ background: '#f8f8f8', flexDirection: 'column' }}>
                {/* Mobile Login Header */}
                <header className="admin-mobile-header">
                    <div className="mobile-header-left">
                        <Link href="/" className="mobile-header-btn">
                            <ShoppingBag size={20} />
                        </Link>
                        <span className="mobile-brand-title">Ambre Login</span>
                    </div>
                    <Link href="/" className="mobile-header-btn" style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                        HOME
                    </Link>
                </header>

                <div className="auth-split-page" style={{ paddingTop: '70px', position: 'relative' }}>
                    {/* Desktop Back Button */}
                    <Link href="/" className="admin-desktop-back-btn">
                        <div className="back-btn-circle" title="Back to Home">
                            <ArrowLeft size={24} />
                        </div>
                        <span className="back-btn-text">Back to Home</span>
                    </Link>

                    <div className="auth-left-panel admin-auth-left" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8e4e0', overflow: 'hidden' }}>
                        <motion.img
                            src="https://res.cloudinary.com/dmw5efwf5/image/upload/v1770878558/ambre-candles/Favourites/bl89eoniobqjdyhnri2g.jpg"
                            alt="Ambre Admin"
                            className="auth-visual-image"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            style={{
                                width: '100%',
                                height: '100%',
                                maxHeight: '85vh',
                                objectFit: 'cover',
                                objectPosition: 'right center',
                                borderRadius: '30px',
                                filter: 'brightness(0.75)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                                border: '2px solid #d4af37'
                            }}
                        />
                        <motion.div
                            className="admin-auth-visual-text"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                        >
                            <h2 className="auth-visual-heading" style={{ color: '#ffffff', fontSize: '2.2rem', marginBottom: '8px' }}>Admin Portal.</h2>
                            <p className="auth-visual-subtext" style={{ color: '#ffffff', opacity: 0.9, fontSize: '0.95rem', margin: 0 }}>Manage your empire of fragrance and elegance.</p>
                        </motion.div>
                    </div>

                    <div className="auth-right-panel">
                        <motion.div
                            className="auth-form-container"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="auth-header">
                                <div style={{
                                    width: '60px', height: '60px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px', boxShadow: '0 10px 20px rgba(212,175,55,0.2)'
                                }}>
                                    <Lock size={28} color="#fff" />
                                </div>
                                <h1 className="auth-title">Welcome Back</h1>
                                <p className="auth-subtitle">Please sign in to continue</p>
                            </div>

                            <form onSubmit={handleLogin}>
                                <div className="modern-form-group">
                                    <div className="modern-input-wrapper">
                                        <User size={18} className="modern-input-icon" />
                                        <input
                                            type="text"
                                            className="modern-input"
                                            placeholder="Username"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="modern-form-group">
                                    <div className="modern-input-wrapper">
                                        <Lock size={18} className="modern-input-icon" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="modern-input"
                                            placeholder="Password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    className="btn-modern"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}
                                >
                                    Authenticate Access
                                    <ArrowRight size={20} />
                                </motion.button>

                                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Difficulties? <span onClick={() => { setIsAuthenticated(true); sessionStorage.setItem('ambre_admin_session', 'active'); }} style={{ color: '#d4af37', cursor: 'pointer', textDecoration: 'underline' }}>Emergency Access</span></p>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
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
                <button
                    className="mobile-header-btn"
                    onClick={handleLogout}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                >
                    <LogOut size={20} />
                </button>
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
                    </ul>
                </nav>

                <motion.button
                    onClick={handleLogout}
                    whileHover={{
                        background: '#d4af37',
                        color: '#fff',
                        boxShadow: '0 5px 15px rgba(212, 175, 55, 0.3)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        width: '100%',
                        transition: 'color 0.3s ease'
                    }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </motion.button>
            </aside>

            {/* Main Content */}
            <main className="admin-main-content">
                {children}
            </main>
        </div>
    );
}
