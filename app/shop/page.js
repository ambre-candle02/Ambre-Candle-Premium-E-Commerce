'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import { PRODUCTS as STATIC_PRODUCTS } from '@/src/config/products';
import { PRODUCT_CATEGORIES } from '@/src/config/constants';
import { db } from '@/src/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Heart, X, ShoppingBag, Check, Eye, Sparkles, LayoutGrid, IndianRupee } from 'lucide-react';
import SafeImage from '@/src/components/SafeImage';
import '@/src/styles/Shop.css';
import '@/src/styles/Categories.css';

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [activeCategory, setActiveCategory] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [sortBy, setSortBy] = useState('Featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [addedProductId, setAddedProductId] = useState(null);
    const [dynamicProducts, setDynamicProducts] = useState([]);

    useEffect(() => {
        setIsMounted(true);
        const cat = searchParams.get('category');
        if (cat) {
            setActiveCategory(cat);
        }
        const search = searchParams.get('search');
        if (search) {
            setSearchQuery(search);
            if (!cat) setActiveCategory('All');
        }

        async function fetchProducts() {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productsData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.data().id || doc.id
                }));
                if (productsData.length > 0) {
                    setDynamicProducts(productsData);
                } else {
                    setDynamicProducts(STATIC_PRODUCTS);
                }
            } catch (error) {
                console.error("Firestore fetch error:", error);
                setDynamicProducts(STATIC_PRODUCTS);
            }
        }
        fetchProducts();
    }, [searchParams]);

    const filteredProducts = dynamicProducts.filter(p => {
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

    const productCategories = PRODUCT_CATEGORIES;

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'Price: Low-High') return a.price - b.price;
        if (sortBy === 'Price: High-Low') return b.price - a.price;
        if (sortBy === 'Bestsellers') return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
        if (sortBy === 'Newest') return b.id - a.id;
        return 0;
    });



    if (!isMounted) return null;

    return (
        <div className="ambre-boutique-shop section" style={{ background: '#fdfbf7', padding: '100px 0 80px' }}>


            <div className="sidebar-shop-container">
                {/* LEFT SIDE: Artisan Sidebar */}
                <aside className={`shop-sidebar ${isFilterOpen ? 'active' : ''}`}>
                    <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            marginBottom: '20px',
                            fontSize: '0.75rem',
                            letterSpacing: '4px',
                            color: '#d4af37',
                            fontWeight: '700'
                        }}>
                            <Sparkles size={16} />
                            <span>AMBRE BOUTIQUE</span>
                        </div>

                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: '#fff', marginBottom: '5px', fontWeight: '300', letterSpacing: '2px' }}>Artisan</h2>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', marginBottom: '25px', fontWeight: '300', opacity: 0.8, letterSpacing: '5px' }}>Selection</h2>

                        <div style={{ width: '50px', height: '2px', background: '#d4af37', margin: '0 auto', boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}></div>
                    </div>

                    <div className="sidebar-section">
                        <h3 className="section-subtitle">Collections</h3>
                        <nav className="sidebar-nav">
                            {/* --- New Gallery Home Button --- */}
                            <button
                                onClick={() => { setActiveCategory(null); router.push('/shop'); }}
                                className={`sidebar-item ${!activeCategory ? 'active' : ''}`}
                                style={{ marginBottom: '20px', borderStyle: 'dashed' }}
                            >
                                <LayoutGrid size={18} style={{ marginRight: '10px' }} />
                                <span>Gallery Showcase</span>
                            </button>

                            <div style={{ opacity: 0.5, fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '15px', paddingLeft: '20px' }}>CATEGORIES</div>

                            {productCategories.map((cat) => (
                                <Link
                                    key={cat}
                                    href={`/shop?category=${encodeURIComponent(cat)}`}
                                    className={`sidebar-item ${activeCategory === cat ? 'active' : ''}`}>
                                    <span>{cat}</span>
                                    {activeCategory === cat && <Check size={14} />}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="sidebar-section">
                        <h3 className="section-subtitle"><IndianRupee size={16} /> Price Range</h3>
                        <div className="price-slider-container">
                            <div className="price-labels" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#999', fontSize: '0.85rem' }}>₹0</span>
                                <span style={{ color: '#d4af37', fontSize: '0.9rem', fontWeight: '700' }}>Up to ₹{priceRange[1]}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                step="50"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                className="price-slider"
                                style={{
                                    width: '100%',
                                    height: '6px',
                                    borderRadius: '10px',
                                    background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${(priceRange[1] / 2000) * 100}%, rgba(255,255,255,0.1) ${(priceRange[1] / 2000) * 100}%, rgba(255,255,255,0.1) 100%)`,
                                    outline: 'none',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    cursor: 'pointer'
                                }} />
                        </div>
                    </div>

                    {(activeCategory !== 'All' || priceRange[1] !== 2000) && (
                        <button
                            onClick={() => { setActiveCategory('All'); setPriceRange([0, 2000]); }}
                            className="sidebar-item"
                            style={{ marginTop: '30px', justifyContent: 'center', background: 'rgba(212, 175, 55, 0.1)', borderColor: '#d4af37', color: '#d4af37' }}
                        >
                            Clear Filters
                        </button>
                    )}
                </aside>
                {/* RIGHT SIDE: Hero + Products */}
                {/* --- RIGHT CONTENT AREA: Hero vs Products --- */}
                <AnimatePresence mode="wait">
                    {!activeCategory ? (
                        <motion.div
                            key="hero-view"
                            className="shop-gallery-view"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="shop-top-hero">
                                <div className="hero-visual">
                                    <SafeImage
                                        src="https://res.cloudinary.com/dmw5efwf5/image/upload/v1770899767/ambre-candles/Favourites/mnszqowrujfkt3qhbqva.jpg"
                                        alt="Ambre Premium Candles"
                                        priority
                                    />
                                    <div className="hero-overlay"></div>
                                </div>
                                <div className="hero-text-content">
                                    <div className="boutique-label">AMBRE LUXE SELECTION</div>
                                    <h1 className="hero-main-title">Artisanal Gallery</h1>
                                    <p className="hero-subtext">Welcome to our sensory showcase. Select a category from the sidebar to explore our hand-poured collections.</p>
                                    <button
                                        className="btn-primary"
                                        style={{ marginTop: '30px' }}
                                        onClick={() => setActiveCategory('All')}
                                    >
                                        Explore All Products
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="product-view"
                            className="shop-product-focus-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="compact-category-header">
                                <span className="browsing-prefix">Browsing Collection</span>
                                <h1 className="active-cat-name">
                                    {activeCategory === 'All' ? 'Artisan Selection' : activeCategory}
                                </h1>
                                <div className="active-accent-line"></div>
                            </div>

                            {sortedProducts.length > 0 ? (
                                <div className="product-wall">
                                    {sortedProducts.map((p, i) => (
                                        <motion.div
                                            key={p.id}
                                            className="luxury-card"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: i * 0.05 }}
                                        >
                                            <div className="unit-visual">
                                                <Link href={`/product/${p.id}`} className="unit-link" style={{ position: 'relative', display: 'block', height: '100%' }}>
                                                    <SafeImage src={p.image} alt={p.name} />
                                                    {p.status === 'out_of_stock' && (
                                                        <div style={{ position: 'absolute', top: 10, left: 10, background: '#ef4444', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.7rem', zIndex: 10 }}>OUT OF STOCK</div>
                                                    )}
                                                    {p.status === 'coming_soon' && (
                                                        <div style={{ position: 'absolute', top: 10, left: 10, background: '#10b981', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.7rem', zIndex: 10 }}>COMING SOON</div>
                                                    )}
                                                </Link>
                                                <div className="unit-overlay">
                                                    <button
                                                        className="btn-quickview-shop"
                                                        onClick={(e) => { e.preventDefault(); setQuickViewProduct(p); }}
                                                    >
                                                        <Eye size={22} strokeWidth={1.5} />
                                                    </button>
                                                    <button
                                                        className={`btn-add-cart-shop ${addedProductId === p.id ? 'added' : ''}`}
                                                        disabled={p.status === 'out_of_stock' || p.status === 'coming_soon'}
                                                        style={{
                                                            opacity: (p.status === 'out_of_stock' || p.status === 'coming_soon') ? 0.5 : 1,
                                                            cursor: (p.status === 'out_of_stock' || p.status === 'coming_soon') ? 'not-allowed' : 'pointer'
                                                        }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            addToCart({ ...p, quantity: 1 });
                                                            setAddedProductId(p.id);
                                                            setTimeout(() => setAddedProductId(null), 2000);
                                                        }}
                                                    >
                                                        {addedProductId === p.id ? <Check size={18} /> : <ShoppingBag size={18} />}
                                                    </button>
                                                </div>
                                                <button
                                                    className="btn-wishlist-shop"
                                                    onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}
                                                >
                                                    <Heart
                                                        size={18}
                                                        fill={isInWishlist(p.id) ? "#d4af37" : "none"}
                                                        color={isInWishlist(p.id) ? "#d4af37" : "#1a1a1a"}
                                                    />
                                                </button>
                                            </div>
                                            <div className="unit-meta">
                                                <h3>{p.name}</h3>
                                                <p><span className="currency-symbol">₹</span>{p.price}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-products-wrapper">
                                    <h3 style={{ fontWeight: '300', color: '#666' }}>No products found in this selection.</h3>
                                    <button
                                        onClick={() => { setActiveCategory(null); router.push('/shop'); }}
                                        className="no-products-btn"
                                    >
                                        Back to Gallery
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick View Modal */}
                <AnimatePresence>
                    {quickViewProduct && (
                        <div className="quickview-overlay" onClick={() => setQuickViewProduct(null)}>
                            <motion.div
                                className="qv-modal"
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="qv-close-btn"
                                    onClick={() => setQuickViewProduct(null)}
                                >
                                    <X size={20} />
                                </button>
                                <div className="qv-image-side" style={{ position: 'relative' }}>
                                    <SafeImage src={quickViewProduct.image} alt={quickViewProduct.name} />
                                    {quickViewProduct.status === 'out_of_stock' && (
                                        <div style={{ position: 'absolute', top: 20, right: 20, background: '#ef4444', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontWeight: '600', fontSize: '0.8rem', zIndex: 10 }}>OUT OF STOCK</div>
                                    )}
                                    {quickViewProduct.status === 'coming_soon' && (
                                        <div style={{ position: 'absolute', top: 20, right: 20, background: '#10b981', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontWeight: '600', fontSize: '0.8rem', zIndex: 10 }}>COMING SOON</div>
                                    )}
                                </div>
                                <div className="qv-content">
                                    <span className="qv-category">{quickViewProduct.productType}</span>
                                    <h2 className="qv-title">{quickViewProduct.name}</h2>
                                    <div className="qv-price">
                                        <span className="currency-symbol">₹</span>{quickViewProduct.price}
                                    </div>
                                    <p className="qv-desc">{quickViewProduct.desc}</p>

                                    <div className="qv-actions">
                                        <button
                                            className="btn-primary"
                                            disabled={quickViewProduct.status === 'out_of_stock' || quickViewProduct.status === 'coming_soon'}
                                            style={{
                                                flex: 1,
                                                height: '60px',
                                                opacity: (quickViewProduct.status === 'out_of_stock' || quickViewProduct.status === 'coming_soon') ? 0.6 : 1,
                                                cursor: (quickViewProduct.status === 'out_of_stock' || quickViewProduct.status === 'coming_soon') ? 'not-allowed' : 'pointer',
                                                background: (quickViewProduct.status === 'out_of_stock' || quickViewProduct.status === 'coming_soon') ? '#888' : ''
                                            }}
                                            onClick={() => { addToCart({ ...quickViewProduct, quantity: 1 }); setQuickViewProduct(null); }}
                                        >
                                            {(quickViewProduct.status === 'out_of_stock' || quickViewProduct.status === 'coming_soon') ? (
                                                <>{quickViewProduct.status === 'out_of_stock' ? 'OUT OF STOCK' : 'COMING SOON'}</>
                                            ) : (
                                                <><ShoppingBag size={20} /> Add to Cart</>
                                            )}
                                        </button>
                                    </div>

                                    <Link
                                        href={`/product/${quickViewProduct.id}`}
                                        className="qv-view-details"
                                        onClick={() => setQuickViewProduct(null)}
                                    >
                                        View Full Product Details
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function Shop() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdfbf7' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', color: '#d4af37', letterSpacing: '4px' }}>AMBRE BOUTIQUE</div>
                    <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '10px' }}>Loading Collection...</div>
                </div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
