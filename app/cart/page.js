'use client';
import { useCart } from '@/src/context/CartContext';
import SafeImage from '@/src/components/SafeImage';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import '@/src/styles/Cart.css';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, subtotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="container cart-empty-container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="empty-icon-wrapper"
                    >
                        <ShoppingBag size={80} strokeWidth={1} />
                    </motion.div>
                    <h2 className="cart-empty-title">The Gallery is Quiet</h2>
                    <p className="cart-empty-text">Your curated collection is waiting for its first masterpiece.</p>
                    <Link href="/shop" className="checkout-btn" style={{ maxWidth: '300px', margin: '0 auto', textDecoration: 'none' }}>
                        Browse Collection
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                {/* Midnight Hero Portal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="cart-hero-portal"
                >
                    <div className="cart-hero-content">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="cart-hero-subtitle"
                        >
                            <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                            Private Selection
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="cart-hero-title"
                        >
                            Your Collection
                        </motion.h1>
                    </div>
                </motion.div>

                <div className="cart-layout">
                    {/* Item Gallery */}
                    <div className="cart-items">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                                    transition={{ duration: 0.8, delay: index * 0.15, ease: [0.19, 1, 0.22, 1] }}
                                    className="cart-item"
                                >
                                    <div className="cart-item-image">
                                        <SafeImage src={item.image} alt={item.name} />
                                    </div>
                                    <div className="cart-item-details">
                                        <div className="item-category">
                                            {item.category || 'Artisan Series'}
                                        </div>
                                        <h3>{item.name}</h3>

                                        <div className="item-controls">
                                            <div className="quantity-control">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                                            </div>

                                            <div className="item-price-display">
                                                <p className="item-total-price">₹{item.price * item.quantity}</p>
                                            </div>

                                            <button onClick={() => removeFromCart(item.id)} className="remove-btn" title="Remove from collection">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        {/* View Product Button */}
                                        <Link
                                            href={`/product/${item.id}`}
                                            style={{
                                                display: 'inline-block',
                                                marginTop: '15px',
                                                padding: '10px 24px',
                                                background: 'transparent',
                                                color: '#d4af37',
                                                textDecoration: 'none',
                                                borderRadius: '25px',
                                                fontSize: '0.9rem',
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease',
                                                border: '2px solid #d4af37',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#d4af37';
                                                e.currentTarget.style.color = '#fff';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = '#d4af37';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            View Product
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Royal Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="cart-summary"
                    >
                        <h2>Collection Summary</h2>
                        <div className="summary-row">
                            <span>Boutique Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="summary-row">
                            <span>Artisan Delivery</span>
                            <span style={{ color: '#d4af37', fontWeight: '900' }}>Complimentary</span>
                        </div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span>₹{subtotal}</span>
                        </div>

                        <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                                <ShieldCheck size={16} color="#d4af37" />
                                <span>Authenticity Guaranteed</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                                <Truck size={16} color="#d4af37" />
                                <span>Premium Insured Shipping</span>
                            </div>
                        </div>

                        <Link href="/checkout" style={{ textDecoration: 'none' }}>
                            <button className="checkout-btn">
                                Complete Order <ArrowRight size={22} style={{ marginLeft: '15px' }} />
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* Complete Your Collection - Gallery Format */}
                <div className="cart-extra-sections">
                    <div className="section-header-elite">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            Complete Your Collection
                        </motion.h2>
                        <div className="section-accent-line"></div>
                    </div>

                    <div className="cart-collection-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '40px'
                    }}>
                        {[
                            { title: 'The Hampers', path: '/categories/Hampers%20|%20Combo', img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770840787/ambre-candles/Hampers_%7C_Combo/lxpbksaxenyc77vrmatf.jpg' },
                            { title: 'The Glass Jars', path: '/categories/Glass%20Jar%20Candle', img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770841201/ambre-candles/Glass_Jar_Candle/niww0h7vjrk9dxnnynrb.jpg' },
                            { title: 'The Bouquets', path: '/categories/Bouquet%20Candle', img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770831575/ambre-candles/Bouquet%20Candle/vjq28br0vds2dh0va5np.jpg' },
                            { title: 'The Festive', path: '/categories/Diwali', img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770837023/ambre-candles/Diwali/ixm6kmfkiwgbu57zrztm.jpg' }
                        ].map((cat, idx) => (
                            <Link key={idx} href={cat.path} className="cart-cat-card" style={{ textDecoration: 'none' }}>
                                <motion.div whileHover={{ y: -10 }}>
                                    <div className="cat-image-wrap">
                                        <SafeImage src={cat.img} alt={cat.title} />
                                    </div>
                                    <h3>{cat.title}</h3>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
