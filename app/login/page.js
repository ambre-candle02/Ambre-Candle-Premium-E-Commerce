'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '../admin/actions';
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
            // Priority 1: Try admin login first (server action validates credentials securely)
            const res = await loginAdmin(formData.email, formData.password);
            if (res.success) {
                localStorage.setItem('ambre_admin_session', 'true');
                const { toast } = await import('react-hot-toast');
                toast.success("Welcome, Administrator! 🛡️");
                router.push('/admin');
                return;
            }

            // Priority 2: Standard Firebase user login
            await login(formData.email, formData.password);
            const { toast } = await import('react-hot-toast');
            toast.success("Login successful!");
            router.push('/');
        } catch (error) {
            let msg = "Failed to login.";
            if (error.code === 'auth/invalid-credential') msg = "Invalid email or password.";
            else if (error.code === 'auth/user-not-found') msg = "No user found with this email.";
            else if (error.code === 'auth/wrong-password') msg = "Incorrect password.";

            import('react-hot-toast').then(({ toast }) => toast.error(msg));
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
                        src="https://res.cloudinary.com/dmw5efwf5/image/upload/f_auto,q_auto,w_800/v1773865296/ambre-candles/Favourites/mq7qrzsp1yhnpyrtwinw.png"
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
                    <Link href="/" className="desktop-only-back-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '30px', color: '#1a1a1a', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', transition: 'all 0.3s ease' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', paddingRight: '2px' }}>
                            <ArrowLeft size={16} style={{ marginLeft: '1px' }} />
                        </div>
                        <span style={{ paddingTop: '1px' }}>Back to Home</span>
                    </Link>
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
                                    type="text"
                                    inputMode="email"
                                    autoComplete="username"
                                    className="modern-input"
                                    placeholder="Email or Username"
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
                            whileTap={{ scale: 0.96 }}
                            type="submit"
                            className="btn-modern"
                            disabled={isLoading}
                        >
                            {isLoading ? <div className="auth-loader"></div> : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                                    <span>Log In</span>
                                    <ArrowRight size={20} />
                                </div>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
