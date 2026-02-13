'use client';
import { useMemo, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SafeImage from '@/src/components/SafeImage';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import { PRODUCTS } from '@/src/config/products';
import { PRODUCT_CATEGORIES } from '@/src/config/constants';
import { Heart, ShoppingBag, Check, ArrowLeft } from 'lucide-react';
import '@/src/styles/Shop.css';
import '@/src/styles/Categories.css';

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
            className={`btn-add-cart ${added ? 'added' : ''}`}
            onClick={handleClick}
        >
            <AnimatePresence mode="wait">
                {added ? (
                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check size={16} />
                    </motion.div>
                ) : (
                    <motion.div key="bag" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <ShoppingBag size={16} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};



function CategoryContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const sort = searchParams.get('sort');

    const categoryName = decodeURIComponent(params.category);
    const { toggleWishlist, isInWishlist } = useWishlist();

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
                        <motion.div
                            layout
                            key={p.id}
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

                                {/* Wishlist Button */}
                                <button
                                    className="card-action-btn category-wishlist-btn"
                                    onClick={() => toggleWishlist(p)}
                                >
                                    <Heart
                                        size={18}
                                        fill={isInWishlist(p.id) ? "#d4af37" : "none"}
                                        color={isInWishlist(p.id) ? "#d4af37" : "#1a1a1a"}
                                    />
                                </button>

                                {/* Add to Cart Button */}
                                <div className="card-action-btn category-cart-btn">
                                    <AddToCartButton product={p} />
                                </div>
                            </div>

                            <div className="card-content">
                                <h3 className="card-title">{p.name}</h3>
                                <p className="card-price">₹{p.price}</p>
                            </div>
                        </motion.div>
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
