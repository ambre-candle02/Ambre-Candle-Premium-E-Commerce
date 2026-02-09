'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import { Heart, Search, X, ShoppingBag, Check, Filter } from 'lucide-react';
import '@/src/styles/Shop.css'; // Re-importing the CSS file

const products = [
    {
        id: 801,
        name: 'Bouquet candle',
        productType: 'Bouquet Candle',
        scentFamily: 'Floral',
        occasion: 'Everyday',
        price: 250,
        image: 'https://www.ambrecandle.com/cdn/shop/files/b97213b8-3e2f-4858-8f85-684ded0f7ecf_3294eca4-a32a-4bd7-9a47-7d94dcae5102.jpg?v=1761578738',
        desc: 'Intricately sculpted floral bouquet candle hand-poured with premium soy wax.'
    },
    {
        id: 802,
        name: 'Bubble candle',
        productType: 'Pillar Candle',
        scentFamily: 'Fresh & Fruity',
        occasion: 'Everyday',
        price: 120,
        image: 'https://www.ambrecandle.com/cdn/shop/files/2c681722-e4f6-4308-b097-968026bc85b1.jpg?v=1760297485',
        desc: 'Minimalist aesthetic bubble pillar candle, perfect for home decor.'
    },
    {
        id: 803,
        name: 'Daisy candle (Set of 4)',
        productType: 'Hampers | Combo',
        scentFamily: 'Floral',
        occasion: 'Diwali',
        price: 100,
        image: 'https://www.ambrecandle.com/cdn/shop/files/WhatsAppImage2025-10-07at11.34.53AM_1.jpg?v=1759819864',
        desc: 'Set of 4 delicate daisy-shaped candles, perfect for gifting.'
    },
    {
        id: 804,
        name: 'Daisy jar candle',
        productType: 'Glass Jar Candle',
        scentFamily: 'Floral',
        occasion: 'Everyday',
        price: 200,
        image: 'https://www.ambrecandle.com/cdn/shop/files/a96c2a84-b8d9-4f81-8634-828506ac3fe9.jpg?v=1760269864',
        desc: 'Elegant jar topped with a daisy motif and calming fragrance.'
    },
    {
        id: 805,
        name: 'Flower Heart (Set of 2)',
        productType: 'Hampers | Combo',
        scentFamily: 'Floral',
        occasion: 'Valentines',
        price: 120,
        image: 'https://www.ambrecandle.com/cdn/shop/files/8edaaddf-1693-4475-aaf9-5464343fd7d4.jpg?v=1760274931',
        desc: 'Beautiful heart-shaped floral candles, ideal for romantic settings.'
    },
    {
        id: 806,
        name: 'Flower Urli Candle',
        productType: 'Urli Candle',
        scentFamily: 'Floral',
        occasion: 'Diwali',
        price: 350,
        image: 'https://www.ambrecandle.com/cdn/shop/files/bd4dcff1-2d70-4173-ada6-bed7cf51ab70.jpg?v=1760296634',
        desc: 'Traditional metal urli with floating floral candles.'
    },
    {
        id: 807,
        name: 'Sandalwood Urli',
        productType: 'Urli Candle',
        scentFamily: 'Woody',
        occasion: 'Evenings',
        price: 350,
        image: 'https://www.ambrecandle.com/cdn/shop/files/185dcfa6-6cab-4306-bd57-b27a38c77d35.jpg?v=1760275359',
        desc: 'Rich sandalwood scented urli candle for deep relaxation.'
    },
    {
        id: 808,
        name: 'Ladoo candle (pack of 4)',
        productType: 'Cake / Dessert Candle',
        scentFamily: 'Gourmand',
        occasion: 'Diwali',
        price: 150,
        image: 'https://www.ambrecandle.com/cdn/shop/files/7370bac1-67cd-4f34-898a-a43667f9ff81.jpg?v=1759939529',
        desc: 'Hyper-realistic ladoo-shaped festive candles with cardamom scent.'
    },
    {
        id: 809,
        name: 'Lotus Candle (Set of 2)',
        productType: 'Hampers | Combo',
        scentFamily: 'Floral',
        occasion: 'Everyday',
        price: 500,
        image: 'https://www.ambrecandle.com/cdn/shop/files/276bee9d-72cc-4fc4-affa-588cc5772cf2.jpg?v=1760193469',
        desc: 'Premium twin lotus designs for auspicious occasions.'
    },
    {
        id: 810,
        name: 'Lotus Urli (Small)',
        productType: 'Urli Candle',
        scentFamily: 'Floral',
        occasion: 'Everyday',
        price: 250,
        image: 'https://www.ambrecandle.com/cdn/shop/files/c7f9a190-a257-4656-b9ba-ac55e896c465.jpg?v=1760272062',
        desc: 'Compact lotus urli for elegant table settings.'
    },
    {
        id: 811,
        name: 'Lotus Urli (Large)',
        productType: 'Urli Candle',
        scentFamily: 'Floral',
        occasion: 'Diwali',
        price: 399,
        image: 'https://www.ambrecandle.com/cdn/shop/files/dd00ec79-d22f-4a5c-a03f-8115101b3d7a.jpg?v=1760275135',
        desc: 'Grand lotus urli centerpiece for festive decor.'
    },
    {
        id: 812,
        name: 'Mini Bubble Candle',
        productType: 'Pillar Candle',
        scentFamily: 'Fresh & Fruity',
        occasion: 'Everyday',
        price: 130,
        image: 'https://www.ambrecandle.com/cdn/shop/files/7eb94026-cffe-44ba-93cf-3f1dff92e08c.jpg?v=1760297002',
        desc: 'Cute mini bubble candle, perfect for favors and small spaces.'
    },
    {
        id: 813,
        name: 'Ocean Jar Candle',
        productType: 'Glass Jar Candle',
        scentFamily: 'Fresh & Fruity',
        occasion: 'Bath Time',
        price: 299,
        image: 'https://www.ambrecandle.com/cdn/shop/files/c5bddc45-0e6a-4415-8666-a2ce7e37b70e.png?v=1760273973',
        desc: 'Refreshing ocean mist fragrance ensuring a spa-like experience.'
    },
    {
        id: 814,
        name: 'Amber Sunflower',
        productType: 'Urli Candle',
        scentFamily: 'Woody',
        occasion: 'Evenings',
        price: 320,
        image: 'https://www.ambrecandle.com/cdn/shop/files/9e692ddb-43fe-48d3-b869-fe6fcb9203a7.png?v=1761584004',
        desc: 'Warm amber warmth combined with a unique sunflower design.'
    },
    {
        id: 815,
        name: 'Peacock Urli Candle',
        productType: 'Urli Candle',
        scentFamily: 'Floral',
        occasion: 'Diwali',
        price: 299,
        image: 'https://www.ambrecandle.com/cdn/shop/files/f9b6153e-2773-4b06-93d0-d96f33784619.jpg?v=1761584280',
        desc: 'Intricately designed peacock urli candle for traditional settings.'
    },
    {
        id: 816,
        name: 'Peacock Urli (Spice)',
        productType: 'Urli Candle',
        scentFamily: 'Spicy',
        occasion: 'Diwali',
        price: 399,
        image: 'https://www.ambrecandle.com/cdn/shop/files/332be99a-2ead-4f6c-b148-e800e9394104.jpg?v=1761584422',
        desc: 'A premium spicy aromatic candle with cinnamon notes.'
    },
    {
        id: 817,
        name: 'Chamomile & Lavender Jar',
        productType: 'Glass Jar Candle',
        scentFamily: 'Floral',
        occasion: 'Bed Time',
        price: 200,
        image: 'https://www.ambrecandle.com/cdn/shop/files/a96c2a84-b8d9-4f81-8634-828506ac3fe9.jpg?v=1760269864',
        desc: 'Soothing chamomile and lavender notes for a peaceful sleep.'
    },
    {
        id: 818,
        name: 'Rose Garden Set',
        productType: 'Hampers | Combo',
        scentFamily: 'Floral',
        occasion: 'Everyday',
        price: 350,
        image: 'https://www.ambrecandle.com/cdn/shop/files/8edaaddf-1693-4475-aaf9-5464343fd7d4.jpg?v=1760274931',
        desc: 'A romantic collection of rose-infused floral candles.'
    },
    {
        id: 819,
        name: 'Peony candle',
        productType: 'Bouquet Candle',
        scentFamily: 'Floral',
        occasion: 'Everyday',
        price: 130,
        image: '/images/new_arrivals/peony_candle.jpg',
        desc: 'Beautifully sculpted peony flower candle.'
    },
    {
        id: 820,
        name: 'Rasmalai candle',
        productType: 'Cake / Dessert Candle',
        scentFamily: 'Gourmand',
        occasion: 'Diwali',
        price: 120,
        image: '/images/new_arrivals/rasmalai_candle.jpg',
        desc: 'Sweet and delightful Rasmalai shaped candle.'
    },
    {
        id: 821,
        name: 'Rose (set of 2)',
        productType: 'Bouquet Candle',
        scentFamily: 'Floral',
        occasion: 'Evenings',
        price: 120,
        image: '/images/new_arrivals/rose__set_of_2_.jpg',
        desc: 'Pair of elegant rose shaped candles.'
    },
    {
        id: 822,
        name: 'Rose pillar candle',
        productType: 'Pillar Candle',
        scentFamily: 'Floral',
        occasion: 'Evenings',
        price: 150,
        image: '/images/new_arrivals/rose_pillar_candle.jpg',
        desc: 'Classic pillar candle with rose engravings.'
    },
    {
        id: 823,
        name: 'Snake pillar candle',
        productType: 'Figure Candle',
        scentFamily: 'Unscented',
        occasion: 'Everyday',
        price: 199,
        image: '/images/new_arrivals/snake_pillar_candle.jpg',
        desc: 'Unique snake design pillar candle.'
    },
    {
        id: 824,
        name: 'Strip pillar candle (set of2)',
        productType: 'Pillar Candle',
        scentFamily: 'Unscented',
        occasion: 'Everyday',
        price: 299,
        image: '/images/new_arrivals/strip_pillar_candle__set_of2_.jpg',
        desc: 'Modern striped pillar candles (Set of 2).'
    },
    {
        id: 825,
        name: 'Sunflower urli candle',
        productType: 'Urli Candle',
        scentFamily: 'Floral',
        occasion: 'Diwali',
        price: 150,
        image: '/images/new_arrivals/sunflower_urli_candle.jpg',
        desc: 'Festive sunflower shaped urli candle.'
    },
    {
        id: 826,
        name: 'Sunflower urli candle (6.5inch)',
        productType: 'Urli Candle',
        scentFamily: 'Floral',
        occasion: 'Diwali',
        price: 400,
        image: '/images/new_arrivals/sunflower_urli_candle__6_5inch_.jpg',
        desc: 'Large statement sunflower urli candle (6.5 inch).'
    },
    {
        id: 827,
        name: 'Teddy bear scented candles',
        productType: 'Figure Candle',
        scentFamily: 'Fresh & Fruity',
        occasion: 'Everyday',
        price: 119,
        image: '/images/new_arrivals/teddy_bear_scented_candles.jpg',
        desc: 'Adorable teddy bear scented candle.'
    },
    {
        id: 828,
        name: 'Tulip candle',
        productType: 'Bouquet Candle',
        scentFamily: 'Floral',
        occasion: 'Everyday',
        price: 200,
        image: '/images/new_arrivals/tulip_candle.jpg',
        desc: 'Elegant tulip shaped candle.'
    }
];

const productCategories = [
    'All',
    'Baby Shower', 'Bouquet Candle', 'Cake / Dessert Candle', 'Christmas', 'Coconut Shell Candle', 'Concrete Base Candle', 'Diwali', 'Figure Candle', 'Glass Jar Candle', 'Hampers | Combo', 'Halloween | Fall', 'Pillar Candle', 'Rakhi', 'Tealight', 'Tin Jar Candle', 'Urli Candle', 'Valentines', 'Wax Melts', 'Wax Sachet', 'Wooden Base Candle'
];

const AddToCartButton = ({ product }) => {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleClick = () => {
        addToCart({ ...product, quantity: 1 });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            style={{
                background: added ? '#4CAF50' : 'var(--color-accent)',
                color: '#fff',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.3s ease',
                width: '36px',
                height: '36px'
            }}
        >
            <AnimatePresence mode="wait">
                {added ? (
                    <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    >
                        <Check size={16} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="bag"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    >
                        <ShoppingBag size={16} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default function Shop() {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [sortBy, setSortBy] = useState('Featured');
    const [activeCategory, setActiveCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Get search and category query from URL
    useEffect(() => {
        setIsMounted(true);
        const params = new URLSearchParams(window.location.search);
        const search = params.get('search');
        const category = params.get('category');

        if (search) {
            setSearchQuery(search);
        }
        if (category) {
            setActiveCategory(category);
        }
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === 'All' ||
            p.scentFamily === activeCategory ||
            p.productType === activeCategory ||
            p.occasion === activeCategory;
        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
        const matchesSearch = searchQuery === '' ||
            searchTerms.some(term =>
                p.name.toLowerCase().includes(term) ||
                (p.desc && p.desc.toLowerCase().includes(term)) ||
                (p.productType && p.productType.toLowerCase().includes(term)) ||
                (p.scentFamily && p.scentFamily.toLowerCase().includes(term))
            );
        return matchesCategory && matchesPrice && matchesSearch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'Price: Low-High') return a.price - b.price;
        if (sortBy === 'Price: High-Low') return b.price - a.price;
        if (sortBy === 'Bestsellers') return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
        if (sortBy === 'Newest') return b.id - a.id;
        return 0;
    });

    if (!isMounted) return null;

    return (
        <div className="ambre-boutique-shop section" style={{ background: 'var(--color-bg-primary)', padding: '110px 0 80px' }}>
            <div className="container">
                <header className="boutique-header" style={{ marginBottom: '60px', textAlign: 'center' }}>
                    <div className="bread-v5" style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '15px', fontWeight: '800' }}>Collection / All Products</div>
                    <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>Our Collection</h1>
                </header>

                <div className="shop-layout" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '50px' }}>

                    {/* Filter Sidebar with Mobile Support */}
                    <aside className={`shop-sidebar ${isFilterOpen ? 'active' : ''}`}>
                        <div className="mobile-filter-header" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                            <h3 style={{ margin: 0 }}>Filters</h3>
                            <button onClick={() => setIsFilterOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <div className="filter-group" style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '0.9rem', marginBottom: '25px', borderBottom: '1px solid var(--color-border)', paddingBottom: '15px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800', color: '#d4af37' }}>Product Category</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {productCategories.map(cat => (
                                    <li
                                        key={cat}
                                        className={activeCategory === cat ? 'active' : ''}
                                        onClick={() => { setActiveCategory(cat); setIsFilterOpen(false); }}
                                    >
                                        {cat}
                                        {activeCategory === cat && <Check size={16} strokeWidth={3} />}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="filter-group" style={{ marginBottom: '30px' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Price Range</h3>
                            <div style={{ padding: '10px 5px' }}>
                                <input
                                    type="range"
                                    min="0"
                                    max="2000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                    className="price-slider"
                                    style={{ width: '100%' }}
                                />
                                <div className="price-labels">
                                    <span>Rs. 0</span>
                                    <span>Rs. {priceRange[1]}</span>
                                </div>
                            </div>
                        </div>

                        {(activeCategory !== 'All' || priceRange[1] !== 2000) && (
                            <button
                                onClick={() => { setActiveCategory('All'); setPriceRange([0, 2000]); }}
                                className="btn-clear-filters"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </aside>

                    <div className="shop-main-content">
                        <div className="shop-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee', flexWrap: 'wrap', gap: '15px' }}>

                            {/* Mobile Filter Toggle */}
                            <button
                                className="mobile-filter-btn"
                                onClick={() => setIsFilterOpen(true)}
                                style={{
                                    /* display: 'none',  handled by CSS media query */
                                    padding: '8px 16px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', fontSize: '0.9rem', alignItems: 'center', gap: '8px'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>≡</span> Filters
                            </button>

                            <span style={{ color: '#333', fontSize: '0.9rem', fontWeight: '600' }}>Showing {sortedProducts.length} results</span>

                            <div className="sort-wrapper">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #eee', outline: 'none', background: '#fff' }}
                                >
                                    <option value="Featured">Featured</option>
                                    <option value="Bestsellers">Bestsellers</option>
                                    <option value="Newest">Newest</option>
                                    <option value="Price: Low-High">Price: Low to High</option>
                                    <option value="Price: High-Low">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {sortedProducts.length === 0 && (
                            <div className="no-results" style={{ textAlign: 'center', padding: '60px 20px', width: '100%', gridColumn: '1 / -1' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>No matches found</h3>
                                <p style={{ color: '#666', marginBottom: '30px' }}>Try adjusting your search or filter to find what you're looking for.</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setActiveCategory('All');
                                        setPriceRange([0, 2000]);
                                        if (typeof window !== 'undefined') {
                                            const url = new URL(window.location);
                                            url.search = '';
                                            window.history.pushState({}, '', url);
                                        }
                                    }}
                                    className="btn-clear-filters"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}

                        {sortedProducts.length > 0 && (
                            <div className="product-wall">
                                <AnimatePresence mode='popLayout'>
                                    {sortedProducts.map((p, i) => (
                                        <motion.div
                                            layout
                                            key={p.id}
                                            className="luxury-card"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <div className="unit-visual">
                                                {p.bestseller && (
                                                    <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--color-accent)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 2 }}>
                                                        Bestseller
                                                    </div>
                                                )}
                                                <Link href={`/product/${p.id}`} style={{ position: 'relative', display: 'block', width: '100%', height: '100%' }}>
                                                    <Image
                                                        src={p.image}
                                                        alt={p.name}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        style={{
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </Link>
                                                <div className="unit-overlay" style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                                                    <button
                                                        onClick={() => setQuickViewProduct(p)}
                                                        style={{ flex: 1, background: '#fff', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                                    >
                                                        <Search size={14} /> Quick View
                                                    </button>
                                                    <AddToCartButton product={p} />
                                                </div>
                                                <button
                                                    style={{ position: 'absolute', top: '15px', right: '15px', background: '#fff', padding: '8px', borderRadius: '50%', color: isInWishlist(p.id) ? 'var(--color-accent)' : '#1a1a1a' }}
                                                    onClick={() => toggleWishlist(p)}
                                                >
                                                    <Heart size={18} fill={isInWishlist(p.id) ? "var(--color-accent)" : "none"} />
                                                </button>
                                            </div>
                                            <div className="unit-meta">
                                                <h3>{p.name}</h3>
                                                <p>Rs. {p.price.toFixed(2)}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div >

                {/* Quick View Modal */}
                < AnimatePresence >
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
                                        <Image
                                            src={quickViewProduct.image}
                                            alt={quickViewProduct.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ padding: '50px' }}>
                                        <span style={{ color: 'var(--color-accent)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{quickViewProduct.productType}</span>
                                        <h2 style={{ fontSize: '2.5rem', margin: '15px 0' }}>{quickViewProduct.name}</h2>
                                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Rs. {quickViewProduct.price.toFixed(2)}</p>
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
                    )
                    }
                </AnimatePresence >
            </div >
        </div >
    );
}
