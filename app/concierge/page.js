'use client';
import { motion } from 'framer-motion';
import { Sparkles, Gift, Key, MessageSquare, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export default function ConciergePage() {
    return (
        <div style={{ background: '#1b1f1c', color: '#fff', minHeight: '100vh', paddingTop: 'calc(var(--header-height) + 20px)', paddingBottom: 'var(--concierge-pb, 100px)' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', marginBottom: '60px' }}
                >
                    <Sparkles size={32} color="#d4af37" style={{ marginBottom: '15px' }} />
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', marginBottom: '15px' }}>The Concierge</h1>
                    <p style={{ color: '#d4af37', fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.9 }}>Bespoke Services for the Discerning Client</p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--concierge-grid-gap, 40px)', marginBottom: 'var(--concierge-grid-mb, 80px)' }}>
                    <motion.div
                        whileHover={{ y: -10 }}
                        style={{ background: 'rgba(255,255,255,0.05)', padding: '50px 40px', borderRadius: '30px', border: '1px solid rgba(212,175,55,0.2)', textAlign: 'center' }}
                    >
                        <Gift size={32} color="#d4af37" style={{ marginBottom: '25px', display: 'inline-block' }} />
                        <h3 style={{ fontSize: '1.6rem', marginBottom: '15px' }}>Corporate Gifting</h3>
                        <p style={{ color: '#999', lineHeight: '1.7', marginBottom: '25px' }}>Custom curation and branding for corporate events, weddings, and elite gatherings.</p>
                        <Link href="/contact" style={{ color: '#d4af37', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem' }}>ENQUIRE NOW &gt;</Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -10 }}
                        style={{ background: 'rgba(255,255,255,0.05)', padding: '50px 40px', borderRadius: '30px', border: '1px solid #d4af37', textAlign: 'center' }}
                    >
                        <Key size={32} color="#d4af37" style={{ marginBottom: '25px', display: 'inline-block' }} />
                        <h3 style={{ fontSize: '1.6rem', marginBottom: '15px' }}>Scent Consultation</h3>
                        <p style={{ color: '#999', lineHeight: '1.7', marginBottom: '25px' }}>One-on-one sessions to find the perfect signature scent for your home or persona.</p>
                        <Link href="/contact" style={{ color: '#d4af37', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem' }}>BOOK SESSION &gt;</Link>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--concierge-assist-pt, 60px)' }}
                >
                    <h2 style={{ marginBottom: 'var(--concierge-assist-mb, 40px)', fontSize: '1.5rem' }}>Immediate Assistance</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--concierge-assist-gap, 40px)', flexWrap: 'wrap' }}>
                        <a href="tel:+918577079877" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>
                            <PhoneCall size={20} color="#d4af37" /> +91 85770 79877
                        </a>
                        <a href="https://api.whatsapp.com/send?phone=918577079877" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>
                            <MessageSquare size={20} color="#25D366" /> WhatsApp Support
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
