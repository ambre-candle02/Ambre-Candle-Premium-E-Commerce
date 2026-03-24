'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ImageIcon, 
    Type, 
    Save, 
    RefreshCw, 
    LayoutDashboard, 
    Smartphone, 
    Lock, 
    Sparkles, 
    ArrowRight,
    Search,
    User,
    Menu,
    X,
    Check
} from 'lucide-react';
import { db } from '@/src/config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';
import SafeImage from '@/src/components/SafeImage';
import { PRODUCT_CATEGORIES } from '@/src/config/constants';

const TABS = [
    { id: 'hero', label: 'Hero Banners', icon: ImageIcon },
    { id: 'collections', label: 'Collection Visuals', icon: Sparkles },
    { id: 'auth', label: 'Auth Backgrounds', icon: Lock },
    { id: 'titles', label: 'Section Labels', icon: Type }
];

const BORDER_COLORS = [
    '#3b82f6', // Blue
    '#f43f5e', // Rose
    '#10b981', // Green
    '#8b5cf6', // Violet
    '#f59e0b', // Amber
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#f97316'  // Orange
];

export default function SiteDesigner() {
    const [activeTab, setActiveTab] = useState('hero');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [config, setConfig] = useState({
        hero: {
            home: '', 
            shop: '', 
            collection: '', 
            about: '', 
            contact: '', 
            wishlist: '', 
            cart: '',
            'Gift': '',
            'Festive': '',
            'Artisan': '',
            'Jar': '',
            'Daily Luxe': ''
        },
        auth: {
            login: '', signup: '', forgot: ''
        },
        titles: {
            bestsellers: 'Our Bestsellers',
            collections: 'Shop by Collection',
            selection: 'You May Also Like',
            signatures: 'Explore Signature Collections'
        },
        collections: {} // Will be populated dynamically
    });

    // Populate collections if empty or missing new categories
    useEffect(() => {
        if (!loading && config.collections) {
            const currentCats = Object.keys(config.collections);
            const missing = PRODUCT_CATEGORIES.filter(c => !currentCats.includes(c));
            if (missing.length > 0) {
                const newCols = { ...config.collections };
                missing.forEach(c => { newCols[c] = ''; });
                setConfig(prev => ({ ...prev, collections: newCols }));
            }
        }
    }, [loading]);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "site_config", "general"), (doc) => {
            if (doc.exists()) {
                setConfig(doc.data());
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "site_config", "general"), config);
            toast.success("Settings updated! ✨");
        } catch (error) {
            toast.error("Save failed.");
        } finally {
            setSaving(false);
        }
    };

    const updateValue = (category, field, value) => {
        setConfig(prev => ({
            ...prev,
            [category]: { ...prev[category], [field]: value }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-40">
                <RefreshCw className="w-10 h-10 animate-spin text-[#d4af37]" />
            </div>
        );
    }

    return (
        <div className="vibrant-designer">
            <header className="designer-head">
                <div>
                    <h2>Design Studio</h2>
                    <p>Customize your masterpiece with different vibrant sections</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="v-save-btn">
                    {saving ? <RefreshCw className="animate-spin" /> : <Save color="#10b981" strokeWidth={3} />}
                    {saving ? "Saving..." : "Save Selection"}
                </button>
            </header>

            <nav className="tabs-nav">
                {TABS.map((tab, idx) => {
                    const colors = ['#3b82f6', '#f59e0b', '#f43f5e', '#8b5cf6'];
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            className={`tab-link ${isActive ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ 
                                color: isActive ? colors[idx] : '#666',
                                borderBottom: isActive ? `3px solid ${colors[idx]}` : '3px solid transparent'
                            }}
                        >
                            <tab.icon size={18} color={colors[idx]} strokeWidth={isActive ? 3 : 2} />
                            {tab.label}
                        </button>
                    );
                })}
            </nav>

            <main className="designer-main">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid-shell"
                    >
                        {activeTab === 'hero' && (
                            <div className="designer-grid">
                                {Object.entries(config.hero).map(([page, url], idx) => (
                                    <div key={page} className="v-card" style={{ borderColor: BORDER_COLORS[idx % BORDER_COLORS.length] }}>
                                        <div className="v-card-header">
                                            <h4 className="capitalize">{page}</h4>
                                            <div className="dot" style={{ background: BORDER_COLORS[idx % BORDER_COLORS.length] }}></div>
                                        </div>
                                        <div className="v-preview glass">
                                            {url ? <SafeImage src={url} alt="Preview" /> : (
                                                <div className="v-placeholder" style={{ color: BORDER_COLORS[idx % BORDER_COLORS.length] }}>
                                                    <ImageIcon size={35} />
                                                    <span>No image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="v-input">
                                            <input 
                                                style={{ borderColor: BORDER_COLORS[idx % BORDER_COLORS.length] }}
                                                value={url} 
                                                onChange={e => updateValue('hero', page, e.target.value)} 
                                                placeholder="Image link..." 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'auth' && (
                            <div className="designer-grid">
                                {Object.entries(config.auth).map(([page, url], idx) => (
                                    <div key={page} className="v-card" style={{ borderColor: BORDER_COLORS[idx % BORDER_COLORS.length] }}>
                                        <div className="v-card-header">
                                            <h4 className="capitalize">{page}</h4>
                                            <div className="dot" style={{ background: BORDER_COLORS[idx % BORDER_COLORS.length] }}></div>
                                        </div>
                                        <div className="v-preview compact glass">
                                            {url ? <SafeImage src={url} alt="Preview" /> : (
                                                <div className="v-placeholder" style={{ color: BORDER_COLORS[idx % BORDER_COLORS.length] }}>
                                                    <Lock size={35} />
                                                    <span>Missing URL</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="v-input">
                                            <input 
                                                style={{ borderColor: BORDER_COLORS[idx % BORDER_COLORS.length] }}
                                                value={url} 
                                                onChange={e => updateValue('auth', page, e.target.value)} 
                                                placeholder="Background link..." 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'titles' && (
                            <div className="v-card full" style={{ borderColor: '#8b5cf6' }}>
                                <div className="v-card-header"><h4>Section Labels</h4></div>
                                <div className="label-grid">
                                    {Object.entries(config.titles).map(([key, value], idx) => (
                                        <div key={key} className="v-input labeled">
                                            <label className="capitalize">{key.replace('_', ' ')}</label>
                                            <div className="v-input-wrap" style={{ borderColor: BORDER_COLORS[idx % BORDER_COLORS.length] }}>
                                                <Type size={18} color={BORDER_COLORS[idx % BORDER_COLORS.length]} />
                                                <input value={value} onChange={e => updateValue('titles', key, e.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'collections' && (
                            <div className="designer-grid">
                                {Object.entries(config.collections).map(([key, value], idx) => (
                                    <div key={key} className="v-card" style={{ borderColor: BORDER_COLORS[idx % BORDER_COLORS.length] }}>
                                        <div className="v-card-header">
                                            <h4 className="capitalize">{key}</h4>
                                            <div className="dot" style={{ background: BORDER_COLORS[idx % BORDER_COLORS.length] }}></div>
                                        </div>
                                        <div className="v-preview compact glass">
                                            {value ? <SafeImage src={value} alt="Preview" /> : (
                                                <div className="v-placeholder" style={{ color: BORDER_COLORS[idx % BORDER_COLORS.length] }}>
                                                    <Sparkles size={35} />
                                                    <span>Default</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="v-input">
                                            <input 
                                                style={{ borderColor: BORDER_COLORS[idx % BORDER_COLORS.length] }}
                                                value={value} 
                                                onChange={e => updateValue('collections', key, e.target.value)} 
                                                placeholder="Image link..." 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            <style jsx>{`
                .vibrant-designer { padding-bottom: 200px; }
                .designer-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
                .designer-head h2 { font-size: 2.2rem; font-weight: 850; margin: 0; letter-spacing: -1.5px; }
                .designer-head p { color: #888; margin-top: 5px; font-weight: 500; font-size: 0.95rem; }
                
                .v-save-btn { display: flex; align-items: center; gap: 10px; background: #d4af37; color: #000; padding: 12px 25px; border-radius: 14px; border: none; font-weight: 850; cursor: pointer; transition: 0.3s; box-shadow: 0 5px 15px rgba(212,175,55,0.2); }
                .v-save-btn:hover { background: #b8952e; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(212,175,55,0.3); }
                
                .tabs-nav { 
                    display: flex; 
                    gap: 30px; 
                    margin-bottom: 40px; 
                    background: transparent; 
                    padding: 0; 
                    border-bottom: 2px solid #f0f0f0;
                    width: 100%; 
                }
                .tab-link { 
                    padding: 15px 10px; 
                    background: transparent;
                    border: none; 
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                    font-weight: 800; 
                    cursor: pointer; 
                    transition: all 0.3s; 
                    font-size: 0.95rem;
                    border-radius: 0;
                }
                .tab-link:hover { opacity: 0.8; }
                
                .designer-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
                .v-card { background: #fff; border-radius: 20px; border: 2.5px solid #eee; padding: 25px; transition: 0.3s; }
                .v-card:hover { transform: translateY(-5px); border-color: #d4af37; box-shadow: 0 15px 40px rgba(0,0,0,0.05); }
                .v-card.full { width: 100%; }
                
                .v-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
                .v-card-header h4 { margin: 0; font-size: 1.1rem; font-weight: 850; letter-spacing: -0.5px; }
                .dot { width: 12px; height: 12px; border-radius: 50%; }
                
                .v-preview { width: 100%; height: 180px; border-radius: 16px; margin: 15px 0; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #fafafa; border: 1.5px solid #f0f0f0; }
                .v-preview.compact { height: 130px; }
                .v-preview.glass { backdrop-filter: blur(10px); }
                
                .v-placeholder { display: flex; flex-direction: column; align-items: center; gap: 10px; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; }
                
                .v-input input { width: 100%; padding: 15px; border: 1.5px solid #eee; border-radius: 12px; outline: none; transition: 0.3s; background: #fafafa; font-size: 0.9rem; }
                .v-input input:focus { border-color: #1a1a1a; background: #fff; }
                
                .label-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 25px; }
                .v-input.labeled { display: flex; flex-direction: column; gap: 10px; }
                .v-input.labeled label { font-size: 0.75rem; font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 1.5px; }
                .v-input-wrap { display: flex; align-items: center; gap: 15px; background: #fafafa; padding: 0 20px; border-radius: 14px; border: 1.5px solid #eee; }
                .v-input-wrap input { border: none; background: transparent; padding: 15px 0; }
            `}</style>
        </div>
    );
}
