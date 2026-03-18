'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Linkedin, Twitter, CheckCircle, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../src/styles/Contact.css';
import toast from 'react-hot-toast';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function ContactPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setShowSuccess(true);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    subject: 'General Inquiry',
                    message: ''
                });
                setTimeout(() => setShowSuccess(false), 5000);
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Error submitting form. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-page-wrapper">
            <div style={{
                position: 'absolute',
                top: '110px',
                left: '5%',
                zIndex: 20
            }}>
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
                    className="desktop-only-back-btn"
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
                        transition: 'all 0.3s ease'
                    }}
                    whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                    onClick={() => {
                        if (window.history.length > 2) {
                            router.back();
                        } else {
                            router.push('/');
                        }
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </motion.button>
            </div>

            {/* --- Hero Section --- */}
            <section className="contact-hero" style={{ 
                backgroundImage: 'url("https://res.cloudinary.com/dmw5efwf5/image/upload/v1773650440/ambre-candles/Favourites/tdboywkhdakz8slsmk1t.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="contact-hero-overlay" style={{ background: 'rgba(0,0,0,0.5)' }}></div>

                <div className="contact-hero-content">
                    <motion.div
                        initial={false}
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.span variants={fadeInUp} className="contact-badge" style={{ marginTop: '10px' }}>
                            Get In Touch
                        </motion.span>
                        <motion.h1 variants={fadeInUp} className="contact-title">
                            Let's Illuminate <br />
                            <span style={{ color: '#d4af37', fontStyle: 'italic' }}>Your Inquiries.</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="contact-subtitle">
                            We are here to assist you with order inquiries, collaborations, or simply to chat about scents.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* --- Main Content Section --- */}
            <section className="contact-main">
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div className="contact-grid">

                        {/* Left Side: Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="contact-info-card"
                        >
                            <div className="contact-info-glow"></div>

                            <h2 className="contact-info-title">
                                Contact Information
                                <div className="contact-info-line"></div>
                            </h2>

                            <div className="contact-info-list">
                                <div className="info-item">
                                    <div className="info-icon-box" style={{ background: 'rgba(234, 67, 53, 0.1)', borderColor: 'rgba(234, 67, 53, 0.3)' }}>
                                        <Mail size={20} color="#EA4335" />
                                    </div>
                                    <div className="info-content">
                                        <h4 className="info-label">Email Us</h4>
                                        <a href="mailto:ambrecandle@gmail.com" className="info-link">
                                            ambrecandle@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon-box" style={{ background: 'rgba(52, 183, 241, 0.1)', borderColor: 'rgba(52, 183, 241, 0.3)' }}>
                                        <Phone size={20} color="#34B7F1" />
                                    </div>
                                    <div className="info-content">
                                        <h4 className="info-label">Call Us</h4>
                                        <a href="tel:+918577079877" className="info-link">
                                            +91 85770 79877
                                        </a>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon-box" style={{ background: 'rgba(37, 211, 102, 0.1)', borderColor: 'rgba(37, 211, 102, 0.3)' }}>
                                        <MessageCircle size={20} color="#25D366" />
                                    </div>
                                    <div className="info-content">
                                        <h4 className="info-label">WhatsApp</h4>
                                        <a href="https://api.whatsapp.com/send?phone=918577079877" target="_blank" rel="noopener noreferrer" className="info-link">
                                            Chat with us
                                        </a>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon-box" style={{ background: 'rgba(255, 75, 43, 0.1)', borderColor: 'rgba(255, 75, 43, 0.3)' }}>
                                        <MapPin size={20} color="#FF4B2B" />
                                    </div>
                                    <div className="info-content">
                                        <h4 className="info-label">Visit Us</h4>
                                        <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#d1d5db' }}>
                                            Delhi, Delhi NCR, Lucknow<br />India
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="social-section" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
                                <h4 className="info-label" style={{ marginBottom: '20px', color: '#d4af37', fontWeight: 'bold' }}>Follow Us</h4>
                                <div className="social-icons-container" style={{ display: 'flex', gap: '20px' }}>
                                    {[
                                        { Icon: Instagram, link: 'https://www.instagram.com/candleambre/', label: 'Instagram', color: '#E4405F' },
                                        { Icon: Facebook, link: 'https://www.facebook.com/share/1Cgib9LvU7/', label: 'Facebook', color: '#1877F2' },
                                        { Icon: Twitter, link: '#', label: 'Twitter', color: '#1DA1F2' },
                                        { Icon: Linkedin, link: '#', label: 'LinkedIn', color: '#0A66C2' }
                                    ].map(({ Icon, link, label, color }) => (
                                        <motion.a
                                            key={label}
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-icon-link"
                                            whileHover={{ y: -5, color: '#fff', backgroundColor: color, borderColor: color, boxShadow: `0 10px 20px -5px ${color}60` }}
                                            whileTap={{ scale: 0.9 }}
                                            style={{
                                                width: '45px',
                                                height: '45px',
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.05)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: color,
                                                border: `2px solid ${color}40`,
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <Icon size={20} />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side: Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="contact-form-card"
                        >
                            <h2 className="form-title">Send a Message</h2>
                            <p className="form-subtitle">We typically reply within 24 hours.</p>

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name *</label>
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className="form-input" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="form-input" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email Address *</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="form-input" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Subject</label>
                                        <select name="subject" value={formData.subject} onChange={handleChange} className="form-input">
                                            <option>General Inquiry</option>
                                            <option>Wholesale Orders</option>
                                            <option>Order Support</option>
                                            <option>Collaborations</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Message *</label>
                                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="How can we help you?" className="form-input" style={{ minHeight: '150px', resize: 'vertical' }} required></textarea>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="contact-send-button"
                                    style={{
                                        width: '100%', 
                                        padding: '20px', 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        fontSize: '1rem', 
                                        fontWeight: '700', 
                                        letterSpacing: '2px', 
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '12px', 
                                        marginTop: 'auto', 
                                        transition: 'all 0.3s ease',
                                        textTransform: 'uppercase'
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isSubmitting ? (
                                        <>SENDING... <Sparkles size={18} className="spin" /></>
                                    ) : (
                                        <>SEND MESSAGE <Send size={20} /></>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-backdrop"
                        onClick={() => setShowSuccess(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                                <CheckCircle size={64} color="#d4af37" style={{ marginBottom: '20px' }} />
                            </motion.div>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '15px' }}>Message Sent!</h3>
                            <p style={{ color: '#666', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>
                                Thank you for reaching out. We'll get back to you within 24 hours.
                            </p>
                            <button
                                onClick={() => setShowSuccess(false)}
                                style={{ background: '#1b1f1c', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '50px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', letterSpacing: '1px' }}
                            >
                                CLOSE
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
