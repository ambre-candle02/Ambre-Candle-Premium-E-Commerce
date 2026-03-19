'use client';
import { useState, useEffect } from 'react';
import { useWishlist } from '@/src/context/WishlistContext';
import { useCart } from '@/src/context/CartContext';
import { ShoppingBag, X, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import SafeImage from '@/src/components/SafeImage';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSiteConfig } from '@/src/hooks/useSiteConfig';
import '@/src/styles/Wishlist.css';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist, isLoaded } = useWishlist();
    const { addToCart } = useCart();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const { getHero } = useSiteConfig();
    const heroBanner = getHero('wishlist');

    return (
        <div className="wishlist-page">
            {/* Premium Hero Section - ALWAYS RENDERED */}
            <div className="wishlist-hero" style={{ 
                backgroundImage: `url(${heroBanner || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=2000'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="wishlist-hero-overlay"></div>
                
                {/* Fixed Back Button Positioning */}
                <div className="container" style={{ position: 'absolute', top: '110px', left: '20px', zIndex: 20 }}>
                    <Link href="/shop" className="desktop-only-back-btn">
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </Link>
                </div>

                {/* Centered Hero Content */}
                <div className="wishlist-hero-content">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="wishlist-title"
                    >
                        Your Curated Collection {wishlist.length > 0 && `(${wishlist.length} ${wishlist.length === 1 ? 'Item' : 'Items'})`}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="wishlist-subtitle"
                    >
                        Handpicked artisan candles for your premium private selection.
                    </motion.p>
                </div>
            </div>

            <div className="wishlist-content-container">
                {(!mounted || !isLoaded) ? (
                    <div style={{ padding: '80px 20px', textAlign: 'center', color: '#d4af37' }}>
                        <ShoppingBag className="spin" size={40} strokeWidth={1} />
                        <p style={{ marginTop: '20px', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: '600' }}>OPENING PRIVATE GALLERY...</p>
                    </div>
                ) : wishlist.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="wishlist-empty section"
                        style={{ textAlign: 'center', padding: '20px 20px' }}
                    >
                        <div style={{
                            width: '120px', height: '120px', background: 'rgba(212, 175, 55, 0.08)',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 30px', border: '1px solid rgba(212, 175, 55, 0.15)'
                        }}>
                            <ShoppingBag size={50} color="#d4af37" strokeWidth={1} />
                        </div>
                        <h2 className="empty-wishlist-title">Your Wishlist is Empty</h2>
                        <p style={{ marginBottom: '40px', color: '#666', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 40px' }}>
                            Begin your aromatic journey. Discover artisan candles that resonate with your lifestyle.
                        </p>
                        <Link href="/shop" className="btn-primary" style={{
                            padding: '16px 45px', borderRadius: '50px', background: '#d4af37', border: 'none',
                            color: '#fff', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase',
                            letterSpacing: '2px', boxShadow: '0 15px 30px rgba(212, 175, 55, 0.2)',
                            textDecoration: 'none', display: 'inline-block'
                        }}>Explore Collection</Link>
                    </motion.div>
                ) : (
                    <div className="wishlist-grid">
                        <AnimatePresence mode="popLayout">
                            {wishlist.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="wishlist-card"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.1, background: '#f5f5f5' }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="btn-remove-wishlist"
                                        title="Remove from Wishlist"
                                    >
                                        <X size={18} strokeWidth={2} />
                                    </motion.button>

                                    <Link href={`/product/${item.id}`} className="wishlist-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="wishlist-img-wrapper">
                                            <SafeImage src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <div className="wishlist-img-overlay"></div>
                                        </div>
                                        <div className="wishlist-card-content">
                                            <span className="wishlist-category">
                                                {item.productType || item.category || 'ARTISAN COLLECTION'}
                                            </span>
                                            <h3 className="wishlist-item-title">
                                                {item.name}
                                            </h3>
                                            <div className="wishlist-item-price">
                                                <span className="currency-symbol">₹</span>{item.price}
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="wishlist-actions">
                                        <button
                                            onClick={() => {
                                                addToCart(item);
                                                removeFromWishlist(item.id);
                                                toast.success(`✔ Item moved to cart`);
                                            }}
                                            className="btn-wishlist-add-cart"
                                        >
                                            <ShoppingCart size={16} /> MOVE TO CART
                                        </button>
                                        <Link href={`/product/${item.id}`} className="link-view-details">
                                            View Details
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
