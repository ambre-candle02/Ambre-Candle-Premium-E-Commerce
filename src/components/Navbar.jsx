'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, User, Heart, Package, Mail, Phone, Instagram, Facebook } from 'lucide-react';
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
    const { totalItems, subtotal } = useCart();
    const { wishlist } = useWishlist();
    const { user, logout } = useAuth();

    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
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

        // Close mobile menus on path change
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);

        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [pathname]);

    const navLinks = useMemo(() => [
        { title: 'Home', path: '/' },
        { title: 'Shop', path: '/shop' },
        { title: 'Collection', path: '/collection' },
        { title: 'Our Story', path: '/about' },
        { title: 'Contact Us', path: '/contact' },
    ], []);

    // Hide Navbar on Admin pages (Move after hooks to fix React error)
    if (pathname && pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <div className="nav-left">
                    <motion.div 
                        whileTap={{ scale: 0.9 }} 
                        className="mobile-menu-trigger" 
                        onClick={() => setIsMobileMenuOpen(true)}
                        suppressHydrationWarning
                    >
                        <Menu size={24} />
                    </motion.div>

                    <Link href="/" className="nav-logo">
                        <Logo />
                    </Link>
                </div>

                <div className="nav-links desktop-only" suppressHydrationWarning>
                    {navLinks.map((link) => (
                        <motion.div 
                            key={link.title} 
                            className="nav-link-wrapper" 
                            suppressHydrationWarning
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={link.path}
                                className={pathname === link.path ? 'nav-link active' : 'nav-link'}
                                suppressHydrationWarning
                            >
                                {link.title}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="nav-actions" suppressHydrationWarning>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="nav-action-btn desktop-only" /* Fix 9: Hide on mobile */
                        aria-label="Search"
                        onClick={() => {
                            if (isSearchOpen) {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                            } else {
                                setIsSearchOpen(true);
                            }
                        }}
                    >
                        <Search size={22} strokeWidth={2.5} />
                    </motion.button>

                    {/* Cart Button - Visible on all devices */}
                    <motion.div whileTap={{ scale: 0.9 }} className="cart-motion-wrapper">
                        <Link href="/cart" className="nav-action-btn cart-btn" suppressHydrationWarning>
                            <div className="cart-icon-wrapper">
                                <ShoppingBag size={26} strokeWidth={2.5} />
                                {isMounted && totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                            </div>
                        </Link>
                    </motion.div>

                    {isMounted && user ? (
                        <div 
                            ref={userMenuRef}
                            className={`user-profile-menu-wrapper ${isUserMenuOpen ? 'mobile-active' : ''}`}
                            suppressHydrationWarning
                            onClick={() => {
                                if (window.innerWidth <= 1024) {
                                    setIsUserMenuOpen(!isUserMenuOpen);
                                }
                            }}
                        >
                            <div className="user-profile-menu">
                                <User size={20} strokeWidth={2.5} />
                                <span className="user-name-bold desktop-only">{user.displayName || user.email}</span>
                            </div>
                            <div className="profile-dropdown-container" suppressHydrationWarning>
                                <div className="profile-dropdown-header">
                                    <div className="dropdown-user-name">{user.displayName || user.email}</div>
                                    <div className="dropdown-user-email">{user.email}</div>
                                </div>
                                <div className="profile-dropdown-links">
                                    <Link href="/profile" className="profile-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>My Profile</Link>
                                    <Link href="/orders" className="profile-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>My Orders</Link>
                                    <Link href="/wishlist" className="profile-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>Wishlist {wishlist?.length > 0 && `(${wishlist.length})`}</Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsUserMenuOpen(false);
                                            logout().then(() => router.push('/'));
                                        }}
                                        className="profile-dropdown-item logout-red"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <motion.button 
                            whileTap={{ scale: 0.9 }} 
                            className="nav-action-btn"
                            aria-label="Account"
                            onClick={() => router.push('/login')}
                            suppressHydrationWarning
                        >
                            <User size={22} strokeWidth={2.5} />
                        </motion.button>
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
                                <div className="mobile-search-wrapper" suppressHydrationWarning>
                                    <form 
                                        className="mobile-search-form"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (searchQuery.trim()) {
                                                router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
                                                setIsSearchOpen(false);
                                                setIsMobileMenuOpen(false);
                                            }
                                        }}
                                    >
                                        <input 
                                            type="text" 
                                            placeholder="Search products..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="mobile-search-input"
                                        />
                                        <button type="submit" className="mobile-search-btn">
                                            <Search size={18} />
                                        </button>
                                    </form>
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

                                <div className="mobile-menu-footer" suppressHydrationWarning>
                                    <div className="mobile-contact-info">
                                        <a href="mailto:support@ambrecandle.com" className="mobile-contact-item">
                                            <Mail size={16} /> support@ambrecandle.com
                                        </a>
                                        <a href="tel:+919876543210" className="mobile-contact-item">
                                            <Phone size={16} /> +91 98765 43210
                                        </a>
                                    </div>
                                    <div className="mobile-social-links">
                                        <a href="https://instagram.com/candleambre" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
                                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
                                    </div>
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
                                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
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
