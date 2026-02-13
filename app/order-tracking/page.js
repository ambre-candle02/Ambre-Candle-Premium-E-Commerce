'use client';
import { motion } from 'framer-motion';
import SafeImage from '@/src/components/SafeImage';
import Link from 'next/link';
import { CheckCircle, Truck, Package, MapPin, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function OrderTracking() {
    const [order, setOrder] = useState(null);

    useEffect(() => {
        // Retrieve last order details for demo
        const savedOrder = localStorage.getItem('ambre_last_order');
        if (savedOrder) {
            setOrder(JSON.parse(savedOrder));
        } else {
            // Fallback mock check if direct access
            setOrder({
                id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
                customer: { firstName: 'Guest' },
                items: [],
                status: 'Processing'
            });
        }
    }, []);

    if (!order) return <div className="section container" style={{ padding: '100px', textAlign: 'center' }}>Loading Tracking Details...</div>;

    return (
        <div className="section container" style={{ marginTop: '50px', maxWidth: '900px', textAlign: 'center', paddingBottom: '100px' }}>
            {/* Success Header */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '50px' }}
            >
                <div style={{ display: 'inline-flex', background: '#e8f5e9', padding: '20px', borderRadius: '50%', color: '#2b7a4b', marginBottom: '20px' }}>
                    <CheckCircle size={64} />
                </div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Order Placed Successfully!</h1>
                <p style={{ color: '#666', fontSize: '1.2rem' }}>Thank you {order.customer.firstName}, we have received your order.</p>
                <p style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '1.1rem' }}>Order ID: {order.id}</p>

                {/* Visual Items Summary */}
                {order.items && order.items.length > 0 && (
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {order.items.map((item, i) => (
                            <div key={i} style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee', position: 'relative' }}>
                                <SafeImage src={item.image} alt="item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span style={{ position: 'absolute', bottom: 0, right: 0, background: '#000', color: '#fff', fontSize: '10px', padding: '2px 5px', borderTopLeftRadius: '5px' }}>x{item.quantity}</span>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Tracking System */}
            <div className="tracking-card" style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'left', border: '1px solid #eee' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>Tracking Status</span>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>Estimated Delivery: 3-5 Days</span>
                </h3>

                <div className="timeline" style={{ position: 'relative', paddingLeft: '10px' }}>
                    {/* Step 1 */}
                    <TimelineItem
                        icon={<CheckCircle size={20} />}
                        title="Order Confirmed"
                        date="Just Now"
                        active={true}
                        completed={true}
                    />

                    {/* Connector */}
                    <div style={{ width: '2px', height: '40px', background: '#4CAF50', marginLeft: '17px', marginBlock: '5px' }}></div>

                    {/* Step 2 */}
                    <TimelineItem
                        icon={<Package size={20} />}
                        title="Processing"
                        date="In Progress"
                        active={true}
                        pulsing={true}
                    />

                    <div style={{ width: '2px', height: '40px', background: '#eee', marginLeft: '17px', marginBlock: '5px' }}></div>

                    <TimelineItem
                        icon={<Truck size={20} />}
                        title="Shipped"
                        date="Pending"
                        active={false}
                    />

                    <div style={{ width: '2px', height: '40px', background: '#eee', marginLeft: '17px', marginBlock: '5px' }}></div>

                    <TimelineItem
                        icon={<MapPin size={20} />}
                        title="Out for Delivery"
                        date="Pending"
                        active={false}
                    />
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <Link href="/shop" style={{ textDecoration: 'none' }}>
                    <button className="btn-primary">
                        Continue Shopping <ArrowRight size={18} style={{ display: 'inline', marginLeft: '5px', verticalAlign: 'middle' }} />
                    </button>
                </Link>
            </div>
        </div>
    );
}

const TimelineItem = ({ icon, title, date, active, completed, pulsing }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', opacity: active ? 1 : 0.4 }}>
        <div style={{
            background: completed ? '#4CAF50' : (active ? 'var(--color-accent)' : '#eee'),
            color: completed || active ? '#fff' : '#888',
            padding: '12px',
            borderRadius: '50%',
            boxShadow: pulsing ? '0 0 0 4px rgba(193, 154, 107, 0.2)' : 'none',
            transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            {icon}
        </div>
        <div>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: active ? 'bold' : 'normal' }}>{title}</h4>
            <span style={{ fontSize: '0.85rem', color: '#888' }}>{date}</span>
        </div>
    </div>
);
