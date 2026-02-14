'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrder = () => {
            try {
                const allOrders = JSON.parse(localStorage.getItem('ambre_orders') || '[]');
                const foundOrder = allOrders.find(o => o.id === id);
                setOrder(foundOrder || null);
            } catch (e) {
                console.error("Error loading order", e);
            } finally {
                setLoading(false);
            }
        };
        loadOrder();
    }, [id]);

    if (loading) return <div className="section container">Loading...</div>;

    if (!order) {
        return (
            <div className="section container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2>Order Not Found</h2>
                <p>We couldn't find order #{id}.</p>
                <Link href="/orders" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Back to My Orders</Link>
            </div>
        );
    }

    // Determine progress bar state based on status
    const getProgress = (status) => {
        switch (status?.toLowerCase()) {
            case 'processing': return 1;
            case 'shipped': return 2;
            case 'delivered': return 3;
            default: return 1;
        }
    };

    const currentStep = getProgress(order.status);

    return (
        <div className="section container" style={{ padding: '150px 20px 60px', maxWidth: '1000px', margin: '0 auto' }}>
            <Link href="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '30px', color: '#1a1a1a', textDecoration: 'none', fontWeight: '600', transition: 'all 0.3s ease' }}>
                <ArrowLeft size={18} style={{ color: '#d4af37' }} /> Back to Orders
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '2px solid #d4af37' }}
            >
                {/* Header Strip - Refined with Gold Tint */}
                <div style={{ background: 'rgba(212, 175, 55, 0.12)', padding: '24px 30px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'serif', color: '#1a1a1a' }}>Order #{order.id}</h1>
                        <p style={{ margin: '5px 0 0', color: '#444', fontWeight: '500' }}>Placed on {order.date}</p>
                    </div>
                </div>

                {/* Progress Tracker - Refined to Gold Theme */}
                <div style={{ padding: '40px 30px', background: 'rgba(212, 175, 55, 0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                        {/* Progress Line Track - Refined Background */}
                        <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '4px', background: '#f0e6cc', zIndex: 1 }}>
                            <div style={{ height: '100%', width: `${(currentStep - 1) * 50}%`, background: '#d4af37', transition: 'width 0.5s ease' }}></div>
                        </div>

                        {/* Steps - Updated to Gold/Copper tones */}
                        <OrderStep step={1} currentStep={currentStep} icon={<Clock size={20} />} label="Processing" />
                        <OrderStep step={2} currentStep={currentStep} icon={<Truck size={20} />} label="Shipped" />
                        <OrderStep step={3} currentStep={currentStep} icon={<CheckCircle size={20} />} label="Delivered" />
                    </div>
                    {order.status === 'Cancelled' && (
                        <div style={{ textAlign: 'center', marginTop: '30px', color: '#c0392b', fontWeight: 'bold' }}>
                            Order Cancelled
                        </div>
                    )}
                </div>

                {/* Details Section - Refined Liners */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', borderTop: '1px solid rgba(212, 175, 55, 0.3)' }}>

                    {/* Items List */}
                    <div style={{ padding: '30px', borderRight: '1px solid rgba(212, 175, 55, 0.3)' }}>
                        <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', color: '#1a1a1a' }}>Items in your order</h3>
                        <div>
                            {order.items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                                    <div style={{ width: '70px', height: '70px', background: 'rgba(212, 175, 55, 0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                                        {/* Refined Gold Icon with better lighting */}
                                        <Package size={28} color="#d4af37" strokeWidth={1.5} style={{ opacity: 0.9 }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px', color: '#1a1a1a' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#444' }}>Qty: <span style={{ fontWeight: '600' }}>{item.quantity}</span> | Price: <span style={{ fontWeight: '600' }}>Rs. {item.price}</span></div>
                                        <div style={{ fontWeight: '700', marginTop: '4px', color: '#b45d06' }}>Rs. {item.price * item.quantity}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', paddingTop: '15px', marginTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span style={{ color: '#1a1a1a' }}>Total Amount</span>
                            <span style={{ color: '#b45d06', fontWeight: '800' }}>Rs. {order.total}</span>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div style={{ padding: '30px' }}>
                        <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', color: '#1a1a1a' }}>Shipping Details</h3>
                        <div style={{ marginBottom: '25px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '15px' }}>
                                <MapPin size={20} style={{ color: '#d4af37', marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '4px', color: '#1a1a1a' }}>{order.customer?.firstName} {order.customer?.lastName}</div>
                                    <div style={{ color: '#333', lineHeight: '1.6', fontWeight: '400' }}>
                                        {order.customer?.address}<br />
                                        {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
                                    </div>
                                    <div style={{ marginTop: '8px', color: '#1a1a1a', fontWeight: '500' }}>Phone: <span style={{ fontWeight: '600' }}>{order.customer?.phone}</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Strip - Refined Visibility */}
                        <div style={{ background: 'rgba(212, 175, 55, 0.12)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                            <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', color: '#b45d06', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Method</h4>
                            <p style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem', color: '#1a1a1a' }}>Cash on Delivery</p>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}

const OrderStep = ({ step, currentStep, icon, label }) => {
    const isActive = currentStep >= step;
    return (
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '80px' }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: isActive ? '#d4af37' : '#fff',
                border: `2px solid ${isActive ? '#d4af37' : '#ddd'}`,
                color: isActive ? '#fff' : '#ccc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
                transition: 'all 0.3s ease',
                boxShadow: isActive ? '0 0 15px rgba(212, 175, 55, 0.4)' : 'none'
            }}>
                {icon}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: isActive ? '700' : '500', color: isActive ? '#1a1a1a' : '#888', letterSpacing: '0.5px' }}>{label}</div>
        </div>
    );
};
