'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/src/config/firebase';
import { motion } from 'framer-motion';
import { Trash2, MessageSquare, Search, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QueriesAdmin() {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        if (!db) return;
        setLoading(true);
        try {
            const q = query(collection(db, 'support_queries'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQueries(data);
        } catch (error) {
            console.error('Error fetching queries:', error);
            toast.error('Failed to load queries');
        } finally {
            setLoading(false);
        }
    };

    const deleteQuery = async (id) => {
        if (!confirm('Are you sure you want to delete this query?')) return;
        try {
            await deleteDoc(doc(db, 'support_queries', id));
            setQueries(queries.filter(q => q.id !== id));
            toast.success('Query deleted');
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error('Failed to delete query');
        }
    };

    const markAsResolved = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'resolved' ? 'pending' : 'resolved';
            await updateDoc(doc(db, 'support_queries', id), { status: newStatus });
            setQueries(queries.map(q => q.id === id ? { ...q, status: newStatus } : q));
            toast.success(`Query marked as ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredQueries = queries.filter(q => 
        q.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        q.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-main-container">
            <div className="admin-header-v2" style={{ paddingTop: '20px' }}>
                <div className="admin-header-title">
                    <span style={{ color: '#d4af37', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Customer Support</span>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', margin: '5px 0 0' }}>Support Queries</h1>
                </div>
            </div>

            <div className="admin-table-section" style={{ marginTop: '20px' }}>
                <div className="admin-table-header-v2">
                    <h3>Recent Messages</h3>
                    <div className="admin-search-wrapper-v2">
                        <div className="admin-search-input-container">
                            <Search size={18} className="admin-search-icon" style={{ color: '#d4af37' }} />
                            <input
                                className="admin-search-input-v2"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search queries..."
                            />
                        </div>
                    </div>
                </div>

                <div className="admin-table-scroll-container">
                    <table className="admin-orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                <th style={{ padding: '15px' }}>Date</th>
                                <th style={{ padding: '15px' }}>Customer</th>
                                <th style={{ padding: '15px' }}>Subject / Message</th>
                                <th style={{ padding: '15px' }}>Status</th>
                                <th style={{ padding: '15px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading queries...</td></tr>
                            ) : filteredQueries.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No queries found.</td></tr>
                            ) : (
                                filteredQueries.map((q) => (
                                    <tr key={q.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                        <td style={{ padding: '15px' }}>
                                            {q.createdAt?.toDate ? q.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ fontWeight: 'bold' }}>{q.firstName} {q.lastName}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#666' }}>{q.email}</div>
                                        </td>
                                        <td style={{ padding: '15px', maxWidth: '300px' }}>
                                            <div style={{ fontWeight: 'bold', color: '#d4af37', marginBottom: '5px' }}>{q.subject}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                {q.message}
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ 
                                                padding: '4px 8px', 
                                                borderRadius: '4px', 
                                                fontSize: '0.8rem', 
                                                fontWeight: 'bold',
                                                backgroundColor: q.status === 'resolved' ? '#dcfce7' : '#fef9c3',
                                                color: q.status === 'resolved' ? '#166534' : '#854d0e'
                                            }}>
                                                {q.status === 'resolved' ? 'Resolved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => markAsResolved(q.id, q.status)} style={{ background: q.status === 'resolved' ? '#f3f4f6' : '#dcfce7', color: q.status === 'resolved' ? '#4b5563' : '#166534', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <CheckCircle size={14} /> {q.status === 'resolved' ? 'Reopen' : 'Resolve'}
                                                </button>
                                                <button onClick={() => deleteQuery(q.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
