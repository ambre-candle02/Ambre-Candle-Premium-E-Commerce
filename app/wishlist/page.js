'use client';
import { useWishlist } from '@/src/context/WishlistContext';
import { ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import SafeImage from '@/src/components/SafeImage';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="wishlist-empty section" style={{
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
                backgroundColor: '#fdfbf7'
            }}>
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Your Wishlist is Empty</h2>
                    <p style={{ marginBottom: '40px', color: '#666' }}>Save items you love here.</p>
                    <Link href="/shop" className="btn-primary btn-gold-hover">Explore Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page section">
            <div className="container">
                <h1 style={{ marginBottom: '50px', fontSize: '2.5rem' }}>Your Wishlist</h1>
                <div className="wishlist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
                    <AnimatePresence>
                        {wishlist.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="wishlist-card"
                                style={{ position: 'relative', border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden' }}
                            >
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: '#fff', borderRadius: '50%', padding: '5px' }}
                                >
                                    <X size={18} />
                                </button>
                                <Link href={`/product/${item.id}`}>
                                    <div style={{ height: '300px' }}>
                                        <SafeImage src={item.image} alt="Ambre Candle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '20px', textAlign: 'center' }}>
                                        <h3>{item.category}</h3>
                                    </div>
                                </Link>
                                <div style={{ padding: '0 20px 20px' }}>
                                    <Link href={`/product/${item.id}`} className="btn-primary btn-gold-hover" style={{ width: '100%', textAlign: 'center', fontSize: '0.8rem' }}>
                                        View Product
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
