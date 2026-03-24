'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock, MapPin, ArrowLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '@/src/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '@/src/styles/Orders.css';

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const loadOrder = async () => {
            setLoading(true);
            try {
                // 1. Try Firestore First
                const docRef = doc(db, "orders", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setOrder({ id: docSnap.id, ...docSnap.data() });
                } else {
                    // 2. Fallback to localStorage
                    const allOrders = JSON.parse(localStorage.getItem('ambre_orders') || '[]');
                    const foundOrder = allOrders.find(o => o.id === id);
                    if (foundOrder) {
                        setOrder(foundOrder);
                    } else {
                        setOrder(null);
                    }
                }
            } catch (e) {
                console.error("Error loading order from Firestore:", e);
                // Last ditch effort: localStorage
                const allOrders = JSON.parse(localStorage.getItem('ambre_orders') || '[]');
                setOrder(allOrders.find(o => o.id === id) || null);
            } finally {
                setLoading(false);
            }
        };
        loadOrder();

        const handleOrderSync = (e) => {
            if (e.key === 'ambre_orders') loadOrder();
        };
        window.addEventListener('storage', handleOrderSync);
        return () => window.removeEventListener('storage', handleOrderSync);
    }, [id]);

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this order? This cannot be undone.")) return;

        setCancelling(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: id, status: 'Cancelled', userId: order.userId })
            });
            const data = await res.json();
            if (res.ok) {
                setOrder({ ...order, status: 'Cancelled' });
                toast.success("Order cancelled successfully");

                // Sync to local history as well
                const localOrders = JSON.parse(localStorage.getItem('ambre_orders') || '[]');
                const updatedLocal = localOrders.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o);
                localStorage.setItem('ambre_orders', JSON.stringify(updatedLocal));
            } else {
                alert(data.error || "Failed to cancel order");
            }
        } catch (error) {
            console.error("Cancel Error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return <div className="section container">Loading...</div>;

    if (!order) {
        return (
            <div className="section container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2>Order Not Found</h2>
                <p>We couldn't find order #{order?.orderId || id}.</p>
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

    // Mock Expected Delivery
    const expectedDelivery = "18 – 20 Mar 2026";

    const handleDownloadInvoice = () => {
        try {
            const doc = new jsPDF();
            
            // --- HEADER ---
            doc.setFontSize(22);
            doc.setTextColor(180, 93, 6); // Golden/Amber color
            doc.text('AMBRE CANDLE', 105, 25, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text('Luxury Hand-Poured Scented Candles', 105, 32, { align: 'center' });
            
            doc.setDrawColor(212, 175, 55);
            doc.setLineWidth(0.5);
            doc.line(20, 40, 190, 40);

            // --- ORDER INFO ---
            doc.setFontSize(14);
            doc.setTextColor(26);
            doc.text(`INVOICE: #${order.orderId || id.substring(0, 10).toUpperCase()}`, 20, 55);
            
            doc.setFontSize(10);
            doc.text(`Date: ${order.date}`, 20, 62);
            doc.text(`Status: ${order.status || 'Processing'}`, 20, 67);

            // --- CUSTOMER DETAILS ---
            doc.setFontSize(12);
            doc.text('Billed To:', 130, 55);
            doc.setFontSize(10);
            doc.text(`${order.customer?.firstName} ${order.customer?.lastName}`, 130, 62);
            doc.text(`${order.customer?.address}`, 130, 67, { maxWidth: 60 });
            doc.text(`${order.customer?.city}, ${order.customer?.state} - ${order.customer?.pincode}`, 130, 77);
            doc.text(`Phone: ${order.customer?.phone}`, 130, 82);

            // --- TABLE OF ITEMS ---
            const tableColumn = ["Product Name", "Price", "Qty", "Subtotal"];
            const tableRows = [];

            order.items?.forEach(item => {
                const rowData = [
                    item.name,
                    `Rs. ${item.price}`,
                    item.quantity,
                    `Rs. ${item.price * item.quantity}`
                ];
                tableRows.push(rowData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 95,
                theme: 'grid',
                headStyles: { fillColor: [212, 175, 55], textColor: 255 },
                styles: { fontSize: 9, cellPadding: 5 }
            });

            // --- SUMMARY ---
            const finalY = doc.lastAutoTable.finalY + 10;
            doc.setFontSize(12);
            doc.text(`Grand Total: Rs. ${order.total}`, 140, finalY + 10);
            
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text('Thank you for choosing Ambre Candle.', 105, finalY + 30, { align: 'center' });

            // Save the PDF
            doc.save(`ambre_invoice_${order.orderId || id.substring(0, 8)}.pdf`);
            toast.success("Invoice downloaded successfully! ✨");
        } catch (error) {
            console.error("PDF generation error:", error);
            toast.error("Failed to generate PDF. Please try again.");
        }
    };

    return (
        <div className="section container order-details-container" style={{ padding: '110px 20px 80px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Top Navigation Row */}
            <div className="order-details-nav-row" style={{
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <button 
                    className="desktop-only-back-btn"
                    onClick={() => {
                        if (window.history.length > 2) {
                            router.back();
                        } else {
                            router.push('/orders');
                        }
                    }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 18px',
                        border: '1px solid #d4af37',
                        borderRadius: '30px',
                        fontSize: '13px',
                        color: '#d4af37',
                        background: 'transparent',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all .25s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#d4af37';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#d4af37';
                    }}
                >
                    <ArrowLeft size={16} /> Back to Orders
                </button>

                {order.status?.toLowerCase() === 'processing' && (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="cancel-order-btn"
                        style={{
                            padding: '8px 16px',
                            background: '#fff',
                            color: '#c0392b',
                            border: '1px solid #c0392b',
                            borderRadius: '30px',
                            fontWeight: '700',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            textTransform: 'uppercase',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#c0392b';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff';
                            e.currentTarget.style.color = '#c0392b';
                        }}
                    >
                        {cancelling ? 'Cancelling...' : <><X size={14} /> Cancel Order</>}
                    </motion.button>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', border: '1px solid rgba(212, 175, 55, 0.12)' }}
            >
                {/* Header Information */}
                <div className="order-details-header" style={{ 
                    padding: '25px 35px', 
                    borderBottom: '1px solid #f2f2f2',
                    background: 'linear-gradient(to bottom, #fffcf5, #fff)'
                }}>
                    {/* Order ID & Status Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h1 className="order-details-title" style={{ margin: 0, fontFamily: 'serif', fontSize: '1.8rem', color: '#1a1a1a', letterSpacing: '-0.5px' }}>
                            Order #{order.orderId || (order.id && order.id.substring(0, 10).toUpperCase())}
                        </h1>
                        <div style={{ 
                            padding: '6px 16px', 
                            borderRadius: '50px', 
                            background: '#fff', 
                            border: '1px solid #d4af37', 
                            color: '#d4af37',
                            fontWeight: '800',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {order.status || 'Processing'}
                        </div>
                    </div>

                    {/* Dates Row */}
                    <div className="order-details-meta-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ margin: 0, color: '#777', fontWeight: '500', fontSize: '0.9rem' }}>
                            Placed on {order.date}
                        </p>
                        <p style={{ margin: 0, color: '#caa24c', fontWeight: '800', fontSize: '0.9rem' }}>
                            Expected Delivery: {expectedDelivery}
                        </p>
                    </div>

                    {/* Timeline */}
                    <div style={{ marginTop: '35px', maxWidth: '550px', margin: '35px auto 10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '7px', left: '0', right: '0', height: '2px', background: '#f0f0f0', zIndex: 1 }}>
                                <div style={{ height: '100%', width: `${(currentStep - 1) * 50}%`, background: '#d4af37', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                            </div>
                            <OrderStep step={1} currentStep={currentStep} label="Processing" />
                            <OrderStep step={2} currentStep={currentStep} label="Shipped" />
                            <OrderStep step={3} currentStep={currentStep} label="Delivered" />
                        </div>
                    </div>
                </div>

                {/* Main Body */}
                <div className="order-details-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(280px, 0.8fr)', gap: '1px', background: '#f0f0f0' }}>
                    
                    {/* Left Column: Items */}
                    <div style={{ padding: '25px 35px', background: '#fff' }}>
                        <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', color: '#1a1a1a', fontWeight: '700' }}>
                            Order Items ({order.items?.length || 0})
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {order.items?.map((item, i) => (                                <div key={i} className="order-details-item" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ 
                                        width: '75px', 
                                        height: '75px', 
                                        borderRadius: '12px', 
                                        overflow: 'hidden', 
                                        background: '#f9f9f9',
                                        border: '1px solid #eee'
                                    }}>
                                        {item.image || item.image_url ? (
                                            <img src={item.image || item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                                <Package size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h4 className="order-details-item-name" style={{ margin: '0 0 3px', fontSize: '1rem', color: '#1a1a1a' }}>{item.name}</h4>
                                        <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
                                            Qty: <span style={{ fontWeight: '700', color: '#1a1a1a' }}>{item.quantity}</span> | <span style={{ color: '#d4af37', fontWeight: '700' }}>₹{item.price}</span>
                                        </p>
                                    </div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a1a1a' }}>
                                        ₹{item.price * item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1rem', fontWeight: '600', color: '#666' }}>Total Payable</span>
                            <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#b45d06' }}>₹{order.total}</span>
                        </div>
                        
                        <div style={{ marginTop: '15px', textAlign: 'right' }}>
                            <button 
                                onClick={handleDownloadInvoice}
                                style={{ 
                                    background: 'transparent', 
                                    border: '1px solid #d4af37', 
                                    padding: '8px 18px', 
                                    borderRadius: '10px', 
                                    color: '#d4af37', 
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                [ Download Invoice ]
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Address & Payment */}
                    <div style={{ padding: '25px 35px', background: '#fff' }}>
                        {/* Shipping Details */}
                        <div className="shipping-card" style={{ 
                            background: '#faf7f2', 
                            padding: '20px', 
                            borderRadius: '16px',
                            border: '1px solid rgba(212, 175, 55, 0.1)',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#b45d06', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Shipping Details
                            </h3>
                            <div style={{ color: '#1a1a1a', lineHeight: '1.6' }}>
                                <p style={{ margin: '0 0 5px', fontWeight: '700', fontSize: '1rem' }}>{order.customer?.firstName} {order.customer?.lastName}</p>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>{order.customer?.address}</p>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>{order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}</p>
                                <p style={{ margin: '10px 0 0', fontWeight: '600', fontSize: '0.9rem' }}>📞 {order.customer?.phone}</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div style={{ marginBottom: '25px', padding: '0 5px' }}>
                            <h3 style={{ margin: '0 0 8px', fontSize: '0.85rem', color: '#666' }}>Payment Method</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', color: '#1a1a1a' }}>
                                {order.paymentDetails?.method?.toUpperCase() === 'COD' ? '💵 COD' : '💳 Paid Online'}
                            </div>
                        </div>

                        {/* Help & Support */}
                        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
                            <p style={{ color: '#888', marginBottom: '12px', fontSize: '0.8rem', textAlign: 'center' }}>Need help with this order?</p>
                            <button 
                                onClick={() => {
                                    const message = `Hi Ambre Candle! I need help with my Order #${order.orderId || order.id}`;
                                    window.open(`https://api.whatsapp.com/send?phone=918577079877&text=${encodeURIComponent(message)}`, '_blank');
                                }}
                                style={{ 
                                    width: '100%', 
                                    background: '#25D366', 
                                    color: '#fff', 
                                    border: 'none', 
                                    padding: '12px', 
                                    borderRadius: '12px', 
                                    fontWeight: '700', 
                                    fontSize: '0.9rem',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    gap: '10px',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 16px rgba(37, 211, 102, 0.12)',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#1ebc57';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#25D366';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.938 3.659 1.432 5.633 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                WhatsApp Support
                            </button>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}

const OrderStep = ({ step, currentStep, label }) => {
    const isActive = currentStep >= step;
    return (
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div style={{
                width: '16px', height: '16px', borderRadius: '50%',
                background: isActive ? '#d4af37' : '#fff',
                border: `2px solid ${isActive ? '#d4af37' : '#eee'}`,
                margin: '0 auto 10px',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isActive ? '0 0 10px rgba(212, 175, 55, 0.5)' : 'none'
            }}>
            </div>
            <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: isActive ? '800' : '600', 
                color: isActive ? '#1a1a1a' : '#aaa',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {label}
            </div>
        </div>
    );
};
