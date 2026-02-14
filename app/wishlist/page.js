'use client';
import { useState, useEffect } from 'react';
import { useWishlist } from '@/src/context/WishlistContext';
import { useCart } from '@/src/context/CartContext';
import { ShoppingBag, X, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import SafeImage from '@/src/components/SafeImage';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div style={{ minHeight: '100vh', backgroundColor: '#fdfbf7' }}></div>;
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
        <div className="wishlist-page" style={{ backgroundColor: '#fdfbf7', minHeight: '100vh' }}>
            {/* Premium Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #2c1e14 0%, #4a3728 100%)',
                padding: '180px 20px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ margin: 0, fontSize: '3.5rem', fontFamily: 'serif', color: '#d4af37', letterSpacing: '2px' }}
                    >
                        Your Curated Collection
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginTop: '15px', maxWidth: '600px', margin: '15px auto 0' }}
                    >
                        Items you've selected for your elite artisan lifestyle.
                    </motion.p>
                </div>
            </div>

            <div className="container" style={{ padding: '80px 20px', maxWidth: '1400px', margin: '0 auto' }}>
                <div className="wishlist-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '40px'
                }}>
                    <AnimatePresence>
                        {wishlist.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -10 }}
                                style={{
                                    position: 'relative', background: '#fff', borderRadius: '20px',
                                    overflow: 'hidden', border: '2px solid #d4af37',
                                    boxShadow: '0 15px 45px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <motion.button
                                    whileHover={{ scale: 1.1, background: '#d4af37', color: '#fff' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeFromWishlist(item.id)}
                                    style={{
                                        position: 'absolute', top: '20px', right: '20px', zIndex: 10,
                                        background: 'rgba(255,255,255,0.9)', borderRadius: '50%',
                                        width: '40px', height: '40px', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', border: 'none', cursor: 'pointer',
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)', color: '#d4af37'
                                    }}
                                >
                                    <X size={20} strokeWidth={2.5} />
                                </motion.button>

                                <Link href={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                                        <SafeImage src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                                            height: '80px'
                                        }}></div>
                                    </div>
                                    <div style={{ padding: '25px', textAlign: 'center' }}>
                                        <span style={{
                                            fontSize: '0.8rem', color: '#d4af37', fontWeight: '700',
                                            textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px'
                                        }}>
                                            {item.category}
                                        </span>
                                        <h3 style={{ margin: '0 0 15px', fontSize: '1.4rem', fontFamily: 'serif', color: '#1a1a1a' }}>
                                            {item.name}
                                        </h3>
                                        <div style={{ fontSize: '1.3rem', color: '#b45d06', fontWeight: '800', marginBottom: '20px' }}>
                                            ₹{item.price}
                                        </div>
                                    </div>
                                </Link>
                                <div style={{ padding: '0 25px 25px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button
                                        onClick={() => {
                                            addToCart(item);
                                            toast.success(`${item.name} added to cart!`);
                                        }}
                                        style={{
                                            background: '#1a1a1a', color: '#d4af37', padding: '14px',
                                            borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem',
                                            textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s ease',
                                            border: '1px solid #d4af37', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = '#d4af37';
                                            e.currentTarget.style.color = '#fff';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = '#1a1a1a';
                                            e.currentTarget.style.color = '#d4af37';
                                        }}
                                    >
                                        <ShoppingCart size={18} /> ADD TO CART
                                    </button>
                                    <Link href={`/product/${item.id}`} style={{
                                        color: '#666', fontSize: '0.85rem', fontWeight: '600',
                                        textAlign: 'center', textDecoration: 'none', letterSpacing: '0.5px'
                                    }}>
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
