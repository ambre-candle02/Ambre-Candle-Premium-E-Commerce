'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Linkedin, Twitter, CheckCircle, Sparkles, MessageCircle } from 'lucide-react';
import '../../src/styles/Contact.css';

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
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-page-wrapper" suppressHydrationWarning>

            {/* --- Hero Section --- */}
            <section className="contact-hero">
                <div className="contact-hero-overlay"></div>

                <div className="contact-hero-content">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.span variants={fadeInUp} className="contact-badge">
                            Get In Touch
                        </motion.span>
                        <motion.h1 variants={fadeInUp} className="contact-title">
                            Let's Illuminate <br />
                            <span style={{ color: '#d4af37', fontStyle: 'italic' }}>Your Queries.</span>
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
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
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
                                    <div className="info-icon-box">
                                        <Mail size={20} color="#d4af37" />
                                    </div>
                                    <div className="info-content">
                                        <h4 className="info-label">Email Us</h4>
                                        <a href="mailto:ambrecandle@gmail.com" className="info-link">
                                            ambrecandle@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon-box">
                                        <Phone size={20} color="#d4af37" />
                                    </div>
                                    <div className="info-content">
                                        <h4 className="info-label">Call Us</h4>
                                        <a href="tel:+918577079877" className="info-link">
                                            +91 85770 79877
                                        </a>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon-box">
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
                                    <div className="info-icon-box">
                                        <MapPin size={20} color="#d4af37" />
                                    </div>
                                    <div className="info-content">
                                        <h4 className="info-label">Visit Us</h4>
                                        <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#d1d5db' }}>
                                            Delhi, Delhi NCR, Lucknow<br />India
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="social-section">
                                <h4 className="info-label" style={{ marginBottom: '20px' }}>Follow Us</h4>
                                <div className="social-icons-container">
                                    <a href="https://www.instagram.com/candleambre?igsh=cmM3MDR2dndocWEx&utm_source=qr" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Instagram">
                                        <Instagram size={22} />
                                    </a>
                                    <a href="https://www.facebook.com/share/1Cgib9LvU7/" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Facebook">
                                        <Facebook size={22} />
                                    </a>
                                    <a href="#" className="social-icon-link" aria-label="LinkedIn">
                                        <Linkedin size={22} />
                                    </a>
                                    <a href="#" className="social-icon-link" aria-label="Twitter">
                                        <Twitter size={22} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side: Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
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
                                        width: '100%', padding: '18px', borderRadius: '50px', border: 'none', fontSize: '0.95rem', fontWeight: '600', letterSpacing: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px', transition: 'all 0.3s ease'
                                    }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    {isSubmitting ? (
                                        <>SENDING... <Sparkles size={18} className="spin" /></>
                                    ) : (
                                        <>SEND MESSAGE <Send size={18} /></>
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
