'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';
import { Minus, Plus, ArrowLeft, ArrowRight, Eye, LayoutGrid, Check, ShoppingBag, Sparkles, Tag, Wind, Gem, Leaf, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SafeImage from '@/src/components/SafeImage';
import { PRODUCTS as STATIC_PRODUCTS } from '@/src/config/products';
import { db } from '@/src/config/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [activeImgIndex, setActiveImgIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [showSticky, setShowSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const addBtn = document.querySelector('.add-btn-v6');
            if (addBtn) {
                const rect = addBtn.getBoundingClientRect();
                setShowSticky(rect.top < 0);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        async function fetchProduct() {
            try {
                // Try fetching from Firestore first
                const docRef = doc(db, 'products', id.toString());
                const docSnap = await getDoc(docRef);

                let fetchedProduct = null;
                if (docSnap.exists()) {
                    fetchedProduct = { ...docSnap.data(), id: docSnap.data().id || id };
                } else {
                    // Fallback to static products
                    fetchedProduct = STATIC_PRODUCTS.find(p => p.id === parseInt(id));
                }
                setProduct(fetchedProduct);

                // Fetch recommendations
                if (fetchedProduct) {
                    const productsRef = collection(db, 'products');
                    const qSnapshot = await getDocs(productsRef);
                    const allProducts = qSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.data().id || doc.id }));

                    const pool = allProducts.length > 0 ? allProducts : STATIC_PRODUCTS;
                    const recommendations = pool
                        .filter(p => p.id !== fetchedProduct.id && (p.category === fetchedProduct.category || p.scentFamily === fetchedProduct.scentFamily))
                        .slice(0, 4);
                    setRecommendedProducts(recommendations);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                const staticMatch = STATIC_PRODUCTS.find(p => p.id === parseInt(id));
                setProduct(staticMatch);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdfbf7' }}>
            <div className="artisan-loader" style={{ width: '40px', height: '40px', border: '2px solid rgba(212, 175, 55, 0.1)', borderTopColor: '#d4af37', borderRadius: '50%' }}></div>
            <style jsx>{`
                .artisan-loader {
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );

    if (!product) return (
        <div className="container section" style={{ textAlign: 'center', padding: '120px 20px', background: '#fdfbf7', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: '#d4af37', letterSpacing: '4px', marginBottom: '20px' }}>AMBRE BOUTIQUE</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '20px' }}>Masterpiece Not Found</h2>
            <p style={{ color: '#666', marginBottom: '30px', maxWidth: '500px' }}>The artisanal creation you are looking for might have been moved or is currently unavailable in our gallery.</p>
            <Link href="/shop" className="btn-primary" style={{ padding: '15px 40px' }}>Return to Shop</Link>
        </div>
    );

    const mainImage = product.images ? product.images[activeImgIndex] : product.image;

    return (
        <div className="product-detail-v5 section">
            <div className="container">
                <button
                    onClick={() => {
                        if (window.history.length > 2) {
                            router.back();
                        } else {
                            router.push('/shop');
                        }
                    }}
                    className="back-link-v6"
                >
                    <ArrowLeft size={14} /> Back
                </button>

                <div className="detail-layout-v5">
                    {/* Artisan Spotlight Stage */}
                    <motion.div
                        className="main-visual-v5 active-gold-border"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.165, 0.84, 0.44, 1] }}
                        key={activeImgIndex} // Re-animate on change
                    >
                        <div className="main-visual-container" style={{ position: 'relative' }}>
                            <SafeImage src={mainImage} alt={product.name} priority={true} />
                            {product.status === 'out_of_stock' && (
                                <div style={{ position: 'absolute', top: 20, right: 20, background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: '30px', fontWeight: '600', fontSize: '0.85rem', letterSpacing: '1px', zIndex: 10, boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' }}>OUT OF STOCK</div>
                            )}
                            {product.status === 'coming_soon' && (
                                <div style={{ position: 'absolute', top: 20, right: 20, background: '#10b981', color: '#fff', padding: '8px 16px', borderRadius: '30px', fontWeight: '600', fontSize: '0.85rem', letterSpacing: '1px', zIndex: 10, boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>COMING SOON</div>
                            )}
                        </div>

                    </motion.div>

                    {/* Elite Info Card */}
                    <motion.div
                        className="elite-info-card"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="p-meta-v6">
                            <span className="meta-tag-v6">
                                <Tag size={14} style={{ color: '#d4af37' }} />
                                {product.productType || product.category}
                            </span>
                            <span className="meta-tag-v6">
                                <Sparkles size={14} style={{ color: '#d4af37' }} />
                                ARTISAN HANDMADE
                            </span>
                        </div>

                        <h1 className="elite-title-v6">
                            {product.name}
                        </h1>

                        <div className="p-price-v6">
                            <span className="total-price-v6">₹{product.price * quantity}</span>
                            {quantity > 1 && <span className="qty-calc-v6">({quantity} × ₹{product.price})</span>}
                        </div>

                        <div className="p-actions-v6">
                            <div className="qty-pill-v6">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.status === 'out_of_stock' || product.status === 'coming_soon'}><Minus size={18} /></button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} disabled={product.status === 'out_of_stock' || product.status === 'coming_soon'}><Plus size={18} /></button>
                            </div>
                            <button
                                className="add-btn-v6"
                                onClick={() => addToCart({ ...product, quantity })}
                                disabled={product.status === 'out_of_stock' || product.status === 'coming_soon'}
                            >
                                {product.status === 'out_of_stock' ? 'OUT OF STOCK' : product.status === 'coming_soon' ? 'COMING SOON' : 'ADD TO CART'}
                            </button>
                        </div>

                        <div className="p-narrative-v6">
                            {product.desc || product.description}
                        </div>

                        {/* Artisan Specs Section */}
                        <div className="artisan-specs-v6">
                            <div className="spec-item-v6">
                                <div className="spec-icon-box-v6" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                                    <Wind size={16} color="#d4af37" />
                                </div>
                                <div className="spec-content-v6">
                                    <span className="spec-label-v6">Scent Profile</span>
                                    <span className="spec-value-v6">{product.scentFamily || 'Curated Artisan Blend'}</span>
                                </div>
                            </div>
                            <div className="spec-item-v6">
                                <div className="spec-icon-box-v6" style={{ background: 'rgba(122, 108, 235, 0.1)' }}>
                                    <Gem size={16} color="#7a6ceb" />
                                </div>
                                <div className="spec-content-v6">
                                    <span className="spec-label-v6">Artisan Pick</span>
                                    <span className="spec-value-v6">{product.occasion || 'Everyday Luxury'}</span>
                                </div>
                            </div>
                            <div className="spec-item-v6">
                                <div className="spec-icon-box-v6" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                                    <Leaf size={16} color="#22c55e" />
                                </div>
                                <div className="spec-content-v6">
                                    <span className="spec-label-v6">Signature</span>
                                    <span className="spec-value-v6">100% Organic Soy</span>
                                </div>
                            </div>
                            <div className="spec-item-v6">
                                <div className="spec-icon-box-v6" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                                    <Truck size={16} color="#3b82f6" />
                                </div>
                                <div className="spec-content-v6">
                                    <span className="spec-label-v6">Logistics</span>
                                    <span className="spec-value-v6">Free Express Delivery</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Recommended Products */}
            {recommendedProducts.length > 0 && (
                <div className="related-section-v6">
                    <div className="container">
                        <div className="related-header-v6">
                            <span className="subtitle">Artisan Selection</span>
                            <h2>You May Also Like</h2>
                        </div>

                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 5000 }}
                            breakpoints={{
                                320: { slidesPerView: 1, spaceBetween: 20 },
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                1024: { slidesPerView: 4, spaceBetween: 30 }
                            }}
                            className="recommendations-swiper"
                        >
                            {recommendedProducts.map((p) => (
                                <SwiperSlide key={p.id}>
                                    <Link href={`/product/${p.id}`} className="recommendation-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                                        <div className="rec-card-v6">
                                            <div className="rec-image-box-v6">
                                                <SafeImage src={p.image} alt={p.name} />
                                            </div>
                                            <div className="rec-info-v6">
                                                <h4 className="rec-title-v6">{p.name}</h4>
                                                <p className="rec-price-v6">₹{p.price}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}
        </div>
    );
}
