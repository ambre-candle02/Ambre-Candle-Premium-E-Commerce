'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '@/src/styles/AuthModern.css';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const { signup } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signup(formData.name, formData.email, formData.password);
            // Optionally save phone number to Firestore later, for now we just register Auth
            router.push('/');
        } catch (error) {
            console.error("Signup Error:", error);
            let msg = "Failed to create account.";
            if (error.code === 'auth/email-already-in-use') msg = "Email is already in use.";
            if (error.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    // Animation Variants
    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="auth-split-page">
            {/* Left Panel - Visual (Transparent Candle) */}
            <div className="auth-left-panel">
                <div className="auth-circle-decor circle-1"></div>
                <div className="auth-circle-decor circle-2"></div>

                <motion.div
                    className="auth-visual-wrapper"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{ position: 'relative', height: '100%', width: '100%', borderRadius: '20px', overflow: 'hidden', border: '2px solid #d4af37', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                >
                    <Image
                        src="https://res.cloudinary.com/dmw5efwf5/image/upload/v1770878560/ambre-candles/Favourites/lngfplnzboyv4tyvll8x.jpg"
                        alt="Ambre Candle Collection"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                    />
                </motion.div>

                <motion.div
                    className="auth-visual-text"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <h2 className="auth-visual-heading">Pure Luxury.</h2>
                    <p className="auth-visual-subtext">Hand-poured wax, artisan fragrances, and timeless elegance.</p>
                </motion.div>
            </div>

            {/* Right Panel - Form */}
            <div className="auth-right-panel">
                <motion.div
                    className="auth-form-container"
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                >
                    <div className="auth-header">
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">
                            Already a member? <Link href="/login">Log in here</Link>
                        </p>
                    </div>

                    <form onSubmit={handleSignup}>
                        <div className="modern-form-group">
                            <div className="modern-input-wrapper">
                                <User size={18} className="modern-input-icon" />
                                <input
                                    type="text"
                                    className="modern-input"
                                    placeholder="Full Name"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="modern-form-group">
                            <div className="modern-input-wrapper">
                                <Mail size={18} className="modern-input-icon" />
                                <input
                                    type="email"
                                    className="modern-input"
                                    placeholder="Email Address"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="modern-form-group">
                            <div className="modern-input-wrapper">
                                <Phone size={18} className="modern-input-icon" />
                                <input
                                    type="tel"
                                    className="modern-input"
                                    placeholder="Phone Number"
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="modern-form-group">
                            <div className="modern-input-wrapper">
                                <Lock size={18} className="modern-input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="modern-input"
                                    placeholder="Create Password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="btn-modern"
                            disabled={loading}
                        >
                            {loading ? <div className="loading-spinner-sm"></div> : (
                                <>
                                    Create Account
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
