'use client';
import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, DollarSign, Users, Lock, LogOut, TrendingUp, Calendar, RefreshCw, Trash2, Eye, Search, Filter, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const session = sessionStorage.getItem('ambre_admin_session');
        if (session === 'active') {
            setIsAuthenticated(true);
            loadOrders();
        }
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
            // Sort by latest
            loadedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
            setOrders(loadedOrders);
        } catch (error) {
            console.error("Failed to load orders:", error);
            setOrders([]);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const u = username.toLowerCase().trim();
        const p = password.trim();

        if (u === 'admin' && (p === 'admin123' || p === 'admin')) {
            setIsAuthenticated(true);
            sessionStorage.setItem('ambre_admin_session', 'active');
            loadOrders();
        } else {
            alert('Invalid Credentials!\nDefault User: admin\nDefault Pass: admin123');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('ambre_admin_session');
        setUsername('');
        setPassword('');
        setOrders([]);
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

    if (!isAuthenticated) {
        return (
            <div className="auth-split-page">
                {/* Left Panel - Visual (Different Image) */}
                <div className="auth-left-panel" style={{ background: '#fdfbf7' }}>
                    <div className="auth-circle-decor circle-1" style={{ background: 'rgba(212, 175, 55, 0.1)' }}></div>
                    <div className="auth-circle-decor circle-2" style={{ background: 'rgba(212, 175, 55, 0.05)' }}></div>

                    <motion.img
                        src="/images/new_arrivals/sunflower_urli_candle__6_5inch_.jpg?v=admin2"
                        alt="Ambre Admin"
                        className="auth-visual-image"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        style={{ maxHeight: '70vh', objectFit: 'contain' }}
                    />

                    <motion.div
                        className="auth-visual-text"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <h2 className="auth-visual-heading" style={{ color: '#1a1a1a' }}>Admin Portal.</h2>
                        <p className="auth-visual-subtext" style={{ color: '#555' }}>Manage your empire of fragrance and elegance.</p>
                    </motion.div>
                </div>

                {/* Right Panel - Form */}
                <div className="auth-right-panel">
                    <motion.div
                        className="auth-form-container"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="auth-header">
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 20px', boxShadow: '0 10px 20px rgba(212,175,55,0.2)'
                            }}>
                                <Lock size={28} color="#fff" />
                            </div>
                            <h1 className="auth-title">Welcome Back</h1>
                            <p className="auth-subtitle">Please sign in to continue</p>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className="modern-form-group">
                                <div className="modern-input-wrapper">
                                    <User size={18} className="modern-input-icon" />
                                    <input
                                        type="text"
                                        className="modern-input"
                                        placeholder="Username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="modern-form-group">
                                <div className="modern-input-wrapper">
                                    <Lock size={18} className="modern-input-icon" />
                                    <input
                                        type="password"
                                        className="modern-input"
                                        placeholder="Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                className="btn-modern"
                                initial={{ background: '#1a1a1a', borderColor: '#1a1a1a', color: '#fff' }}
                                whileHover={{
                                    scale: 1.02,
                                    background: '#d4af37',
                                    borderColor: '#d4af37',
                                    color: '#fff',
                                    boxShadow: '0 10px 25px rgba(212, 175, 55, 0.4)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.3 }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}
                            >
                                Authenticate Access
                                <ArrowRight size={20} />
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (!mounted) return null;

    return (
        <div className="admin-main-container" style={{ minHeight: '100vh', background: '#f8f8f8', color: '#1a1a1a', paddingTop: '100px', paddingBottom: '50px' }}>
            <style>{styles}</style>
            <div className="container" style={{ maxWidth: '1400px', padding: '0 30px' }}>

                {/* Header */}
                <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '50px', borderBottom: '1px solid #e5e5e5', paddingBottom: '30px' }}>
                    <div>
                        <p style={{ color: '#d4af37', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '5px' }}>Overview</p>
                        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: 0 }}>Dashboard</h1>
                    </div>
                    <div className="admin-actions" style={{ display: 'flex', gap: '15px' }}>
                        <motion.button
                            onClick={loadOrders}
                            whileHover={{ scale: 1.05, backgroundColor: '#d4af37', color: '#000', borderColor: '#d4af37' }}
                            whileTap={{ scale: 0.95 }}
                            style={actionButtonStyle}
                        >
                            <RefreshCw size={18} /> Refresh
                        </motion.button>
                        <motion.button
                            onClick={clearAllOrders}
                            whileHover={{ scale: 1.05, backgroundColor: '#ef4444', color: '#fff', borderColor: '#ef4444' }}
                            whileTap={{ scale: 0.95 }}
                            style={{ ...actionButtonStyle, background: '#fee2e2', color: '#dc2626', borderColor: '#fecaca' }}
                        >
                            <Trash2 size={18} /> Clear Data
                        </motion.button>
                        <motion.button
                            onClick={handleLogout}
                            whileHover={{ scale: 1.05, backgroundColor: '#d4af37', color: '#000', borderColor: '#d4af37' }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                ...actionButtonStyle,
                                background: '#1a1a1a',
                                color: '#fff',
                                borderColor: '#1a1a1a'
                            }}
                        >
                            <LogOut size={18} /> Logout
                        </motion.button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="admin-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
                    <StatCard
                        title="Total Orders"
                        value={orders.length}
                        icon={<Package size={28} color="#d4af37" />}
                    />
                    <StatCard
                        title="Revenue"
                        value={formatCurrency(orders.reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0))}
                        icon={<DollarSign size={28} color="#d4af37" />}
                    />
                    <StatCard
                        title="Customers"
                        value={new Set(orders.map(o => o.customer?.email)).size}
                        icon={<Users size={28} color="#d4af37" />}
                    />
                </div>

                {/* Orders Table Section */}
                <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #eee' }}>
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
                                        color: '#333'
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
                                                    whileHover={{ scale: 1.05, backgroundColor: '#d4af37', color: '#000', borderColor: '#d4af37' }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{
                                                        background: '#fff',
                                                        border: '1px solid #ddd',
                                                        padding: '8px 16px',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        color: '#333'
                                                    }}
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

                {/* Modal */}
                <AnimatePresence>
                    {selectedOrder && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedOrder(null)}
                                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}
                            />
                            <motion.div
                                className="admin-modal-content"
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                style={{ background: '#fff', width: '100%', maxWidth: '700px', borderRadius: '24px', position: 'relative', zIndex: 1010, overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.3)' }}
                            >
                                <div style={{ padding: '30px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                                    <div>
                                        <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '1.5rem' }}>Order #{selectedOrder.id}</h2>
                                        <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.9rem' }}>Placed on {new Date(selectedOrder.date).toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => setSelectedOrder(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: '#aaa', padding: '10px' }}>&times;</button>
                                </div>

                                <div style={{ padding: '30px', maxHeight: '60vh', overflowY: 'auto' }}>
                                    <div className="admin-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                                        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '16px' }}>
                                            <h4 style={{ margin: '0 0 15px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', color: '#999' }}>Customer</h4>
                                            <p style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 5px' }}>{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                                            <p style={{ margin: '0 0 5px', color: '#555' }}>{selectedOrder.customer?.email}</p>
                                            <p style={{ margin: 0, color: '#555' }}>{selectedOrder.customer?.phone}</p>
                                        </div>
                                        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '16px' }}>
                                            <h4 style={{ margin: '0 0 15px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', color: '#999' }}>Shipping Address</h4>
                                            <p style={{ margin: '0 0 5px', color: '#333' }}>{selectedOrder.customer?.address}</p>
                                            <p style={{ margin: '0 0 5px', color: '#333' }}>{selectedOrder.customer?.city}, {selectedOrder.customer?.state}</p>
                                            <p style={{ margin: 0, color: '#333' }}>Pincode: {selectedOrder.customer?.pincode}</p>
                                        </div>
                                    </div>

                                    <h4 style={{ margin: '0 0 15px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', color: '#999' }}>Items Ordered</h4>
                                    <div style={{ border: '1px solid #eee', borderRadius: '16px', overflow: 'hidden', marginBottom: '30px' }}>
                                        {selectedOrder.items?.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', borderBottom: idx !== selectedOrder.items?.length - 1 ? '1px solid #f0f0f0' : 'none', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <div style={{ width: '50px', height: '50px', background: '#f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
                                                        <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                                                        <div style={{ fontSize: '0.85rem', color: '#888' }}>Qty: {item.quantity}</div>
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: '600' }}>{formatCurrency(item.price * item.quantity)}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', fontWeight: 'bold', padding: '20px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #eee' }}>
                                        <span>Total Amount</span>
                                        <span style={{ color: '#d4af37' }}>{formatCurrency(selectedOrder.total)}</span>
                                    </div>
                                </div>

                                <div style={{ padding: '20px 30px', background: '#fafafa', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Order Status:</label>
                                        <select
                                            value={selectedOrder.status || 'Pending'}
                                            onChange={(e) => {
                                                const newStatus = e.target.value;
                                                const updatedOrders = orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o);
                                                setOrders(updatedOrders);
                                                setSelectedOrder({ ...selectedOrder, status: newStatus });
                                                localStorage.setItem('ambre_orders', JSON.stringify(updatedOrders));
                                            }}
                                            style={{
                                                padding: '10px 16px',
                                                borderRadius: '8px',
                                                border: '1px solid #ddd',
                                                outline: 'none',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                background: '#fff'
                                            }}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <button onClick={() => setSelectedOrder(null)} style={{ padding: '12px 30px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Close Details</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

const StatCard = ({ title, value, icon, color }) => (
    <motion.div
        className="luxury-card"
        whileHover={{ scale: 1.02 }}
        style={{
            background: '#1a1a1a',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            color: '#fff'
        }}
    >
        <div style={{
            width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(212,175,55,0.2)', // Gold tint background
            color: '#d4af37', // Gold Icon
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
        }}>
            {icon}
        </div>
        <div>
            <h3 style={{ margin: 0, fontSize: '0.85rem', color: '#d4af37', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>{title}</h3>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>{value}</div>
        </div>
    </motion.div>
);

const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    outline: 'none',
    fontSize: '1rem',
    transition: 'all 0.3s'
};

const actionButtonStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #e5e5e5',
    background: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#333',
    transition: 'all 0.2s'
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Delivered': return { bg: '#dcfce7', text: '#166534' };
        case 'Shipped': return { bg: '#e0f2fe', text: '#075985' };
        case 'Cancelled': return { bg: '#fee2e2', text: '#991b1b' };
        default: return { bg: '#fef9c3', text: '#854d0e' };
    }
};

const styles = `
@media (max-width: 768px) {
    /* Fix Header Overlap - Aggressive */
    .admin-main-container {
        padding-top: 160px !important; 
    }
    
    .container {
        padding: 0 20px !important;
    }

    .admin-header {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 20px;
    }
    
    
    .admin-actions {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .admin-actions button {
        width: 100%;
        justify-content: center;
    }

    .admin-table-header {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 15px;
    }

    .admin-search-wrapper {
        width: 100%;
    }

    .admin-search-input {
        width: 100% !important;
    }

    .admin-modal-content {
        max-height: 80vh !important;
        overflow-y: auto;
    }

    .admin-modal-grid {
        grid-template-columns: 1fr !important;
        gap: 15px !important;
    }
    
    .admin-kpi-grid {
        grid-template-columns: 1fr !important;
    }
}
`;
