'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SafeImage from '@/src/components/SafeImage';
import '@/src/styles/Categories.css';

const DEFAULT_CAT_IMAGE = 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770899767/ambre-candles/Favourites/mnszqowrujfkt3qhbqva.jpg';

export default function CategoriesPage() {
    return (
        <div className="categories-explorer-right">
            {/* HERO SECTION - Right Side */}
            <div className="categories-hero-container" style={{ padding: '20px' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="categories-hero-card"
                    style={{
                        minHeight: '400px',
                        border: '2px solid #d4af37',
                        borderRadius: '30px',
                        overflow: 'hidden'
                    }}
                >
                    <SafeImage
                        src={DEFAULT_CAT_IMAGE}
                        alt="Featured Candle"
                        className="categories-hero-img"
                    />

                    <div className="categories-hero-overlay">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            style={{ marginBottom: '20px' }}
                        >
                            <Sparkles size={64} color="#d4af37" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                                letterSpacing: '8px',
                                marginBottom: '25px',
                                fontWeight: '300',
                                textTransform: 'uppercase'
                            }}
                        >
                            Begin Your <br />
                            <span style={{ color: '#d4af37', fontWeight: '400' }}>Sensory Journey</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            style={{
                                maxWidth: '600px',
                                fontSize: '1.2rem',
                                color: 'rgba(255,255,255,0.8)',
                                fontWeight: 300,
                                lineHeight: 1.8,
                                letterSpacing: '1px'
                            }}
                        >
                            Choose an artisan collection from the sidebar to discover our masterfully crafted scents and elegant designs.
                        </motion.p>

                        <motion.div
                            className="hero-scroll-dots"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            style={{ display: 'flex', gap: '15px', marginTop: '40px' }}
                        >
                            <div className="dot active"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
