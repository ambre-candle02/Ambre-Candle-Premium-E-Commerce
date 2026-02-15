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
                        <Eye size={22} strokeWidth={1.5} />
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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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

    if (!isMounted) return null;

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
                            <div className="qv-image-side">
                                <SafeImage src={quickViewProduct.image} alt={quickViewProduct.name} />
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
                                        style={{ flex: 1, height: '60px' }}
                                        onClick={() => { addToCart({ ...quickViewProduct, quantity: 1 }); setQuickViewProduct(null); }}
                                    >
                                        <ShoppingBag size={20} /> Add to Cart
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
    );
}

export default function CategoryPage() {
    return (
        <Suspense fallback={<div>Loading Selection...</div>}>
            <CategoryContent />
        </Suspense>
    );
}
