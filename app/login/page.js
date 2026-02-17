'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '@/src/styles/AuthModern.css';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(formData.email, formData.password);
            router.push('/');
        } catch (error) {
            console.error("Login Error:", error);
            let msg = "Failed to login.";
            if (error.code === 'auth/invalid-credential') msg = "Invalid email or password.";
            if (error.code === 'auth/user-not-found') msg = "No user found with this email.";
            if (error.code === 'auth/wrong-password') msg = "Incorrect password.";
            alert(msg);
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
            {/* Left Panel - Visual (Wax Candle) */}
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
                        src="https://res.cloudinary.com/dmw5efwf5/image/upload/v1770878558/ambre-candles/Favourites/bl89eoniobqjdyhnri2g.jpg"
                        alt="Ambre Lux Collection"
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
                    <h2 className="auth-visual-heading">Artisan Essence.</h2>
                    <p className="auth-visual-subtext">Discover the warmth of handcrafted luxury.</p>
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
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">
                            New here? <Link href="/signup">Create an account</Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
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
                                <Lock size={18} className="modern-input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="modern-input"
                                    placeholder="Password"
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

                        <div className="auth-actions">
                            <label className="auth-remember">
                                <input type="checkbox" style={{ accentColor: '#d4af37' }} /> Remember me
                            </label>
                            <Link href="/forgot-password" className="auth-forgot">Forgot Password?</Link>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="btn-modern"
                            disabled={isLoading}
                        >
                            {isLoading ? <div className="loading-spinner-sm"></div> : (
                                <>
                                    Log In
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
