'use client';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SafeImage from '@/src/components/SafeImage';
import { PRODUCTS } from '@/src/config/products';
import { useWishlist } from '@/src/context/WishlistContext';
import { useCart } from '@/src/context/CartContext';
import { Heart, ShoppingCart } from 'lucide-react';
import { Suspense } from 'react';
import '../../src/styles/Collection.css';

function CollectionContent() {
    const searchParams = useSearchParams();
    const sort = searchParams.get('sort');
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();

    const filteredProducts = useMemo(() => {
        const maxPrice = parseInt(searchParams.get('max')) || 2000;
        let list = [...PRODUCTS].filter(p => p.price <= maxPrice);

        if (sort === 'price-low') {
            list.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            list.sort((a, b) => b.price - a.price);
        }
        return list;
    }, [sort, searchParams]);

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: 'var(--header-height)'
        }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 20px' }}>
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        textAlign: 'center',
                        marginBottom: '60px',
                        background: 'linear-gradient(135deg, #1a0f0a 0%, #2d1810 50%, #1a0f0a 100%)',
                        padding: '80px 50px',
                        borderRadius: '28px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.2)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <p style={{
                        color: '#d4af37',
                        fontSize: '0.9rem',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        marginBottom: '15px',
                        fontWeight: '600'
                    }}>
                        Master Gallery
                    </p>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        color: '#fff',
                        marginBottom: '20px',
                        fontWeight: '300',
                        letterSpacing: '2px'
                    }}>
                        Our Collection
                    </h1>
                    <div style={{
                        width: '80px',
                        height: '2px',
                        background: '#d4af37',
                        margin: '0 auto 30px'
                    }}></div>
                    <p style={{
                        fontSize: '1.1rem',
                        color: 'rgba(255,255,255,0.85)',
                        maxWidth: '600px',
                        margin: '0 auto 40px',
                        lineHeight: '1.8',
                        fontStyle: 'italic'
                    }}>
                        "The art of light, the science of scent."
                    </p>

                    {/* Sort Links */}
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link
                            href="/collection?sort=price-low"
                            style={{
                                padding: '10px 24px',
                                borderRadius: '25px',
                                background: sort === 'price-low' ? '#d4af37' : 'rgba(255,255,255,0.1)',
                                color: sort === 'price-low' ? '#1a1a1a' : '#fff',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                transition: 'all 0.3s ease',
                                border: '1px solid #d4af37'
                            }}
                            onMouseEnter={(e) => { if (sort !== 'price-low') { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#1a1a1a'; } }}
                            onMouseLeave={(e) => { if (sort !== 'price-low') { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; } }}
                        >
                            Price: Low to High
                        </Link>
                        <Link
                            href="/collection?sort=price-high"
                            style={{
                                padding: '10px 24px',
                                borderRadius: '25px',
                                background: sort === 'price-high' ? '#d4af37' : 'rgba(255,255,255,0.1)',
                                color: sort === 'price-high' ? '#1a1a1a' : '#fff',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                transition: 'all 0.3s ease',
                                border: '1px solid #d4af37'
                            }}
                            onMouseEnter={(e) => { if (sort !== 'price-high') { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#1a1a1a'; } }}
                            onMouseLeave={(e) => { if (sort !== 'price-high') { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; } }}
                        >
                            Price: High to Low
                        </Link>
                    </div>
                </motion.div>

                {/* Product Grid */}
                <div className="ambre-collection-grid-master">
                    {filteredProducts.map((product, i) => (
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
                                border: '2px solid transparent',
                                backgroundClip: 'padding-box',
                                position: 'relative'
                            }}
                            whileHover={{
                                y: -15,
                                boxShadow: '0 25px 50px rgba(212,175,55,0.3), 0 0 0 2px #d4af37',
                                scale: 1.02,
                                background: 'linear-gradient(to bottom, #fffef8 0%, #faf9f0 100%)'
                            }}
                        >
                            {/* Image */}
                            <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
                                <Link href={`/product/${product.id}`}>
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
                                </Link>

                                {/* Wishlist Button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
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
                                        zIndex: 2
                                    }}
                                >
                                    <Heart
                                        size={18}
                                        fill={isInWishlist(product.id) ? '#d4af37' : 'none'}
                                        color={isInWishlist(product.id) ? '#d4af37' : '#1a1a1a'}
                                    />
                                </button>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addToCart({ ...product, quantity: 1 });
                                    }}
                                    className="cart-add-btn"
                                    style={{
                                        position: 'absolute',
                                        bottom: '15px',
                                        right: '15px',
                                        background: '#d4af37',
                                        borderRadius: '50%',
                                        width: '45px',
                                        height: '45px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: '#fff',
                                        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                                        transition: 'all 0.3s ease',
                                        zIndex: 2
                                    }}
                                >
                                    <ShoppingCart size={20} />
                                </button>
                            </div>

                            {/* Product Info */}
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                <h3 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.1rem',
                                    color: '#1a1a1a',
                                    marginBottom: '10px',
                                    fontWeight: '400'
                                }}>
                                    {product.name}
                                </h3>
                                <p style={{
                                    fontSize: '1.2rem',
                                    color: '#d4af37',
                                    fontWeight: '700',
                                    marginBottom: '15px'
                                }}>
                                    ₹{product.price}
                                </p>

                                {/* View Product Button */}
                                <Link
                                    href={`/product/${product.id}`}
                                    style={{
                                        display: 'inline-block',
                                        padding: '10px 28px',
                                        background: 'transparent',
                                        color: '#d4af37',
                                        textDecoration: 'none',
                                        borderRadius: '25px',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease',
                                        marginTop: '5px',
                                        border: '2px solid #d4af37'
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
            </div>
        </div>
    );
}

export default function CollectionPage() {
    return (
        <Suspense fallback={<div>Loading Collection...</div>}>
            <CollectionContent />
        </Suspense>
    );
}
