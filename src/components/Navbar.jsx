'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, Heart, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
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

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const pathname = usePathname();
    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'Shop Candles', path: '/shop' },
        { title: 'Collections', path: '/shop' },
        { title: 'About Us', path: '/about' },
        { title: 'Contact', path: '/contact' },
        { title: 'Admin', path: '/admin' },
    ];

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    return (
        <nav
            className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        >
            <div className="container nav-container">
                <div className="nav-left" style={{ marginRight: '20px' }}>
                    <div className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu size={24} />
                    </div>
                    <Link href="/" className="nav-logo">
                        <Logo />
                    </Link>
                </div>

                {/* Desktop Links */}
                <div className="nav-links desktop-only" style={{ marginLeft: '10px' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.title}
                            href={link.path}
                            className={pathname === link.path ? 'nav-link active' : 'nav-link'}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="nav-actions" style={{ paddingRight: '10px' }}>
                    <button
                        className="nav-action-btn"
                        aria-label="Search"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        <Search size={22} strokeWidth={1.5} />
                    </button>

                    <Link href="/cart" className="nav-action-btn cart-btn" aria-label="Cart">
                        <ShoppingBag size={22} strokeWidth={1.5} />
                        {isMounted && totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                    </Link>

                    {isMounted && user ? (
                        <div
                            className="user-profile-menu-wrapper"
                            onMouseEnter={() => setIsProfileDropdownOpen(true)}
                            onMouseLeave={() => setIsProfileDropdownOpen(false)}
                            style={{ position: 'relative' }}
                        >
                            <div className="user-profile-menu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '70px', cursor: 'pointer' }}>
                                <User size={18} strokeWidth={1.5} />
                                <span className="user-name-bold" style={{ fontSize: '0.65rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{user.name}</span>
                            </div>

                            <AnimatePresence>
                                {isProfileDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            width: '200px',
                                            background: 'var(--color-bg-secondary)',
                                            borderRadius: '12px',
                                            boxShadow: 'var(--premium-shadow)',
                                            padding: '10px',
                                            border: '1px solid var(--color-border)',
                                            zIndex: 100
                                        }}
                                    >
                                        <div style={{ padding: '10px', borderBottom: '1px solid #f0f0f0', marginBottom: '5px' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#666' }}>{user.email}</div>
                                        </div>
                                        <Link href="/orders" className="profile-dropdown-item">
                                            My Orders
                                        </Link>
                                        <Link href="/wishlist" className="profile-dropdown-item">
                                            Wishlist {isMounted && wishlist && wishlist.length > 0 && `(${wishlist.length})`}
                                        </Link>
                                        <button onClick={logout} className="profile-dropdown-item logout-red">
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : isMounted ? (
                        <Link href="/login" className="nav-action-btn" aria-label="Account">
                            <User size={22} strokeWidth={1.5} />
                        </Link>
                    ) : (
                        <div className="nav-action-btn" style={{ opacity: 0 }}>
                            <User size={22} strokeWidth={1.5} />
                        </div>
                    )}
                </div>

                {/* Mobile Menu Overlay */}
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
                                <div className="mobile-nav-links">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.title}
                                            href={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="mobile-nav-link"
                                        >
                                            {link.title}
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Search Overlay & Backdrop */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <>
                            {/* Dimmed Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="search-backdrop"
                                onClick={() => setIsSearchOpen(false)}
                            />
                            {/* Search Bar */}
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
                                            window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                                            setIsSearchOpen(false);
                                            setSearchQuery('');
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
                                    <button
                                        type="button"
                                        onClick={() => setIsSearchOpen(false)}
                                        className="search-close-btn"
                                    >
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
