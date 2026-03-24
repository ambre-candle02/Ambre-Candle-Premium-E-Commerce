'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/context/CartContext';
import { useAuth } from '@/src/context/AuthContext';
import { Truck, ShieldCheck, CreditCard, Lock, ArrowLeft, ArrowRight, MapPin, Sparkles, Leaf, Gift } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/src/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import SafeImage from '@/src/components/SafeImage';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const { cart, subtotal, clearCart } = useCart();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod', 'upi', 'card'
    const [showSuccess, setShowSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Wait for Firebase to restore auth session before redirecting
        if (authLoading) return; // Firebase still loading — don't redirect yet!
        if (!user) {
            toast.error("Please login to proceed with your order.");
            router.push('/login');
            return;
        }

        // Fetch Saved Profile to Auto-Fill Checkout
        const prefillProfile = async () => {
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const names = (data.displayName || user.displayName || '').split(' ');
                    const firstName = names[0] || '';
                    const lastName = names.slice(1).join(' ') || '';

                    setFormData(prev => ({
                        ...prev,
                        firstName: prev.firstName || firstName,
                        lastName: prev.lastName || lastName,
                        email: prev.email || user.email || '',
                        phone: prev.phone || data.phone || '',
                        address: prev.address || data.address || '',
                        city: prev.city || data.city || '',
                        state: prev.state || data.state || '',
                        pincode: prev.pincode || data.pincode || ''
                    }));
                } else if (user.displayName || user.email) {
                    const names = (user.displayName || '').split(' ');
                    setFormData(prev => ({
                        ...prev,
                        firstName: prev.firstName || names[0] || '',
                        lastName: prev.lastName || names.slice(1).join(' ') || '',
                        email: prev.email || user.email || ''
                    }));
                }
            } catch (err) {
                console.error("Error pre-filling checkout profile:", err);
            }
        };

        prefillProfile();
    }, [user, authLoading, router]);

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

    if (!mounted) return <div className="checkout-page" style={{ height: '100vh', background: '#fdfbf7' }}></div>;

    if (cart.length === 0 && !loading && !showSuccess) {
        return (
            <div className="section container" style={{ padding: '150px 20px 60px', maxWidth: '1200px', margin: '0 auto' }}>
                <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '15px', marginBottom: '30px', color: '#1a1a1a', textDecoration: 'none', fontWeight: 'bold', transition: 'all 0.3s ease' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back to Cart</span>
                </Link>

                <div style={{ textAlign: 'center', padding: '50px 20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fff' }}>
                    <h2>Your cart is empty</h2>
                    <p style={{ color: '#666', marginTop: '10px', marginBottom: '30px' }}>Add some products to proceed to checkout.</p>
                    <Link href="/shop" className="btn-primary">Return to Shop</Link>
                </div>
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
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const osmResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                const osmData = await osmResponse.json();

                if (osmData && osmData.address) {
                    const addr = osmData.address;
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
                    let finalPincode = addr.postcode ? addr.postcode.replace(/\s/g, '').split(';')[0].split(',')[0] : '';
                    const finalCity = addr.city || addr.town || addr.village || addr.county;
                    const finalState = addr.state;

                    setFormData(prev => ({
                        ...prev,
                        address: streetPart || prev.address,
                        city: finalCity || prev.city,
                        state: finalState || prev.state,
                        pincode: finalPincode || prev.pincode
                    }));

                    toast.success(`Location detected! Pincode: ${finalPincode}`);
                }
            } catch (error) {
                console.error("Error fetching address:", error);
                toast.error('Unable to fetch precise address. Please enter manually.');
            } finally {
                setLoadingLocation(false);
            }
        }, (error) => {
            console.error("Error getting location:", error);
            let msg = "Unable to retrieve your location.";
            if (error.code === 1) msg = "Location permission denied.";
            else if (error.code === 2) msg = "Location unavailable.";
            else if (error.code === 3) msg = "Location request timed out.";
            toast.error(msg);
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
        // ── DUPLICATE PREVENTION LAYER 1: Cross-tab lock ──
        // If another tab is already submitting, block this one immediately
        const isSubmitting = localStorage.getItem('ambre_order_submitting');
        if (isSubmitting === 'true') {
            toast.error("Order is already being placed in another tab. Please wait.");
            return;
        }

        // ── DUPLICATE PREVENTION LAYER 2: Idempotency key ──
        // Build a fingerprint from user + cart + total
        const idempotencyKey = `${user?.uid}_${cart.map(i => i.id + i.qty).join('_')}_${subtotal}`;
        const lastKey = localStorage.getItem('ambre_last_order_key');
        const lastKeyTime = parseInt(localStorage.getItem('ambre_last_order_key_time') || '0');
        const SIXTY_SECONDS = 60 * 1000;

        if (lastKey === idempotencyKey && Date.now() - lastKeyTime < SIXTY_SECONDS) {
            toast.error("This order was already placed! Check your Orders page.");
            return;
        }

        // Set cross-tab lock
        localStorage.setItem('ambre_order_submitting', 'true');
        setLoading(true);

        try {
            // Generate Order Data
            const orderData = {
                id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
                date: new Date().toLocaleDateString(),
                userId: user ? user.uid : 'guest', // Security Tag
                customer: formData,
                items: cart,
                total: subtotal,
                status: 'Processing'
            };

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

                    if (!res.ok) {
                        toast.error(razorData.message || "Payment setup failed. Please use Cash on Delivery while we configure the system.");
                        localStorage.removeItem('ambre_order_submitting'); // Release lock on failure
                        setLoading(false);
                        return;
                    }

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

                            // 3. Verify Payment on Server Side
                            try {
                                const verifyRes = await fetch('/api/payment/verify', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        razorpay_order_id: response.razorpay_order_id,
                                        razorpay_payment_id: response.razorpay_payment_id,
                                        razorpay_signature: response.razorpay_signature
                                    })
                                });

                                if (!verifyRes.ok) {
                                    const verifyData = await verifyRes.json();
                                    throw new Error(verifyData.message || "Payment verification failed.");
                                }

                                // SUCCESS: Now we record the order and idempotency
                                localStorage.setItem('ambre_last_order_key', idempotencyKey);
                                localStorage.setItem('ambre_last_order_key_time', Date.now().toString());
                                await finalizeOrder(finalOrder);
                            } catch (err) {
                                console.error("Verification error:", err);
                                toast.error('Verification Error: ' + (err.message || 'Please contact support.'));
                                localStorage.removeItem('ambre_order_submitting');
                                setLoading(false);
                            }
                        },
                        prefill: {
                            name: `${formData.firstName} ${formData.lastName}`,
                            email: formData.email,
                            contact: formData.phone
                        },
                        theme: { color: "#d4af37" },
                        modal: {
                            ondismiss: function () {
                                localStorage.removeItem('ambre_order_submitting'); // Release lock if closed
                                setLoading(false);
                            }
                        }
                    };

                    const rzp = new window.Razorpay(options);
                    rzp.on('payment.failed', function (response) {
                        toast.error("Payment failed: " + response.error.description);
                        localStorage.removeItem('ambre_order_submitting');
                        setLoading(false);
                    });
                    rzp.open();
                    return; // Wait for handler
                } catch (error) {
                    console.error("Payment setup error:", error);
                    toast.error('Payment setup failed. Please use Cash on Delivery while we configure the system.');
                    localStorage.removeItem('ambre_order_submitting');
                    setLoading(false);
                    return;
                }
            }

            // SUCCESS FOR COD: Now we record the order and idempotency
            localStorage.setItem('ambre_last_order_key', idempotencyKey);
            localStorage.setItem('ambre_last_order_key_time', Date.now().toString());
            await finalizeOrder(orderData);
        } catch (err) {
            console.error("Order placement error:", err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            // Always release the cross-tab lock so future orders work
            localStorage.removeItem('ambre_order_submitting');
            setLoading(false);
        }
    };

    const finalizeOrder = async (orderData) => {
        // 3. Save to Firestore via Server-Side API (Real-world Persistence)
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: orderData.items,
                    total: orderData.total,
                    customer: orderData.customer,
                    userId: orderData.userId,
                    razorpay_order_id: orderData.paymentDetails?.razorpay_order_id,
                    razorpay_payment_id: orderData.paymentDetails?.razorpay_id
                })
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Failed to save order");

            // ── SYNC PROFILE ON ORDER ── - Non-blocking for speed
            if (user && user.uid) {
                setDoc(doc(db, 'users', user.uid), {
                    displayName: `${orderData.customer.firstName} ${orderData.customer.lastName}`.trim(),
                    phone: orderData.customer.phone,
                    address: orderData.customer.address,
                    city: orderData.customer.city,
                    state: orderData.customer.state,
                    pincode: orderData.customer.pincode,
                    email: user.email,
                    updatedAt: new Date().toISOString()
                }, { merge: true }).catch(err => console.warn("Background profile sync fail:", err));
            }

            // Update orderData with real ID for local storage
            orderData.id = result.orderId;

            // Save to Local Storage History ONLY NOW (Real Success)
            let existingOrders = [];
            try {
                existingOrders = JSON.parse(localStorage.getItem('ambre_orders') || '[]');
                if (!Array.isArray(existingOrders)) existingOrders = [];
            } catch (e) {
                console.error("Failed to parse orders history", e);
            }
            const updatedOrders = [orderData, ...existingOrders];
            localStorage.setItem('ambre_orders', JSON.stringify(updatedOrders));
            localStorage.setItem('ambre_last_order', JSON.stringify(orderData));

            // 4. Send Confirmation Email (Nodemailer) - Non-blocking for UI speed
            fetch('/api/orders/confirmation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: orderData, type: 'confirmation' })
            }).catch(e => console.error("Background email error:", e));

        } catch (error) {
            console.error("Order finalization error:", error);
            toast.error("There was an issue saving your order. Please contact support.");
            return; // Don't show success if Firestore save failed
        }

        // Show Success Overlay immediately after processing
        setShowSuccess(true);
        setTimeout(() => clearCart(), 500); // Slight delay for safety

        // Redirect after a nice pause for the user to see success
        setTimeout(() => {
            router.replace('/orders');
        }, 1500); // Reduced from 2000ms for faster feel
    };

    return (
        <div className="checkout-page section">
            {/* Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
            <div className="container" style={{ maxWidth: '1100px' }}>
                <div className="checkout-back-btn-wrapper" style={{ paddingTop: '30px' }}>
                    <button
                        onClick={() => {
                            if (window.history.length > 2) {
                                router.back();
                            } else {
                                router.push('/cart');
                            }
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '15px', marginBottom: '0', color: '#1a1a1a', fontWeight: 'bold' }}
                    >
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
                            <ArrowLeft size={18} />
                        </div>
                        <span>Back</span>
                    </button>
                </div>

                <div className="checkout-header" style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <h1 style={{ fontSize: '2.2rem', fontFamily: 'serif', marginBottom: '10px', letterSpacing: '-0.5px' }}>Secure Checkout</h1>
                    <div className="checkout-steps">
                        <span className={step === 1 ? 'active' : ''}>1. Shipping</span>
                        <div className="step-line"></div>
                        <span className={step === 2 ? 'active' : ''}>2. Payment</span>
                    </div>
                </div>

                <div className="checkout-layout" style={{
                    display: 'grid',
                    gridTemplateColumns: '1.4fr 1fr',
                    gap: '40px',
                    alignItems: 'stretch'
                }}>

                    {/* LEFT SIDE: FORM */}
                    <div className="checkout-form-area" style={{ flex: 1 }}>
                        {step === 1 ? (
                            <div className="delivery-section fade-in" style={{ border: '1.5px solid #d4af37', height: '100%', display: 'flex', flexDirection: 'column', padding: '25px' }}>
                                <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
                                    <Truck size={24} color="#2563eb" fill="rgba(37, 99, 235, 0.1)" /> Shipping Information
                                </h2>

                                <div className="checkout-form-grid" style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '15px'
                                }}>
                                    <div className="form-group" style={{ flex: '1 1 200px' }}>
                                        <input
                                            name="firstName"
                                            className={`checkout-input ${errors.firstName ? 'error' : ''}`}
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="First Name *"
                                        />
                                        {errors.firstName && <span className="checkout-error-text">{errors.firstName}</span>}
                                    </div>

                                    <div className="form-group" style={{ flex: '1 1 200px' }}>
                                        <input
                                            name="lastName"
                                            className={`checkout-input ${errors.lastName ? 'error' : ''}`}
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Last Name *"
                                        />
                                        {errors.lastName && <span className="checkout-error-text">{errors.lastName}</span>}
                                    </div>

                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <div className="input-with-icon" style={{ position: 'relative' }}>
                                            <input
                                                name="email"
                                                className={`checkout-input ${errors.email ? 'error' : ''}`}
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Email Address *"
                                            />
                                        </div>
                                        {errors.email && <span className="checkout-error-text">{errors.email}</span>}
                                    </div>

                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <div className="input-with-icon" style={{ position: 'relative' }}>
                                            <input
                                                name="phone"
                                                className={`checkout-input ${errors.phone ? 'error' : ''}`}
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Phone Number *"
                                                maxLength={10}
                                            />
                                        </div>
                                        {errors.phone && <span className="checkout-error-text">{errors.phone}</span>}
                                    </div>

                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <label style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '0.95rem' }}>Shipping Address</label>
                                            <button
                                                onClick={detectLocation}
                                                style={{
                                                    background: '#fdfbf7',
                                                    border: '1px solid #e8e2d9',
                                                    color: '#d4af37',
                                                    padding: '6px 14px',
                                                    borderRadius: '10px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                className="location-btn"
                                                type="button"
                                                disabled={loadingLocation}
                                            >
                                                <MapPin size={14} />
                                                {loadingLocation ? 'Detecting...' : 'Use My Location'}
                                            </button>
                                        </div>
                                        <div className="input-with-icon" style={{ position: 'relative' }}>
                                            <input
                                                name="address"
                                                className={`checkout-input ${errors.address ? 'error' : ''}`}
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Street Address, House/Flat No. *"
                                            />
                                        </div>
                                        {errors.address && <span className="checkout-error-text">{errors.address}</span>}
                                    </div>

                                    <div className="checkout-form-grid" style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '20px'
                                    }}>
                                        <div className="form-group" style={{ flex: '1 1 150px' }}>
                                            <input
                                                name="city"
                                                className={`checkout-input ${errors.city ? 'error' : ''}`}
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="City *"
                                            />
                                            {errors.city && <span className="checkout-error-text">{errors.city}</span>}
                                        </div>

                                        <div className="form-group" style={{ flex: '1 1 150px' }}>
                                            <input
                                                name="state"
                                                className={`checkout-input ${errors.state ? 'error' : ''}`}
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                placeholder="State *"
                                            />
                                            {errors.state && <span className="checkout-error-text">{errors.state}</span>}
                                        </div>

                                        <div className="form-group" style={{ flex: '1 1 120px' }}>
                                            <input
                                                name="pincode"
                                                className={`checkout-input ${errors.pincode ? 'error' : ''}`}
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                placeholder="Pincode *"
                                                maxLength={6}
                                            />
                                            {errors.pincode && <span className="checkout-error-text">{errors.pincode}</span>}
                                        </div>
                                    </div>

                                </div>
                                
                                <div className="checkout-action-wrap" style={{ marginTop: '25px' }}>
                                    <button className="btn-primary btn-gold-hover checkout-main-btn" onClick={handleContinue}>
                                        Continue to Payment <ArrowRight size={18} style={{ display: 'inline', marginLeft: '8px' }} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="payment-selection fade-in" style={{
                                background: '#fff',
                                borderRadius: '24px',
                                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.03)',
                                border: '1.5px solid #d4af37',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '25px'
                            }}>
                                <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
                                    <CreditCard size={24} color="#6366f1" fill="rgba(99, 102, 241, 0.1)" /> Payment
                                </h2>

                                <div style={{ background: '#fdfbf7', padding: '18px', borderRadius: '16px', marginBottom: '25px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                                    <p style={{ fontWeight: '800', marginBottom: '8px', color: '#1a1a1a', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Delivery Details</p>
                                    <p style={{ margin: '0 0 4px 0', color: '#1a1a1a', fontWeight: '600' }}>{formData.firstName} {formData.lastName}</p>
                                    <p style={{ margin: '0 0 10px 0', color: '#555', fontSize: '0.9rem', lineHeight: '1.4' }}>{formData.address}, {formData.city}, {formData.pincode}</p>
                                    <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#d4af37', fontWeight: '700', padding: 0, cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>Edit Address</button>
                                </div>

                                <div className="payment-options" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {/* Payment Options */}
                                    <label className={`payment-option-card ${paymentMethod === 'upi' ? 'active' : ''}`}>
                                        <input type="radio" name="payment" onChange={() => setPaymentMethod('upi')} checked={paymentMethod === 'upi'} />
                                        <span>UPI / GPay / PhonePe (Recommended)</span>
                                    </label>
                                    <label className={`payment-option-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                                        <input type="radio" name="payment" onChange={() => setPaymentMethod('card')} checked={paymentMethod === 'card'} />
                                        <span>Credit / Debit Card</span>
                                    </label>
                                    <label className={`payment-option-card ${paymentMethod === 'cod' ? 'active' : ''}`}>
                                        <input type="radio" name="payment" onChange={() => setPaymentMethod('cod')} checked={paymentMethod === 'cod'} />
                                        <span style={{ fontWeight: 'bold', color: '#d4af37' }}>Cash on Delivery (Available)</span>
                                    </label>
                                </div>

                                <div className="checkout-action-wrap payment-actions" style={{ marginTop: '20px', paddingBottom: '0' }}>
                                    <button
                                        className="btn-modern btn-gold-hover checkout-main-btn"
                                        style={{ height: '50px', minWidth: '280px' }}
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="auth-loader"></div>
                                        ) : "Confirm Order"}
                                    </button>

                                    <button
                                        className="checkout-back-btn"
                                        onClick={() => setStep(1)}
                                    >
                                        <ArrowLeft size={16} style={{ marginRight: '5px' }} /> Back to Shipping
                                    </button>
                                </div>
                            </div>
                        )}


                    </div>

                    {/* RIGHT SIDE: SUMMARY */}
                    <div className="order-summary-side summary-card fade-in" style={{
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                        border: '1.5px solid #d4af37',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <h2 style={{ marginBottom: '15px', fontSize: '1.4rem', fontFamily: 'serif', color: '#1a1a1a' }}>Order Summary</h2>
                        <div style={{ maxHeight: '160px', overflowY: 'auto', marginBottom: '15px', paddingRight: '5px' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', transition: 'transform 0.2s ease' }} className="product-summary-row">
                                    <Link href={`/product/${item.id}`} prefetch={true} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '12px', background: '#f8f8f8', flexShrink: 0, overflow: 'hidden', display: 'block' }}>
                                        <SafeImage src={item.image || '/logo.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.name} />
                                    </Link>
                                    <div style={{ flex: 1 }}>
                                        <Link href={`/product/${item.id}`} prefetch={true} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '0.95rem', transition: 'color 0.2s' }} className="product-name-link">{item.name}</div>
                                        </Link>
                                        <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>Quantity: {item.quantity}</div>
                                    </div>
                                    <div style={{ fontWeight: '700', color: '#1a1a1a' }}><span className="currency-symbol">₹</span>{(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#666', fontSize: '0.9rem' }}>
                                <span>Subtotal</span>
                                <span style={{ fontWeight: '500' }}><span className="currency-symbol">₹</span>{subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#666', fontSize: '0.9rem' }}>
                                <span>Shipping</span>
                                <span style={{ color: '#2e7d32', fontWeight: '600' }}>COMPLIMENTARY</span>
                            </div>
                            <div className="st-row total" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px' }}>
                                <span>Order Total</span>
                                <span><span className="currency-symbol">₹</span>{subtotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Glassmorphism Trust Badges */}
                        <div className="desktop-trust-badges" style={{
                            marginTop: '15px',
                            background: 'rgba(212, 175, 55, 0.03)',
                            padding: '12px',
                            borderRadius: '20px',
                            border: '1px solid rgba(212, 175, 55, 0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            flex: 1,
                            justifyContent: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '28px', height: '28px', background: 'rgba(212,175,55,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
                                    <Sparkles size={14} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1a1a1a' }}>Artisan Handmade</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '28px', height: '28px', background: 'rgba(34,197,94,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                                    <Leaf size={14} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1a1a1a' }}>100% Organic Soy Wax</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '28px', height: '28px', background: 'rgba(59,130,246,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                    <Gift size={14} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1a1a1a' }}>Luxury Packaging</div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '20px',
                            background: '#fdfbf7',
                            padding: '12px',
                            borderRadius: '16px',
                            display: 'flex',
                            gap: '10px',
                            fontSize: '0.75rem',
                            color: '#666',
                            alignItems: 'center',
                            border: '1px solid #e8e2d9'
                        }}>
                            <ShieldCheck size={20} color="#d4af37" />
                            <span>This is a secure SSL encrypted payment. Your data is protected by industry-leading security standards.</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Elite Success Overlay */}
            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-card">
                        <div className="success-check-wrapper">
                            <ShieldCheck size={50} />
                        </div>
                        <h2>Order Confirmed</h2>
                        <p>
                            Your aromatic journey has begun. We've received your order and our artisan team is now preparing your candles.
                        </p>
                        <button 
                            className="redirecting-pill" 
                            onClick={() => router.replace('/orders')}
                            style={{ 
                                cursor: 'pointer', 
                                border: 'none', 
                                outline: 'none',
                                transition: 'transform 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div className="pulse-dot"></div>
                            Taking you to your orders
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
