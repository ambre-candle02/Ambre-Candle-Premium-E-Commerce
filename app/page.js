'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SafeImage from '@/src/components/SafeImage';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';


const categorybanners = [
    {
        title: 'Signature Hampers',
        img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770840787/ambre-candles/Hampers_%7C_Combo/lxpbksaxenyc77vrmatf.jpg',
        path: '/categories/Hampers | Combo'
    },
    {
        title: 'Luxury Glass Jars',
        img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770841201/ambre-candles/Glass_Jar_Candle/niww0h7vjrk9dxnnynrb.jpg',
        path: '/categories/Glass Jar Candle'
    },
    {
        title: 'Artisan Bouquets',
        img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770831575/ambre-candles/Bouquet%20Candle/vjq28br0vds2dh0va5np.jpg',
        path: '/categories/Bouquet Candle'
    },
    {
        title: 'Festive Series',
        img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770837023/ambre-candles/Diwali/ixm6kmfkiwgbu57zrztm.jpg',
        path: '/categories/Diwali'
    }
];

const microGallery = [
    { img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1771484848/ambre-candles/Diwali/szg7vbr9wxn2vhvjfm6d.jpg', title: 'Lotus Series', path: '/shop?search=Lotus' },
    { img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770842058/ambre-candles/Pillar_Candle/gxxf6o9neqvvmvvwnckz.jpg', title: 'Artisan Pillars', path: '/categories/Pillar Candle' },
    { img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1771486568/ambre-candles/Cake_/_Dessert_Candle/bt92a3ebit58u1b90vq2.jpg', title: 'Dessert Series', path: '/categories/Cake / Dessert Candle' },
    { img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1771487254/ambre-candles/Rakhi/dd1pmhgcvwbpaxmxxufx.jpg', title: 'Rakhi Special', path: '/categories/Rakhi' }
];

const bestSellers = [
    {
        id: 2184,
        name: 'Amber Glow Jar',
        fragrance: 'Spiced Amber',
        price: 349,
        image: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1771486016/ambre-candles/Glass_Jar_Candle/yr5hc3pv0tbcc33w33jm.jpg'
    },
    {
        id: 2196,
        name: 'Sacred Bond Rakhi Candle',
        fragrance: 'Sandalwood & Turmeric',
        price: 299,
        image: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1771487254/ambre-candles/Rakhi/dd1pmhgcvwbpaxmxxufx.jpg'
    },
    {
        id: 2195,
        name: 'Love\'s Blossom Heart',
        fragrance: 'Rose & Vanilla',
        price: 399,
        image: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1771486802/ambre-candles/Flower_Heart_Candle/x8sgi7p6uztvybgddgok.jpg'
    },
    {
        id: 2193,
        name: 'Delicate Floral Pot',
        fragrance: 'Spring Garden',
        price: 350,
        image: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1771486422/ambre-candles/Bouquet_Candle/bqbbscevgxs5b6ad2yex.jpg'
    }
];
const HERO_IMAGES = [
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770878558/ambre-candles/Favourites/bl89eoniobqjdyhnri2g.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770878560/ambre-candles/Favourites/lngfplnzboyv4tyvll8x.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770878530/ambre-candles/Favourites/mzcchlhpaolfydep8pwe.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770878532/ambre-candles/Favourites/eelqgmh1w0atnrfqsud5.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770878534/ambre-candles/Favourites/y2g2ptjsikgf7uqcgzj2.jpg'
];

export default function Home() {
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Auto-rotate hero images
    useEffect(() => {
        if (HERO_IMAGES.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [HERO_IMAGES.length]);

    return (
        <div className="home-page-misa">
            {/* HERO SECTION */}
            {/* HERO SECTION (ULTRA-ADVANCED CINEMATIC) */}
            <section className="misa-hero">
                {/* Cinematic Background Slideshow */}
                <div className="misa-hero-slideshow">
                    {HERO_IMAGES.map((src, index) => (
                        <div
                            key={index}
                            className="misa-hero-slide"
                            style={{
                                opacity: currentHeroIndex === index ? 1 : 0,
                                transform: currentHeroIndex === index ? 'scale(1)' : 'scale(1.1)',
                                transition: 'opacity 1.5s ease-in-out, transform 1.5s ease-in-out',
                                zIndex: currentHeroIndex === index ? 1 : 0
                            }}
                        >
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <SafeImage
                                    src={src}
                                    alt="Misa Luxury"
                                    className="misa-hero-image"
                                    priority={index === 0}
                                />
                            </div>
                        </div>
                    ))}
                    <div className="misa-hero-overlay"></div>

                    {/* Slide Indicators (Dots) */}
                    <div className="misa-hero-dots">
                        {HERO_IMAGES.map((_, index) => (
                            <button
                                key={index}
                                className={`misa-hero-dot ${currentHeroIndex === index ? 'active' : ''}`}
                                onClick={() => setCurrentHeroIndex(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
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
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="misa-btn-premium"
                            >
                                Explore Collection
                            </motion.button>
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
                    <p>free shipping above ₹999+</p>
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
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className="misa-cat-img-wrapper" style={{ position: 'relative' }}>
                                    <SafeImage src={cat.img} alt={cat.title} />
                                </div>
                                <h3>{cat.title}</h3>
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
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ position: 'relative' }}
                    >
                        <SafeImage
                            src="https://res.cloudinary.com/dmw5efwf5/image/upload/v1770881032/ambre-candles/Favourites/f47a3zsbk8tz6rnkwscn.jpg"
                            alt="Ambre Artisan Craft"
                            priority={true}
                        />
                    </motion.div>
                    <motion.div
                        className="misa-story-content"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2>Sustainable <br /> Craftsmanship</h2>
                        <p>At Ambre Candle, we believe luxury should be kind to the planet. Our candles are meticulously handcrafted using 100% natural soy wax and eco-friendly materials, bringing a warm, sustainable glow to your home sanctuary.</p>
                        <Link href="/about">
                            <button className="misa-btn" style={{ background: '#d4af37', color: '#fff', border: 'none' }}>Our Story</button>
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
                        <motion.div key={product.id} className="misa-product-card" whileHover="hover" initial="initial">
                            <Link href={`/product/${product.id}`} className="misa-prod-link-wrapper" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="misa-prod-img-box">
                                    {(i === 0 || i === 2) && <span className="misa-badge">{i === 0 ? 'Bestseller' : 'New'}</span>}
                                    <button
                                        className="misa-wishlist-btn-home"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleWishlist(product);
                                        }}
                                    >
                                        <Heart
                                            size={18}
                                            fill={isMounted && isInWishlist(product.id) ? "#d4af37" : "none"}
                                            color={isMounted && isInWishlist(product.id) ? "#d4af37" : "#1a1a1a"}
                                        />
                                    </button>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        style={{ position: 'relative', width: '100%', height: '100%' }}
                                    >
                                        <SafeImage src={product.image} alt="Ambre Candle Product" className="misa-prod-img" />
                                    </motion.div>
                                    <div className="misa-prod-overlay">
                                        <button
                                            className="btn-quickview-shop"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // Functionality to be added later or redirect
                                                window.location.href = `/product/${product.id}`;
                                            }}
                                        >
                                            <Eye size={22} strokeWidth={1.5} />
                                        </button>
                                        <button
                                            className="btn-add-cart-shop"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToCart({ ...product, quantity: 1 });
                                            }}
                                        >
                                            <ShoppingBag size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="misa-prod-info">
                                    <h3>{product.name}</h3>
                                    <p><span className="currency-symbol">₹</span>{product.price}</p>
                                </div>
                            </Link>
                        </motion.div>
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
                        <p>Unlock a world of fragrance. Join our inner circle for exclusive updates, early access to new collections, and 10% off your first artisan order.</p>
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
