'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/context/CartContext';
import { Truck, ShieldCheck, CreditCard, Lock, ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/src/config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function CheckoutPage() {
    const { cart, subtotal, clearCart } = useCart();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod', 'upi', 'card'

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [errors, setErrors] = useState({});

    if (cart.length === 0 && !loading) {
        return (
            <div className="section container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2>Your cart is empty</h2>
                <p style={{ color: '#666', marginTop: '10px', marginBottom: '30px' }}>Add some products to proceed to checkout.</p>
                <Link href="/shop" className="btn-primary">Return to Shop</Link>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';

        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';

        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Enter valid 10-digit number';

        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // 1. Fetch address details from OpenStreetMap
                const osmResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                const osmData = await osmResponse.json();

                // 2. Fetch nearest pincode using Zippopotam (or similar service for India if available, currently falling back to rigorous OSM parsing)
                // Since Zippopotam is country-based and reverse geocoding is complex, we will refine OSM data extraction

                // Note: BigDataCloud or Google Maps are best, but require keys/limits. 
                // We will try to fetch from a public Indian Pincode Directory API if completely necessary,
                // but for now, let's refine the logic to trust specific fields more.

                if (osmData && osmData.address) {
                    const addr = osmData.address;



                    // Construct street address
                    const streetComponents = [
                        addr.house_number,
                        addr.building,
                        addr.road,
                        addr.residential,
                        addr.suburb,
                        addr.neighbourhood,
                        addr.locality,
                        addr.city_district
                    ].filter(Boolean);

                    const streetPart = [...new Set(streetComponents)].join(', ');

                    // Pincode Logic:
                    // Sometimes OSM returns multiple pincodes like "110017;110048".
                    // We split by ';' and take the first one.
                    // Also check specifically for known overrides if needed (though hardcoding is bad)

                    let finalPincode = addr.postcode ? addr.postcode.replace(/\s/g, '').split(';')[0].split(',')[0] : '';

                    // Fallback City/State
                    const finalCity = addr.city || addr.town || addr.village || addr.county;
                    const finalState = addr.state;

                    setFormData(prev => ({
                        ...prev,
                        address: streetPart || prev.address,
                        city: finalCity || prev.city,
                        state: finalState || prev.state,
                        pincode: finalPincode || prev.pincode
                    }));

                    alert(`Location detected!\nPincode: ${finalPincode}\nArea: ${streetPart}\n\nNote: If the Pincode is slightly off (e.g. 110048 vs 110017), it may be due to the map data boundary. Please edit if necessary.`);
                }
            } catch (error) {
                console.error("Error fetching address:", error);
                alert("Unable to fetch precise address. Please enter manually.");
            } finally {
                setLoadingLocation(false);
            }
        }, (error) => {
            console.error("Error getting location:", error);
            let msg = "Unable to retrieve your location.";
            if (error.code === 1) msg = "Location permission denied. Please allow location access.";
            if (error.code === 2) msg = "Location unavailable. Check GPS/Network.";
            if (error.code === 3) msg = "Location request timed out.";
            alert(msg);
            setLoadingLocation(false);
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    };

    const handleContinue = () => {
        if (validateForm()) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);

        // Generate Order Data
        const orderData = {
            id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
            date: new Date().toLocaleDateString(),
            customer: formData,
            items: cart,
            total: subtotal,
            status: 'Processing'
        };

        // Save to Local Storage (Array for history)
        let existingOrders = [];
        try {
            existingOrders = JSON.parse(localStorage.getItem('ambre_orders') || '[]');
            if (!Array.isArray(existingOrders)) existingOrders = [];
        } catch (e) {
            console.error("Failed to parse orders history", e);
        }

        const updatedOrders = [orderData, ...existingOrders];
        localStorage.setItem('ambre_orders', JSON.stringify(updatedOrders));

        // Save last order separately for tracking page reference
        localStorage.setItem('ambre_last_order', JSON.stringify(orderData));

        // Handle Online Payment if selected
        if (paymentMethod !== 'cod') {
            try {
                // 1. Create a Razorpay Order through our API
                const res = await fetch('/api/payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: subtotal })
                });
                const razorData = await res.json();

                if (!res.ok) throw new Error(razorData.message || "Payment setup failed");

                // 2. Open Razorpay Modal
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: razorData.amount,
                    currency: razorData.currency,
                    name: "Ambre Candle",
                    description: "Handcrafted Artisan Candles",
                    image: "/logo.png",
                    order_id: razorData.id,
                    handler: async function (response) {
                        // Payment Success!
                        const finalOrder = {
                            ...orderData,
                            paymentDetails: {
                                razorpay_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                method: paymentMethod
                            },
                            status: 'Paid & Processing'
                        };
                        await finalizeOrder(finalOrder);
                    },
                    prefill: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        contact: formData.phone
                    },
                    theme: { color: "#d4af37" },
                    modal: {
                        ondismiss: function () {
                            setLoading(false);
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                return; // Wait for handler
            } catch (error) {
                console.error("Payment error:", error);
                alert("Online payment failed. You can use Cash on Delivery.");
                setLoading(false);
                return;
            }
        }

        // Proceed with Regular COD Flow
        await finalizeOrder(orderData);
    };

    const finalizeOrder = async (orderData) => {
        // 3. Save to Firestore (Real-world Persistence)
        try {
            await setDoc(doc(db, "orders", orderData.id), orderData);

            // 4. Send Confirmation Email (Nodemailer)
            await fetch('/api/orders/confirmation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: orderData, type: 'confirmation' })
            });

        } catch (error) {
            console.error("Firestore order save error:", error);
            // Fallback is already handled by localStorage
        }

        // Simulate API Processing
        setTimeout(() => {
            clearCart();
            router.push('/orders');
        }, 1500);
    };

    return (
        <div className="checkout-page section">
            {/* Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
            <div className="container" style={{ maxWidth: '1100px' }}>
                <div className="checkout-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontFamily: 'serif' }}>Secure Checkout</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px', color: '#666', fontSize: '0.9rem' }}>
                        <span style={{ color: step === 1 ? '#000' : '#888', fontWeight: step === 1 ? 'bold' : 'normal' }}>1. Shipping Details</span>
                        <span>&gt;</span>
                        <span style={{ color: step === 2 ? '#888' : '#aaa', fontWeight: step === 2 ? 'bold' : 'normal' }}>2. Payment & Order</span>
                    </div>
                </div>

                <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

                    {/* LEFT SIDE: FORM */}
                    <div className="checkout-form-area" style={{ flex: 1 }}>
                        {step === 1 ? (
                            <div className="delivery-section fade-in">
                                <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
                                    <Truck size={24} /> Shipping Information
                                </h2>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                                    <div className="form-group">
                                        <input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="First Name *"
                                            style={{ ...inputStyle, borderColor: errors.firstName ? 'red' : '#d4af37' }}
                                        />
                                        {errors.firstName && <span style={errorStyle}>{errors.firstName}</span>}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Last Name *"
                                            style={{ ...inputStyle, borderColor: errors.lastName ? 'red' : '#d4af37' }}
                                        />
                                        {errors.lastName && <span style={errorStyle}>{errors.lastName}</span>}
                                    </div>

                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Email Address *"
                                            style={{ ...inputStyle, borderColor: errors.email ? 'red' : '#d4af37' }}
                                        />
                                        {errors.email && <span style={errorStyle}>{errors.email}</span>}
                                    </div>

                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Phone Number *"
                                            maxLength={10}
                                            style={{ ...inputStyle, borderColor: errors.phone ? 'red' : '#d4af37' }}
                                        />
                                        {errors.phone && <span style={errorStyle}>{errors.phone}</span>}
                                    </div>

                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <label style={{ fontWeight: '500' }}>Address</label>
                                            <button
                                                onClick={detectLocation}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#C19A6B',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    fontSize: '0.85rem'
                                                }}
                                                type="button"
                                                disabled={loadingLocation}
                                            >
                                                <MapPin size={16} />
                                                {loadingLocation ? 'Detecting...' : 'Use Current Location'}
                                            </button>
                                        </div>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Street Address, Flat No. *"
                                            style={{ ...inputStyle, borderColor: errors.address ? 'red' : '#d4af37' }}
                                        />
                                        {errors.address && <span style={errorStyle}>{errors.address}</span>}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="City *"
                                            style={{ ...inputStyle, borderColor: errors.city ? 'red' : '#d4af37' }}
                                        />
                                        {errors.city && <span style={errorStyle}>{errors.city}</span>}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="State *"
                                            style={{ ...inputStyle, borderColor: errors.state ? 'red' : '#d4af37' }}
                                        />
                                        {errors.state && <span style={errorStyle}>{errors.state}</span>}
                                    </div>

                                    <div className="form-group">
                                        <input
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            placeholder="Pincode *"
                                            maxLength={6}
                                            style={{ ...inputStyle, borderColor: errors.pincode ? 'red' : '#d4af37' }}
                                        />
                                        {errors.pincode && <span style={errorStyle}>{errors.pincode}</span>}
                                    </div>

                                </div>

                                <button className="btn-primary btn-gold-hover" style={{ marginTop: '30px', width: '100%', padding: '15px' }} onClick={handleContinue}>
                                    Order Now <ArrowRight size={18} style={{ display: 'inline', marginLeft: '8px' }} />
                                </button>
                            </div>
                        ) : (
                            <div className="payment-selection fade-in">
                                <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
                                    <CreditCard size={24} /> Payment
                                </h2>

                                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #d4af37' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Delivery To:</p>
                                    <p style={{ margin: 0, color: '#555' }}>{formData.firstName} {formData.lastName}</p>
                                    <p style={{ margin: 0, color: '#555' }}>{formData.address}, {formData.city}</p>
                                    <p style={{ margin: 0, color: '#555' }}>{formData.phone}</p>
                                    <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#C19A6B', textDecoration: 'underline', padding: 0, marginTop: '10px', cursor: 'pointer' }}>Edit Details</button>
                                </div>

                                <div className="payment-options" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {/* Payment Options */}
                                    <label style={{ ...paymentOptionStyle, border: paymentMethod === 'upi' ? '2px solid #d4af37' : '1px solid #ddd' }}>
                                        <input type="radio" name="payment" onChange={() => setPaymentMethod('upi')} checked={paymentMethod === 'upi'} />
                                        <span>UPI / GPay / PhonePe (Recommended)</span>
                                    </label>
                                    <label style={{ ...paymentOptionStyle, border: paymentMethod === 'card' ? '2px solid #d4af37' : '1px solid #ddd' }}>
                                        <input type="radio" name="payment" onChange={() => setPaymentMethod('card')} checked={paymentMethod === 'card'} />
                                        <span>Credit / Debit Card</span>
                                    </label>
                                    <label style={{ ...paymentOptionStyle, border: paymentMethod === 'cod' ? '2px solid #d4af37' : '1px solid #ddd' }}>
                                        <input type="radio" name="payment" onChange={() => setPaymentMethod('cod')} checked={paymentMethod === 'cod'} />
                                        <span style={{ fontWeight: 'bold', color: '#d4af37' }}>Cash on Delivery (Available)</span>
                                    </label>
                                </div>

                                <button
                                    className="btn-primary btn-gold-hover"
                                    style={{ marginTop: '30px', width: '100%', padding: '15px', opacity: loading ? 0.7 : 1 }}
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                >
                                    {loading ? "Processing Order..." : "Order Now"}
                                </button>

                                <button
                                    style={{ marginTop: '15px', color: '#555', width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={() => setStep(1)}
                                >
                                    <ArrowLeft size={16} style={{ marginRight: '5px' }} /> Back to Shipping
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: SUMMARY */}
                    <div className="order-summary-side" style={{ background: '#faf8f5', padding: '30px', borderRadius: '20px', height: 'fit-content', border: '1px solid #d4af37' }}>
                        <h2 style={{ marginBottom: '20px', fontSize: '1.4rem' }}>Order Summary</h2>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.9rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                    <div style={{ paddingRight: '10px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                        <div style={{ color: '#888', fontSize: '0.8rem' }}>Qty: {item.quantity}</div>
                                    </div>
                                    <div style={{ fontWeight: 600 }}><span className="currency-symbol">₹</span>{(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: '2px solid #ddd', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#888' }}>
                                <span>Subtotal</span>
                                <span><span className="currency-symbol">₹</span>{subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#888' }}>
                                <span>Shipping</span>
                                <span style={{ color: 'green' }}>FREE</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.4rem', marginTop: '15px' }}>
                                <span>Total</span>
                                <span><span className="currency-symbol">₹</span>{subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <div style={{ marginTop: '30px', background: 'rgba(212, 100, 55, 0.05)', padding: '15px', borderRadius: '10px', display: 'flex', gap: '10px', fontSize: '0.85rem', color: '#d46437', alignItems: 'center', border: '1px solid rgba(212, 100, 55, 0.1)' }}>
                            <ShieldCheck size={20} />
                            <span>Secure SSL Encrypted Payment</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: '15px',
    borderRadius: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#d4af37',
    color: '#1a1a1a',
    outline: 'none',
    width: '100%',
    fontSize: '1rem',
    transition: 'border-color 0.3s'
};

const errorStyle = {
    color: '#e53935',
    fontSize: '0.75rem',
    marginTop: '5px',
    display: 'block'
};

const paymentOptionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    border: '1px solid #d4af37',
    borderRadius: '10px',
    cursor: 'pointer',
    background: '#fff',
    fontSize: '1rem'
};
