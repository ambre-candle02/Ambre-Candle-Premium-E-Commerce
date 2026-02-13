'use client';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

const Footer = () => {
    const pathname = usePathname();

    if (pathname && pathname.startsWith('/admin')) {
        return null;
    }
    return (
        <footer className="footer" suppressHydrationWarning>
            <div className="container footer-main" suppressHydrationWarning>
                <div className="footer-grid" suppressHydrationWarning>
                    {/* Brand Section */}
                    <div className="footer-brand" suppressHydrationWarning>
                        <Link href="/" className="footer-logo-wrap" style={{ transform: 'scale(0.9)', originX: 0, display: 'block', marginBottom: '30px' }} suppressHydrationWarning>
                            <Logo />
                        </Link>
                        <p className="footer-mission">
                            Handcrafted luxury candles for the conscious home. Every jar is a journey into sensory bliss.
                        </p>
                        <div className="footer-social-v2" style={{ marginTop: '30px', display: 'flex', gap: '20px' }} suppressHydrationWarning>
                            <motion.a whileHover={{ y: -5, color: '#d4af37', borderColor: '#d4af37' }} href="https://www.instagram.com/candleambre?igsh=cmM3MDR2dndocWEx&utm_source=qr" target="_blank" rel="noopener noreferrer"><Instagram size={22} /></motion.a>
                            <motion.a whileHover={{ y: -5, color: '#d4af37', borderColor: '#d4af37' }} href="https://www.facebook.com/share/1Cgib9LvU7/" target="_blank" rel="noopener noreferrer"><Facebook size={22} /></motion.a>
                            <motion.a whileHover={{ y: -5, color: '#d4af37', borderColor: '#d4af37' }} href="https://twitter.com" target="_blank" rel="noopener noreferrer"><Twitter size={22} /></motion.a>
                            <motion.a whileHover={{ y: -5, color: '#d4af37', borderColor: '#d4af37' }} href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><Linkedin size={22} /></motion.a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="footer-nav-col" suppressHydrationWarning>
                        <h4>Explore</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }} suppressHydrationWarning>
                            <li><Link href="/shop" suppressHydrationWarning>All Candles</Link></li>
                            <li><Link href="/shop" suppressHydrationWarning>Best Sellers</Link></li>
                            <li><Link href="/shop" suppressHydrationWarning>Gift Sets</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="footer-nav-col" suppressHydrationWarning>
                        <h4>Company</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }} suppressHydrationWarning>
                            <li><Link href="/about" suppressHydrationWarning>Our Story</Link></li>
                            <li><Link href="/contact" suppressHydrationWarning>Get in Touch</Link></li>
                            <li><Link href="/quiz" suppressHydrationWarning>Scent Quiz</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="footer-nav-col" suppressHydrationWarning>
                        <h4>Concierge</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }} suppressHydrationWarning>
                            <li><Link href="/contact" suppressHydrationWarning>Shipping Details</Link></li>
                            <li><Link href="/contact" suppressHydrationWarning>Return Policy</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom-v2" suppressHydrationWarning>
                <div className="container bottom-content" suppressHydrationWarning>
                    <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Ambre Candle. Crafted for Excellence.</p>
                    <div className="bottom-links" suppressHydrationWarning>
                        <Link href="/contact" suppressHydrationWarning>Privacy Policy</Link>
                        <Link href="/contact" suppressHydrationWarning>Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
