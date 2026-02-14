'use client';
import { useMemo, useState, Suspense, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SafeImage from '@/src/components/SafeImage';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import { PRODUCTS } from '@/src/config/products';
import { PRODUCT_CATEGORIES } from '@/src/config/constants';
import { Heart, ShoppingBag, Check, ArrowLeft, Eye, X } from 'lucide-react';
import '@/src/styles/Shop.css';
import '@/src/styles/Categories.css';

const CategoryCard = ({ p, i, isInWishlist, toggleWishlist, setQuickViewProduct }) => {
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
            className="category-artisan-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
        >
            <div className="card-img-wrapper">
                <Link href={`/product/${p.id}`}>
                    <SafeImage
                        src={p.image}
                        alt={p.name}
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
                    className="card-action-btn category-wishlist-btn"
                    style={{
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(p);
                    }}
                >
                    <Heart
                        size={18}
                        fill={isInWishlist(p.id) ? "#d4af37" : "none"}
                        color={isInWishlist(p.id) ? "#d4af37" : "#1a1a1a"}
                    />
                </button>
            </div>

            <div className="card-content">
                <h3 className="card-title">{p.name}</h3>
                <p className="card-price"><span className="currency-symbol">₹</span>{p.price}</p>
            </div>
        </motion.div>
    );
};

function CategoryContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    const categoryName = decodeURIComponent(params.category);

    const filteredProducts = useMemo(() => {
        const sort = searchParams.get('sort');
        const maxPrice = parseInt(searchParams.get('max')) || 2000;

        let list = PRODUCTS.filter(p =>
            (p.productType === categoryName || (p.productType && p.productType.includes(categoryName))) &&
            p.price <= maxPrice
        );

        if (sort === 'price-low') {
            list = [...list].sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            list = [...list].sort((a, b) => b.price - a.price);
        }
        return list;
    }, [categoryName, searchParams]);

    return (
        <div className="category-products-container" style={{ width: '100%' }}>
            <div className="category-results-grid">
                <AnimatePresence mode='popLayout'>
                    {filteredProducts.map((p, i) => (
                        <CategoryCard
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

            {filteredProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h3>No products found in this category.</h3>
                    <Link href="/categories" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                        Explore Other Categories
                    </Link>
                </div>
            )}

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
                                            style={{ flex: 1, height: '55px', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
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

export default function CategoryPage() {
    return (
        <Suspense fallback={<div>Loading Selection...</div>}>
            <CategoryContent />
        </Suspense>
    );
}
