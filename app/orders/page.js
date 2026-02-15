'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/src/context/AuthContext';
import { db } from '@/src/config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            try {
                let allOrders = [];

                // 1. Try fetching from Firestore if user email exists
                if (user && user.email) {
                    const q = query(
                        collection(db, "orders"),
                        where("customer.email", "==", user.email),
                        orderBy("date", "desc")
                    );
                    const querySnapshot = await getDocs(q);
                    allOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                }

                // 2. If no cloud orders or no user, fallback to localStorage
                if (allOrders.length === 0) {
                    const localRaw = localStorage.getItem('ambre_orders');
                    if (localRaw) {
                        allOrders = JSON.parse(localRaw);
                        if (!Array.isArray(allOrders)) allOrders = [allOrders];
                    }
                }

                setOrders(allOrders);
            } catch (e) {
                console.error("Error loading orders from Firestore:", e);
                // Last ditch effort: localStorage only
                const localRaw = localStorage.getItem('ambre_orders');
                if (localRaw) {
                    const loaded = JSON.parse(localRaw);
                    setOrders(Array.isArray(loaded) ? loaded : [loaded]);
                }
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [user]);

    if (loading) return <div className="section container">Loading...</div>;

    if (orders.length === 0) {
        return (
            <div className="section container" style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
                <Package size={64} style={{ color: '#ccc', marginBottom: '20px' }} />
                <h2>No Orders Found</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>Looks like you haven't placed any orders yet.</p>
                <Link href="/shop" className="btn-primary btn-gold-hover">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="section container" style={{ minHeight: '80vh', padding: '150px 20px 60px' }}>
            <h1 style={{ fontFamily: 'serif', fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>My Orders</h1>

            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orders.map((order, index) => (
                    <Link href={`/orders/${order.id}`} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{ border: '2px solid #d4af37', borderRadius: '20px', overflow: 'hidden', background: '#fff', boxShadow: '0 15px 40px rgba(0,0,0,0.05)', cursor: 'pointer' }}
                            whileHover={{ scale: 1.01, boxShadow: '0 20px 50px rgba(212, 175, 55, 0.2)' }}
                        >
                            {/* Header */}
                            <div style={{ background: 'rgba(212, 175, 55, 0.12)', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', marginRight: '10px', color: '#1a1a1a' }}>Order #{order.id}</span>
                                    <span style={{ fontSize: '0.85rem', color: '#555' }}>Place on {order.date}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', fontWeight: '500', color: getStatusColor(order.status) }}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                            </div>

                            {/* Body */}
                            <div style={{ padding: '25px' }}>
                                {order.items.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '25px', marginBottom: '20px', alignItems: 'center' }}>
                                        <div style={{ width: '70px', height: '70px', background: 'rgba(212, 175, 55, 0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                                            {/* Gold themed placeholder - Refined: slightly more visible 'light' */}
                                            <Package size={30} color="#d4af37" strokeWidth={1.5} style={{ opacity: 0.8 }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 5px', fontSize: '1.1rem', color: '#1a1a1a', fontWeight: '500' }}>{item.name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>Qty: {item.quantity} × <span className="currency-symbol">₹</span>{item.price}</p>
                                        </div>
                                        <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#1a1a1a' }}>
                                            <span className="currency-symbol">₹</span>{item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div style={{ padding: '15px 25px', borderTop: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(212, 175, 55, 0.08)' }}>
                                <div style={{ fontSize: '1.1rem', color: '#1a1a1a' }}>
                                    <strong>Total: <span style={{ color: '#b45d06', fontWeight: '800' }}><span className="currency-symbol">₹</span>{order.total}</span></strong>
                                </div>
                                <span style={{ color: '#b45d06', fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'underline' }}>
                                    View Details &gt;
                                </span>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function getStatusColor(status) {
    switch (status?.toLowerCase()) {
        case 'delivered': return '#27ae60';
        case 'processing': return '#b45d06'; // Richer, more visible gold-brown
        case 'cancelled': return '#c0392b';
        default: return '#1a1a1a';
    }
}

function getStatusIcon(status) {
    switch (status?.toLowerCase()) {
        case 'delivered': return <CheckCircle size={16} />;
        case 'processing': return <Clock size={16} />;
        case 'shipped': return <Truck size={16} />;
        default: return <Package size={16} />;
    }
}
