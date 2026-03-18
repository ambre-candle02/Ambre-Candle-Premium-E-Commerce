'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Heart, Leaf, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SafeImage from '@/src/components/SafeImage';
import { useRef } from 'react';
import '@/src/styles/About.css';

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
    const router = useRouter();

    return (
        <div className="about-page-wrapper">
            <section className="about-hero-section">
                <SafeImage
                    src="https://res.cloudinary.com/dmw5efwf5/image/upload/v1773649152/ambre-candles/Favourites/u9djvn3wnfqgfxya0ymg.jpg"
                    alt="Ambre Heritage"
                    priority={true}
                    className="about-hero-bg-visual"
                    style={{ position: 'absolute', inset: 0, zIndex: 0 }}
                />

                <div style={{ position: 'absolute', top: '110px', left: '5%', zIndex: 20 }}>
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="desktop-only-back-btn"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#d4af37',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            background: 'rgba(212, 175, 55, 0.1)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            padding: '10px 20px',
                            borderRadius: '50px',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease'
                        }}
                        onClick={() => router.back()}
                    >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </motion.button>
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                        <motion.span variants={fadeInUp} className="philosophy-tag" style={{ 
                            color: '#e8ca6b', 
                            border: '1px solid rgba(212, 175, 55, 0.8)', 
                            background: 'rgba(0, 0, 0, 0.65)', 
                            padding: '10px 24px', 
                            borderRadius: '12px', 
                            display: 'inline-flex', 
                            alignItems: 'center',
                            marginTop: '30px', 
                            marginBottom: '30px',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
                            fontWeight: '800',
                            letterSpacing: '3px',
                            fontSize: '0.75rem'
                        }}>
                            Est. 2024
                        </motion.span>
                        <motion.h1 variants={fadeInUp} style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 5vw, 6rem)', color: '#fff', marginBottom: '30px', lineHeight: '1.1' }}>
                            Crafting Light, <br />
                            <span style={{ color: '#d4af37', fontStyle: 'italic' }}>Curating Moments.</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} style={{ fontSize: '1.25rem', color: '#d1d5db', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.8' }}>
                            Experience the art of illumination with Ambre Candle. Where sustainability meets luxury in every hand-poured drop.
                        </motion.p>
                        <motion.div variants={fadeInUp}>
                            <Link href="/shop" className="about-cta-btn">
                                Explore Collection
                                <ArrowRight size={20} />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* --- Stats Strip --- */}
            <section className="stats-strip">
                <div className="container">
                    <div className="stats-grid">
                        {[
                            { label: "Happy Customers", value: "10k+", icon: Heart },
                            { label: "Scents Crafted", value: "50+", icon: Sparkles },
                            { label: "Natural Soy Wax", value: "100%", icon: Leaf },
                            { label: "5-Star Ratings", value: "4.9", icon: Award }
                        ].map((stat, index) => (
                            <motion.div key={index} className="stat-box" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                                <div className="feature-icon" style={{ margin: '0 auto 15px' }}>
                                    <stat.icon size={22} />
                                </div>
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Our Story Section --- */}
            <section className="about-story-section">
                <div className="container">
                    {/* Desktop View */}
                    <div className="desktop-about-content">
                        <div className="about-story-grid">
                            <motion.div className="about-image-wrapper" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                <div className="about-image-frame">
                                    <SafeImage
                                        src="https://res.cloudinary.com/dmw5efwf5/image/upload/v1770899720/ambre-candles/Favourites/fyrg1vwl7uzm2nbrl8ky.jpg"
                                        alt="Artisan pouring a candle"
                                    />
                                </div>
                            </motion.div>

                            <motion.div className="about-content" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                <span className="philosophy-tag">Our Philosophy</span>
                                <h2 className="about-heading">More Than Just <br /> <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Wax & Wick.</span></h2>
                                <p className="about-text">At Ambre Candle, we believe that a candle is more than just a source of light—it's a catalyst for atmosphere, a vessel for memory, and a ritual of self-care.</p>
                                <p className="about-text">Our journey began with a simple obsession: to create the perfect burn. Using only 100% natural soy wax and ethically sourced fragrance oils, we hand-pour every candle.</p>

                                <div className="about-features">
                                    <div className="feature-item">
                                        <div className="feature-icon"><Leaf size={24} /></div>
                                        <div className="feature-info">
                                            <h5>Eco-Friendly</h5>
                                            <p>Sustainably sourced materials.</p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon"><Heart size={24} /></div>
                                        <div className="feature-info">
                                            <h5>Handcrafted</h5>
                                            <p>Made with love & care.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="mobile-swipe-about-wrap">
                        <div style={{ textAlign: 'center' }}>
                            <div className="mobile-philosophy-image">
                                <SafeImage
                                    src="https://res.cloudinary.com/dmw5efwf5/image/upload/v1770899720/ambre-candles/Favourites/fyrg1vwl7uzm2nbrl8ky.jpg"
                                    alt="Artistry"
                                />
                            </div>
                            <span className="philosophy-tag">Our Philosophy</span>
                            <h2 className="about-heading">
                                More Than Just <br /><span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Wax & Wick.</span>
                            </h2>
                            <p className="about-text">
                                A catalyst for atmosphere, a vessel for memory, and a ritual of self-care. Hand-poured in small batches.
                            </p>
                            <div className="mobile-feature-box">
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Leaf size={28} color="#d4af37" />
                                    <span style={{ fontSize: '0.65rem', fontWeight: '800', marginTop: '10px', color: '#1b1f1c' }}>ECO-FRIENDLY</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Heart size={28} color="#d4af37" />
                                    <span style={{ fontSize: '0.65rem', fontWeight: '800', marginTop: '10px', color: '#1b1f1c' }}>HANDCRAFTED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Values Section --- */}
            <section className="values-section">
                <div className="container">
                    {/* Desktop View Grid */}
                    <div className="desktop-about-content">
                        <div className="section-header">
                            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Our Core Values</motion.h2>
                            <div className="header-line"></div>
                        </div>

                        <div className="values-grid">
                            {[
                                { icon: Sparkles, title: "Artisan Excellence", desc: "We don't mass produce. Each candle is a work of art, crafted with attention to the smallest detail." },
                                { icon: Leaf, title: "Sustainable Luxury", desc: "Luxury shouldn't cost the earth. We use biodegradable soy wax and recyclable packaging." },
                                { icon: Award, title: "Premium Quality", desc: "We source the finest fragrance oils to ensure a potent yet pleasant scent throw that lasts." }
                            ].map((item, i) => (
                                <motion.div key={i} className="about-value-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}>
                                    <item.icon size={48} color="#d4af37" />
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile View Swiper */}
                    <div className="mobile-swipe-about-wrap">
                        <div className="section-header" style={{ marginBottom: '30px' }}>
                            <h2>Our Core Values</h2>
                            <div className="header-line"></div>
                        </div>
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 5000 }}
                            style={{ paddingBottom: '40px' }}
                        >
                            {[
                                { icon: Sparkles, title: "Artisan Excellence", desc: "We don't mass produce. Each candle is a work of art, crafted with attention to details." },
                                { icon: Leaf, title: "Sustainable Luxury", desc: "Luxury shouldn't cost the earth. We use biodegradable soy wax and recycled materials." },
                                { icon: Award, title: "Premium Quality", desc: "We source the finest fragrance oils for a potent yet pleasant scent that lasts." }
                            ].map((item, i) => (
                                <SwiperSlide key={i}>
                                    <div className="about-value-card" style={{ height: '100%', margin: '0 5px' }}>
                                        <item.icon size={48} color="#d4af37" style={{ margin: '0 auto 20px' }} />
                                        <h3>{item.title}</h3>
                                        <p>{item.desc}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* --- Trust Banner --- */}
            <section className="trust-banner">
                <div className="container">
                    <div className="trust-items">
                        {["Eco Friendly", "Hand Poured", "Natural Soy Wax", "Safe Fragrance Oils"].map((text, i) => (
                            <div key={i} className="trust-item">
                                <Award size={16} className="trust-glass-icon" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA Section --- */}
            <section className="about-cta-section">
                <div className="cta-bg-text">AMBRE</div>
                <div className="container">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                        <h2 className="about-heading" style={{ marginBottom: '20px' }}>Ready to Transform<br />Your Space?</h2>
                        <Link href="/shop" className="about-cta-btn">
                            Shop The Collection
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
