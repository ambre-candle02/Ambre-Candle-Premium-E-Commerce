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
            <header className="admin-header-v2">
                <div className="admin-header-title">
                    <span className="section-tag">Customer Support</span>
                    <h1>Support Queries</h1>
                </div>
            </header>

            <div className="admin-table-section">
                <div className="admin-table-header-v2">
                    <div className="header-left">
                        <h3>Recent Messages</h3>
                        <span className="count-badge">{filteredQueries.length} Total</span>
                    </div>
                    <div className="admin-search-wrapper-v2">
                        <div className="admin-search-input-container">
                            <div className="search-icon-wrapper">
                                <Search size={18} />
                            </div>
                            <input
                                className="admin-search-input-v2"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search messages..."
                            />
                        </div>
                    </div>
                </div>

                <div className="admin-table-scroll-container custom-scrollbar">
                    <table className="admin-queries-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Subject / Message</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="status-msg">Loading queries...</td></tr>
                            ) : filteredQueries.length === 0 ? (
                                <tr><td colSpan="5" className="status-msg">No queries found.</td></tr>
                            ) : (
                                filteredQueries.map((q) => (
                                    <tr key={q.id}>
                                        <td>{q.createdAt?.toDate ? q.createdAt.toDate().toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <div className="customer-name">{q.firstName} {q.lastName}</div>
                                            <div className="customer-email">{q.email}</div>
                                        </td>
                                        <td style={{ maxWidth: '300px' }}>
                                            <div className="msg-subject">{q.subject}</div>
                                            <div className="msg-preview">{q.message}</div>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${q.status === 'resolved' ? 'resolved' : 'pending'}`}>
                                                {q.status === 'resolved' ? 'Resolved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div className="action-buttons">
                                                <button onClick={() => markAsResolved(q.id, q.status)} className={`btn-action ${q.status === 'resolved' ? 'reopen' : 'resolve'}`}>
                                                    <CheckCircle size={14} /> {q.status === 'resolved' ? 'Reopen' : 'Resolve'}
                                                </button>
                                                <button onClick={() => deleteQuery(q.id)} className="btn-action btn-delete">
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

            <style jsx>{`
                .admin-main-container {
                    padding: 2rem;
                    background: #f8fafc;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                }
                .admin-header-v2 { padding: 20px 0; margin-bottom: 5px; }
                .section-tag { color: #d4af37; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; font-size: 0.75rem; display: block; }
                .admin-header-title h1 { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: #1e293b; margin: 5px 0 0; }
                
                .admin-table-section {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
                    height: calc(100vh - 220px);
                    display: flex;
                    flex-direction: column;
                }
                .admin-table-header-v2 {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #f1f5f9;
                    padding-bottom: 15px;
                }
                .header-left h3 { margin: 0; font-size: 1.2rem; color: #1e293b; }
                .count-badge { font-size: 0.75rem; background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 10px; margin-top: 4px; display: inline-block; }
                
                .admin-search-input-container { position: relative; width: 300px; }
                .search-icon-wrapper { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; z-index: 10; }
                .admin-search-input-v2 { width: 100%; padding: 0.6rem 1rem 0.6rem 2.5rem; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; }
                
                .admin-table-scroll-container { flex: 1; overflow-y: auto; overflow-x: hidden; }
                .admin-queries-table { width: 100%; border-collapse: separate; border-spacing: 0; }
                .admin-queries-table thead th { position: sticky; top: 0; background: #fff; padding: 12px; font-size: 0.75rem; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; z-index: 20; text-align: left; }
                .admin-queries-table tbody td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
                
                .customer-name { font-weight: 600; color: #1e293b; }
                .customer-email { font-size: 0.8rem; color: #94a3b8; }
                .msg-subject { font-weight: 600; color: #d4af37; margin-bottom: 3px; }
                .msg-preview { font-size: 0.85rem; color: #475569; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                
                .status-pill { font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }
                .status-pill.pending { background: #fef9c3; color: #854d0e; }
                .status-pill.resolved { background: #dcfce7; color: #166534; }
                
                .action-buttons { display: flex; gap: 8px; justify-content: flex-end; }
                .btn-action { border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; display: flex; alignItems: center; gap: 5px; font-size: 0.8rem; font-weight: 500; transition: 0.2s; }
                .resolve { background: #dcfce7; color: #166534; }
                .reopen { background: #f1f5f9; color: #475569; }
                .btn-delete { background: #fee2e2; color: #dc2626; }
                
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                .status-msg { padding: 40px; text-align: center; color: #64748b; font-style: italic; }
            `}</style>
        </div>
    );
}
