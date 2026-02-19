'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/src/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PRODUCT_CATEGORIES } from '@/src/config/constants';
import Link from 'next/link';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const productsCollection = collection(db, 'products');
            const newProduct = {
                ...formData,
                id: Date.now(), // Unique ID based on timestamp
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
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error(error);
            alert("Error adding product: " + error.message);
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '120px 20px',
            background: '#fafafa'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link href="/admin" style={{ color: '#d4af37', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
                    ← Back to Admin
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: '#fff',
                        padding: '40px',
                        borderRadius: '20px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                        border: '1px solid #eee'
                    }}
                >
                    <h1 style={{ fontFamily: 'var(--font-heading)', color: '#1a1a1a', marginBottom: '30px' }}>
                        Add New Dynamic Product
                    </h1>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Product Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    placeholder="e.g. Royal Sunburst Urli"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Price (₹)</label>
                                <input
                                    required
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    placeholder="450"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Category</label>
                                <select
                                    required
                                    value={formData.productType}
                                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                >
                                    <option value="">Select Category</option>
                                    {PRODUCT_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Scent Family</label>
                                <input
                                    type="text"
                                    value={formData.scentFamily}
                                    onChange={(e) => setFormData({ ...formData, scentFamily: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    placeholder="e.g. Sandalwood & Turmeric"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Image URL (Cloudinary)</label>
                            <input
                                required
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                placeholder="Paste your Cloudinary URL here"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Description</label>
                            <textarea
                                required
                                rows="4"
                                value={formData.desc}
                                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', resize: 'vertical' }}
                                placeholder="Tell us about this beautiful candle..."
                            />
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            style={{
                                padding: '16px',
                                background: '#d4af37',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                marginTop: '10px'
                            }}
                        >
                            {loading ? 'Adding Product...' : 'Publish Product to Live Site'}
                        </button>

                        {success && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ color: '#2ecc71', textAlign: 'center', fontWeight: 'bold' }}
                            >
                                ✨ Product added successfully! It will be live instantly.
                            </motion.p>
                        )}
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
