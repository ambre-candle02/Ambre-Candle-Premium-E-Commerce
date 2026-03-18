'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save, ArrowLeft, Navigation } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/src/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import '@/src/styles/Profile.css';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);
    const [formData, setFormData] = useState({
        displayName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFormData({
                        displayName: docSnap.data().displayName || user.displayName || '',
                        phone: docSnap.data().phone || '',
                        address: docSnap.data().address || '',
                        city: docSnap.data().city || '',
                        state: docSnap.data().state || '',
                        pincode: docSnap.data().pincode || ''
                    });
                } else {
                    // Pre-fill with user's name if it exists in Firebase Auth
                    setFormData(prev => ({ ...prev, displayName: user.displayName || '' }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile details.");
            } finally {
                setFetchingProfile(false);
            }
        };

        fetchProfile();
    }, [user, authLoading, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Detecting your location...');

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Using nominatim with a specific limit and better error handling
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&addressdetails=1`, {
                    headers: {
                        'Accept-Language': 'en'
                    }
                });
                
                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = await response.json();
                const addr = data.address;

                if (!addr) {
                    toast.error('Could not find address for this location.', { id: toastId });
                    return;
                }

                setFormData(prev => ({
                    ...prev,
                    address: addr.road || addr.suburb || addr.neighbourhood || addr.amenity || prev.address || '',
                    city: addr.city || addr.town || addr.village || addr.city_district || '',
                    state: addr.state || '',
                    pincode: addr.postcode || ''
                }));
                
                toast.success('Location detected! ✨', { id: toastId });
            } catch (err) {
                console.error("Geocoding error:", err);
                toast.error('Failed to get address. Please enter manually.', { id: toastId });
            } finally {
                setIsLoading(false);
            }
        }, (error) => {
            let errorMsg = 'Location access denied. Please allow it from browser settings (Lock icon).';
            if (error.code === 2) errorMsg = 'Location unavailable (Weak signal)';
            if (error.code === 3) errorMsg = 'Location request timed out';
            if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                errorMsg = 'SSL (HTTPS) required for location features on domains.';
            }
            
            toast.error(errorMsg, { id: toastId, duration: 5000 });
            setIsLoading(false);
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await setDoc(doc(db, 'users', user.uid), {
                ...formData,
                email: user.email,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            toast.success("Profile updated successfully! ✨");
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to save profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading || (user && fetchingProfile)) {
        return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner"></div>
        </div>;
    }

    if (!user) return null;

    return (
        <div className="profile-page-section section container">
            <div style={{
                position: 'absolute',
                top: '100px',
                left: '5%',
                zIndex: 20
            }}>
                <button
                    className="desktop-only-back-btn"
                    onClick={() => {
                        if (window.history.length > 2) {
                            router.back();
                        } else {
                            router.push('/');
                        }
                    }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#d4af37',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        cursor: 'pointer',
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        padding: '10px 20px',
                        borderRadius: '50px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        marginBottom: '20px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'}
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="profile-card"
            >
                <div className="profile-header">
                    {/* User Info Elite Card - PRO Idea Integration */}
                    <div className="user-info-elite-card">
                        <div className="user-elite-avatar">
                            <User size={30} />
                        </div>
                        <div className="user-elite-details">
                            <h2 className="user-elite-name">{formData.displayName || user.displayName || 'Glow Member'}</h2>
                            <p className="user-elite-meta">
                                Member since {user.metadata.creationTime ? new Date(user.metadata.creationTime).getFullYear() : '2026'}
                            </p>
                        </div>
                        <div className="user-elite-stats">
                            <div className="stat-pill">2 Orders</div>
                            <div className="stat-pill">2 Wishlist</div>
                        </div>
                    </div>

                    <h1 className="profile-title">Profile Settings</h1>
                    <p className="profile-subtitle">Refine your personal and shipping information.</p>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    {/* Basic Info */}
                    <div className="profile-form-row">
                        <div className="modern-form-group">
                            <label className="input-label">Full Name</label>
                            <div className="modern-input-wrapper">
                                <User size={18} className="modern-input-icon" />
                                <input
                                    type="text"
                                    name="displayName"
                                    className="modern-input bordered-input"
                                    placeholder="Enter your name"
                                    value={formData.displayName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modern-form-group">
                            <label className="input-label">WhatsApp / Phone</label>
                            <div className="modern-input-wrapper">
                                <Phone size={18} className="modern-input-icon" />
                                <input
                                    type="tel"
                                    name="phone"
                                    className="modern-input bordered-input"
                                    placeholder="Order updates on this number"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modern-form-group">
                        <label className="input-label">Email Address</label>
                        <div className="modern-input-wrapper disabled-wrapper">
                            <Mail size={18} className="modern-input-icon" />
                            <input
                                type="email"
                                className="modern-input disabled-input"
                                value={user.email}
                                disabled
                            />
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="profile-location-section">
                        <div className="profile-location-header">
                            <h3 className="section-title">Shipping Location</h3>
                            <button
                                type="button"
                                onClick={detectLocation}
                                className="detect-location-btn"
                            >
                                <Navigation size={14} /> Detect Current
                            </button>
                        </div>

                        <div className="shipping-fields-grid">
                            <div className="modern-form-group full-width">
                                <label className="input-label">Detailed Address</label>
                                <div className="modern-input-wrapper">
                                    <MapPin size={18} className="modern-input-icon" />
                                    <input
                                        type="text"
                                        name="address"
                                        className="modern-input bordered-input"
                                        placeholder="Street name, House/Flat No, Landmark"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="shipping-sub-fields-grid">
                                <div className="modern-form-group">
                                    <label className="input-label">City / Town</label>
                                    <input
                                        type="text"
                                        name="city"
                                        className="modern-input bordered-input no-icon"
                                        placeholder="Your City"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="modern-form-group">
                                    <label className="input-label">State / Region</label>
                                    <input
                                        type="text"
                                        name="state"
                                        className="modern-input bordered-input no-icon"
                                        placeholder="Your State"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="modern-form-group">
                                    <label className="input-label">Pincode / Zip</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        className="modern-input bordered-input no-icon"
                                        placeholder="Area Pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn-modern profile-save-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? <div className="loading-spinner-sm"></div> : (
                            <div className="btn-content">
                                <Save size={20} /> Save My Profile
                            </div>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
