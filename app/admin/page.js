'use client';
import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, DollarSign, Users, TrendingUp, Calendar, RefreshCw, Trash2, Eye, Search, Filter, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/src/styles/Admin.css';

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadOrders();
    }, []);

    const loadOrders = () => {
        try {
            const historyRaw = localStorage.getItem('ambre_orders');
            let loadedOrders = [];

            if (historyRaw) {
                loadedOrders = JSON.parse(historyRaw);
                if (!Array.isArray(loadedOrders)) {
                    loadedOrders = [loadedOrders];
                }
            } else {
                const lastOrderRaw = localStorage.getItem('ambre_last_order');
                if (lastOrderRaw) {
                    loadedOrders = [JSON.parse(lastOrderRaw)];
                }
            }
            loadedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
            setOrders(loadedOrders);
        } catch (error) {
            console.error("Failed to load orders:", error);
            setOrders([]);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const clearAllOrders = () => {
        if (confirm("Are you sure you want to delete all order history?")) {
            localStorage.removeItem('ambre_orders');
            localStorage.removeItem('ambre_last_order');
            setOrders([]);
        }
    }

    const filteredOrders = orders.filter(order => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        return (
            order.id?.toString().toLowerCase().includes(lowerTerm) ||
            order.customer?.firstName?.toLowerCase().includes(lowerTerm) ||
            order.customer?.lastName?.toLowerCase().includes(lowerTerm) ||
            order.customer?.email?.toLowerCase().includes(lowerTerm)
        );
    });

    if (!mounted) return null;

    return (
        <div className="admin-main-container">
            <div className="admin-dashboard-grid">

                {/* KPI Cards */}
                <div className="admin-kpi-grid">
                    <StatCard
                        title="Total Orders"
                        value={orders.length}
                        icon={<Package size={28} color="#d4af37" />}
                        trend="up"
                    />
                    <StatCard
                        title="Revenue"
                        value={formatCurrency(orders.reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0))}
                        icon={<DollarSign size={28} color="#d4af37" />}
                        trend="up"
                    />
                    <StatCard
                        title="Customers"
                        value={new Set(orders.map(o => o.customer?.email)).size}
                        icon={<Users size={28} color="#d4af37" />}
                        trend="stable"
                    />
                </div>

                <div className="admin-header-v2">
                    <div className="admin-header-title">
                        <span>Management</span>
                        <h1>Order History</h1>
                    </div>
                    <div className="admin-header-actions">
                        <motion.button
                            onClick={loadOrders}
                            className="admin-refresh-btn"
                            style={actionButtonStyle}
                            whileHover={{
                                background: '#d4af37',
                                color: '#fff',
                                borderColor: '#d4af37',
                                boxShadow: '0 5px 15px rgba(212, 175, 55, 0.3)'
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <RefreshCw size={18} /> Refresh
                        </motion.button>
                        <motion.button
                            onClick={clearAllOrders}
                            className="admin-clear-btn"
                            style={{ ...actionButtonStyle, background: '#fee2e2', color: '#dc2626', borderColor: '#fecaca' }}
                            whileHover={{
                                background: '#dc2626',
                                color: '#fff',
                                borderColor: '#dc2626',
                                boxShadow: '0 5px 15px rgba(220, 38, 38, 0.3)'
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Trash2 size={18} /> Clear Data
                        </motion.button>
                    </div>
                </div>

                {/* Orders Table Section */}
                <div className="admin-table-section">
                    <div className="admin-table-header" style={{ padding: '30px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0 }}>Recent Orders</h3>
                        <div className="admin-search-wrapper" style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#d4af37' }} />
                                <input
                                    className="admin-search-input"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search orders..."
                                    style={{
                                        padding: '10px 10px 10px 40px',
                                        borderRadius: '50px',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        width: '250px',
                                        color: '#333',
                                        border: '1px solid #d4af37'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                            <thead style={{ background: '#fcfcfc', borderBottom: '1px solid #eee' }}>
                                <tr style={{ textAlign: 'left', color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <th style={{ padding: '20px 30px' }}>Order ID</th>
                                    <th style={{ padding: '20px 30px' }}>Customer</th>
                                    <th style={{ padding: '20px 30px' }}>Date</th>
                                    <th style={{ padding: '20px 30px' }}>Total</th>
                                    <th style={{ padding: '20px 30px' }}>Status</th>
                                    <th style={{ padding: '20px 30px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
                                            {orders.length === 0 ? "No orders found." : `No orders found matching "${searchTerm}".`}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order, i) => (
                                        <motion.tr
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            style={{ borderBottom: '1px solid #f9f9f9' }}
                                            whileHover={{ backgroundColor: '#fafafa' }}
                                        >
                                            <td style={{ padding: '20px 30px', fontWeight: '600' }}>#{order.id}</td>
                                            <td style={{ padding: '20px 30px' }}>
                                                <div style={{ fontWeight: '600', color: '#111' }}>{order.customer?.firstName} {order.customer?.lastName}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#888' }}>{order.customer?.email}</div>
                                            </td>
                                            <td style={{ padding: '20px 30px', color: '#555' }}>
                                                {new Date(order.date).toLocaleDateString()}
                                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{new Date(order.date).toLocaleTimeString()}</div>
                                            </td>
                                            <td style={{ padding: '20px 30px', fontWeight: 'bold' }}>{formatCurrency(order.total)}</td>
                                            <td style={{ padding: '20px 30px' }}>
                                                <span style={{
                                                    padding: '6px 14px',
                                                    borderRadius: '50px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    background: getStatusColor(order.status).bg,
                                                    color: getStatusColor(order.status).text
                                                }}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px 30px' }}>
                                                <motion.button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="admin-table-btn"
                                                    style={{ ...actionButtonStyle, padding: '8px 15px', fontSize: '0.8rem', transition: 'all 0.3s ease' }}
                                                    whileHover={{
                                                        background: '#d4af37',
                                                        color: '#fff',
                                                        borderColor: '#d4af37',
                                                        boxShadow: '0 5px 15px rgba(212, 175, 55, 0.3)'
                                                    }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    View Details
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <AnimatePresence>
                    {selectedOrder && (
                        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} formatCurrency={formatCurrency} orders={orders} setOrders={setOrders} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

const StatCard = ({ title, value, icon, trend }) => (
    <motion.div
        className="luxury-card stat-card"
        whileHover={{ scale: 1.02, y: -5 }}
        style={{
            background: 'linear-gradient(145deg, #1e1e1e, #121212)',
            padding: '30px',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            color: '#fff',
            border: '1px solid rgba(212, 175, 55, 0.1)',
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        {/* Subtle Background Glow */}
        <div style={{
            position: 'absolute', top: '-50%', right: '-50%', width: '150%', height: '150%',
            background: 'radial-gradient(circle at center, rgba(212,175,55,0.05) 0%, transparent 70%)',
            zIndex: 0, pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
            <div style={{
                width: '64px', height: '64px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(212,175,55,0.15)',
                color: '#d4af37',
                border: '1px solid rgba(212,175,55,0.2)'
            }}>
                {icon}
            </div>
            <div>
                <h3 style={{ margin: 0, fontSize: '0.8rem', color: '#d4af37', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>{title}</h3>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', letterSpacing: '-1px' }}>{value}</div>
            </div>
        </div>

        {/* Mock Sparkline/Trend */}
        <div style={{ width: '100%', height: '40px', marginTop: '10px', position: 'relative', zIndex: 1 }}>
            <TrendChart color={trend === 'up' ? '#10b981' : '#d4af37'} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: trend === 'up' ? '#10b981' : '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {trend === 'up' ? <TrendingUp size={14} /> : null}
                    {trend === 'up' ? '+12.5% vs last month' : 'Stable'}
                </span>
            </div>
        </div>
    </motion.div>
);

const TrendChart = ({ color }) => (
    <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path
            d="M0,35 Q10,32 20,38 T40,25 T60,30 T80,15 T100,20"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M0,35 Q10,32 20,38 T40,25 T60,30 T80,15 T100,20 V40 H0 Z"
            fill={`url(#gradient-${color})`}
            opacity="0.1"
        />
        <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor="transparent" />
            </linearGradient>
        </defs>
    </svg>
);

const StatusDropdown = ({ currentStatus, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <div style={{ position: 'relative', width: '160px' }}>
            <motion.div
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ borderColor: '#d4af37', boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)' }}
                style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    transition: 'border-color 0.3s'
                }}
            >
                {currentStatus}
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown size={16} />
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            style={{ position: 'fixed', inset: 0, zIndex: 1100 }}
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: 0,
                                right: 0,
                                background: '#fff',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                overflow: 'hidden',
                                marginBottom: '10px',
                                zIndex: 1101,
                                border: '1px solid #f0f0f0'
                            }}
                        >
                            {statuses.map(status => (
                                <motion.div
                                    key={status}
                                    onClick={() => {
                                        onStatusChange(status);
                                        setIsOpen(false);
                                    }}
                                    whileHover={{ background: '#d4af37', color: '#fff' }}
                                    style={{
                                        padding: '10px 15px',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: '500',
                                        color: currentStatus === status ? '#d4af37' : '#333',
                                        background: currentStatus === status ? '#f9f9f9' : '#fff',
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    {status}
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const OrderModal = ({ order, onClose, formatCurrency, orders, setOrders }) => {
    const [trackingID, setTrackingID] = useState(order.trackingID || '');
    const [isSaving, setIsSaving] = useState(false);
    const [notified, setNotified] = useState(false);

    const handleSaveTracking = () => {
        setIsSaving(true);
        // Simulate API call to email service
        setTimeout(() => {
            const updatedOrders = orders.map(o => o.id === order.id ? { ...o, trackingID: trackingID } : o);
            setOrders(updatedOrders);
            localStorage.setItem('ambre_orders', JSON.stringify(updatedOrders));
            setIsSaving(false);
            setNotified(true);
            setTimeout(() => setNotified(false), 3000);
        }, 800);
    };

    return (
        <div className="admin-modal-overlay">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="admin-modal-backdrop"
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="admin-modal-container"
            >
                <div className="admin-modal-header">
                    <div>
                        <h2>Order #{order.id}</h2>
                        <p>Placed on {new Date(order.date).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="admin-modal-close-btn">&times;</button>
                </div>

                <div className="admin-modal-body">
                    <div className="admin-modal-grid-v2">
                        <div className="admin-modal-info-box">
                            <h4 className="admin-modal-label">Customer</h4>
                            <p style={{ fontWeight: 'bold', margin: '0 0 5px' }}>{order.customer?.firstName} {order.customer?.lastName}</p>
                            <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>{order.customer?.email}</p>
                            <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>{order.customer?.phone}</p>
                        </div>
                        <div className="admin-modal-info-box">
                            <h4 className="admin-modal-label">Address</h4>
                            <p style={{ margin: '0 0 5px', color: '#333', fontSize: '0.9rem' }}>{order.customer?.address}</p>
                            <p style={{ margin: 0, color: '#333', fontSize: '0.9rem' }}>{order.customer?.city}, {order.customer?.state}</p>
                        </div>
                    </div>

                    {/* Logistics Section */}
                    <div className="admin-modal-logistics-box">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h4 className="admin-modal-label" style={{ margin: 0 }}>Logistics & Tracking</h4>
                            <AnimatePresence>
                                {notified && (
                                    <motion.span
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        style={{ fontSize: '0.75rem', color: '#166534', background: '#dcfce7', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}
                                    >
                                        ✓ Customer Notified
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="admin-tracking-input-wrapper">
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', marginBottom: '5px', fontWeight: 'bold' }}>AWB / Tracking Number</label>
                                <input
                                    type="text"
                                    placeholder="Enter Tracking ID (e.g. DEL-7788)"
                                    value={trackingID}
                                    onChange={(e) => setTrackingID(e.target.value)}
                                    className="admin-tracking-input"
                                />
                            </div>
                            <button
                                onClick={handleSaveTracking}
                                disabled={isSaving}
                                className="admin-tracking-save-btn"
                            >
                                {isSaving ? 'Saving...' : 'Save & Notify'}
                            </button>
                        </div>
                        {order.trackingID && (
                            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
                                <span>Track on: </span>
                                <a href={`https://www.delhivery.com/track/package/${order.trackingID}`} target="_blank" rel="noreferrer" style={{ color: '#d4af37', fontWeight: 'bold', textDecoration: 'none' }}>Delhivery Global Tracking ↗</a>
                            </div>
                        )}
                    </div>

                    <h4 className="admin-modal-label">Items Ordered</h4>
                    <div className="admin-modal-items-container">
                        {order.items?.map((item, idx) => (
                            <div key={idx} className="admin-modal-item-row">
                                <div className="admin-modal-item-info">
                                    <div className="admin-modal-item-img">
                                        <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Qty: {item.quantity}</div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: '600' }}>{formatCurrency(item.price * item.quantity)}</div>
                            </div>
                        ))}
                    </div>

                    <div className="admin-modal-total-bar">
                        <span>Total Amount</span>
                        <span style={{ color: '#d4af37' }}>{formatCurrency(order.total)}</span>
                    </div>
                </div>

                <div className="admin-modal-footer">
                    <div className="admin-modal-status-selector">
                        <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Status:</label>
                        <StatusDropdown
                            currentStatus={order.status || 'Processing'}
                            onStatusChange={(newStatus) => {
                                const updatedOrders = orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o);
                                setOrders(updatedOrders);
                                localStorage.setItem('ambre_orders', JSON.stringify(updatedOrders));
                            }}
                        />
                    </div>
                    <motion.button
                        onClick={onClose}
                        whileHover={{ background: '#b8962d', color: '#fff', boxShadow: '0 5px 20px rgba(184, 150, 45, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        className="admin-modal-footer-btn"
                    >
                        Close
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

const actionButtonStyle = {
    padding: '10px 20px',
    borderRadius: '12px',
    border: '1px solid #e5e5e5',
    background: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#333'
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Delivered': return { bg: '#dcfce7', text: '#166534' };
        case 'Shipped': return { bg: '#e0f2fe', text: '#075985' };
        case 'Cancelled': return { bg: '#fee2e2', text: '#991b1b' };
        default: return { bg: '#fef9c3', text: '#854d0e' };
    }
};
