'use client';
import { motion } from 'framer-motion';
import { Scale, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
    return (
        <div style={{ background: '#fdfbf7', minHeight: '100vh', paddingTop: 'var(--terms-padding-top, calc(var(--header-height) + 40px))', paddingBottom: 'var(--terms-pb, 100px)' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: 'var(--terms-header-mb, 60px)' }}
                >
                    <span style={{ color: '#d4af37', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 'bold' }}>Legal Governance</span>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: '#1a1a1a', marginTop: '15px' }}>Terms of Service</h1>
                    <div style={{ width: '60px', height: '3px', background: '#d4af37', margin: '25px auto' }}></div>
                </motion.div>

                <div style={{ background: '#fff', padding: 'var(--terms-card-padding, 50px)', borderRadius: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                    <section style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', color: '#d4af37' }}>
                            <Scale size={24} />
                            <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#1a1a1a' }}>Terms of Use</h2>
                        </div>
                        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
                            By accessing and placing an order with Ambre Candle, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below.
                        </p>
                    </section>

                    <section style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', color: '#d4af37' }}>
                            <CheckCircle size={24} />
                            <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#1a1a1a' }}>Product Quality</h2>
                        </div>
                        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
                            Our candles are handmade. Natural variations in color and texture are signs of artisan craftsmanship and are not considered defects. We ensure every product meets our premium luxury standards before shipping.
                        </p>
                    </section>

                    <section style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', color: '#d4af37' }}>
                            <FileText size={24} />
                            <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#1a1a1a' }}>Order Cancellation</h2>
                        </div>
                        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
                            Orders can be cancelled within 12 hours of placement before they enter the shipping process. Once dispatched, our standard return and refund policies will apply.
                        </p>
                    </section>

                    <div style={{ marginTop: '50px', pt: '30px', borderTop: '1px solid #eee', textAlign: 'center' }}>
                        <p style={{ color: '#999', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '20px' }}>Last Updated: March 2024</p>
                        <Link href="/contact" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }}>
                            Questions? Contact Legal Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
