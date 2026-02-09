'use client';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-main">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <Link href="/" className="footer-logo-wrap" style={{ transform: 'scale(0.9)', originX: 0, display: 'block', marginBottom: '30px' }}>
                            <Logo />
                        </Link>
                        <p className="footer-mission">
                            Handcrafted luxury candles for the conscious home. Every jar is a journey into sensory bliss.
                        </p>
                        <div className="footer-social-v2" style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
                            <motion.a whileHover={{ y: -5, color: '#d4af37', borderColor: '#d4af37' }} href="https://www.instagram.com/candleambre?igsh=cmM3MDR2dndocWEx&utm_source=qr" target="_blank" rel="noopener noreferrer"><Instagram size={22} /></motion.a>
                            <motion.a whileHover={{ y: -5, color: '#d4af37', borderColor: '#d4af37' }} href="https://www.facebook.com/share/1Cgib9LvU7/" target="_blank" rel="noopener noreferrer"><Facebook size={22} /></motion.a>
                            <motion.a whileHover={{ y: -5, color: '#d4af37', borderColor: '#d4af37' }} href="https://twitter.com" target="_blank" rel="noopener noreferrer"><Twitter size={22} /></motion.a>
                            <motion.a whileHover={{ y: -5, color: '#d4af37', borderColor: '#d4af37' }} href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><Linkedin size={22} /></motion.a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="footer-nav-col">
                        <h4>Explore</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li><Link href="/shop">All Candles</Link></li>
                            <li><Link href="/shop">Best Sellers</Link></li>
                            <li><Link href="/shop">Gift Sets</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="footer-nav-col">
                        <h4>Company</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li><Link href="/about">Our Story</Link></li>
                            <li><Link href="/contact">Get in Touch</Link></li>
                            <li><Link href="/quiz">Scent Quiz</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="footer-nav-col">
                        <h4>Concierge</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li><Link href="/contact">Shipping Details</Link></li>
                            <li><Link href="/contact">Return Policy</Link></li>
                            <li><Link href="/admin" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>Admin Access</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom-v2">
                <div className="container bottom-content">
                    <p style={{ margin: 0 }}>&copy; 2026 Ambre Candle. Crafted for Excellence.</p>
                    <div className="bottom-links">
                        <Link href="/contact">Privacy Policy</Link>
                        <Link href="/contact">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
