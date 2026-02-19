'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/src/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PRODUCT_CATEGORIES } from '@/src/config/constants';
import { Package, IndianRupee, Tag, Info, Image as ImageIcon, FileText, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        productType: '',
        scentFamily: '',
        occasion: '',
        image: '',
        desc: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const productsCollection = collection(db, 'products');
            const newProduct = {
                ...formData,
                id: Date.now(),
                price: Number(formData.price),
                createdAt: serverTimestamp(),
                updatedAt: new Date().toISOString()
            };
            await addDoc(productsCollection, newProduct);
            setSuccess(true);
            setFormData({
                name: '',
                price: '',
                productType: '',
                scentFamily: '',
                occasion: '',
                image: '',
                desc: ''
            });
            setTimeout(() => setSuccess(false), 4000);
        } catch (error) {
            console.error(error);
            alert("Error adding product: " + error.message);
        }
        setLoading(false);
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1.5px solid #eee',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.3s ease',
        background: '#fcfcfc'
    };

    const labelStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '10px',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#444'
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '100px 20px 60px',
            background: '#fafafa',
            fontFamily: 'var(--font-heading)'
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <button
                    onClick={() => router.push('/admin')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        color: '#888',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        marginBottom: '30px'
                    }}
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px'
                }}>
                    <div>
                        <h1 style={{ fontSize: '2.8rem', color: '#1a1a1a', margin: 0 }}>Catalog Manager</h1>
                        <p style={{ color: '#666', marginTop: '5px' }}>Add a new masterpiece to your dynamic collection.</p>
                    </div>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: '#d4af37',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        boxShadow: '0 10px 25px rgba(212, 175, 55, 0.3)'
                    }}>
                        <Package size={30} />
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

                        {/* Left Column: Essential Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                background: '#fff',
                                padding: '30px',
                                borderRadius: '24px',
                                border: '2px solid #d4af37',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
                            }}
                        >
                            <h3 style={{ marginBottom: '25px', color: '#d4af37', fontSize: '1.2rem' }}>Essential Details</h3>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}><Tag size={16} /> Product Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    placeholder="e.g. Royal Sunburst Urli"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                                    onBlur={(e) => e.target.style.borderColor = '#eee'}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={labelStyle}><IndianRupee size={16} /> Price</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        placeholder="450"
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                                        onBlur={(e) => e.target.style.borderColor = '#eee'}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}><Package size={16} /> Category</label>
                                    <select
                                        required
                                        value={formData.productType}
                                        onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                                        onBlur={(e) => e.target.style.borderColor = '#eee'}
                                    >
                                        <option value="">Choose...</option>
                                        {PRODUCT_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}><Info size={16} /> Scent Family</label>
                                <input
                                    type="text"
                                    value={formData.scentFamily}
                                    placeholder="e.g. Sandalwood & Turmeric"
                                    onChange={(e) => setFormData({ ...formData, scentFamily: e.target.value })}
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                                    onBlur={(e) => e.target.style.borderColor = '#eee'}
                                />
                            </div>
                        </motion.div>

                        {/* Right Column: Media & Specs */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
                        >
                            <div style={{
                                background: '#fff',
                                padding: '30px',
                                borderRadius: '24px',
                                border: '2px solid #d4af37',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
                            }}>
                                <h3 style={{ marginBottom: '25px', color: '#d4af37', fontSize: '1.2rem' }}>Visual Content</h3>
                                <div>
                                    <label style={labelStyle}><ImageIcon size={16} /> Image URL (Cloudinary)</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.image}
                                        placeholder="Paste Link Here"
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                                        onBlur={(e) => e.target.style.borderColor = '#eee'}
                                    />
                                    <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '8px' }}>Images should be high-resolution for the premium feel.</p>
                                </div>
                            </div>

                            <div style={{
                                background: '#fff',
                                padding: '30px',
                                borderRadius: '24px',
                                border: '2px solid #d4af37',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                                flex: 1
                            }}>
                                <label style={labelStyle}><FileText size={16} /> Description</label>
                                <textarea
                                    required
                                    rows="5"
                                    value={formData.desc}
                                    placeholder="Tell us about this beautiful candle..."
                                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                    style={{ ...inputStyle, resize: 'none', height: '140px' }}
                                    onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                                    onBlur={(e) => e.target.style.borderColor = '#eee'}
                                />
                            </div>
                        </motion.div>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <button
                            disabled={loading}
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '20px',
                                background: loading ? '#ddd' : '#d4af37',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '20px',
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                            }}
                        >
                            {loading ? 'Publishing...' : <><Send size={20} /> Publish Product to Live Store</>}
                        </button>
                    </div>

                    <AnimatePresence>
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                style={{
                                    marginTop: '25px',
                                    padding: '20px',
                                    background: 'rgba(16, 185, 129, 0.05)',
                                    borderRadius: '16px',
                                    border: '1px solid #10b981',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    color: '#065f46',
                                    fontWeight: '700'
                                }}
                            >
                                <CheckCircle2 size={24} /> ✨ Masterpiece Published! It is now live on the storefront.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
}
