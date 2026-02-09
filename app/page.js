'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const categorybanners = [
    {
        title: 'Gifts & Sets',
        img: 'https://www.ambrecandle.com/cdn/shop/files/8edaaddf-1693-4475-aaf9-5464343fd7d4.jpg?v=1760274931',
        path: '/shop?category=Hampers%20|%20Combo'
    },
    {
        title: 'Candles',
        img: 'https://www.ambrecandle.com/cdn/shop/files/b97213b8-3e2f-4858-8f85-684ded0f7ecf_3294eca4-a32a-4bd7-9a47-7d94dcae5102.jpg?v=1761578738',
        path: '/shop?category=Glass%20Jar%20Candle'
    },
    {
        title: 'New Arrivals',
        img: '/images/new_arrivals/tulip_candle.jpg',
        path: '/shop?category=Bouquet%20Candle'
    },
    {
        title: 'Collections',
        img: 'https://www.ambrecandle.com/cdn/shop/files/bd4dcff1-2d70-4173-ada6-bed7cf51ab70.jpg?v=1760296634',
        path: '/shop?category=Urli%20Candle'
    }
];

const microGallery = [
    { img: 'https://www.ambrecandle.com/cdn/shop/files/dd00ec79-d22f-4a5c-a03f-8115101b3d7a.jpg?v=1760275135', title: 'Lotus Series', path: '/shop?category=Urli%20Candle' },
    { img: 'https://www.ambrecandle.com/cdn/shop/files/2c681722-e4f6-4308-b097-968026bc85b1.jpg?v=1760297485', title: 'Artisan Pillars', path: '/shop?category=Pillar%20Candle' },
    { img: '/images/new_arrivals/rasmalai_candle.jpg', title: 'Dessert Series', path: '/shop?category=Cake%20/%20Dessert%20Candle' },
    { img: 'https://www.ambrecandle.com/cdn/shop/files/7370bac1-67cd-4f34-898a-a43667f9ff81.jpg?v=1759939529', title: 'Daily Rituals', path: '/shop?category=Hampers%20|%20Combo' }
];

const bestSellers = [
    {
        id: 801,
        name: 'Sacred Sanctuary',
        fragrance: 'Burnt Oak & Sage',
        price: 1860,
        image: 'https://www.ambrecandle.com/cdn/shop/files/b97213b8-3e2f-4858-8f85-684ded0f7ecf_3294eca4-a32a-4bd7-9a47-7d94dcae5102.jpg?v=1761578738'
    },
    {
        id: 807,
        name: 'Prairie',
        fragrance: 'Lavender and Patchouli',
        price: 2330,
        image: 'https://www.ambrecandle.com/cdn/shop/files/7370bac1-67cd-4f34-898a-a43667f9ff81.jpg?v=1759939529'
    },
    {
        id: 806,
        name: 'Love Potion',
        fragrance: 'Rose & Apple Blossom',
        price: 2330,
        image: 'https://www.ambrecandle.com/cdn/shop/files/bd4dcff1-2d70-4173-ada6-bed7cf51ab70.jpg?v=1760296634'
    },
    {
        id: 802,
        name: 'Silent Whisper',
        fragrance: 'White Tea & Ginger',
        price: 790,
        image: 'https://www.ambrecandle.com/cdn/shop/files/2c681722-e4f6-4308-b097-968026bc85b1.jpg?v=1760297485'
    }
];

export default function Home() {
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    // Auto-rotate hero images
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % 5);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="home-page-misa">
            {/* HERO SECTION */}
            {/* HERO SECTION (ULTRA-ADVANCED CINEMATIC) */}
            <section className="misa-hero">
                {/* Cinematic Background Slideshow */}
                <div className="misa-hero-slideshow">
                    {[
                        '/images/hero/hero_banner_1.jpg?v=3',
                        '/images/hero/hero_banner_2.jpg?v=3',
                        '/images/hero/hero_slideshow_1.png?v=3',
                        '/images/new_arrivals/snake_pillar_candle.jpg?v=3',
                        '/images/new_arrivals/tulip_candle.jpg?v=3'
                    ].map((src, index) => (
                        <div
                            key={index}
                            className="misa-hero-slide"
                            style={{
                                opacity: currentHeroIndex === index ? 1 : 0,
                                transform: currentHeroIndex === index ? 'scale(1)' : 'scale(1.1)',
                                transition: 'opacity 2.5s ease-in-out, transform 2.5s ease-in-out',
                                zIndex: currentHeroIndex === index ? 1 : 0
                            }}
                        >
                            <Image
                                src={src}
                                alt="Misa Luxury"
                                fill
                                priority={index === 0}
                                sizes="100vw"
                                className="misa-hero-image"
                            />
                        </div>
                    ))}
                    <div className="misa-hero-overlay"></div>
                </div>

                {/* Editorial Content Layer */}
                <div className="misa-hero-content">
                    <motion.div
                        className="misa-hero-text-container"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    >
                        <motion.span
                            className="misa-hero-subtitle"
                            initial={{ opacity: 0, letterSpacing: "0px" }}
                            animate={{ opacity: 1, letterSpacing: "4px" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            The New Artisan Essence
                        </motion.span>

                        <h1 className="misa-hero-title">
                            <span className="hero-line">Extraordinary</span>
                            <span className="hero-line">Candles.</span>
                        </h1>

                        <p className="misa-hero-desc">
                            Crafted for those who seek the extraordinary. <br />
                            Experience the warmth of 100% organic soy wax.
                        </p>

                        <Link href="/shop" className="misa-cta-wrapper">
                            <button className="misa-btn-premium">
                                Explore Collection
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* TRUST STRIP (E-COMMERCE ASSURANCE) */}
            <div className="misa-trust-strip">
                <div className="misa-trust-item">
                    <span>🌿</span>
                    <p>100% Organic Soy Wax</p>
                </div>
                <div className="misa-trust-item">
                    <span>✨</span>
                    <p>Hand-Poured Artisan</p>
                </div>
                <div className="misa-trust-item">
                    <span>🚚</span>
                    <p>Free Shipping on ₹999+</p>
                </div>
            </div>

            {/* CATEGORY GRID */}
            <section className="misa-section">
                <div className="misa-section-header">
                    <span>Curated For You</span>
                    <h2>Shop by Collection</h2>
                </div>
                <div className="misa-categories-grid">
                    {categorybanners.map((cat, i) => (
                        <Link href={cat.path} key={i} className="misa-cat-card">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="misa-cat-img-wrapper">
                                    <Image
                                        src={cat.img}
                                        alt={cat.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />
                                </div>
                                <h3>{cat.title}</h3>
                                <span className="misa-cat-link">View All</span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* SECOND IMAGE GRID: EXACTLY SAME AS FIRST SECTION */}
            <section className="misa-section" style={{ paddingTop: '0' }}>
                <div className="misa-categories-grid">
                    {microGallery.map((item, i) => (
                        <Link href={item.path} key={i} className="misa-cat-card">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="misa-cat-img-wrapper">
                                    <Image
                                        src={item.img}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />
                                </div>
                                <h3>{item.title}</h3>
                                <span className="misa-cat-link">View All</span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* STORY SECTION */}
            <section className="misa-story">
                <div className="misa-story-container">
                    <motion.div
                        className="misa-story-image"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Image
                            src="https://www.ambrecandle.com/cdn/shop/files/bd4dcff1-2d70-4173-ada6-bed7cf51ab70.jpg?v=1760296634"
                            alt="Misa Craft"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </motion.div>
                    <motion.div
                        className="misa-story-content"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>The Art of <br /> Olfaction</h2>
                        <p>We believe that a candle is more than just light. It's a memory, a mood, and a statement. Our scents are meticulously developed to transform your space into a sanctuary of refined elegance.</p>
                        <Link href="/about">
                            <button className="misa-btn">Our Philosophy</button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* BESTSELLERS */}
            <section className="misa-section">
                <div className="misa-section-header">
                    <span>Timeless Hits</span>
                    <h2>Our Bestsellers</h2>
                </div>
                <div className="misa-products-grid">
                    {bestSellers.map((product, i) => (
                        <div key={product.id} className="misa-product-card">
                            <Link href={`/product/${product.id}`} className="misa-prod-link-wrapper">
                                <div className="misa-prod-img-box">
                                    {(i === 0 || i === 2) && <span className="misa-badge">{i === 0 ? 'Bestseller' : 'New'}</span>}
                                    <button className="misa-wishlist-btn" onClick={(e) => { e.preventDefault(); alert('Added to wishlist!'); }}>
                                        ❤
                                    </button>
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                        className="misa-prod-img"
                                    />
                                    <div className="misa-quick-add">
                                        <button onClick={(e) => { e.preventDefault(); alert('Added to cart!'); }}>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                                <div className="misa-prod-info">
                                    <span className="misa-prod-fragrance">{product.fragrance}</span>
                                    <h3>{product.name}</h3>
                                    <span className="misa-prod-price">₹{product.price}</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* NEWSLETTER */}
            <section className="misa-newsletter">
                <div className="misa-newsletter-box">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Join the Inner Circle</h2>
                        <p>Unlock 10% off your first artisan collection order.</p>
                        <form className="misa-modern-form" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="misa-modern-input"
                                required
                            />
                            <button type="submit" className="misa-modern-btn">SUBSCRIBE</button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
