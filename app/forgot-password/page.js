'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { auth } from '@/src/config/firebase'; // Direct import since we need specific auth function
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';
import '@/src/styles/AuthModern.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess(true);
        } catch (error) {
            console.error("Reset Password Error:", error);
            let msg = "Failed to send reset email.";
            if (error.code === 'auth/user-not-found') msg = "No account found with this email.";
            if (error.code === 'auth/invalid-email') msg = "Invalid email address.";
            setError(msg); // Set error message to be displayed
        } finally {
            setIsLoading(false);
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    if (!mounted) return <div style={{ minHeight: '100vh', background: '#fff' }}></div>;

    return (
        <div className="auth-split-page">
            {/* Left Panel - Visual */}
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
                        src="https://res.cloudinary.com/dmw5efwf5/image/upload/v1770837011/ambre-candles/Diwali/qd1oi1jxl44g0fiu9dny.jpg"
                        alt="Restoration"
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
                    <h2 className="auth-visual-heading">Renewal.</h2>
                    <p className="auth-visual-subtext">Restore access to your sanctuary.</p>
                </motion.div>
            </div>

            {/* Right Panel - Form */}
            <div className="auth-right-panel">
                <Link href="/login" className="admin-desktop-back-btn" style={{ top: '30px', left: '30px' }}>
                    <div className="back-btn-circle" title="Back to Login">
                        <ArrowLeft size={24} />
                    </div>
                </Link>

                <motion.div
                    className="auth-form-container"
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                >
                    <div className="auth-header" style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%',
                            background: 'rgba(212, 175, 55, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px', color: '#d4af37'
                        }}>
                            <Mail size={28} />
                        </div>
                        <h1 className="auth-title">Forgot Password?</h1>
                        <p className="auth-subtitle">
                            Enter your email and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {success ? (
                        <div className="success-message-box" style={{ textAlign: 'center' }}>
                            <div style={{
                                background: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                padding: '20px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                color: '#166534',
                                marginBottom: '20px'
                            }}>
                                <CheckCircle size={40} style={{ marginBottom: '10px', display: 'inline-block' }} />
                                <h3 style={{ margin: '0 0 5px', fontSize: '1.1rem' }}>Email Sent!</h3>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>Check your inbox for password reset instructions.</p>
                            </div>
                            <Link href="/login" className="btn-modern" style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div style={{
                                    background: '#fee2e2', color: '#991b1b', padding: '10px',
                                    borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center'
                                }}>
                                    {error}
                                </div>
                            )}
                            <div className="modern-form-group">
                                <div className="modern-input-wrapper">
                                    <Mail size={18} className="modern-input-icon" />
                                    <input
                                        type="email"
                                        className="modern-input"
                                        placeholder="Enter your email address"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        style={{ paddingLeft: '45px' }}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="btn-modern"
                                disabled={isLoading}
                                style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                            >
                                {isLoading ? <div className="loading-spinner-sm"></div> : (
                                    <>
                                        Send Reset Link
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </motion.button>
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <Link href="/login" className="auth-forgot" style={{ fontSize: '0.9rem' }}>
                                    Return to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
