'use client';
import { CreditCard, ShoppingBag, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Analytics() {
    const metrics = [
        { label: 'Revenue', value: '₹45,280', trend: '+12%', icon: CreditCard, color: '#fef3c7' },
        { label: 'Orders', value: '128', trend: '+8%', icon: ShoppingBag, color: '#ecfdf5' },
        { label: 'Customers', value: '42', trend: '+15%', icon: Users, color: '#eff6ff' },
        { label: 'Avg Sale', value: '₹354', trend: '-2%', icon: Activity, color: '#fef2f2' }
    ];

    return (
        <div className="analytics-ribbon">
            {metrics.map((m, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="metric-chip"
                >
                    <div className="chip-icon" style={{ backgroundColor: m.color }}>
                        <m.icon size={16} color="#d4af37" />
                    </div>
                    <div className="chip-data">
                        <span className="chip-label">{m.label}</span>
                        <div className="chip-value-row">
                            <span className="chip-value">{m.value}</span>
                            <span className={`chip-trend ${m.trend.startsWith('+') ? 'up' : 'down'}`}>
                                {m.trend}
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}

            <style jsx>{`
                .analytics-ribbon {
                    display: flex;
                    gap: 20px;
                    width: 100%;
                    max-width: 1150px; /* Expanded for more horizontal presence */
                    padding: 10px 0;
                    overflow: hidden;
                }
                .metric-chip {
                    flex: 1;
                    background: #fff;
                    border: 1px solid rgba(0,0,0,0.06);
                    padding: 15px 20px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                }
                .chip-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .chip-data { display: flex; flex-direction: column; }
                .chip-label { font-size: 0.65rem; font-weight: 800; color: #888; text-transform: uppercase; letter-spacing: 1px; }
                .chip-value-row { display: flex; align-items: baseline; gap: 8px; margin-top: 2px; }
                .chip-value { font-size: 1.2rem; font-weight: 850; color: #111; letter-spacing: -0.5px; }
                .chip-trend { font-size: 0.7rem; font-weight: 800; }
                .chip-trend.up { color: #10b981; }
                .chip-trend.down { color: #ef4444; }
            `}</style>
        </div>
    );
}
