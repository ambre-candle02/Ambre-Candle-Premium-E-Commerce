'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/src/context/AuthContext';
import { db } from '@/src/config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import '@/src/styles/Orders.css';

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            try {
                let allOrders = [];

                if (user) {
                    const q = query(
                        collection(db, "orders"),
                        where("userId", "==", user.uid)
                    );
                    const querySnapshot = await getDocs(q);
                    allOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                }

                const localRaw = localStorage.getItem('ambre_orders');
                if (localRaw) {
                    let localOrders = JSON.parse(localRaw);
                    if (!Array.isArray(localOrders)) localOrders = [localOrders];

                    const filteredLocal = localOrders.filter(o => {
                        if (user) return o.userId === user.uid;
                        return o.userId === 'guest' || !o.userId;
                    });

                    const existingIds = new Set(allOrders.map(o => o.id));
                    filteredLocal.forEach(lo => {
                        if (!existingIds.has(lo.id)) {
                            allOrders.push(lo);
                        }
                    });
                }

                allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(allOrders);
            } catch (e) {
                console.error("Error loading orders:", e);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();

        const handleOrderSync = (e) => {
            if (e.key === 'ambre_orders') {
                loadOrders();
            }
        };
        window.addEventListener('storage', handleOrderSync);
        return () => window.removeEventListener('storage', handleOrderSync);
    }, [user]);

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner"></div>
        </div>
    );

    if (orders.length === 0) {
        return (
            <div className="orders-page-wrapper">
                <div className="orders-empty-state">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="empty-state-icon"
                    >
                        <Package size={60} strokeWidth={1} />
                    </motion.div>
                    <h2 className="empty-state-title">Your Order History is Empty</h2>
                    <p className="empty-state-text">Explore our boutique collection and start your sensory journey with Ambre Candle.</p>
                    <Link href="/shop" className="explore-btn">
                        Explore Candles <Package size={18} style={{ marginLeft: 8 }} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page-wrapper" style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute',
                top: '90px',
                left: '20px',
                zIndex: 20
            }}>
                <button
                    className="desktop-only-back-btn"
                    onClick={() => {
                        if (window.history.length > 2) {
                            router.back();
                        } else {
                            router.push('/shop');
                        }
                    }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#d4af37',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        cursor: 'pointer',
                        background: 'rgba(212, 175, 55, 0.08)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        padding: '8px 16px',
                        borderRadius: '50px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Back to Shop</span>
                </button>
            </div>

            <div className="section container" style={{ minHeight: '80vh', padding: '110px 20px 80px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto 50px', textAlign: 'center' }}>
                    <h1 style={{ 
                        fontFamily: 'var(--font-heading)', 
                        fontSize: '3rem', 
                        marginBottom: '10px',
                        color: '#1a1a1a'
                    }}>My Orders</h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', fontStyle: 'italic' }}>Track and manage your private selection of scents.</p>
                </div>

                <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '35px' }}>
                    {orders.map((order, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="order-card"
                        >
                            <Link href={`/orders/${order.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {/* Header */}
                                <div className="order-card-header" style={{
                                    background: 'rgba(253, 251, 247, 0.8)',
                                    padding: '20px 30px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottom: '1px solid rgba(212, 175, 55, 0.15)'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '1rem', color: '#1a1a1a', marginBottom: '4px' }}>
                                            ORDER #{order.orderId || (order.id && order.id.substring(0, 8).toUpperCase()) || 'PENDING'}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>
                                            {order.date} • {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
                                        </div>
                                    </div>
                                    <div className={`status-badge status-${order.status?.toLowerCase() || 'processing'}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status || 'Processing'}
                                    </div>
                                </div>

                                {/* Body */}
                                <div style={{ padding: '30px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                        {order.items && order.items.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                                                {item.image || item.image_url ? (
                                                    <img 
                                                        src={item.image || item.image_url} 
                                                        alt={item.name} 
                                                        className="order-item-image"
                                                    />
                                                ) : (
                                                    <div className="item-placeholder">
                                                        <Package size={24} strokeWidth={1} />
                                                    </div>
                                                )}
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ margin: '0 0 5px', fontSize: '1.1rem', color: '#1a1a1a', fontWeight: '600' }}>{item.name}</h4>
                                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                                                        Quantity: <span style={{ color: '#1a1a1a', fontWeight: '700' }}>{item.quantity}</span>
                                                    </p>
                                                </div>
                                                <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1a1a1a' }}>
                                                    <span className="currency-symbol">₹</span>{item.price * item.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Timeline */}
                                    <div className="order-timeline">
                                        <div className={`timeline-step ${(order.status?.toLowerCase() === 'processing' || order.status?.toLowerCase() === 'shipped' || order.status?.toLowerCase() === 'delivered') ? 'active' : ''}`}>
                                            <div className="step-dot"><Clock size={14} /></div>
                                            <span className="step-label">Ordered</span>
                                        </div>
                                        <div className={`timeline-step ${order.status?.toLowerCase() === 'processing' ? 'active' : (order.status?.toLowerCase() === 'shipped' || order.status?.toLowerCase() === 'delivered' ? 'completed' : '')}`}>
                                            <div className="step-dot"><Truck size={14} /></div>
                                            <span className="step-label">Processing</span>
                                        </div>
                                        <div className={`timeline-step ${order.status?.toLowerCase() === 'shipped' ? 'active' : (order.status?.toLowerCase() === 'delivered' ? 'completed' : '')}`}>
                                            <div className="step-dot"><Package size={14} /></div>
                                            <span className="step-label">Shipped</span>
                                        </div>
                                        <div className={`timeline-step ${order.status?.toLowerCase() === 'delivered' ? 'completed' : ''}`}>
                                            <div className="step-dot"><CheckCircle size={14} /></div>
                                            <span className="step-label">Delivered</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div style={{ 
                                    padding: '20px 30px', 
                                    borderTop: '1px solid rgba(212, 175, 55, 0.1)', 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    background: 'rgba(253, 251, 247, 0.5)' 
                                }}>
                                    <div style={{ fontSize: '1.1rem', color: '#1a1a1a' }}>
                                        <span style={{ color: '#666', fontSize: '0.9rem', marginRight: '8px' }}>Amount Paid:</span>
                                        <strong style={{ color: '#b45d06', fontSize: '1.4rem', display: 'inline-flex', alignItems: 'baseline' }}>
                                          <span className="currency-symbol">₹</span>{order.total}
                                        </strong>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const message = `Halo Ambre Candle! I just placed an order.\n\n*Order ID:* #${order.orderId || order.id}\n*Total:* ₹${order.total}\n*Items:* ${order.items?.map(item => `${item.name} (x${item.quantity})`).join(', ')}\n\nPlease help me process this order.`;
                                                const whatsappUrl = `https://api.whatsapp.com/send?phone=918577079877&text=${encodeURIComponent(message)}`;
                                                window.open(whatsappUrl, '_blank');
                                            }}
                                            style={{ 
                                                background: '#25D366', 
                                                color: '#fff', 
                                                border: 'none', 
                                                padding: '10px 20px', 
                                                borderRadius: '50px', 
                                                fontWeight: 'bold', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '8px', 
                                                cursor: 'pointer', 
                                                transition: 'all 0.3s ease', 
                                                fontSize: '0.82rem',
                                                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)'
                                            }}
                                        >
                                            <Package size={16} />
                                            WhatsApp
                                        </button>
                                        <button className="view-details-cta">
                                            View Order Details
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function getStatusIcon(status) {
    switch (status?.toLowerCase()) {
        case 'delivered': return <CheckCircle size={14} />;
        case 'processing': return <Clock size={14} />;
        case 'shipped': return <Truck size={14} />;
        default: return <Package size={14} />;
    }
}
