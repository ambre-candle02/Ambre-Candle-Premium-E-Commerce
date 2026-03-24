'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/src/config/firebase';
import { 
    Trash2, Search, Download, Users, Mail, Clock, 
    ShieldAlert, ChevronLeft, ChevronRight, UserCheck, Activity, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SubscribersAdmin() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        const fetchSubscribers = async () => {
            if (!db) return;
            setLoading(true);
            try {
                const q = query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc'));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSubscribers(data);
            } catch (error) {
                console.error('Error fetching subscribers:', error);
                toast.error('Secure Database Error.');
            } finally {
                setLoading(false);
            }
        };
        fetchSubscribers();
    }, []);

    const deleteSubscriber = async (id) => {
        if (!window.confirm('IRREVERSIBLE ACTION: Destory this subscriber record?')) return;
        try {
            await deleteDoc(doc(db, 'subscribers', id));
            setSubscribers(subscribers.filter(s => s.id !== id));
            toast.success('Member Revoked Successfully');
        } catch (error) {
            toast.error('Security Protocol Failed');
        }
    };

    const exportToCSV = () => {
        if (subscribers.length === 0) return;
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Email,Date Joined\n"
            + subscribers.map(s => `${s.email},${s.subscribedAt?.toDate ? s.subscribedAt.toDate().toLocaleDateString() : 'N/A'}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Ambre_Circle_Data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredSubscribers = subscribers.filter(s => 
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSubscribers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);

    return (
        <div className="subscribers-admin-container">
            <header className="admin-header">
                <div className="header-title">
                    <div className="accent-bar"></div>
                    <span className="section-tag">Management Console</span>
                    <h1>Subscribers</h1>
                </div>

                <button onClick={exportToCSV} className="export-btn">
                    <Download size={18} />
                    <span>Export CSV</span>
                </button>
            </header>

            <div className="stats-grid">
                <div className="stat-glass-card">
                    <div className="stat-icon-wrapper users"><Users size={24} /></div>
                    <div className="stat-content">
                        <label>Total Subscribers</label>
                        <span className="stat-value">{subscribers.length}</span>
                    </div>
                </div>
                <div className="stat-glass-card">
                    <div className="stat-icon-wrapper growth"><Activity size={24} /></div>
                    <div className="stat-content">
                        <label>Recent Growth</label>
                        <span className="stat-value">+{subscribers.filter(s => (Date.now() - (s.subscribedAt?.toMillis() || 0)) < 86400000).length}</span>
                    </div>
                </div>
                <div className="stat-glass-card">
                    <div className="stat-icon-wrapper search"><Search size={24} /></div>
                    <div className="stat-content">
                        <label>Search Matches</label>
                        <span className="stat-value">{searchTerm ? filteredSubscribers.length : subscribers.length}</span>
                    </div>
                </div>
            </div>

            <main className="content-container">
                <div className="search-bar-wrapper">
                    <div className="search-input-inner">
                        <div className="search-icon-wrapper">
                            <Search size={20} />
                        </div>
                        <input 
                            value={searchTerm}
                            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            placeholder="Search by email address..."
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="clear-search">×</button>
                        )}
                    </div>
                </div>

                <div className="table-wrapper">
                    <div className="table-scroll-area">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentPage + searchTerm}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className="th-content">
                                                <Mail size={14} />
                                                <span>Subscriber Email</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="th-content">
                                                <Clock size={14} />
                                                <span>Subscription Date</span>
                                            </div>
                                        </th>
                                        <th className="align-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="3" className="status-cell">Loading subscribers...</td></tr>
                                    ) : currentItems.length === 0 ? (
                                        <tr><td colSpan="3" className="status-cell">No subscribers found in database.</td></tr>
                                    ) : (
                                        currentItems.map((s, idx) => (
                                            <tr key={s.id} className="table-row" style={{ animationDelay: `${idx * 0.05}s` }}>
                                                <td className="email-cell">{s.email}</td>
                                                <td className="date-cell">
                                                    {s.subscribedAt?.toDate ? s.subscribedAt.toDate().toLocaleDateString('en-GB', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    }) : 'N/A'}
                                                </td>
                                                <td className="action-cell">
                                                    <button onClick={() => deleteSubscriber(s.id)} className="delete-btn" title="Remove Subscriber">
                                                        <Trash2 size={16} />
                                                        <span>Remove</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </motion.div>
                    </AnimatePresence>
                    </div>

                    {totalPages > 1 && (
                        <footer className="pagination-footer">
                            <div className="pagination-info">
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSubscribers.length)} of {filteredSubscribers.length}
                            </div>
                            <div className="pagination-controls">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-nav">
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="p-numbers">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setCurrentPage(i + 1)} 
                                            className={`p-num ${currentPage === i + 1 ? 'active' : ''}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-nav">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </footer>
                    )}
                </div>
            </main>

            <style jsx>{`
                .subscribers-admin-container {
                    padding: 8px 40px 40px 40px;
                    background: #f8fafc;
                    min-height: 100vh;
                    font-family: 'Outfit', 'Inter', sans-serif;
                    color: #1e293b;
                }
                
                .admin-header {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: flex-start !important;
                    margin-bottom: 25px;
                    width: 100% !important;
                }

                .header-title {
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                }

                .accent-bar {
                    width: 40px;
                    height: 4px;
                    background: #c29d59;
                    border-radius: 2px;
                    margin-bottom: 2px;
                }

                .section-tag {
                    color: #64748b;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 600;
                }

                .header-title h1 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                    letter-spacing: -1px;
                }

                .export-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #ffffff;
                    color: #0f172a;
                    padding: 12px 24px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    white-space: nowrap;
                    margin-top: 12px;
                    flex-shrink: 0;
                }

                .export-btn:hover {
                    background: #0f172a;
                    color: #ffffff;
                    border-color: #0f172a;
                    transform: translateY(-2px);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-glass-card {
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    transition: all 0.3s ease;
                }

                .stat-glass-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
                    border-color: #c29d59;
                }

                .stat-icon-wrapper {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .stat-icon-wrapper.users { background: #fff7ed; color: #c2410c; }
                .stat-icon-wrapper.growth { background: #f0fdf4; color: #15803d; }
                .stat-icon-wrapper.search { background: #eff6ff; color: #1d4ed8; }

                .stat-content label {
                    display: block;
                    color: #64748b;
                    font-size: 0.875rem;
                    font-weight: 500;
                    margin-bottom: 2px;
                }

                .stat-value {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #0f172a;
                }

                .search-bar-wrapper {
                    margin-bottom: 24px;
                }

                .search-input-inner {
                    position: relative;
                    max-width: 500px;
                }

                .search-icon-wrapper {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                    z-index: 10;
                }

                .search-input-inner input {
                    width: 100%;
                    padding: 12px 18px 12px 48px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    background: #ffffff;
                    font-size: 0.95rem;
                    outline: none;
                    transition: all 0.2s ease;
                }

                .search-input-inner input:focus {
                    border-color: #c29d59;
                    box-shadow: 0 0 0 4px rgba(194, 157, 89, 0.1);
                }

                .clear-search {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #f1f5f9;
                    border: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #64748b;
                    font-size: 18px;
                }

                .table-wrapper {
                    background: #ffffff;
                    border-radius: 24px;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    display: flex;
                    flex-direction: column;
                }

                .table-scroll-area {
                    max-height: 520px;
                    overflow-y: auto;
                    position: relative;
                }

                /* Premium Custom Scrollbar */
                .table-scroll-area::-webkit-scrollbar {
                    width: 6px;
                }
                .table-scroll-area::-webkit-scrollbar-track {
                    background: transparent;
                }
                .table-scroll-area::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .table-scroll-area::-webkit-scrollbar-thumb:hover {
                    background: #c29d59;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .admin-table th {
                    background: #f8fafc;
                    padding: 18px 24px;
                    text-align: left;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #64748b;
                    letter-spacing: 0.5px;
                    border-bottom: 1px solid #e2e8f0;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .th-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .table-row {
                    transition: all 0.2s ease;
                    border-bottom: 1px solid #f1f5f9;
                }

                .table-row:hover {
                    background: #fdfbf7;
                }

                .email-cell {
                    padding: 20px 24px;
                    font-weight: 600;
                    color: #0f172a;
                    font-size: 1rem;
                }

                .date-cell {
                    padding: 20px 24px;
                    color: #64748b;
                    font-size: 0.9375rem;
                }

                .action-cell {
                    padding: 20px 24px;
                    text-align: right;
                }

                .delete-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: 8px;
                    background: transparent;
                    color: #ef4444;
                    border: 1px solid transparent;
                    font-weight: 600;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .delete-btn:hover {
                    background: #fef2f2;
                    border-color: #fee2e2;
                    transform: scale(1.02);
                }

                .pagination-footer {
                    padding: 20px 24px;
                    background: #f8fafc;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #e2e8f0;
                }

                .pagination-info {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .pagination-controls {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .p-nav {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    background: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #1e293b;
                    transition: all 0.2s ease;
                }

                .p-nav:hover:not(:disabled) {
                    border-color: #c29d59;
                    color: #c29d59;
                }

                .p-nav:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .p-numbers {
                    display: flex;
                    gap: 6px;
                }

                .p-num {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    background: #ffffff;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    color: #64748b;
                    transition: all 0.2s ease;
                }

                .p-num:hover:not(.active) {
                    border-color: #c29d59;
                    color: #c29d59;
                }

                .p-num.active {
                    background: #0f172a;
                    border-color: #0f172a;
                    color: #ffffff;
                }

                .status-cell {
                    padding: 100px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 1.1rem;
                    font-weight: 500;
                }

                .align-right { text-align: right; }

                @media (max-width: 768px) {
                    .subscribers-admin-container { padding: 20px; }
                    .admin-header { flex-direction: column; align-items: flex-start; gap: 20px; }
                    .header-title h1 { font-size: 2rem; }
                    .stats-grid { grid-template-columns: 1fr; }
                    .pagination-footer { flex-direction: column; gap: 15px; text-align: center; }
                }
            `}</style>
        </div>
    );
}
