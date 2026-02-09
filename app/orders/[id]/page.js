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
            <Link href="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '30px', color: '#666', textDecoration: 'none' }}>
                <ArrowLeft size={18} /> Back to Orders
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}
            >
                {/* Header */}
                <div style={{ background: '#fafafa', padding: '24px 30px', borderBottom: '1px solid #eee', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'serif' }}>Order #{order.id}</h1>
                        <p style={{ margin: '5px 0 0', color: '#666' }}>Placed on {order.date}</p>
                    </div>
                </div>

                {/* Progress Tracker */}
                <div style={{ padding: '40px 30px', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                        {/* Progress Line */}
                        <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '4px', background: '#eee', zIndex: 1 }}>
                            <div style={{ height: '100%', width: `${(currentStep - 1) * 50}%`, background: '#2b7a4b', transition: 'width 0.5s ease' }}></div>
                        </div>

                        {/* Steps */}
                        <OrderStep step={1} currentStep={currentStep} icon={<Clock size={20} />} label="Processing" />
                        <OrderStep step={2} currentStep={currentStep} icon={<Truck size={20} />} label="Shipped" />
                        <OrderStep step={3} currentStep={currentStep} icon={<CheckCircle size={20} />} label="Delivered" />
                    </div>
                    {order.status === 'Cancelled' && (
                        <div style={{ textAlign: 'center', marginTop: '30px', color: 'red', fontWeight: 'bold' }}>
                            Order Cancelled
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', borderTop: '1px solid #eee' }}>

                    {/* Items List */}
                    <div style={{ padding: '30px', borderRight: '1px solid #eee' }}>
                        <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem' }}>Items in your order</h3>
                        <div>
                            {order.items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                    <div style={{ width: '70px', height: '70px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Package size={24} color="#ccc" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Qty: {item.quantity} | Price: Rs. {item.price}</div>
                                        <div style={{ fontWeight: '600', marginTop: '4px' }}>Rs. {item.price * item.quantity}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total</span>
                            <span>Rs. {order.total}</span>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div style={{ padding: '30px' }}>
                        <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem' }}>Shipping Details</h3>
                        <div style={{ marginBottom: '25px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '15px' }}>
                                <MapPin size={20} style={{ color: '#C19A6B', marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{order.customer?.firstName} {order.customer?.lastName}</div>
                                    <div style={{ color: '#555', lineHeight: '1.5' }}>
                                        {order.customer?.address}<br />
                                        {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
                                    </div>
                                    <div style={{ marginTop: '8px', color: '#666' }}>Phone: {order.customer?.phone}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px', fontSize: '0.9rem', color: '#555' }}>Payment Method</h4>
                            <p style={{ margin: 0, fontWeight: '500' }}>Cash on Delivery</p>
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
                background: isActive ? '#2b7a4b' : '#fff',
                border: `2px solid ${isActive ? '#2b7a4b' : '#ddd'}`,
                color: isActive ? '#fff' : '#ccc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
                transition: 'all 0.3s ease'
            }}>
                {icon}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: isActive ? '600' : '400', color: isActive ? '#000' : '#888' }}>{label}</div>
        </div>
    );
};
