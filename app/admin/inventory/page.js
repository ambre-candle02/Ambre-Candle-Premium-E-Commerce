'use client';
import { motion } from 'framer-motion';
import { Package, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '@/src/styles/Admin.css';

export default function InventoryHubPage() {
    const router = useRouter();

    return (
        <div className="admin-main-container">
            <header style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d4af37', marginBottom: '8px' }}>
                    <Sparkles size={24} />
                    <span style={{ fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '0.75rem' }}>Resource Management</span>
                </div>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0 }}>Inventory Hub</h1>
                <p style={{ color: '#666', fontSize: '1rem', marginTop: '5px' }}>Manage your product catalog and keep your cloud database in sync.</p>
            </header>

            <div className="admin-tools-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <motion.div
                    className="admin-tool-card"
                    style={{ padding: '30px', background: '#fff', borderRadius: '24px', border: '2px solid #d4af37' }}
                    onClick={() => router.push('/admin/add-product')}
                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.05)' }}
                >
                    <div style={{
                        width: '50px', height: '50px', background: 'rgba(212,175,55,0.1)',
                        borderRadius: '15px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#d4af37', marginBottom: '20px'
                    }}>
                        <Package size={28} />
                    </div>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Catalog Manager</h2>
                    <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.5', marginBottom: '25px' }}>
                        Add new products instantly. Upload images, set prices, and write descriptions.
                    </p>
                    <button className="admin-btn-tool admin-btn-plus" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '0.95rem', background: '#d4af37' }}>
                        Add New Product <ArrowRight size={16} />
                    </button>
                </motion.div>

                <motion.div
                    className="admin-tool-card"
                    style={{ padding: '30px', background: '#fff', borderRadius: '24px', border: '2px solid #d4af37' }}
                    onClick={() => router.push('/admin/migrate')}
                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.05)' }}
                >
                    <div style={{
                        width: '50px', height: '50px', background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '15px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#10b981', marginBottom: '20px'
                    }}>
                        <RefreshCw size={28} />
                    </div>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Cloud Sync</h2>
                    <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.5', marginBottom: '25px' }}>
                        Sync local products with Firestore database. Bulk update data.
                    </p>
                    <button className="admin-btn-tool admin-btn-sync" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '0.95rem', background: '#10b981' }}>
                        Run Migration <ArrowRight size={16} />
                    </button>
                </motion.div>
            </div>

            {/* Status Info Section */}
            <div style={{ marginTop: '40px', padding: '30px', background: '#1a1a1a', borderRadius: '24px', color: '#fff', border: '2px solid #d4af37' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '5px', color: '#d4af37' }}>System Health</h3>
                        <p style={{ color: '#aaa', margin: 0, fontSize: '0.9rem' }}>All services operational.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '40px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Active</div>
                            <div style={{ color: '#d4af37', fontSize: '0.7rem', textTransform: 'uppercase' }}>Status</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>180+</div>
                            <div style={{ color: '#d4af37', fontSize: '0.7rem', textTransform: 'uppercase' }}>Products</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
