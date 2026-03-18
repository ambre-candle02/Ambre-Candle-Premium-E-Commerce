'use client';
import { motion } from 'framer-motion';
import { RefreshCcw, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReturnsPage() {
    return (
        <div style={{ background: '#fff', minHeight: '100vh', paddingTop: 'calc(var(--header-height) + 20px)', paddingBottom: 'var(--returns-pb, 100px)' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '60px' }}
                >
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: '#1a1a1a' }}>Return Policy</h1>
                    <p style={{ color: '#d4af37', fontSize: '1.1rem', marginTop: '10px' }}>Our commitment to your satisfaction</p>
                    <div style={{ width: '50px', height: '2px', background: '#d4af37', margin: '30px auto' }}></div>
                </motion.div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
                    <section>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <RefreshCcw size={24} color="#d4af37" /> Return Eligibility
                        </h3>
                        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05rem' }}>
                            We accept returns within <strong>7 days</strong> of delivery if the product is unused, in its original packaging, and in the same condition as received. Due to the delicate nature of artisanal candles, burnt or used candles cannot be returned.
                        </p>
                    </section>

                    <section style={{ background: '#fdfbf7', padding: '30px', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.1)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ShieldCheck size={24} color="#d4af37" /> Damaged in Transit
                        </h3>
                        <p style={{ color: '#555', lineHeight: '1.8' }}>
                            If your candle arrives damaged or broken, please notify us within 24 hours of delivery. Send a photo of the damaged item and packaging to <strong>ambrecandle@gmail.com</strong>, and we will ship a replacement immediately.
                        </p>
                    </section>

                    <section>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <AlertCircle size={24} color="#d4af37" /> Refund Process
                        </h3>
                        <p style={{ color: '#555', lineHeight: '1.8' }}>
                            Once your return is received and inspected, we will process your refund to the original payment method within 5-7 business days. For COD orders, we will request your bank details for a secure transfer.
                        </p>
                    </section>

                    <div style={{ marginTop: '40px', textAlign: 'center', padding: '40px', borderTop: '1px solid #eee' }}>
                        <HelpCircle size={32} color="#d4af37" style={{ marginBottom: '20px' }} />
                        <h3>Need more help?</h3>
                        <p style={{ color: '#666', marginBottom: '25px' }}>Our concierge team is available 24/7 for any inquiries.</p>
                        <Link href="/contact" className="btn-primary" style={{ padding: '15px 40px', whiteSpace: 'var(--returns-btn-ws, normal)' }}>Contact Support</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
