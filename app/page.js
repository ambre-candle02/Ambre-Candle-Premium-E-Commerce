'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SafeImage from '@/src/components/SafeImage';
import { Heart, Eye, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import { useRouter } from 'next/navigation';
import { db } from '@/src/config/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useSiteConfig } from '@/src/hooks/useSiteConfig';
import { useMemo } from 'react';



const categorybanners = [
    {
        title: 'Heritage Hampers',
        img: '/images/hd/hampers_hd.png',
        path: '/categories/Hampers | Combo'
    },
    {
        title: 'Luxury Glass Jars',
        img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773904464/ambre-candles/Favourites/h9goei3q05rozx3u0ylf.png',
        path: '/categories/Glass Jar Candle'
    },
    {
        title: 'Artisan Bouquets',
        img: '/images/hd/bouquets_hd.png',
        path: '/categories/Bouquet Candle'
    },
    {
        title: 'Festive Series',
        img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/q_auto,f_auto,w_1200/v1770837023/ambre-candles/Diwali/ixm6kmfkiwgbu57zrztm.jpg',
        path: '/categories/Diwali'
    }
];

const microGallery = [
    { img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1771484848/ambre-candles/Diwali/szg7vbr9wxn2vhvjfm6d.jpg', title: 'Lotus Series', path: '/shop?search=Lotus' },
    { img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1771481682/ambre-candles/Pillar_Candle/efjqbrendmdfug3pmlwu.jpg', title: 'Artisan Pillars', path: '/categories/Pillar Candle' },
    { img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1771486568/ambre-candles/Cake_/_Dessert_Candle/bt92a3ebit58u1b90vq2.jpg', title: 'Dessert Series', path: '/categories/Cake / Dessert Candle' },
    { img: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1771487254/ambre-candles/Rakhi/dd1pmhgcvwbpaxmxxufx.jpg', title: 'Rakhi Special', path: '/categories/Rakhi' }
];

const bestSellers = [
    {
        id: 2184,
        name: 'Ambre Glow Jar',
        fragrance: 'Spiced Amber',
        price: 349,
        image: '/images/hd/bestseller_1.png'
    },
    {
        id: 2196,
        name: 'Sacred Bond Rakhi Candle',
        fragrance: 'Sandalwood & Turmeric',
        price: 299,
        image: '/images/hd/bestseller_2.png'
    },
    {
        id: 2195,
        name: 'Love\'s Blossom Heart',
        fragrance: 'Rose & Vanilla',
        price: 399,
        image: '/images/hd/bestseller_3.png'
    },
    {
        id: 2193,
        name: 'Delicate Floral Pot',
        fragrance: 'Spring Garden',
        price: 350,
        image: '/images/hd/bestseller_4.png'
    }
];
const HERO_IMAGES = [
    '/images/hd/bouquets_hd.png',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773905349/ambre-candles/Favourites/rlmc6m2snbm9zhemalro.png',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773903723/ambre-candles/Favourites/yjx1svkhkjt7qudiwduh.png',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773903722/ambre-candles/Favourites/zqzhwic38c4svydyyxeh.png',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773905596/ambre-candles/Favourites/gzigramjhkmpbs0nf28n.png'
];

export default function Home() {
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [dynamicBestsellers, setDynamicBestsellers] = useState(bestSellers);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { getTitle, getHero, config, getCollectionHero } = useSiteConfig();
    const router = useRouter();

    const finalCategoryBanners = useMemo(() => {
        return categorybanners.map(cat => {
            // Map the path to a collection name
            let colName = '';
            if (cat.path.includes('Hampers | Combo')) colName = 'Hampers | Combo';
            else if (cat.path.includes('Glass Jar Candle')) colName = 'Glass Jar Candle';
            else if (cat.path.includes('Bouquet Candle')) colName = 'Bouquet Candle';
            else if (cat.path.includes('Diwali')) colName = 'Diwali';

            const dynamicImg = colName ? getCollectionHero(colName) : null;
            return {
                ...cat,
                img: dynamicImg || cat.img
            };
        });
    }, [config?.collections]);

    // Dynamically update Hero Images if provided in config
    const [finalHeroImages, setFinalHeroImages] = useState(HERO_IMAGES);

    useEffect(() => {
        const dynamicHero = getHero('home');
        if (dynamicHero) {
            // Put the dynamic one first
            setFinalHeroImages([dynamicHero, ...HERO_IMAGES.slice(1)]);
        }
    }, [getHero('home')]);

    useEffect(() => {
        setIsMounted(true);
        async function fetchBestsellers() {
            try {
                const q = query(collection(db, 'products'), limit(4));
                const querySnapshot = await getDocs(q);
                const products = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.data().id || doc.id
                }));
                if (products.length > 0) {
                    setDynamicBestsellers(products);
                }
            } catch (error) {
                console.error("Home fetch error:", error);
            }
        }
        fetchBestsellers();
    }, []);

    // Auto-rotate hero images
    useEffect(() => {
        if (finalHeroImages.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % finalHeroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [finalHeroImages.length]);

    return (
        <div className="home-page-misa">
            {/* HERO SECTION */}
            {/* HERO SECTION (ULTRA-ADVANCED CINEMATIC) */}
            <section className="misa-hero">
                {/* Cinematic Background Slideshow */}
                <div className="misa-hero-slideshow">
                    {finalHeroImages.map((src, index) => (
                        <div
                            key={index}
                            className={`misa-hero-slide ${currentHeroIndex === index ? 'active' : ''}`}
                            style={{
                                opacity: currentHeroIndex === index ? 1 : 0,
                                transform: currentHeroIndex === index ? 'scale(1) translateZ(0)' : 'scale(1.05) translateZ(0)',
                                transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1), transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                zIndex: currentHeroIndex === index ? 1 : 0,
                                willChange: currentHeroIndex === index ? 'opacity, transform' : 'auto' /* Only active slide uses GPU layer */
                            }}
                            suppressHydrationWarning
                        >
                            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                                <SafeImage
                                    src={src}
                                    alt="Ambre Premium Hero"
                                    className="misa-hero-image"
                                    priority={index === 0} /* Only first image gets priority preload */
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    ))}
                    <div className="misa-hero-overlay"></div>

                    {/* Slide Indicators (Dots) */}
                    <div className="misa-hero-dots">
                        {finalHeroImages.map((_, index) => (
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
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        suppressHydrationWarning
                    >
                        <motion.span
                            className="misa-hero-subtitle"
                            initial={{ opacity: 0, letterSpacing: "4px" }}
                            animate={{ opacity: 1, letterSpacing: "4px" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            The New Artisan Essence
                        </motion.span>

                        <h1 className="misa-hero-title">
                            Extraordinary <br /> Candles.
                        </h1>

                        <p className="misa-hero-desc">
                            Crafted for those who seek the extraordinary. <br />
                            Experience the warmth of 100% organic soy wax.
                        </p>

                        <div className="misa-hero-cta-group">
                            <Link href="/collection" className="misa-cta-wrapper">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className="misa-btn-premium cta-primary"
                                >
                                    Explore Collection
                                </motion.button>
                            </Link>
                            <Link href="/shop" className="misa-cta-wrapper">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className="misa-btn-premium cta-secondary"
                                >
                                    Shop Best Sellers
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* TRUST STRIP (E-COMMERCE ASSURANCE) */}
            <div className="misa-trust-strip" suppressHydrationWarning>
                <div className="misa-trust-item" suppressHydrationWarning>
                    <span className="trust-icon" suppressHydrationWarning>⭐</span>
                    <div className="trust-content" suppressHydrationWarning>
                        <p suppressHydrationWarning>4.8 Rating</p>
                        <span suppressHydrationWarning>Trust by 5k+ Clients</span>
                    </div>
                </div>
                <div className="misa-trust-item" suppressHydrationWarning>
                    <span className="trust-icon" suppressHydrationWarning>🌱</span>
                    <div className="trust-content" suppressHydrationWarning>
                        <p suppressHydrationWarning>100% Organic</p>
                        <span suppressHydrationWarning>Soy Wax Candles</span>
                    </div>
                </div>
                <div className="misa-trust-item" suppressHydrationWarning>
                    <span className="trust-icon" suppressHydrationWarning>🚚</span>
                    <div className="trust-content" suppressHydrationWarning>
                        <p suppressHydrationWarning>Free Shipping</p>
                        <span suppressHydrationWarning>On Order ₹999+</span>
                    </div>
                </div>
                <div className="misa-trust-item" suppressHydrationWarning>
                    <span className="trust-icon" suppressHydrationWarning>🕯️</span>
                    <div className="trust-content" suppressHydrationWarning>
                        <p suppressHydrationWarning>Hand Poured</p>
                        <span suppressHydrationWarning>Artisan Crafted</span>
                    </div>
                </div>
            </div>

            {/* CATEGORY GRID */}
            <section className="misa-section misa-curated-section">
                <div className="misa-section-header">
                    <span>Curated For You</span>
                    <h2>{getTitle('collections', 'Shop by Collection')}</h2>
                </div>
                <div className="misa-categories-grid">
                    {finalCategoryBanners.map((cat, i) => (
                        <Link href={cat.path} key={i} className="misa-cat-card">
                            <motion.div
                                initial={{ opacity: 0, y: 0 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className="misa-cat-img-wrapper" style={{ position: 'relative' }}>
                                    <SafeImage src={cat.img} alt={cat.title} priority={i === 0} /* Only first cat image preloads */ />
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
                            src="/images/hd/story_hd.png"
                            alt="Ambre Artisan Craft"
                            priority={true}
                        />
                    </motion.div>
                    <motion.div
                        className="misa-story-content"
                        initial={{ opacity: 0, y: 0 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2>Philosophy of <br /> Slow Living</h2>
                        <p>Every Ambre Candle is a testament to the art of patience. We reject the haste of mass production, choosing instead the deliberate precision of hand-poured artisanry. Using the world's finest organic soy wax and curated fragrance oils, we craft atmosphere and emotion, turning your space into a sanctuary of timeless calm.</p>
                        <Link href="/about">
                            <button className="misa-story-btn">Our Story</button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* BESTSELLERS */}
            <section className="misa-section misa-bestsellers-section">
                <div className="misa-section-header">
                    <span>Timeless Hits</span>
                    <h2>{getTitle('bestsellers', 'Our Bestsellers')}</h2>
                </div>
                <div className="misa-products-grid-carousel">
                    <Swiper
                        modules={[Autoplay, Navigation, SwiperPagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation={true}
                        pagination={{ clickable: true }}
                        grabCursor={true}
                        autoplay={{ delay: 3500, disableOnInteraction: false }}
                        loop={true}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 3 }
                        }}
                        className="bestsellers-swiper"
                    >
                        {dynamicBestsellers.map((product, i) => (
                            <SwiperSlide key={product.id}>
                                <motion.div className="misa-product-card" whileHover="hover" initial="initial">
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
                                                        setSelectedProduct(product);
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
                                            <div className="misa-prod-rating">
                                                <span className="stars">⭐⭐⭐⭐⭐</span>
                                                <span className="review-count">(128)</span>
                                            </div>
                                            <h3>{product.name}</h3>
                                            <p><span className="currency-symbol">₹</span>{product.price}</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* REVIEWS SECTION */}
            <section className="misa-section misa-reviews-section">
                <div className="misa-section-header">
                    <span>What They Say</span>
                    <h2>Elite Testimonials</h2>
                </div>
                <div className="misa-reviews-container">
                    <Swiper
                        modules={[Autoplay, SwiperPagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 }
                        }}
                        className="reviews-swiper"
                    >
                        <SwiperSlide>
                            <div className="misa-review-card">
                                <div className="review-stars">⭐⭐⭐⭐⭐</div>
                                <p>"The fragrance is absolutely divine. My whole living room feels like a luxury spa. The packaging was also exquisite!"</p>
                                <div className="review-author">— Ananya R.</div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="misa-review-card">
                                <div className="review-stars">⭐⭐⭐⭐⭐</div>
                                <p>"Hands down the best candles I've ever bought. They burn so clean and the scent throw is incredible. Worth every penny."</p>
                                <div className="review-author">— Vikram S.</div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="misa-review-card">
                                <div className="review-stars">⭐⭐⭐⭐⭐</div>
                                <p>"Ambre candles have become my go-to gift for every occasion. The quality is unmatched and the hand-poured feel is so special."</p>
                                <div className="review-author">— Priya K.</div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </section>



            {/* QUICK VIEW MODAL */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div
                        className="misa-quickview-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProduct(null)}
                    >
                        <motion.div
                            className="misa-quickview-card"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="misa-quickview-close" onClick={() => setSelectedProduct(null)}>
                                <X size={20} />
                            </button>

                            <div className="misa-qv-image-side">
                                <SafeImage src={selectedProduct.image} alt={selectedProduct.name} />
                            </div>

                            <div className="misa-qv-details-side">
                                <span className="misa-qv-category">Best Seller</span>
                                <h2>{selectedProduct.name}</h2>
                                <p className="misa-qv-price"><span className="currency-symbol">₹</span>{selectedProduct.price}</p>
                                <p className="misa-qv-fragrance">Notes: {selectedProduct.fragrance || 'Premium Scent'}</p>

                                <div className="misa-qv-actions">
                                    <button
                                        className="misa-qv-add-btn"
                                        onClick={() => {
                                            addToCart({ ...selectedProduct, quantity: 1 });
                                            setSelectedProduct(null);
                                        }}
                                    >
                                        ADD TO BAG
                                    </button>
                                    <button
                                        className="misa-action-icon-btn"
                                        style={{ border: '1px solid #1a1a1a', padding: '15px', borderRadius: '50%' }}
                                        onClick={() => toggleWishlist(selectedProduct)}
                                    >
                                        <Heart
                                            size={20}
                                            fill={isMounted && isInWishlist(selectedProduct.id) ? "#d4af37" : "none"}
                                            color={isMounted && isInWishlist(selectedProduct.id) ? "#d4af37" : "#1a1a1a"}
                                        />
                                    </button>
                                </div>

                                <Link
                                    href={`/product/${selectedProduct.id}`}
                                    className="misa-qv-view-more"
                                    onClick={() => setSelectedProduct(null)}
                                >
                                    View Full Details
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
