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

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const shouldBeScrolled = window.scrollY > 10;
            if (shouldBeScrolled !== isScrolled) {
                setIsScrolled(shouldBeScrolled);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolled]);

    const pathname = usePathname();
    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'Shop Candles', path: '/shop' },
        { title: 'Collections', path: '/shop' },
        { title: 'About Us', path: '/about' },
        { title: 'Contact', path: '/contact' },
        { title: 'Admin', path: '/admin' },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <div className="nav-left">
                    {/* Mobile Menu Trigger */}
                    <div className="mobile-menu-trigger" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu size={24} />
                    </div>

                    <Link href="/" className="nav-logo">
                        <Logo />
                    </Link>
                </div>

                <div className="nav-links desktop-only">
                    {navLinks.map((link) => (
                        <Link
                            key={link.title}
                            href={link.path}
                            className={pathname === link.path ? 'nav-link active' : 'nav-link'}
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>

                <div className="nav-actions">
                    <button className="nav-action-btn" aria-label="Search" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                        <Search size={22} strokeWidth={2.5} />
                    </button>

                    <Link href="/cart" className="nav-action-btn cart-btn" aria-label="Cart">
                        <ShoppingBag size={22} strokeWidth={2.5} />
                        {isMounted && totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                    </Link>

                    {isMounted && user ? (
                        <div
                            className="user-profile-menu-wrapper"
                            onMouseEnter={() => setIsProfileDropdownOpen(true)}
                            onMouseLeave={() => setIsProfileDropdownOpen(false)}
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        >
                            <div className="user-profile-menu">
                                <User size={20} strokeWidth={2.5} />
                                <span className="user-name-bold">{user.displayName || user.email}</span>
                            </div>

                            <AnimatePresence>
                                {isProfileDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="profile-dropdown-container"
                                    >
                                        <div className="profile-dropdown-header">
                                            <div className="dropdown-user-name">{user.displayName || user.email}</div>
                                            <div className="dropdown-user-email">{user.email}</div>
                                        </div>
                                        <div className="profile-dropdown-links">
                                            <Link href="/orders" className="profile-dropdown-item">My Orders</Link>
                                            <Link href="/wishlist" className="profile-dropdown-item">Wishlist {wishlist?.length > 0 && `(${wishlist.length})`}</Link>
                                            <button onClick={logout} className="profile-dropdown-item logout-red">Logout</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : isMounted && (
                        <Link href="/login" className="nav-action-btn" aria-label="Account">
                            <User size={22} strokeWidth={2.5} />
                        </Link>
                    )}
                </div>
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

            {/* Search Overlay */}
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
                                        window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
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
        </nav>
    );
};

export default Navbar;
