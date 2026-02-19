import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import SafeImage from '@/src/components/SafeImage';
import { PRODUCTS as STATIC_PRODUCTS } from '@/src/config/products';
import { db } from '@/src/config/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [activeImgIndex, setActiveImgIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            try {
                // Try fetching from Firestore first
                const docRef = doc(db, 'products', id.toString());
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct({ ...docSnap.data(), id: docSnap.data().id || id });
                } else {
                    // Fallback to static products
                    const staticMatch = STATIC_PRODUCTS.find(p => p.id === parseInt(id));
                    setProduct(staticMatch);
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
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#d4af37', letterSpacing: '2px' }}>LOADING MASTERPIECE...</div>
        </div>
    );

    if (!product) return (
        <div className="container section" style={{ textAlign: 'center', padding: '100px' }}>
            <h2>Product not found</h2>
            <Link href="/collection" style={{ color: '#d4af37' }}>Return to Collection</Link>
        </div>
    );

    const mainImage = product.images ? product.images[activeImgIndex] : product.image;

    return (
        <div className="product-detail-v5 section">
            <div className="container">
                <Link href="/collection" className="back-link-v6">
                    <ArrowLeft size={14} /> Back to Collection
                </Link>

                <div className="detail-layout-v5">
                    {/* Artisan Spotlight Stage */}
                    <motion.div
                        className="main-visual-v5 active-gold-border"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.165, 0.84, 0.44, 1] }}
                        key={activeImgIndex} // Re-animate on change
                    >
                        <div className="main-visual-container">
                            <SafeImage src={mainImage} alt={product.name} />
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
                            <span className="meta-tag-v6">{product.productType || product.category}</span>
                            {product.occasion && <span className="meta-tag-v6" style={{ background: 'rgba(45, 74, 62, 0.1)', color: '#2d4a3e' }}>{product.occasion}</span>}
                        </div>

                        <h1 className="portal-luxury-title" style={{ color: '#1a1a13', fontSize: '3rem', textAlign: 'left', margin: '0 0 15px 0', textShadow: 'none' }}>
                            {product.name}
                        </h1>

                        <div className="p-price-v6">
                            <span className="currency-symbol">₹</span>{product.price}
                        </div>

                        <div className="p-narrative-v6">
                            {product.desc || product.description}
                        </div>

                        <div className="p-actions-v6">
                            <div className="qty-pill-v6">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={18} /></button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}><Plus size={18} /></button>
                            </div>
                            <button className="add-btn-v6" onClick={() => addToCart({ ...product, quantity })}>
                                ADD TO CART
                            </button>
                        </div>

                        {/* Artisan Specs Section */}
                        <div className="artisan-specs-v6">
                            <div className="spec-item-v6">
                                <span className="spec-label-v6">Scent Profile</span>
                                <span className="spec-value-v6">{product.scentFamily || 'Curated Artisan Blend'}</span>
                            </div>
                            <div className="spec-item-v6">
                                <span className="spec-label-v6">Artisan Pick</span>
                                <span className="spec-value-v6">{product.occasion || 'Everyday Luxury'}</span>
                            </div>
                            <div className="spec-item-v6">
                                <span className="spec-label-v6">Signature</span>
                                <span className="spec-value-v6">100% Organic Soy</span>
                            </div>
                            <div className="spec-item-v6">
                                <span className="spec-label-v6">Logistics</span>
                                <span className="spec-value-v6">Free Express Delivery</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
