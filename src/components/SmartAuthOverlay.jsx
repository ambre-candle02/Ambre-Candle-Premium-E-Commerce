'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const INTERVAL_MS = 60000; // 1 minute between re-appearances
const INITIAL_DELAY_MS = 10000; // Wait 10s before first show
const PAGE_CHANGE_DELAY_MS = 5000; // 5s delay on page change

// Pages where the overlay should NEVER appear
const EXCLUDED_PAGES = ['/login', '/signup', '/forgot-password', '/admin', '/quiz'];

const SmartAuthOverlay = () => {
    const { user, loading } = useAuth(); // Now using 'loading'
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

    // Refs to manage timers
    const intervalRef = useRef(null);
    const timerRef = useRef(null);
    const lastPathname = useRef(pathname);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const dismissed = localStorage.getItem('ambre_auth_dismissed');
            if (dismissed === 'true') {
                setHasBeenDismissed(true);
            }
        }

        // Wait until firebase auth check completes
        if (loading) return;

        // If logged in, on an auth/admin page, or already dismissed → clear everything and hide
        const isExcluded = EXCLUDED_PAGES.some(p => pathname?.startsWith(p));
        if (user || isExcluded || hasBeenDismissed) {
            setIsVisible(false);
            clearTimeout(timerRef.current);
            clearInterval(intervalRef.current);
            return;
        }

        // Detect if this is a path change or initial load
        const isPathChange = lastPathname.current !== pathname;
        lastPathname.current = pathname;
        const delay = isPathChange ? PAGE_CHANGE_DELAY_MS : INITIAL_DELAY_MS;

        // Reset timers
        clearTimeout(timerRef.current);
        clearInterval(intervalRef.current);

        // Start the delay timer
        timerRef.current = setTimeout(() => {
            setIsVisible(true);

            // Start recurring interval only after first show
            intervalRef.current = setInterval(() => {
                if (!hasBeenDismissed && !user) {
                    setIsVisible(true);
                }
            }, INTERVAL_MS);

        }, delay);

        return () => {
            clearTimeout(timerRef.current);
            clearInterval(intervalRef.current);
        };
    }, [user, loading, pathname, hasBeenDismissed]);

    const handleDismiss = () => {
        setIsVisible(false);
        setHasBeenDismissed(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('ambre_auth_dismissed', 'true');
        }
        clearTimeout(timerRef.current);
        clearInterval(intervalRef.current);
    };

    // Login/Signup clicked → dismiss overlay
    const handleAuthAction = () => {
        setIsVisible(false);
        setHasBeenDismissed(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('ambre_auth_dismissed', 'true');
        }
        clearTimeout(timerRef.current);
        clearInterval(intervalRef.current);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="overlay-backdrop"
                    className="overlay-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleDismiss}
                >
                    <motion.div
                        key="auth-sheet"
                        className="auth-bottom-sheet"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="close-sheet" onClick={handleDismiss} aria-label="Close">
                            <X size={20} />
                        </button>

                        <div className="sheet-content">
                            <div className="sheet-icon">
                                <motion.div
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                >
                                    <UserCheck size={32} />
                                </motion.div>
                            </div>
                            <h3>Join the Ambre Elite</h3>
                            <p>Unlock exclusive festival offers, artisan collection drops, and track your orders seamlessly.</p>

                            <div className="sheet-actions">
                                <Link href="/login" className="btn-primary sheet-btn" onClick={handleAuthAction}>
                                    Log In
                                </Link>
                                <Link href="/signup" className="btn-secondary sheet-btn" onClick={handleAuthAction}>
                                    Sign Up
                                </Link>
                            </div>

                            <div className="sheet-footer">
                                <p>Fast checkout like Flipkart &amp; Myntra ✨</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SmartAuthOverlay;
