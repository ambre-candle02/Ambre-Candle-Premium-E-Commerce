'use client';
import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, ShieldCheck, CreditCard } from 'lucide-react';

export default function ShippingPage() {
    return (
        <div style={{ background: '#fdfbf7', minHeight: '100vh', paddingTop: 'var(--shipping-padding-top, 140px)', paddingBottom: 'var(--shipping-pb, 100px)' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: 'var(--shipping-header-mb, 60px)' }}
                >
                    <span style={{ color: '#d4af37', letterSpacing: '3px', textTransform: 'uppercase', fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', fontWeight: 'bold' }}>Delivery & Logistics</span>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--shipping-h1-size, clamp(2.5rem, 4vw, 3.5rem))', color: '#1a1a1a', marginTop: '15px', whiteSpace: 'var(--shipping-h1-ws, normal)' }}>Shipping Information</h1>
                    <div style={{ width: '60px', height: '3px', background: '#d4af37', margin: '25px auto' }}></div>
                </motion.div>

                <div style={{ display: 'grid', gap: '40px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ background: '#fff', padding: 'var(--shipping-card-padding, 40px)', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #eee' }}
                    >
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(212,175,55,0.1)', padding: '15px', borderRadius: '50%', color: '#d4af37' }}>
                                <Truck size={28} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Free Shipping Across India</h3>
                                <p style={{ color: '#666', lineHeight: '1.7' }}>
                                    At Ambre Boutique, we believe luxury should be accessible. Free shipping on orders above <strong>₹1999</strong>.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{ background: '#fff', padding: '30px', borderRadius: '24px', border: '1px solid #eee' }}
                        >
                            <Clock size={24} color="#d4af37" style={{ marginBottom: '15px' }} />
                            <h4 style={{ marginBottom: '10px' }}>Processing Time</h4>
                            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>Every candle is inspected for quality. Orders are typically processed within 24-48 hours.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{ background: '#fff', padding: '30px', borderRadius: '24px', border: '1px solid #eee' }}
                        >
                            <MapPin size={24} color="#d4af37" style={{ marginBottom: '15px' }} />
                            <h4 style={{ marginBottom: '10px' }}>Estimated Delivery</h4>
                            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>Metro cities: 4-6 business days. Other regions: 7-8 business days via premium couriers.</p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{ padding: '40px', background: '#1b1f1c', borderRadius: '24px', color: '#fff' }}
                    >
                        <h3 style={{ color: '#d4af37', marginBottom: '20px' }}>Order Tracking</h3>
                        <p style={{ opacity: 0.8, marginBottom: '25px', lineHeight: '1.7' }}>Once your masterpiece is dispatched, you will receive a tracking ID via email and SMS. You can also track your order status in the "My Orders" section of your profile.</p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <ShieldCheck size={20} color="#d4af37" />
                            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Insured shipping for transit damage.</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
