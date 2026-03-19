'use client';
import { Search, Eye, Table, Filter, MoreHorizontal, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Orders() {
    const orders = [
        { id: '#AMB-16514688', customer: 'chitranjan patel', email: 'chitranjanpatel471@gmail.com', date: '3/19/2026', amount: '₹350.00', status: 'PROCESSING' },
        { id: '#AMB-29086389', customer: 'chitranjan patel', email: 'chitranjanpatel471@gmail.com', date: '3/18/2026', amount: '₹1,023.00', status: 'PROCESSING' },
        { id: '#AMB-55421901', customer: 'chitranjan patel', email: 'chitranjanpatel471@gmail.com', date: '3/17/2026', amount: '₹1,850.00', status: 'SHIPPED' },
        { id: '#AMB-99882312', customer: 'chitranjan patel', email: 'chitranjanpatel471@gmail.com', date: '3/16/2026', amount: '₹550.00', status: 'DELIVERED' }
    ];

    const getStatusColor = (s) => {
        if (s === 'PROCESSING') return '#d4af37';
        if (s === 'SHIPPED') return '#3b82f6';
        return '#10b981';
    };

    return (
        <div className="orders-operations-view">
            {/* COMMAND BAR */}
            <div className="command-bar">
                <div className="command-left">
                    <Table size={20} className="command-icon" />
                    <span className="command-label">Logistics Data</span>
                </div>
                <div className="command-right">
                    <div className="compact-search">
                        <Search size={16} className="search-icon" />
                        <input type="text" placeholder="Lookup Order ID..." />
                    </div>
                </div>
            </div>

            {/* THE DATA GRID - NOW GROWING NATURALLY */}
            <div className="data-grid-wrapper">
                <table className="master-table">
                    <thead>
                        <tr>
                            <th>ORDER ID</th>
                            <th>CUSTOMER ENTITY</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>STATUS</th>
                            <th style={{ textAlign: 'center' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o, i) => {
                            const sc = getStatusColor(o.status);
                            return (
                                <motion.tr 
                                    key={i} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="data-row"
                                >
                                    <td className="id-cell">{o.id}</td>
                                    <td className="customer-cell">
                                        <div className="c-info">
                                            <span className="c-name">{o.customer}</span>
                                            <span className="c-email">{o.email}</span>
                                        </div>
                                    </td>
                                    <td className="date-cell">{o.date}</td>
                                    <td className="amount-cell">{o.amount}</td>
                                    <td className="status-cell">
                                        <div className="status-indicator">
                                            <div className="dot" style={{ backgroundColor: sc }}></div>
                                            <span className="status-label" style={{ color: sc }}>{o.status}</span>
                                        </div>
                                    </td>
                                    <td className="action-cell">
                                        <button className="row-action-btn">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .orders-operations-view { width: 100%; height: auto; display: flex; flex-direction: column; }
                
                .command-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 5px 25px 5px;
                }
                .command-left { 
                    display: flex; 
                    align-items: center; 
                    gap: 12px; 
                    font-weight: 850; 
                    letter-spacing: -0.5px; 
                    font-size: 1.35rem; 
                }
                .command-icon { color: #d4af37; filter: drop-shadow(0 0 5px rgba(212,175,55,0.3)); }
                .command-label { 
                    font-family: var(--font-heading);
                    background: linear-gradient(135deg, #d4af37 0%, #b8860b 50%, #8b4513 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .compact-search {
                    background: #fff;
                    border: 1.5px solid #d4af37;
                    border-radius: 12px;
                    padding: 0 15px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.05);
                }
                .compact-search input { background: transparent; border: none; padding: 12px 0; outline: none; font-size: 0.9rem; width: 220px; font-weight: 600; }
                .search-icon { color: #d4af37; }
                
                .data-grid-wrapper {
                    background: #fff;
                    border: 2px solid #d4af37; /* Cinematic Gold Border */
                    border-radius: 20px;
                    overflow: hidden; /* CRITICAL: Clips the table header corners */
                    box-shadow: 0 5px 20px rgba(0,0,0,0.015);
                }
                
                .master-table { width: 100%; border-collapse: separate; border-spacing: 0; }
                .master-table th { 
                    padding: 22px 25px; 
                    text-align: left; 
                    font-size: 0.7rem; 
                    font-weight: 850; 
                    color: rgba(255, 255, 255, 0.9); /* High contrast white text */
                    letter-spacing: 2.5px;
                    border-bottom: 2px solid #d4af37; /* Gold underlined header */
                    background: rgba(26, 26, 26, 0.85); /* Midnight Glass effect */
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }
                
                /* Precision Corner Clipping for the dark header */
                .master-table th:first-child { border-top-left-radius: 18px; }
                .master-table th:last-child { border-top-right-radius: 18px; }
                .master-table td { padding: 22px 25px; border-bottom: 1px solid rgba(0,0,0,0.02); vertical-align: middle; }
                
                .data-row:hover { background: #fffcf5; }
                
                .id-cell { font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; font-weight: 800; color: #1a1a1a; }
                .c-info { display: flex; flex-direction: column; }
                .c-name { font-weight: 750; color: #111; font-size: 0.95rem; text-transform: capitalize; }
                .c-email { font-size: 0.75rem; color: #999; font-weight: 500; }
                
                .amount-cell { font-weight: 900; color: #111; font-size: 1rem; }
                .date-cell { color: #888; font-size: 0.9rem; font-weight: 600; }
                
                .status-indicator { display: flex; align-items: center; gap: 8px; }
                .status-indicator .dot { width: 8px; height: 8px; border-radius: 50%; }
                .status-label { font-size: 0.7rem; font-weight: 950; letter-spacing: 1px; }
                
                .action-cell { text-align: center; }
                .row-action-btn { background: #fff; border: 1px solid #eee; padding: 10px; border-radius: 10px; color: #888; cursor: pointer; transition: all 0.3s; }
                .row-action-btn:hover { border-color: #d4af37; color: #d4af37; background: #fffef5; }
            `}</style>
        </div>
    );
}
