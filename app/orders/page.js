'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/src/context/AuthContext';

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load orders from local storage
        const loadOrders = () => {
            try {
                const allOrders = JSON.parse(localStorage.getItem('ambre_orders') || '[]');

                // If user is logged in, filter by their email/phone
                // For demo purposes (since auth might be simple), we show all if no user filter rule is strict
                // But ideally: 
                if (user) {
                    const userOrders = allOrders.filter(o =>
                        o.customer?.email === user.email ||
                        o.customer?.phone === user.phone
                    );
                    setOrders(userOrders);
                } else {
                    // If guest, maybe show only if they just placed it? 
                    // For now, let's show all for demo simplicity or ask to login
                    // But to be "Flipkart-like", let's just show the local device's history
                    setOrders(allOrders);
                }
            } catch (e) {
                console.error("Error loading orders", e);
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
                            style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer' }}
                            whileHover={{ scale: 1.01, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                        >
                            {/* Header */}
                            <div style={{ background: '#f9f9f9', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Order #{order.id}</span>
                                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Place on {order.date}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', fontWeight: '500', color: getStatusColor(order.status) }}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                            </div>

                            {/* Body */}
                            <div style={{ padding: '20px' }}>
                                {order.items.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '15px', alignItems: 'center' }}>
                                        <div style={{ width: '60px', height: '60px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {/* Placeholder for image if not available in item object */}
                                            <Package size={24} color="#ccc" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 5px', fontSize: '1rem' }}>{item.name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Qty: {item.quantity} × Rs. {item.price}</p>
                                        </div>
                                        <div style={{ fontWeight: '600' }}>
                                            Rs. {item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div style={{ padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.9rem' }}>
                                    <strong>Total: Rs. {order.total}</strong>
                                </div>
                                <span style={{ color: '#C19A6B', fontWeight: '500', fontSize: '0.9rem' }}>
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
        case 'delivered': return 'green';
        case 'processing': return 'orange';
        case 'cancelled': return 'red';
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
