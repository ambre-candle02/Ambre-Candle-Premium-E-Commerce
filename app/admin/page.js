'use client';
import { useState, useEffect } from 'react';
import Orders from '@/src/components/admin/Orders';
import Analytics from '@/src/components/admin/Analytics';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    return (
        <div className="admin-core-shell">
            <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="core-container"
            >
                {/* 1. SLIM HEADER */}
                <header className="core-header">
                    <div className="h-left">
                        <span className="live-orb"></span>
                        <h1>Command Dashboard</h1>
                        <p>Artisanal Metrics & Logistics Control Center</p>
                    </div>
                    <div className="h-right">
                        <span className="badge">ADMIN MASTER</span>
                    </div>
                </header>

                {/* 2. ANALYTICS RIBBON */}
                <section className="core-analytics-ribbon">
                    <Analytics />
                </section>

                {/* 3. OPERATIONS HUB (NATURAL SCROLLING) */}
                <section className="core-operations-hub">
                    <Orders />
                </section>
            </motion.div>

            <style jsx>{`
                .admin-core-shell {
                    min-height: 100vh;
                    width: 100%;
                    overflow-x: hidden;
                    overflow-y: auto; /* NATURAL PAGE SCROLLING ACTIVATED */
                    background: #fdfdfd;
                    padding: 0;
                    margin: 0;
                }

                .core-container {
                    width: 98%; 
                    max-width: 1250px;
                    margin: 0 0 0 20px; 
                    display: flex;
                    flex-direction: column;
                    padding: 30px 40px 100px 0; /* Extra bottom padding for scroll comfort */
                }

                .core-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 30px;
                }
                .h-left { display: flex; flex-direction: column; }
                .h-left h1 { font-family: var(--font-heading); font-size: 2.1rem; font-weight: 850; color: #111; margin: 0; letter-spacing: -1.5px; }
                .h-left p { font-size: 0.95rem; color: #888; font-weight: 600; margin-top: 5px; }
                .live-orb { width: 8px; height: 8px; background: #d4af37; border-radius: 50%; margin-bottom: 10px; box-shadow: 0 0 10px rgba(212,175,55,0.5); }
                
                .badge { font-size: 0.7rem; font-weight: 850; letter-spacing: 2px; color: #d4af37; background: rgba(212,175,55,0.08); padding: 6px 14px; border-radius: 50px; }

                .core-analytics-ribbon {
                    margin-bottom: 40px;
                }

                .core-operations-hub {
                    width: 100%;
                }
            `}</style>
        </div>
    );
}
