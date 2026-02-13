'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

const SmartAuthOverlay = () => {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Auth monitoring logic
    }, [user]);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('ambre_auth_prompt_seen', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="overlay-backdrop">
            <AnimatePresence>
                <motion.div
                    key="auth-sheet"
                    className="auth-bottom-sheet"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                >
                    <button className="close-sheet" onClick={handleDismiss}><X size={20} /></button>

                    <div className="sheet-content">
                        <div className="sheet-icon">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <UserCheck size={32} />
                            </motion.div>
                        </div>
                        <h3>Join the Ambre Elite</h3>
                        <p>Unlock exclusive festival offers, artisan collection drops, and track your orders seamlessly.</p>

                        <div className="sheet-actions">
                            <Link href="/login" className="btn-primary sheet-btn" onClick={handleDismiss}>
                                Log In
                            </Link>
                            <Link href="/signup" className="btn-secondary sheet-btn" onClick={handleDismiss}>
                                Sign Up
                            </Link>
                        </div>

                        <div className="sheet-footer">
                            <p>Fast checkout like Flipkart & Myntra ✨</p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <style jsx>{`
                .overlay-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.4);
                    z-index: 9999;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    backdrop-filter: blur(4px);
                }
                .auth-bottom-sheet {
                    background: #fff;
                    width: 100%;
                    max-width: 500px;
                    padding: 40px 30px;
                    border-radius: 30px 30px 0 0;
                    position: relative;
                }
                .close-sheet {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: #f5f5f5;
                    padding: 8px;
                    border-radius: 50%;
                }
                .sheet-content {
                    text-align: center;
                }
                .sheet-icon {
                    color: var(--color-accent);
                    margin-bottom: 20px;
                }
                .sheet-content h3 {
                    font-size: 1.5rem;
                    margin-bottom: 10px;
                    font-weight: 700;
                }
                .sheet-content p {
                    color: #666;
                    font-size: 0.95rem;
                    margin-bottom: 30px;
                }
                .sheet-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .sheet-btn {
                    width: 100% !important;
                    text-align: center;
                    padding: 16px !important;
                    border-radius: 12px !important;
                }
                .sheet-footer {
                    margin-top: 20px;
                    font-size: 0.75rem;
                    color: #999;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default SmartAuthOverlay;
