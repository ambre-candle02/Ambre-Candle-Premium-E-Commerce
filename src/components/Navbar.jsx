'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { PRODUCT_CATEGORIES } from '../config/constants';
import Logo from './Logo';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { totalItems } = useCart();
    const { wishlist } = useWishlist();
    const { user, logout } = useAuth();

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const router = useRouter();

    const pathname = usePathname();

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide Navbar on Admin pages
    if (pathname && pathname.startsWith('/admin')) {
        return null;
    }
    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'Shop Candle', path: '/shop' },
        { title: 'Collection', path: '/collection' },
        { title: 'About Us', path: '/about' },
        { title: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <div className="nav-left">
                    <motion.div whileTap={{ scale: 0.9 }} className="mobile-menu-trigger" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu size={24} />
                    </motion.div>

                    <Link href="/" className="nav-logo">
                        <Logo />
                    </Link>
                </div>

                <div className="nav-links desktop-only" suppressHydrationWarning>
                    {navLinks.map((link) => (
                        <div key={link.title} className="nav-link-wrapper" suppressHydrationWarning>
                            {link.hasMegaMenu ? (
                                <div
                                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                                    className="mega-menu-trigger-wrapper"
                                    suppressHydrationWarning
                                >
                                    <Link
                                        href={link.path}
                                        className={pathname === link.path ? 'nav-link active' : 'nav-link'}
                                        onClick={() => setIsMegaMenuOpen(false)}
                                        suppressHydrationWarning
                                    >
                                        {link.title}
                                    </Link>

                                    <AnimatePresence>
                                        {isMegaMenuOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="mega-menu-container"
                                            >
                                                <div className="mega-menu-content" suppressHydrationWarning>
                                                    {PRODUCT_CATEGORIES.map(cat => (
                                                        <Link
                                                            key={cat}
                                                            href={`/categories/${encodeURIComponent(cat)}`}
                                                            className="mega-menu-item"
                                                            onClick={() => setIsMegaMenuOpen(false)}
                                                            suppressHydrationWarning
                                                        >
                                                            {cat}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    href={link.path}
                                    className={pathname === link.path ? 'nav-link active' : 'nav-link'}
                                    suppressHydrationWarning
                                >
                                    {link.title}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                <div className="nav-actions" suppressHydrationWarning>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="nav-action-btn"
                        aria-label="Search"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        <Search size={22} strokeWidth={2.5} />
                    </motion.button>

                    <Link href="/cart" className="nav-action-btn cart-btn" suppressHydrationWarning>
                        <motion.div whileTap={{ scale: 0.9 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingBag size={22} strokeWidth={2.5} />
                            {isMounted && totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </motion.div>
                    </Link>

                    {isMounted && user ? (
                        <div
                            className="user-profile-menu-wrapper"
                            onMouseEnter={() => setIsProfileDropdownOpen(true)}
                            onMouseLeave={() => setIsProfileDropdownOpen(false)}
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            suppressHydrationWarning
                        >
                            <motion.div whileTap={{ scale: 0.95 }} className="user-profile-menu">
                                <User size={20} strokeWidth={2.5} />
                                <span className="user-name-bold">{user.displayName || user.email}</span>
                            </motion.div>

                            <AnimatePresence>
                                {isProfileDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.15 }}
                                        className="profile-dropdown-container"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="profile-dropdown-header" suppressHydrationWarning>
                                            <div className="dropdown-user-name">{user.displayName || user.email}</div>
                                            <div className="dropdown-user-email">{user.email}</div>
                                        </div>
                                        <div className="profile-dropdown-links" suppressHydrationWarning>
                                            <Link href="/orders" className="profile-dropdown-item" onClick={() => setIsProfileDropdownOpen(false)} suppressHydrationWarning>My Orders</Link>
                                            <Link href="/wishlist" className="profile-dropdown-item" onClick={() => setIsProfileDropdownOpen(false)} suppressHydrationWarning>Wishlist {wishlist?.length > 0 && `(${wishlist.length})`}</Link>
                                            <Link href="/admin" className="profile-dropdown-item" style={{ color: 'var(--color-accent)' }} onClick={() => setIsProfileDropdownOpen(false)} suppressHydrationWarning>Admin Dashboard</Link>
                                            <button
                                                onClick={() => {
                                                    setIsProfileDropdownOpen(false);
                                                    logout();
                                                }}
                                                className="profile-dropdown-item logout-red"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : isMounted && (
                        <Link href="/login" suppressHydrationWarning>
                            <motion.button whileTap={{ scale: 0.9 }} className="nav-action-btn" aria-label="Account">
                                <User size={22} strokeWidth={2.5} />
                            </motion.button>
                        </Link>
                    )}
                </div>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="mobile-menu-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <motion.div
                                className="mobile-menu-content"
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'tween', duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="mobile-menu-header">
                                    <Logo />
                                    <button onClick={() => setIsMobileMenuOpen(false)}>
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="mobile-nav-links" suppressHydrationWarning>
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.title}
                                            href={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="mobile-nav-link"
                                            suppressHydrationWarning
                                        >
                                            {link.title}
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isSearchOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="search-backdrop"
                                onClick={() => setIsSearchOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 20, x: '-50%' }}
                                animate={{ opacity: 1, y: 0, x: '-50%' }}
                                exit={{ opacity: 0, y: 20, x: '-50%' }}
                                className="search-overlay"
                            >
                                <form
                                    className="search-form"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (searchQuery.trim()) {
                                            router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
                                            setIsSearchOpen(false);
                                        }
                                    }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Search for candles..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        className="search-input"
                                    />
                                    <button type="submit" className="search-submit-btn">
                                        <Search size={20} />
                                    </button>
                                    <button type="button" onClick={() => setIsSearchOpen(false)} className="search-close-btn">
                                        <X size={20} />
                                    </button>
                                </form>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
