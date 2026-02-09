'use client';
import { useState } from 'react';
import { MessageCircle, X, Phone, Mail, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingHelp() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="help-menu"
                        style={{
                            marginBottom: '20px',
                            background: '#fff',
                            borderRadius: '20px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            padding: '24px',
                            width: '300px',
                            border: '1px solid #f0f0f0'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>Hi there! 👋</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#666' }}>How can we help you today?</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <motion.a
                                href="https://wa.me/918577079877?text=Hello%20Ambre%20Candle!%20I'm%20interested%20in%20your%20luxury%20collections."
                                target="_blank"
                                rel="noopener noreferrer"
                                style={itemStyle}
                                whileHover={{
                                    scale: 1.02,
                                    backgroundColor: 'rgba(139, 101, 8, 0.1)',
                                    borderColor: '#8b6508',
                                    boxShadow: '0 4px 15px rgba(139, 101, 8, 0.2)'
                                }}
                            >
                                <div style={iconBoxStyle('#e3f2fd', '#1565c0')}><MessageCircle size={20} /></div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>WhatsApp Us</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Chat instantly</div>
                                </div>
                            </motion.a>

                            <motion.a
                                href="tel:+918577079877"
                                style={itemStyle}
                                whileHover={{
                                    scale: 1.02,
                                    backgroundColor: 'rgba(139, 101, 8, 0.1)',
                                    borderColor: '#8b6508',
                                    boxShadow: '0 4px 15px rgba(139, 101, 8, 0.2)'
                                }}
                            >
                                <div style={iconBoxStyle('#e8f5e9', '#2e7d32')}><Phone size={20} /></div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Call Support</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>+91 85770 79877</div>
                                </div>
                            </motion.a>

                            <motion.a
                                href="mailto:gautampratibha623@gmail.com"
                                style={itemStyle}
                                whileHover={{
                                    scale: 1.02,
                                    backgroundColor: 'rgba(139, 101, 8, 0.1)',
                                    borderColor: '#8b6508',
                                    boxShadow: '0 4px 15px rgba(139, 101, 8, 0.2)'
                                }}
                            >
                                <div style={iconBoxStyle('#f3e5f5', '#7b1fa2')}><Mail size={20} /></div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Email Us</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>gautampratibha623@gmail.com</div>
                                </div>
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#1a1a1a',
                    color: '#fff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    cursor: 'pointer'
                }}
            >
                {isOpen ? <X size={28} /> : <HelpCircle size={32} />}
            </motion.button>
        </div>
    );
}

const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '12px 16px',
    borderRadius: '16px',
    textDecoration: 'none',
    color: '#1a1a1a',
    background: '#fcfcfc',
    border: '1px solid #eee',
    transition: 'all 0.2s',
};

const iconBoxStyle = (bg, color) => ({
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: bg,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
});
