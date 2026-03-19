'use client';
import { useState, useEffect, useMemo, Suspense, useRef } from 'react';
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
import { Heart, X, ShoppingBag, Check, Eye, Sparkles, LayoutGrid, IndianRupee, ArrowLeft, ArrowRight, Search, Filter, ArrowUpDown } from 'lucide-react';
import SafeImage from '@/src/components/SafeImage';
import '@/src/styles/Shop.css';
import '@/src/styles/Categories.css';
import { useSiteConfig } from '@/src/hooks/useSiteConfig';

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { getHero } = useSiteConfig();

    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [sortBy, setSortBy] = useState(searchParams.get('sort') === 'Bestsellers' ? 'Bestsellers' : 'Featured');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || searchParams.get('category') || '');

    const [addedProductId, setAddedProductId] = useState(null);
    const [dynamicProducts, setDynamicProducts] = useState(STATIC_PRODUCTS);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10); 
    
    // Drag-to-Scroll Refs & State
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // 2x2 grid for mobile (4 products), 10 for desktop
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        const updateProductsPerPage = (e) => {
            setProductsPerPage(e.matches ? 4 : 10);
        };

        updateProductsPerPage(mediaQuery);
        mediaQuery.addListener(updateProductsPerPage);
        return () => mediaQuery.removeListener(updateProductsPerPage);
    }, []);

    useEffect(() => {
        const s = searchParams.get('search') || searchParams.get('category') || '';
        setSearchQuery(s);
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300); // Increased to 300ms for smoother performance
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                if (!querySnapshot.empty) {
                    const productsData = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }));
                    setDynamicProducts(productsData);
                }
            } catch (error) {
                console.error("Firestore fetch error:", error);
                // Stays with STATIC_PRODUCTS
            }
        }
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return dynamicProducts.filter(p => {
            const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
            const terms = debouncedSearchQuery.toLowerCase().trim().split(/\s+/).filter(t => t.length > 0);
            
            // Create a searchable pool of all text fields
            const searchableText = [
                p.name || '',
                p.productType || '',
                p.category || '',
                p.scentFamily || '',
                p.occasion || '',
                'candle' // Add 'candle' as a global keyword for all items
            ].join(' ').toLowerCase();

            const matchesSearch = terms.length === 0 || terms.every(t =>
                searchableText.includes(t)
            );
            return matchesPrice && matchesSearch;
        });
    }, [dynamicProducts, priceRange, debouncedSearchQuery]);

    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts].sort((a, b) => {
            if (sortBy === 'Price: Low-High') return a.price - b.price;
            if (sortBy === 'Price: High-Low') return b.price - a.price;
            if (sortBy === 'Bestsellers') return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
            return 0;
        });
        return sorted;
    }, [filteredProducts, sortBy]);


    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy]);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return sortedProducts.slice(startIndex, startIndex + productsPerPage);
    }, [sortedProducts, currentPage, productsPerPage]);

    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    // Mouse Drag Logic
    const handleDragStart = (e) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleDragEnd = () => setIsDragging(false);

    const handleDragMove = (e) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="ambre-boutique-shop-redesign section">
            {/* Hero Section */}
            <div className="shop-redesign-hero">
                <div className="hero-visual-redesign">
                    <SafeImage src={getHero('shop', 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773650440/ambre-candles/Favourites/tdboywkhdakz8slsmk1t.jpg')} alt="Hero" priority />
                    <div className="hero-overlay-redesign"></div>
                </div>

                {/* Back Button */}
                <button
                    className="shop-back-btn" 
                    onClick={() => {
                        if (window.history.length > 2) {
                            router.back();
                        } else {
                            router.push('/');
                        }
                    }}
                    style={{
                        position: 'absolute',
                        top: '15px', // Changed from 45px to keep it just below header with slight gap
                        left: '20px', // Standardized to 20px gap
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
                        e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                        e.currentTarget.style.borderColor = '#d4af37';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>

                <div className="hero-text-redesign">
                    <div className="bestsellers-badge">
                        <Sparkles size={14} /> <span>Luxury Collection</span>
                    </div>
                    <h1 className="hero-title-redesign">Find Your <span>Perfect Glow</span></h1>
                    <p className="hero-subtext-redesign">Premium handcrafted candles for your elegant lifestyle.</p>
                </div>
            </div>

            <div className="shop-container-redesign" id="product-grid-start">
                <div className="categories-row-container">
                    <div className="sticky-category-wrap">
                        <button
                            onClick={() => setSearchQuery('')}
                            className={`category-pill-btn ${searchQuery === '' ? 'active' : ''}`}
                        >
                            All
                        </button>
                    </div>

                    <div
                        className={`categories-pills-scroll ${isDragging ? 'dragging' : ''}`}
                        ref={scrollRef}
                        onMouseDown={handleDragStart}
                        onMouseLeave={handleDragEnd}
                        onMouseUp={handleDragEnd}
                        onMouseMove={handleDragMove}
                    >
                        {PRODUCT_CATEGORIES.filter(cat => cat !== 'All').map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSearchQuery(cat)}
                                className={`category-pill-btn ${searchQuery.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="right-scroll-fade"></div>
                </div>

                <div className="shop-products-redesign-view">
                    {paginatedProducts.length > 0 ? (
                        <div className="grid-container-redesign">
                            {paginatedProducts.map((p, i) => (
                                <motion.div
                                    key={p.id || i}
                                    className="artisan-luxury-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                >
                                    <div className="card-visual-redesign">
                                        <Link href={`/product/${p.id}`} className="card-img-link">
                                            <SafeImage 
                                                src={p.image} 
                                                alt={p.name} 
                                                priority={i < 4} /* Prioritize first row of products for instant visibility */
                                            />
                                            {p.bestseller && (
                                                <div className="bestseller-tag-card">
                                                    <Sparkles size={10} /> <span>Bestseller</span>
                                                </div>
                                            )}
                                        </Link>
                                    </div>
                                    <div className="card-details-redesign">
                                        <h3 className="product-title-redesign">{p.name}</h3>
                                        <div className="product-price-redesign">₹{p.price}</div>
                                        <button
                                            className={`add-cart-btn-redesign ${addedProductId === p.id ? 'added' : ''}`}
                                            onClick={() => {
                                                addToCart({ ...p, quantity: 1 });
                                                setAddedProductId(p.id);
                                                setTimeout(() => setAddedProductId(null), 2000);
                                            }}
                                        >
                                            {addedProductId === p.id ? 'Added' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-results-redesign">
                            <h3>No items found in this section.</h3>
                            <button onClick={() => setSearchQuery('')} className="reset-btn-redesign">Reset</button>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="premium-pagination-wrap">
                        <button
                            className="pag-nav-btn prev"
                            disabled={currentPage === 1}
                            onClick={() => {
                                setCurrentPage(p => p - 1);
                                document.getElementById('product-grid-start')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <ArrowLeft size={18} /><span>Prev</span>
                        </button>

                        <div className="pag-numbers">
                            {(() => {
                                const pages = [];
                                pages.push(1);
                                if (currentPage > 3) pages.push('...');
                                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                                    pages.push(i);
                                }
                                if (currentPage < totalPages - 2) pages.push('...');
                                if (totalPages > 1) pages.push(totalPages);

                                return pages.map((item, idx) => (
                                    item === '...' ? (
                                        <span key={`dots-${idx}`} className="pag-ellipsis">...</span>
                                    ) : (
                                        <button
                                            key={item}
                                            className={`pag-num-btn ${currentPage === item ? 'active' : ''}`}
                                            onClick={() => {
                                                setCurrentPage(item);
                                                document.getElementById('product-grid-start')?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                        >
                                            {item}
                                        </button>
                                    )
                                ));
                            })()}
                        </div>

                        <button
                            className="pag-nav-btn next"
                            disabled={currentPage === totalPages}
                            onClick={() => {
                                setCurrentPage(p => p + 1);
                                document.getElementById('product-grid-start')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <span>Next</span><ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Shop() {
    return (
        <ShopContent />
    );
}
