'use client';
import ProductManager from '@/src/components/admin/Products';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
    const router = useRouter();

    return (
        <div className="admin-page-container" style={{ paddingTop: '0px', paddingLeft: '20px', paddingRight: '20px' }}>
            <div>
                {/* Dashboard-Ready Action Anchor */}
                <button
                    onClick={() => router.push('/admin')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: '#fff',
                        border: '1.5px solid #d4af37',
                        color: '#d4af37',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginBottom: '20px',
                        marginTop: '-15px', /* SUPER-ELEVATED */
                        padding: '10px 20px',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.1)',
                        zIndex: 100
                    }}
                >
                    <ArrowLeft size={16} /> Dashboard
                </button>

                <div style={{ marginBottom: '25px' }}>
                    <p style={{ color: '#d4af37', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '2px' }}>Operational Suite</p>
                    <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: 'clamp(1.6rem, 6vw, 2.8rem)', margin: 0, whiteSpace: 'nowrap', fontWeight: '850', color: '#1a1a1a', letterSpacing: '-1px' }}>Product Manager</h1>
                </div>

                <ProductManager />
            </div>
        </div>
    );
}
