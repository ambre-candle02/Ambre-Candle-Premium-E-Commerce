'use client';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div style={{ background: '#fdfbf7', minHeight: '100vh', paddingTop: 'var(--privacy-padding-top, calc(var(--header-height) + 40px))', paddingBottom: 'var(--privacy-pb, 100px)' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: 'var(--privacy-header-mb, 60px)' }}
                >
                    <span style={{ color: '#d4af37', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 'bold' }}>Trust & Safety</span>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: '#1a1a1a', marginTop: '15px' }}>Privacy Policy</h1>
                    <div style={{ width: '60px', height: '3px', background: '#d4af37', margin: '25px auto' }}></div>
                </motion.div>

                <div style={{ background: '#fff', padding: 'var(--privacy-card-padding, 50px)', borderRadius: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                    <section style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', color: '#d4af37' }}>
                            <Shield size={24} />
                            <h2 style={{ fontSize: 'var(--privacy-h2-size, 1.5rem)', margin: 0, color: '#1a1a1a', whiteSpace: 'var(--privacy-h2-ws, normal)' }}>Data Protection</h2>
                        </div>
                        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
                            At Ambre Candle, your privacy is our priority. We only collect essential information required to process your orders and enhance your shopping experience. This includes your name, shipping address, and contact details.
                        </p>
                    </section>

                    <section style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', color: '#d4af37' }}>
                            <Lock size={24} />
                            <h2 style={{ fontSize: 'var(--privacy-h2-size, 1.5rem)', margin: 0, color: '#1a1a1a', whiteSpace: 'var(--privacy-h2-ws, normal)' }}>Secure Payments</h2>
                        </div>
                        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
                            All financial transactions are handled through secure, encrypted payment gateways. We do not store your credit card or sensitive banking information on our servers.
                        </p>
                    </section>

                    <section style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', color: '#d4af37' }}>
                            <Eye size={24} />
                            <h2 style={{ fontSize: 'var(--privacy-h2-size, 1.5rem)', margin: 0, color: '#1a1a1a', whiteSpace: 'var(--privacy-h2-ws, normal)' }}>Transparency</h2>
                        </div>
                        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
                            We do not sell, trade, or otherwise transfer your personal information to outside parties. Your data is used strictly for fulfillment and personalized communication from Ambre Candle.
                        </p>
                    </section>

                    <div style={{ marginTop: '50px', pt: '30px', borderTop: '1px solid #eee', textAlign: 'center' }}>
                        <p style={{ color: '#999', fontSize: '0.9rem', fontStyle: 'italic' }}>Last Updated: March 2024</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
