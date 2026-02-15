'use client';
import { useState, useEffect } from 'react';
import { useWishlist } from '@/src/context/WishlistContext';
import { useCart } from '@/src/context/CartContext';
import { ShoppingBag, X, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import SafeImage from '@/src/components/SafeImage';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import '@/src/styles/Wishlist.css';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="wishlist-page"></div>;
    }

    if (wishlist.length === 0) {
        return (
            <div className="wishlist-empty section" style={{
                backgroundColor: '#fdfbf7',
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '150px 20px'
            }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '120px', height: '120px', background: 'rgba(212, 175, 55, 0.1)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 30px', border: '2px solid rgba(212, 175, 55, 0.2)'
                    }}>
                        <ShoppingBag size={50} color="#d4af37" strokeWidth={1.5} />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', fontFamily: 'serif', color: '#1a1a1a' }}>Your Wishlist is Empty</h2>
                    {/* Keeping inline styles for empty state as it wasn't the main target, but could be refactored too if needed. 
                   Focus is on the grid layout. */}
                    <p style={{ marginBottom: '40px', color: '#444', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 40px' }}>
                        Curate your personal collection of artisan candles. Explore our shop to find your next aromatic masterpiece.
                    </p>
                    <Link href="/shop" className="btn-primary" style={{
                        padding: '15px 40px', borderRadius: '50px', background: '#d4af37', border: 'none',
                        color: '#fff', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase',
                        letterSpacing: '1px', boxShadow: '0 10px 20px rgba(212, 175, 55, 0.3)'
                    }}>Explore Shop</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            {/* Premium Hero Section */}
            <div className="wishlist-hero">
                <div className="wishlist-hero-overlay"></div>
                <div className="container wishlist-container">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="wishlist-title"
                    >
                        Your Curated Collection
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="wishlist-subtitle"
                    >
                        Items you've selected for your elite artisan lifestyle.
                    </motion.p>
                </div>
            </div>

            <div className="wishlist-content-container">
                <div className="wishlist-grid">
                    <AnimatePresence>
                        {wishlist.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -10 }}
                                className="wishlist-card"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.1, background: '#d4af37', color: '#fff' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="btn-remove-wishlist"
                                >
                                    <X size={20} strokeWidth={2.5} />
                                </motion.button>

                                <Link href={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="wishlist-img-wrapper">
                                        <SafeImage src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div className="wishlist-img-overlay"></div>
                                    </div>
                                    <div className="wishlist-card-content">
                                        <span className="wishlist-category">
                                            {item.category}
                                        </span>
                                        <h3 className="wishlist-item-title">
                                            {item.name}
                                        </h3>
                                        <div className="wishlist-item-price">
                                            ₹{item.price}
                                        </div>
                                    </div>
                                </Link>
                                <div className="wishlist-actions">
                                    <button
                                        onClick={() => {
                                            addToCart(item);
                                            toast.success(`${item.name} added to cart!`);
                                        }}
                                        className="btn-wishlist-add-cart"
                                    >
                                        <ShoppingCart size={18} /> ADD TO CART
                                    </button>
                                    <Link href={`/product/${item.id}`} className="link-view-details">
                                        VIEW DETAILS
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
