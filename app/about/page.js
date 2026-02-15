'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Heart, Leaf, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SafeImage from '@/src/components/SafeImage';
import { useRef } from 'react';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function AboutPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <div style={{
            background: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-body)',
            overflowX: 'hidden'
        }}>

            {/* --- Hero Section --- */}
            <section style={{
                position: 'relative',
                minHeight: '85vh', // Switched to minHeight for better content fitting
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #2d1f14 0%, #3f2a1a 100%)',
                color: '#fff',
                paddingTop: '160px', // Increased to avoid header overlap
                paddingBottom: '80px'
            }}>
                {/* Background Video/Image Placeholder - Warm Premium */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url("/images/noise.png")', // Try to use noise if valid or fallback
                    background: 'radial-gradient(circle at center, #4d3421 0%, #2d1f14 100%)',
                    opacity: 0.7,
                    zIndex: 0
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 20px' }}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.span variants={fadeInUp} style={{
                            display: 'inline-block',
                            padding: '8px 24px',
                            borderRadius: '50px',
                            border: '1px solid rgba(212,175,55,0.3)',
                            background: 'rgba(212,175,55,0.1)',
                            color: '#d4af37',
                            letterSpacing: '0.2em',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            marginBottom: '24px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            Est. 2024
                        </motion.span>
                        <motion.h1 variants={fadeInUp} style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(3rem, 5vw, 5rem)',
                            marginBottom: '32px',
                            lineHeight: '1.2'
                        }}>
                            Crafting Light, <br />
                            <span style={{ color: '#d4af37', fontStyle: 'italic' }}>Curating Moments.</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} style={{
                            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                            color: '#d1d5db',
                            maxWidth: '700px',
                            margin: '0 auto 40px',
                            lineHeight: '1.8',
                            fontWeight: '300'
                        }}>
                            Experience the art of illumination with Ambre Candle. Where sustainability meets luxury in every hand-poured drop.
                        </motion.p>
                        <motion.div variants={fadeInUp}>
                            <Link href="/collection" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: 'linear-gradient(135deg, #d4af37 0%, #b5952f 100%)',
                                color: '#000',
                                padding: '16px 32px',
                                borderRadius: '50px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                textDecoration: 'none',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                boxShadow: '0 10px 30px rgba(212,175,55,0.3)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(212,175,55,0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(212,175,55,0.3)';
                                }}
                            >
                                Explore Collection
                                <ArrowRight size={20} />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* --- Stats Section --- */}
            <section style={{
                padding: '80px 0',
                borderBottom: '1px solid rgba(212,175,55,0.2)',
                background: 'linear-gradient(135deg, #f5f1e8 0%, #ede7d9 100%)',
                borderTop: '1px solid rgba(212,175,55,0.15)'
            }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '32px',
                        textAlign: 'center'
                    }}>
                        {[
                            { label: "Happy Customers", value: "10k+" },
                            { label: "Scents Crafted", value: "50+" },
                            { label: "Natural Soy Wax", value: "100%" },
                            { label: "5-Star Ratings", value: "4.9" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                            >
                                <h3 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'clamp(2rem, 3vw, 3rem)',
                                    fontWeight: 'bold',
                                    color: '#d4af37',
                                    marginBottom: '8px'
                                }}>{stat.value}</h3>
                                <p style={{
                                    color: '#4b5563',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                }}>{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Our Story (Image Left, Text Right) --- */}
            <section id="story" style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row', // Default to row
                        flexWrap: 'wrap',
                        gap: '60px',
                        alignItems: 'center'
                    }}>

                        {/* Image Side */}
                        <motion.div
                            style={{
                                flex: '1 1 400px',
                                position: 'relative'
                            }}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div style={{
                                position: 'relative',
                                borderRadius: '30px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                border: '2px solid #d4af37', // Elite Gold Border
                                padding: '10px', // Framed Effect
                                background: '#fdfbf7', // Premium Background
                                aspectRatio: '4/5',
                                transform: 'scale(1)',
                                transition: 'transform 0.7s ease'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                <SafeImage src="https://res.cloudinary.com/dmw5efwf5/image/upload/v1770899720/ambre-candles/Favourites/fyrg1vwl7uzm2nbrl8ky.jpg" alt="Artisan pouring a candle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)' }}></div>
                            </div>
                            {/* Floating Element removed as it was hidden/redundant */}
                        </motion.div>

                        {/* Text Side */}
                        <motion.div
                            style={{ flex: '1 1 400px' }}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h4 style={{ color: '#d4af37', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px', fontSize: '0.875rem' }}>Our Philosophy</h4>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: '#1b1f1c', marginBottom: '32px', lineHeight: '1.1' }}>
                                More Than Just <br /> <i style={{ color: '#9ca3af' }}>Wax &amp; Wick.</i>
                            </h2>
                            <p style={{ color: '#4b5563', fontSize: '1.125rem', marginBottom: '24px', lineHeight: '1.7' }}>
                                At Ambre Candle, we believe that a candle is more than just a source of light&mdash;it&apos;s a catalyst for atmosphere, a vessel for memory, and a ritual of self-care.
                            </p>
                            <p style={{ color: '#4b5563', fontSize: '1.125rem', marginBottom: '40px', lineHeight: '1.7' }}>
                                Our journey began with a simple obsession: to create the perfect burn. Using only 100% natural soy wax and ethically sourced fragrance oils, we hand-pour every single candle in small batches to ensure perfection.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{ padding: '12px', background: '#fdfbf7', borderRadius: '50%', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}>
                                        <Leaf size={24} />
                                    </div>
                                    <div>
                                        <h5 style={{ fontWeight: 'bold', color: '#1b1f1c', marginBottom: '4px', fontSize: '1rem' }}>Eco-Friendly</h5>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sustainably sourced materials.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{ padding: '12px', background: '#fdfbf7', borderRadius: '50%', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}>
                                        <Heart size={24} />
                                    </div>
                                    <div>
                                        <h5 style={{ fontWeight: 'bold', color: '#1b1f1c', marginBottom: '4px', fontSize: '1rem' }}>Handcrafted</h5>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Made with love & care.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- Values Section --- */}
            <section style={{ padding: '100px 0', background: '#1b1f1c', color: '#fff' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <motion.div
                        style={{ textAlign: 'center', marginBottom: '60px' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: '16px' }}>Our Core Values</h2>
                        <div style={{ width: '80px', height: '4px', background: '#d4af37', margin: '0 auto', borderRadius: '2px' }}></div>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        {[
                            {
                                icon: Sparkles,
                                title: "Artisan Excellence",
                                desc: "We don't mass produce. Each candle is a work of art, crafted with attention to the smallest detail."
                            },
                            {
                                icon: Leaf,
                                title: "Sustainable Luxury",
                                desc: "Luxury shouldn't cost the earth. We use biodegradable soy wax and recyclable packaging."
                            },
                            {
                                icon: Award,
                                title: "Premium Quality",
                                desc: "We source the finest fragrance oils to ensure a potent yet pleasant scent throw that lasts."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '40px',
                                    borderRadius: '24px',
                                    border: '1px solid #d4af37',
                                    transition: 'background 0.3s ease'
                                }}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            >
                                <item.icon size={48} color="#d4af37" style={{ marginBottom: '24px' }} />
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '16px', fontWeight: 'bold' }}>{item.title}</h3>
                                <p style={{ color: '#d1d5db', lineHeight: '1.7' }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA Section --- */}
            <section style={{ padding: '120px 0', position: 'relative', background: '#fdfbf7', overflow: 'hidden', textAlign: 'center' }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.05,
                    pointerEvents: 'none'
                }}>
                    <h1 style={{ fontSize: '20vw', fontFamily: 'var(--font-heading)', fontWeight: '900', color: '#000', margin: 0 }}>AMBRE</h1>
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 10, padding: '0 20px' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: '#1b1f1c', marginBottom: '32px', lineHeight: '1.1' }}>
                            Ready to Transform<br />Your Space?
                        </h2>
                        <Link href="/collection" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'linear-gradient(135deg, #d4af37 0%, #b5952f 100%)',
                            color: '#000',
                            padding: '20px 48px',
                            borderRadius: '50px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            textDecoration: 'none',
                            boxShadow: '0 20px 50px rgba(212,175,55,0.3)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 25px 60px rgba(212,175,55,0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 20px 50px rgba(212,175,55,0.3)';
                            }}
                        >
                            Shop The Collection
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
