'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SafeImage from '@/src/components/SafeImage';
import { PRODUCTS as STATIC_PRODUCTS } from '@/src/config/products';
import { db } from '@/src/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useWishlist } from '@/src/context/WishlistContext';
import { useCart } from '@/src/context/CartContext';
import { Heart, ShoppingCart, ShoppingBag, Check, ArrowLeft, Eye, ChevronLeft, ChevronRight, X, LayoutGrid } from 'lucide-react';
import { Suspense, useLayoutEffect } from 'react';
import '../../src/styles/Collection.css';
import { useSiteConfig } from '@/src/hooks/useSiteConfig';

function CollectionContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sort = searchParams.get('sort');
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { getHero, getTitle, getCollectionHero, config } = useSiteConfig();
    const [dynamicProducts, setDynamicProducts] = useState(STATIC_PRODUCTS);
    const [isSyncing, setIsSyncing] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [addedProductId, setAddedProductId] = useState(null);
    const [productsPerPage, setProductsPerPage] = useState(10); // Default to desktop 10 items

    // Handle responsive items per page using matchMedia
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleMediaChange = (e) => {
            setProductsPerPage(e.matches ? 4 : 10); // 4 for mobile, 10 for desktop
        };

        // Set initial value
        setProductsPerPage(mediaQuery.matches ? 4 : 10);

        // Add listener
        mediaQuery.addListener(handleMediaChange);
        return () => mediaQuery.removeListener(handleMediaChange);
    }, []);

    // Two-Tier Filter Logic
    const filterGroups = {
        'All': [],
        'Gift': ['Hampers | Combo', 'Rakhi'],
        'Festive': ['Christmas', 'Diwali', 'Halloween | Fall', 'Ladoo Candle'],
        'Decor': ['Concrete Base Candle', 'Cake / Dessert Candle'],
        'Jar': ['Baby Shower', 'Glass Jar Candle', 'Coconut Shell Candle']
    };

    const [activeGroup, setActiveGroup] = useState('All');
    const [activeSubCategory, setActiveSubCategory] = useState('All');

    // Sync state with URL search params on load
    useEffect(() => {
        const category = searchParams.get('category');
        const sub = searchParams.get('sub');
        if (category && filterGroups[category]) {
            setActiveGroup(category);
        }
        if (sub) {
            setActiveSubCategory(sub);
        }
    }, [searchParams]);

    // Update URL when category changes
    const updateUrl = (group, sub) => {
        const params = new URLSearchParams(searchParams);
        if (group === 'All') {
            params.delete('category');
            params.delete('sub');
        } else {
            params.set('category', group);
            if (sub && sub !== 'All') {
                params.set('sub', sub);
            } else {
                params.delete('sub');
            }
        }
        router.push(`/collection?${params.toString()}`, { scroll: false });
    };

    // Fetch products from Firestore
    useEffect(() => {
        async function fetchProducts() {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                if (!querySnapshot.empty) {
                    const products = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.data().id || doc.id
                    }));
                    setDynamicProducts(products);
                }
            } catch (error) {
                console.error("Firestore fetch error, falling back to static config:", error);
                // Keep the initial STATIC_PRODUCTS
            } finally {
                setIsSyncing(false);
            }
        }
        fetchProducts();
    }, []);

    const subCategories = useMemo(() => {
        if (activeGroup === 'All') return [];
        return filterGroups[activeGroup] || [];
    }, [activeGroup]);

    // Handle group change
    const handleGroupChange = (group) => {
        setActiveGroup(group);
        setActiveSubCategory('All');
        updateUrl(group, 'All');
    };

    // Handle sub-category change
    const handleSubCategoryChange = (sub) => {
        setActiveSubCategory(sub);
        updateUrl(activeGroup, sub);
    };

    const processedProducts = useMemo(() => {
        let list = [...dynamicProducts];
        
        // Filter by Group (if specialized group logic needed beyond subcategories)
        if (activeGroup !== 'All') {
            const allowedTypes = filterGroups[activeGroup];
            list = list.filter(p => allowedTypes.includes(p.productType));
            
            // Further filter by Sub-category if specified
            if (activeSubCategory !== 'All') {
                list = list.filter(p => p.productType === activeSubCategory);
            }
        }

        const maxPrice = parseInt(searchParams.get('max')) || 2000;
        list = list.filter(p => p.price <= maxPrice);

        if (sort === 'price-low') {
            list.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            list.sort((a, b) => b.price - a.price);
        }
        return list;
    }, [sort, searchParams, dynamicProducts, activeGroup, activeSubCategory]);

    // Pagination Logic
    const totalPages = Math.ceil(processedProducts.length / productsPerPage);
    const currentProducts = processedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeGroup, activeSubCategory, sort]);

    // Dynamic Hero Images with complete mapping
    const heroImageMap = {
        'All': 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773684711/ambre-candles/Favourites/g3x00qwxo1yw2iz3qp6v.png',
        'Gift': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop',
        'Festive': 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773641385/ambre-candles/Favourites/opfs7sciaxvxubhdq3bc.jpg',
        'Decor': 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770899720/ambre-candles/Favourites/fyrg1vwl7uzm2nbrl8ky.jpg',
        'Jar': 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773646123/ambre-candles/Favourites/vkr7h30a874rgjzox5h3.jpg',
        
        // Sub-categories fallback or specific
        'Diwali': 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773862753/ambre-candles/Favourites/hxqdpn9cg8bwz7l1wtju.png',
        'Christmas': 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773862754/ambre-candles/Favourites/xpo0vxbfxlg2yhcuc13g.png',
        'Halloween | Fall': 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773862751/ambre-candles/Favourites/adrgpopcvgolynrkxiae.png',
        'Ladoo Candle': 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773862749/ambre-candles/Favourites/pjbtrful0kzqayq8zaog.png',
        'Hampers | Combo': 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2000&auto=format&fit=crop',
        'Rakhi': 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773642163/ambre-candles/Favourites/ze9jaer0jkf5e0xo8mll.jpg',
        'Concrete Base Candle': 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773645517/ambre-candles/Favourites/xlnqywo8rhyl1o8chzeq.png',
        'Cake / Dessert Candle': 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773645725/ambre-candles/Favourites/n6vhndsg50qjsso7vdry.jpg',
        'Baby Shower': '/images/baby-shower-hero.png',
        'Glass Jar Candle': 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773646123/ambre-candles/Favourites/vkr7h30a874rgjzox5h3.jpg',
        'Coconut Shell Candle': '/images/coconut-shell-hero.png'
    };

    const currentHeroImage = useMemo(() => {
        // Source: Admin Panel Dynamic overrides
        const adminCollectionHero = getHero('collection');
        const adminSubHero = activeSubCategory !== 'All' ? getCollectionHero(activeSubCategory) : null;
        const adminGroupHero = activeGroup !== 'All' ? getCollectionHero(activeGroup) : null;

        // Priority 1: Sub-category specific from Admin
        if (adminSubHero) return adminSubHero;
        
        // Priority 2: Sub-category static fallback
        if (activeSubCategory !== 'All' && heroImageMap[activeSubCategory]) {
            return heroImageMap[activeSubCategory];
        }

        // Priority 3: Group specific from Admin
        if (adminGroupHero) return adminGroupHero;
        
        // Priority 4: Main Collection global from Admin
        if (activeGroup === 'All' && adminCollectionHero) {
            return adminCollectionHero;
        }

        // Priority 5: Static fallbacks
        return heroImageMap[activeGroup] || adminCollectionHero || heroImageMap['All'];
    }, [activeGroup, activeSubCategory, config?.collections, getHero('collection')]);

    return (
        <div className="ambre-collection-page-root">
            {/* Full-Width Hero Section */}
            <div className="collection-hero-container" style={{
                position: 'relative',
                width: '100%',
                minHeight: 'var(--collection-hero-min-height, 550px)',
                overflow: 'hidden',
                marginTop: 'var(--collection-hero-mt, var(--header-height))',
                backgroundColor: '#1a1a1a'
            }}>
                {/* Background Layer with Animation */}
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={currentHeroImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 1
                        }}
                    >
                        <SafeImage 
                            src={currentHeroImage} 
                            alt="Collection Hero" 
                            priority 
                            className="collection-hero-image-styled"
                            style={{
                                objectPosition: 'center 40%',
                                filter: 'contrast(1.1) brightness(1.05) saturate(1.2)'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
                            zIndex: 2
                        }}></div>
                    </motion.div>
                </AnimatePresence>

                {/* Back Button */}
                <button
                    onClick={() => {
                        if (window.history.length > 2) {
                            router.back();
                        } else {
                            router.push('/');
                        }
                    }}
                    className="collection-back-btn"
                    style={{
                        position: 'absolute',
                        top: '15px',
                        left: '40px',
                        zIndex: 20,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#d4af37',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        cursor: 'pointer',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        padding: '10px 20px',
                        borderRadius: '50px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>

                {/* Content Layer */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: 'var(--collection-hero-padding, 150px 60px 100px 60px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    maxWidth: '1440px',
                    margin: '0 auto',
                    height: '100%'
                }}>
                    <div className="collection-hero-text-wrapper" style={{ maxWidth: '520px' }}>
                        {/* The centered badge */}
                        <div className="collection-hero-badge" style={{
                            position: 'absolute',
                            top: '40px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            letterSpacing: '3px',
                            color: '#e8ca6b', /* Bright elegant gold */
                            textTransform: 'uppercase',
                            fontWeight: '800',
                            padding: '12px 28px',
                            background: 'rgba(0, 0, 0, 0.65)', /* Much darker for high contrast */
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(212, 175, 55, 0.8)', /* Stronger gold border */
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)', /* Deeper shadow */
                            whiteSpace: 'nowrap',
                        }}>
                            Nature Inspired Collection
                        </div>
                        <h1 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            color: '#fff',
                            margin: '0 0 15px 0',
                            fontWeight: '400',
                            lineHeight: '1.2'
                        }}>
                            {getHero('collection_title', 'Our Sustainable Candles')}
                        </h1>
                        <p style={{
                            fontSize: '1.15rem',
                            color: 'rgba(255,255,255,0.9)',
                            margin: '0 0 30px 0',
                            lineHeight: '1.6',
                            fontWeight: '300',
                        }}>
                            {getHero('collection_sub', 'Hand-poured with natural wax and mindful craftsmanship')}
                        </p>

                        {/* Sort Dropdown - Luxury Style */}
                        <div className="sort-container-hero">
                            <select
                                onChange={(e) => router.push(`/collection?sort=${e.target.value}`)}
                                value={sort || ''}
                                className="luxury-sort-dropdown"
                                style={{
                                    padding: '12px 45px 12px 20px',
                                    borderRadius: '10px',
                                    background: '#1a120b',
                                    color: '#fff',
                                    border: '1px solid #d4a857',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d4a857' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'calc(100% - 15px) center',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <option value="" style={{ background: '#1a120b' }}>Sort: Default</option>
                                <option value="price-low" style={{ background: '#1a120b' }}>Sort: Price (Low to High)</option>
                                <option value="price-high" style={{ background: '#1a120b' }}>Sort: Price (High to Low)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container collection-container-main" style={{ paddingTop: '0' }}>
                {/* Primary Group Filter */}
                <div className="collection-filter-pills-container" style={{ marginBottom: '20px' }}>
                    {Object.keys(filterGroups).map((group) => (
                        <button
                            key={group}
                            className={`filter-pill ${activeGroup === group ? 'active' : ''}`}
                            onClick={() => handleGroupChange(group)}
                        >
                            {group}
                        </button>
                    ))}
                </div>

                {/* Secondary Sub-Category Filter */}
                {subCategories.length > 0 && (
                    <div className="secondary-filter-container">
                        <button
                            className={`secondary-filter-pill ${activeSubCategory === 'All' ? 'active' : ''}`}
                            onClick={() => handleSubCategoryChange('All')}
                        >
                            All {activeGroup}
                        </button>
                        {subCategories.map((sub) => (
                            <button
                                key={sub}
                                className={`secondary-filter-pill ${activeSubCategory === sub ? 'active' : ''}`}
                                onClick={() => handleSubCategoryChange(sub)}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                )}

                {/* Product Grid */}
                <div className="ambre-collection-grid-master">
                    {currentProducts.map((product, i) => (
                        <motion.div
                            key={product.id}
                            className="motion-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            style={{
                                background: 'linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(212,175,55,0.1)',
                                transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                cursor: 'pointer',
                                border: '2px solid #d4af37', /* Permanent gold border */
                                backgroundClip: 'padding-box',
                                position: 'relative'
                            }}
                            whileHover={{
                                y: -15,
                                boxShadow: '0 25px 50px rgba(212,175,55,0.3)',
                                scale: 1.02,
                                background: 'linear-gradient(to bottom, #fffef8 0%, #faf9f0 100%)'
                            }}
                        >
                            {/* Image */}
                            <div className="product-image-container" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                                <Link href={`/product/${product.id}`} style={{ position: 'relative', display: 'block', height: '100%' }}>
                                    <SafeImage
                                        src={product.image}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease'
                                        }}
                                    />
                                    {product.status === 'out_of_stock' && (
                                        <div style={{ position: 'absolute', top: 15, left: 15, background: '#ef4444', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.75rem', zIndex: 10 }}>OUT OF STOCK</div>
                                    )}
                                    {product.status === 'coming_soon' && (
                                        <div style={{ position: 'absolute', top: 15, left: 15, background: '#10b981', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.75rem', zIndex: 10 }}>COMING SOON</div>
                                    )}
                                </Link>

                                {/* Add to Cart Button Overlay - Outside Link for better click handling */}
                                <div className="quick-view-overlay">
                                    <button 
                                        className={`quick-view-btn ${addedProductId === product.id ? 'added' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            addToCart({ ...product, quantity: 1 });
                                            setAddedProductId(product.id);
                                            setTimeout(() => setAddedProductId(null), 2000);
                                        }}
                                        disabled={product.status === 'out_of_stock' || product.status === 'coming_soon'}
                                        style={{
                                            opacity: (product.status === 'out_of_stock' || product.status === 'coming_soon') ? 0.6 : 1,
                                            cursor: (product.status === 'out_of_stock' || product.status === 'coming_soon') ? 'not-allowed' : 'pointer',
                                            backgroundColor: addedProductId === product.id ? '#2d4a3e' : '#fff',
                                            color: addedProductId === product.id ? '#fff' : '#1a0f05'
                                        }}
                                    >
                                        {addedProductId === product.id ? (
                                            <>
                                                <Check size={18} />
                                                <span>Added</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag size={18} />
                                                <span>Add to Cart</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Wishlist Button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleWishlist(product);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        background: '#fff',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                        transition: 'all 0.3s ease',
                                        zIndex: 10,
                                        pointerEvents: 'auto'
                                    }}
                                >
                                    <Heart
                                        size={18}
                                        fill={isInWishlist(product.id) ? '#d4af37' : 'none'}
                                        color={isInWishlist(product.id) ? '#d4af37' : '#1a1a1a'}
                                    />
                                </button>


                            </div>

                            {/* Product Info */}
                            <div className="product-info-wrap" style={{ padding: '20px', textAlign: 'center' }}>
                                <h3 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--collection-product-name-size, 1rem)',
                                    color: '#1a1a1a',
                                    marginBottom: '6px',
                                    fontWeight: '400',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 'var(--collection-product-name-clamp, unset)',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    minHeight: 'var(--collection-product-name-height, auto)',
                                    lineHeight: '1.4'
                                }}>
                                    {product.name}
                                </h3>
                                <p style={{
                                    fontSize: '1rem',
                                    color: '#d4af37',
                                    fontWeight: '700',
                                    marginBottom: '10px'
                                }}>
                                    <span className="currency-symbol">₹</span>{product.price}
                                </p>

                                {/* View Product Button */}
                                <Link
                                    href={`/product/${product.id}`}
                                    style={{
                                        display: 'inline-block',
                                        padding: 'var(--collection-btn-padding, 10px 28px)',
                                        background: 'transparent',
                                        color: '#d4af37',
                                        textDecoration: 'none',
                                        borderRadius: '25px',
                                        fontSize: 'var(--collection-btn-size, 0.9rem)',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease',
                                        marginTop: '5px',
                                        border: '2px solid #d4af37',
                                        whiteSpace: 'var(--collection-btn-ws, normal)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#d4af37';
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(212,175,55,0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#d4af37';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    View Product
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="collection-pagination">
                        <button 
                            className="pagination-arrow"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        <div className="pagination-info">
                            Page <span className="current-page">{currentPage}</span> of {totalPages}
                        </div>

                        <button 
                            className="pagination-arrow"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div >
        </div >
    );
}

export default function CollectionPage() {
    return (
        <CollectionContent />
    );
}
