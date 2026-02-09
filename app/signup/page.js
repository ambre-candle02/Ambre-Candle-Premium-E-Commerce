'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Phone, Sparkles } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const { signup } = useAuth();
    const router = useRouter();

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [serverOtp, setServerOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/auth/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone })
            });

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (pErr) {
                console.error("JSON Parse Error. Raw response:", responseText);
                alert("Server returned invalid data format. Please check console or try again.");
                setLoading(false);
                return;
            }

            if (data.success) {
                setServerOtp(data.otp);
                setOtpSent(true);
                alert(`DEMO MODE: OTP for ${formData.phone} is [ ${data.otp} ]. Please enter this code to verify.`);
            } else {
                alert("Failed to send OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Error sending OTP. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndSignup = (e) => {
        e.preventDefault();
        if (otp === serverOtp) {
            signup({ name: formData.name, email: formData.email, phone: formData.phone });
            router.push('/');
        } else {
            alert("Invalid OTP. Please try again.");
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

                <motion.img
                    src="/images/sacred-garden-opt.png"
                    alt="Ambre Candle Collection"
                    className="auth-visual-image"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                />

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

                    <form onSubmit={otpSent ? handleVerifyAndSignup : handleSendOtp}>
                        {!otpSent && (
                            <>
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
                                            type="password"
                                            className="modern-input"
                                            placeholder="Create Password"
                                            required
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <AnimatePresence>
                            {otpSent && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="otp-group"
                                >
                                    <label className="otp-label">
                                        Enter 6-digit Code sent to <b>{formData.phone}</b>
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="• • • • • •"
                                        maxLength={6}
                                        className="otp-input"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            className="btn-modern"
                            disabled={loading}
                            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? (
                                <div className="loading-spinner-sm"></div>
                            ) : (
                                <>
                                    {otpSent ? 'Confirm & Sign Up' : 'Get Verification Code'}
                                    {!loading && <ArrowRight size={20} />}
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
