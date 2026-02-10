'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Linkedin, Twitter, CheckCircle, Sparkles, X, MessageCircle, Clock } from 'lucide-react';
import Image from 'next/image';
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
        <div style={{
            background: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-body)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>

            {/* --- Hero Section --- */}
            <section style={{
                position: 'relative',
                height: '60vh', // Slightly shorter than About Us
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#0a0a0a',
                color: '#fff',
                paddingTop: '160px' // Increased offset for fixed navbar
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, #2a2a2a 0%, #000 100%)',
                    opacity: 0.9,
                    zIndex: 0
                }}></div>
                {/* Optional: Add a subtle background image/pattern here */}

                <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 20px' }}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.span variants={fadeInUp} style={{
                            display: 'inline-block',
                            padding: '8px 24px',
                            borderRadius: '50px',
                            border: '1px solid rgba(212,175,55,0.3)',
                            background: 'rgba(212,175,55,0.1)',
                            color: '#d4af37',
                            letterSpacing: '0.2em',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            marginBottom: '24px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            Get In Touch
                        </motion.span>
                        <motion.h1 variants={fadeInUp} style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                            marginBottom: '24px',
                            lineHeight: '1.2'
                        }}>
                            Let's Illuminate <br />
                            <span style={{ color: '#d4af37', fontStyle: 'italic' }}>Your Queries.</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} style={{
                            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                            color: '#d1d5db',
                            maxWidth: '600px',
                            margin: '0 auto',
                            fontWeight: '300'
                        }}>
                            We are here to assist you with order inquiries, collaborations, or simply to chat about scents.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* --- Main Content Section --- */}
            <section style={{ padding: '80px 0', flex: 1 }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '40px',
                        alignItems: 'start'
                    }}>

                        {/* Left Side: Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{
                                background: '#1b1f1c', // Dark Premium Background
                                color: '#fff',
                                padding: '50px',
                                borderRadius: '30px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Decorative Circle */}
                            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'rgba(212,175,55,0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>

                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '40px', position: 'relative' }}>
                                Contact Information
                                <div style={{ width: '60px', height: '3px', background: '#d4af37', marginTop: '15px' }}></div>
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                {/* Info Item */}
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{
                                        width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <Mail size={20} color="#d4af37" />
                                    </div>
                                    <div>
                                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: '#9ca3af', marginBottom: '8px' }}>Email Us</h4>
                                        <a href="mailto:gautampratibha623@gmail.com" style={{ color: '#fff', fontSize: '1.1rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#fff'}>
                                            gautampratibha623@gmail.com
                                        </a>
                                    </div>
                                </div>

                                {/* Info Item */}
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{
                                        width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <Phone size={20} color="#d4af37" />
                                    </div>
                                    <div>
                                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: '#9ca3af', marginBottom: '8px' }}>Call Us</h4>
                                        <a href="tel:+918577079877" style={{ color: '#fff', fontSize: '1.1rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#fff'}>
                                            +91 85770 79877
                                        </a>
                                    </div>
                                </div>

                                {/* Info Item */}
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{
                                        width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <MessageCircle size={20} color="#25D366" />
                                    </div>
                                    <div>
                                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: '#9ca3af', marginBottom: '8px' }}>WhatsApp</h4>
                                        <a href="https://wa.me/918577079877" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontSize: '1.1rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#fff'}>
                                            Chat with us
                                        </a>
                                    </div>
                                </div>

                                {/* Info Item */}
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{
                                        width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <MapPin size={20} color="#d4af37" />
                                    </div>
                                    <div>
                                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: '#9ca3af', marginBottom: '8px' }}>Visit Us</h4>
                                        <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#d1d5db' }}>
                                            Delhi, Delhi NCR, Lucknow<br />India
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Socials */}
                            <div style={{ marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
                                <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: '#9ca3af', marginBottom: '20px' }}>Follow Us</h4>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <a
                                        href="https://www.instagram.com/ambrecandle"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#9ca3af', transition: 'all 0.3s ease' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#E4405F'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                        aria-label="Instagram"
                                    >
                                        <Instagram size={22} />
                                    </a>
                                    <a
                                        href="https://www.facebook.com/ambrecandle"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#9ca3af', transition: 'all 0.3s ease' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#1877F2'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                        aria-label="Facebook"
                                    >
                                        <Facebook size={22} />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/company/ambrecandle"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#9ca3af', transition: 'all 0.3s ease' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#0A66C2'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                        aria-label="LinkedIn"
                                    >
                                        <Linkedin size={22} />
                                    </a>
                                    <a
                                        href="https://twitter.com/ambrecandle"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#9ca3af', transition: 'all 0.3s ease' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#1DA1F2'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                        aria-label="Twitter"
                                    >
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
                            style={{
                                background: '#fff',
                                padding: '50px',
                                borderRadius: '30px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
                                border: '1px solid #f0f0f0'
                            }}
                        >
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '10px', color: '#1b1f1c' }}>
                                Send a Message
                            </h2>
                            <p style={{ color: '#666', marginBottom: '40px' }}>We typically reply within 24 hours.</p>

                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '25px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={labelStyle}>First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="John"
                                            style={inputStyle}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={labelStyle}>Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            style={inputStyle}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Subject</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        >
                                            <option>General Inquiry</option>
                                            <option>Wholesale Orders</option>
                                            <option>Order Support</option>
                                            <option>Collaborations</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="How can we help you?"
                                        style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }}
                                        required
                                    ></textarea>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="contact-send-button"
                                    style={{
                                        width: '100%',
                                        padding: '18px',
                                        borderRadius: '50px',
                                        background: '#1b1f1c',
                                        color: '#fff',
                                        border: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        letterSpacing: '1px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        marginTop: '10px',
                                        transition: 'background 0.3s ease'
                                    }}
                                    whileHover={{ scale: 1.01, backgroundColor: '#d4af37', color: '#000' }}
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
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10000,
                            backdropFilter: 'blur(5px)'
                        }}
                        onClick={() => setShowSuccess(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            style={{
                                background: '#fff',
                                padding: '50px',
                                borderRadius: '25px',
                                textAlign: 'center',
                                maxWidth: '450px',
                                boxShadow: '0 30px 80px rgba(0,0,0,0.2)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                            >
                                <CheckCircle size={64} color="#d4af37" style={{ marginBottom: '20px' }} />
                            </motion.div>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '15px' }}>Message Sent!</h3>
                            <p style={{ color: '#666', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>
                                Thank you for reaching out. We'll get back to you within 24 hours.
                            </p>
                            <button
                                onClick={() => setShowSuccess(false)}
                                style={{
                                    background: '#1b1f1c',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 30px',
                                    borderRadius: '50px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    letterSpacing: '1px'
                                }}
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

// Reusable Styles
const labelStyle = {
    fontSize: '0.8rem',
    fontWeight: '600',
    marginBottom: '8px',
    display: 'block',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    color: '#1f2937'
};
