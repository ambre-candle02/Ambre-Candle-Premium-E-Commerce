'use client';
import { useState } from 'react';
import { db } from '@/src/config/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { PRODUCTS } from '@/src/config/products';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle, AlertTriangle, ArrowLeft, Database, HardDrive, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MigratePage() {
    const [status, setStatus] = useState('ready'); // ready, loading, success, error
    const [message, setMessage] = useState('');
    const router = useRouter();

    const runMigration = async () => {
        setStatus('loading');
        try {
            const productsCollection = collection(db, 'products');
            const batch = writeBatch(db);

            PRODUCTS.forEach((product) => {
                const docRef = doc(productsCollection, product.id.toString());
                batch.set(docRef, {
                    ...product,
                    updatedAt: new Date().toISOString()
                });
            });

            await batch.commit();
            setStatus('success');
            setMessage(`Seamlessly migrated all ${PRODUCTS.length} products to Cloud Firestore.`);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage(`Migration failed: ${error.message}`);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: '100%',
                    maxWwidth: '600px',
                    background: '#fff',
                    borderRadius: '32px',
                    padding: '40px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
                    border: '2px solid #d4af37',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background Decor */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    background: 'rgba(212, 175, 55, 0.05)',
                    borderRadius: '50%',
                    zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
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

                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            background: 'rgba(212, 175, 55, 0.1)',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: '#d4af37'
                        }}>
                            <Database size={32} />
                        </div>
                        <h1 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '2.2rem',
                            color: '#1a1a1a',
                            margin: '0 0 10px 0'
                        }}>Cloud Migration</h1>
                        <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
                            Sync your local product catalog with the live Cloud Firestore database.
                        </p>
                    </div>

                    <div style={{
                        background: '#f9f9f9',
                        borderRadius: '20px',
                        padding: '25px',
                        marginBottom: '30px',
                        border: '2px solid #d4af37'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#888', fontSize: '0.9rem' }}>Source File</span>
                                <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <HardDrive size={16} color="#d4af37" /> products.js
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#888', fontSize: '0.9rem' }}>Total Items</span>
                                <span style={{ fontWeight: '700', color: '#1a1a1a' }}>{PRODUCTS.length} Products</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#888', fontSize: '0.9rem' }}>Destination</span>
                                <span style={{ fontWeight: '600', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ShieldCheck size={16} /> Firestore (Live)
                                </span>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {status === 'ready' && (
                            <motion.button
                                key="btn-ready"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={runMigration}
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    background: '#1a1a1a',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '16px',
                                    fontWeight: '700',
                                    fontSize: '1.1rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                }}
                                whileHover={{ scale: 1.02, background: '#d4af37' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <RefreshCw size={20} /> Initialize Migration
                            </motion.button>
                        )}

                        {status === 'loading' && (
                            <motion.div
                                key="status-loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    textAlign: 'center',
                                    padding: '20px'
                                }}
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    style={{ color: '#d4af37', marginBottom: '15px' }}
                                >
                                    <RefreshCw size={40} />
                                </motion.div>
                                <p style={{ fontWeight: '600', color: '#1a1a1a' }}>Transferring Data...</p>
                            </motion.div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                key="status-success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    textAlign: 'center',
                                    background: 'rgba(16, 185, 129, 0.05)',
                                    padding: '30px',
                                    borderRadius: '24px',
                                    border: '1px solid #10b981'
                                }}
                            >
                                <CheckCircle size={48} color="#10b981" style={{ marginBottom: '15px' }} />
                                <h3 style={{ color: '#065f46', marginBottom: '10px' }}>Migration Successful!</h3>
                                <p style={{ color: '#065f46', fontSize: '0.9rem', marginBottom: '20px' }}>{message}</p>
                                <button
                                    onClick={() => router.push('/admin')}
                                    style={{
                                        padding: '10px 25px',
                                        background: '#10b981',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Return to Dashboard
                                </button>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                key="status-error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    textAlign: 'center',
                                    background: 'rgba(239, 68, 68, 0.05)',
                                    padding: '25px',
                                    borderRadius: '24px',
                                    border: '1px solid #ef4444'
                                }}
                            >
                                <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '15px' }} />
                                <h3 style={{ color: '#991b1b', marginBottom: '10px' }}>Migration Error</h3>
                                <p style={{ color: '#991b1b', fontSize: '0.9rem', marginBottom: '20px' }}>{message}</p>
                                <button
                                    onClick={() => setStatus('ready')}
                                    style={{
                                        padding: '10px 25px',
                                        background: '#ef4444',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
