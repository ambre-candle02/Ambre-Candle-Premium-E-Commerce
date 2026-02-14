'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import SafeImage from '@/src/components/SafeImage';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import { Heart, Search, X, ShoppingBag, Check, Filter, ChevronDown, Sparkles, Eye, LayoutGrid, ChevronRight } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/src/config/constants';
import '@/src/styles/Shop.css';
import { PRODUCTS } from '@/src/config/products';

const products = PRODUCTS;

const ArtisanCard = ({ p, i, isInWishlist, toggleWishlist, setQuickViewProduct }) => {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ ...p, quantity: 1 });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <motion.div
            layout
            className="misa-product-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
        >
            <div className="unit-visual">
                {p.bestseller && (
                    <div className="misa-badge" style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 5 }}>
                        Bestseller
                    </div>
                )}

                <Link href={`/product/${p.id}`} className="card-image-link">
                    <SafeImage
                        src={p.image}
                        alt={p.name}
                        className="shop-unit-image"
                    />
                </Link>

                <div className="shop-card-overlay">
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => {
                            e.preventDefault();
                            setQuickViewProduct(p);
                        }}
                        className="btn-quickview"
                    >
                        <Eye size={16} />
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className={`btn-add-cart ${added ? 'added' : ''}`}
                        onClick={handleAddToCart}
                    >
                        {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                    </motion.button>
                </div>

                <button
                    className="misa-wishlist-btn"
                    style={{
                        opacity: 1,
                        transform: 'none',
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(p);
                    }}
                >
                    <Heart size={18} fill={isInWishlist(p.id) ? "#d4af37" : "none"} color={isInWishlist(p.id) ? "#d4af37" : "#ccc"} />
                </button>
            </div>

            <div className="unit-meta">
                <h3>{p.name}</h3>
                <p className="u-price"><span className="currency-symbol">₹</span>{p.price}</p>
            </div>
        </motion.div>
    );
};



function ShopContent() {
    const searchParams = useSearchParams();
    const currentCategory = searchParams?.get('category') || null;
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [sortBy, setSortBy] = useState('Featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Get search and category query from URL
    useEffect(() => {
        setIsMounted(true);
        const params = new URLSearchParams(window.location.search);
        const search = params.get('search');
        if (search) {
            setSearchQuery(search);
        }
    }, []);

    const filteredProducts = useMemo(() => products.filter(p => {
        // Category Filter
        const matchesCategory = !currentCategory ||
            p.productType === currentCategory ||
            (p.productType && p.productType.includes(currentCategory));

        // Search Filter
        const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
        const matchesSearch = searchQuery === '' ||
            searchTerms.some(term =>
                p.name.toLowerCase().includes(term) ||
                (p.desc && p.desc.toLowerCase().includes(term)) ||
                (p.productType && p.productType.toLowerCase().includes(term)) ||
                (p.scentFamily && p.scentFamily.toLowerCase().includes(term))
            );

        return matchesCategory && matchesSearch;
    }), [searchQuery, currentCategory]);

    const sortedProducts = useMemo(() => [...filteredProducts].sort((a, b) => {
        if (sortBy === 'Price: Low-High') return a.price - b.price;
        if (sortBy === 'Price: High-Low') return b.price - a.price;
        if (sortBy === 'Bestsellers') return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
        if (sortBy === 'Newest') return b.id - a.id;
        return 0;
    }), [filteredProducts, sortBy]);

    // Mobile Scroll Animation Logic
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('mobile-hover');
                    } else {
                        entry.target.classList.remove('mobile-hover');
                    }
                });
            },
            {
                threshold: 0.6,
                rootMargin: "0px 0px -100px 0px"
            }
        );

        const cards = document.querySelectorAll('.luxury-card');
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, [sortedProducts]);

    if (!isMounted) return null;

    return (
        <div className="ambre-boutique-shop section">
            <div className="container">
                <motion.div
                    className="shop-hero-v5"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        textAlign: 'center',
                        marginBottom: '60px',
                        background: 'linear-gradient(135deg, #1a0f0a 0%, #2d1810 50%, #1a0f0a 100%)',
                        padding: '80px 50px',
                        borderRadius: '28px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.2)',
                        border: '2px solid #d4af37',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <span style={{
                        color: '#d4af37',
                        fontSize: '0.9rem',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: '15px'
                    }}>
                        Curated For You
                    </span>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        fontFamily: 'var(--font-heading)',
                        color: '#fff',
                        marginTop: '20px',
                        fontWeight: '300',
                        letterSpacing: '2px'
                    }}>
                        The Candle Collection
                    </h1>
                    <div style={{
                        width: '80px',
                        height: '2px',
                        background: '#d4af37',
                        margin: '25px auto',
                        boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)'
                    }}></div>
                    <p style={{
                        fontSize: '1.1rem',
                        color: 'rgba(255,255,255,0.85)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.8',
                        fontStyle: 'italic'
                    }}>
                        "Discover the essence of artisan luxury through our hand-poured collections."
                    </p>
                </motion.div>

                <div className="category-bar">
                    <Link href="/shop" className={`category-pill ${!currentCategory ? 'active' : ''}`}>
                        All
                    </Link>
                    {PRODUCT_CATEGORIES.filter(c => c !== 'All').map((cat) => (
                        <motion.div key={cat} whileTap={{ scale: 0.9 }}>
                            <Link
                                href={`/categories/${encodeURIComponent(cat)}`}
                                className={`category-pill ${currentCategory === cat ? 'active' : ''}`}
                            >
                                {cat}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="shop-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Showing {sortedProducts.length} results</span>
                    <div className="sort-wrapper">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ padding: '10px 20px', borderRadius: '30px', border: '1px solid #ddd', background: '#fff' }}
                        >
                            <option value="Featured">Featured</option>
                            <option value="Bestsellers">Bestsellers</option>
                            <option value="Newest">Newest</option>
                            <option value="Price: Low-High">Price: Low to High</option>
                            <option value="Price: High-Low">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="misa-products-grid">
                    <AnimatePresence mode='popLayout'>
                        {sortedProducts.map((p, i) => (
                            <ArtisanCard
                                key={p.id}
                                p={p}
                                i={i}
                                isInWishlist={isInWishlist}
                                toggleWishlist={toggleWishlist}
                                setQuickViewProduct={setQuickViewProduct}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {sortedProducts.length === 0 && (
                    <div className="no-results" style={{ textAlign: 'center', padding: '100px 20px' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>No matches found</h3>
                        <p style={{ color: '#666' }}>Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* Quick View Modal */}
            <AnimatePresence>
                {quickViewProduct && (
                    <div className="quickview-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
                        <motion.div
                            className="qv-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ background: '#fff', width: '100%', maxWidth: '900px', borderRadius: '25px', overflow: 'hidden', position: 'relative' }}
                        >
                            <button
                                style={{ position: 'absolute', top: '20px', right: '20px', background: '#f5f5f5', padding: '8px', borderRadius: '50%', zIndex: 2 }}
                                onClick={() => setQuickViewProduct(null)}
                            >
                                <X size={20} />
                            </button>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                <div style={{ position: 'relative', height: '500px' }}>
                                    <SafeImage src={quickViewProduct.image} alt="Ambre Candle" className="shop-unit-image" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                </div>
                                <div style={{ padding: '50px' }}>
                                    <span style={{ color: 'var(--color-accent)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{quickViewProduct.productType}</span>
                                    <h2 style={{ fontSize: '2rem', margin: '15px 0', fontFamily: 'var(--font-heading)', color: '#1a1a1a' }}>{quickViewProduct.name}</h2>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-accent)', marginBottom: '30px' }}><span className="currency-symbol">₹</span>{quickViewProduct.price}</div>
                                    <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '40px' }}>{quickViewProduct.desc}</p>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <button
                                            className="btn-primary"
                                            style={{ flex: 1, height: '55px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                            onClick={() => { addToCart({ ...quickViewProduct, quantity: 1 }); setQuickViewProduct(null); }}
                                        >
                                            <ShoppingBag size={18} /> Add to Cart
                                        </button>
                                    </div>
                                    <Link
                                        href={`/product/${quickViewProduct.id}`}
                                        style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: '#999', textDecoration: 'underline', fontSize: '0.9rem' }}
                                        onClick={() => setQuickViewProduct(null)}
                                    >
                                        View Full Details
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Shop() {
    return (
        <Suspense fallback={<div className="loading-shimmer" style={{ minHeight: '100vh', background: '#f8f8f8' }}></div>}>
            <ShopContent />
        </Suspense>
    );
}
