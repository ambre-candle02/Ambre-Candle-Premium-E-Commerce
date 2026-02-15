'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SafeImage from '@/src/components/SafeImage';
import '@/src/styles/Categories.css';

const DEFAULT_CAT_IMAGE = 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770899767/ambre-candles/Favourites/mnszqowrujfkt3qhbqva.jpg';

export default function CategoriesPage() {
    return (
        <div className="categories-hero-container" style={{ padding: '0' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="categories-hero-card"
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
                            fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
                            letterSpacing: '8px',
                            marginBottom: '25px',
                            fontWeight: '300',
                            textTransform: 'uppercase',
                            lineHeight: 1,
                            textAlign: 'center'
                        }}
                    >
                        <span style={{ fontSize: '0.45em', display: 'block', letterSpacing: '14px', marginBottom: '12px', color: '#ffffff', fontWeight: '300' }}>BEGIN YOUR</span>
                        <span style={{ color: '#d4af37', fontWeight: '300', display: 'block', fontSize: '1.2em', fontFamily: "var(--font-heading)" }}>Sensory</span>
                        <span style={{ color: '#ffffff', fontWeight: '300', display: 'block', fontSize: '1.2em', fontFamily: "var(--font-heading)" }}>Journey</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        style={{ maxWidth: '600px', fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', fontWeight: 300, lineHeight: 1.6, letterSpacing: '1px', textAlign: 'center' }}
                    >
                        Choose an artisan collection from the sidebar to discover our masterfully crafted scents and elegant designs.
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}
