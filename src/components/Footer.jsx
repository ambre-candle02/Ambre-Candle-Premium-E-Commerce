'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

const Footer = () => {
    const pathname = usePathname();
    const [year, setYear] = useState(2026);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setIsSubscribed(true);
                setEmail('');
            } else {
                const data = await response.json();
                console.error('Newsletter Error:', data.message);
                if (response.status === 200) setIsSubscribed(true);
            }
        } catch (error) {
            console.error('Newsletter Connection Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (pathname && pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="footer">
            {/* Newsletter Section */}
            <div className="footer-newsletter">
                <div className="container newsletter-content">
                    <div className="newsletter-text">
                        <h3>Stay in the Glow</h3>
                        <p>Join our candle community for new scents, exclusive releases and cozy inspiration.</p>
                    </div>
                    
                    {isSubscribed ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="newsletter-success"
                            style={{ 
                                color: '#d4af37', 
                                fontWeight: '700', 
                                fontSize: '1.2rem',
                                border: '1px solid #d4af37',
                                padding: '15px 30px',
                                borderRadius: '5px',
                                background: 'rgba(212, 175, 55, 0.05)'
                            }}
                        >
                            Thank you! You're in the glow. ✨
                        </motion.div>
                    ) : (
                        <form className="newsletter-form" onSubmit={handleSubscribe}>
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                                style={{ opacity: isSubmitting ? 0.7 : 1 }}
                            />
                            <motion.button 
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={!isSubmitting ? { scale: 1.02, y: -2, boxShadow: '0 5px 15px rgba(212, 175, 55, 0.3)' } : {}}
                                whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                                style={{ 
                                    opacity: isSubmitting ? 0.8 : 1,
                                    cursor: isSubmitting ? 'wait' : 'pointer'
                                }}
                            >
                                {isSubmitting ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.2)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                        JOINING...
                                    </span>
                                ) : 'SUBSCRIBE'}
                            </motion.button>
                        </form>
                    )}
                </div>
            </div>

            <div className="container footer-main">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <Link href="/" className="footer-logo-wrap">
                            <div style={{ transform: 'scale(0.9)', display: 'inline-block' }}>
                                <Logo />
                            </div>
                        </Link>
                        <p className="footer-mission">
                            Handcrafted luxury candles for the conscious home. Every jar is a journey into sensory bliss.
                        </p>
                        <div className="footer-social-v2">
                            <motion.a className="social-link instagram" whileHover={{ y: -5 }} href="https://www.instagram.com/candleambre/" target="_blank" rel="noopener noreferrer"><Instagram size={22} /></motion.a>
                            <motion.a className="social-link facebook" whileHover={{ y: -5 }} href="https://www.facebook.com/share/1Cgib9LvU7/" target="_blank" rel="noopener noreferrer"><Facebook size={22} /></motion.a>
                            <motion.a className="social-link twitter" whileHover={{ y: -5 }} href="#" target="_blank" rel="noopener noreferrer"><Twitter size={22} /></motion.a>
                            <motion.a className="social-link linkedin" whileHover={{ y: -5 }} href="#" target="_blank" rel="noopener noreferrer"><Linkedin size={22} /></motion.a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="footer-nav-col">
                        <h4>Explore Collection</h4>
                        <ul>
                            <li><Link href="/shop">All Candles</Link></li>
                            <li><Link href="/shop?sort=Bestsellers">Best Sellers</Link></li>
                            <li><Link href="/shop?category=Hampers%20%7C%20Combo">Gift Sets</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="footer-nav-col">
                        <h4>Company</h4>
                        <ul>
                            <li><Link href="/about">Our Story</Link></li>
                            <li><Link href="/contact">Get in Touch</Link></li>
                            <li><Link href="/quiz">Scent Quiz</Link></li>
                            <li><Link href="/concierge">The Concierge</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="footer-nav-col">
                        <h4>Support</h4>
                        <ul>
                            <li><Link href="/shipping">Shipping Details</Link></li>
                            <li><Link href="/returns">Return Policy</Link></li>
                            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link href="/terms-of-service">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom-v2">
                <div className="container bottom-content">
                    <div className="bottom-links">
                        <Link href="/privacy-policy">Privacy Policy</Link>
                        <Link href="/terms-of-service">Terms of Service</Link>
                    </div>
                    
                    {/* Payment Icons - Colorful Brand Badges */}
                    <div className="payment-icons" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.6rem', opacity: 0.5, letterSpacing: '1px', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>Secure:</span>
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                            {/* Visa */}
                            <span style={{ background: '#1A1F71', color: '#fff', fontSize: '0.65rem', fontWeight: 900, fontStyle: 'italic', padding: '3px 8px', borderRadius: '4px', letterSpacing: '1px' }}>VISA</span>
                            {/* Mastercard */}
                            <span style={{ background: '#fff', padding: '3px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0' }}>
                                <span style={{ width: '14px', height: '14px', background: '#EB001B', borderRadius: '50%', display: 'inline-block' }}></span>
                                <span style={{ width: '14px', height: '14px', background: '#F79E1B', borderRadius: '50%', display: 'inline-block', marginLeft: '-6px' }}></span>
                            </span>
                            {/* UPI */}
                            <span style={{ background: 'linear-gradient(135deg, #6926e4, #00b9f1)', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '3px 7px', borderRadius: '4px', letterSpacing: '0.5px' }}>UPI</span>
                            {/* PayPal */}
                            <span style={{ background: '#fff', color: '#003087', fontSize: '0.6rem', fontWeight: 900, padding: '3px 7px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                                <span style={{ color: '#003087' }}>Pay</span><span style={{ color: '#009CDE' }}>Pal</span>
                            </span>
                            {/* Razorpay */}
                            <span style={{ background: '#3395FF', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '3px 7px', borderRadius: '4px', letterSpacing: '0.5px' }}>Razorpay</span>
                        </div>
                    </div>

                    <p className="footer-copyright-text" style={{ margin: 0, opacity: 0.7 }}>&copy; {year} Ambre Candle. Crafted for Excellence.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
