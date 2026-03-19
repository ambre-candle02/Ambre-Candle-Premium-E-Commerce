'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/src/config/firebase';
import { Trash2, Search, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SubscribersAdmin() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubscribers();
    }, []);

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
            toast.error('Failed to load subscribers. Ensure indices are built if using ordering.');
            
            // Fallback without ordering in case index is missing
            try {
                const snapshotFallback = await getDocs(collection(db, 'subscribers'));
                const dataFallback = snapshotFallback.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSubscribers(dataFallback.sort((a,b) => b.subscribedAt?.toMillis() - a.subscribedAt?.toMillis() || 0));
            } catch (err) {
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteSubscriber = async (id) => {
        if (!window.confirm('Are you sure you want to remove this subscriber?')) return;
        try {
            await deleteDoc(doc(db, 'subscribers', id));
            setSubscribers(subscribers.filter(s => s.id !== id));
            toast.success('Subscriber removed');
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error('Failed to remove subscriber');
        }
    };

    const exportCSV = () => {
        if (subscribers.length === 0) return;
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Email,Subscribed At\n"
            + subscribers.map(s => `${s.email},${s.subscribedAt?.toDate ? s.subscribedAt.toDate().toLocaleDateString() : 'N/A'}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "ambre_subscribers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredSubscribers = subscribers.filter(s => 
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-main-container">
            <div className="admin-header-v2" style={{ paddingTop: '20px' }}>
                <div className="admin-header-title">
                    <span style={{ color: '#d4af37', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Community</span>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', margin: '5px 0 0' }}>Newsletter Subscribers</h1>
                </div>
                <div className="admin-header-actions">
                    <button 
                        onClick={exportCSV} 
                        style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #d4af37', background: '#d4af37', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                    >
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="admin-table-section" style={{ marginTop: '20px' }}>
                <div className="admin-table-header-v2">
                    <h3>All Subscribers ({filteredSubscribers.length})</h3>
                    <div className="admin-search-wrapper-v2">
                        <div className="admin-search-input-container">
                            <Search size={18} className="admin-search-icon" style={{ color: '#d4af37' }} />
                            <input
                                className="admin-search-input-v2"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search email..."
                            />
                        </div>
                    </div>
                </div>

                <div className="admin-table-scroll-container">
                    <table className="admin-orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                <th style={{ padding: '15px' }}>Email Address</th>
                                <th style={{ padding: '15px' }}>Subscribed On</th>
                                <th style={{ padding: '15px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>Loading subscribers...</td></tr>
                            ) : filteredSubscribers.length === 0 ? (
                                <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>No subscribers found.</td></tr>
                            ) : (
                                filteredSubscribers.map((s) => (
                                    <tr key={s.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                        <td style={{ padding: '15px', fontWeight: '500' }}>
                                            {s.email}
                                        </td>
                                        <td style={{ padding: '15px', color: '#666' }}>
                                            {s.subscribedAt?.toDate ? s.subscribedAt.toDate().toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'right' }}>
                                            <button onClick={() => deleteSubscriber(s.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>
                                                <Trash2 size={14} /> Remove
                                            </button>
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
