'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Edit, 
    Trash2, 
    Plus, 
    Save, 
    X, 
    Image as ImageIcon, 
    IndianRupee, 
    Tag, 
    FileText,
    RefreshCw,
    Filter,
    Sparkles
} from 'lucide-react';
import { db } from '@/src/config/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import SafeImage from '@/src/components/SafeImage';

export default function ProductManager() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("id", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(items);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const filteredProducts = products.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpdate = async () => {
        if (!editingProduct) return;
        setIsSaving(true);
        try {
            const docRef = doc(db, "products", editingProduct.id.toString());
            await setDoc(docRef, editingProduct, { merge: true });
            toast.success("Product updated! ✨");
            setEditingProduct(null);
        } catch (error) {
            toast.error("Update failed.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this product?")) return;
        try {
            await deleteDoc(doc(db, "products", id.toString()));
            toast.success("Deleted.");
        } catch (error) {
            toast.error("Delete failed.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-40">
                <RefreshCw className="w-10 h-10 animate-spin text-[#d4af37]" />
            </div>
        );
    }

    return (
        <div className="manager-v3">
            <header className="v3-header">
                <div className="v3-search">
                    <Search size={20} className="text-gray-400" />
                    <input 
                        placeholder="Search our luxury collection..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="v3-add-btn" onClick={() => setShowAddModal(true)}>
                    <Plus size={22} />
                    <span>New Creation</span>
                </button>
            </header>

            <div className="v3-grid">
                {filteredProducts.map(p => (
                    <article key={p.id} className="v3-card">
                        <div className="v3-media">
                            <SafeImage src={p.image} alt={p.name} />
                            <div className="v3-overlay">
                                <button className="v3-action edit" onClick={() => setEditingProduct(p)}><Edit size={20} /></button>
                                <button className="v3-action delete" onClick={() => handleDelete(p.id)}><Trash2 size={20} /></button>
                            </div>
                            <span className="v3-price">₹{p.price}</span>
                        </div>
                        <div className="v3-content">
                            <h3>{p.name}</h3>
                            <footer>
                                <span className="v3-cat">{p.category}</span>
                                <span className="v3-stock">
                                    <i className={p.stock > 0 ? 'in' : 'out'}></i>
                                    {p.stock} Units
                                </span>
                            </footer>
                        </div>
                    </article>
                ))}
            </div>

            {/* MODALS SECTION */}
            <AnimatePresence>
                {(editingProduct || showAddModal) && (
                    <div className="master-modal-root">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="master-backdrop"
                            onClick={() => { setEditingProduct(null); setShowAddModal(false); }}
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="master-dialog"
                        >
                            {/* Inner Scoped Content to ensure CSS applies */}
                            <div className="dialog-inner">
                                <div className="dialog-header">
                                    <h2>{editingProduct ? 'Edit Creation' : 'New Creation'}</h2>
                                    <button onClick={() => { setEditingProduct(null); setShowAddModal(false); }} className="close-x"><X size={24} /></button>
                                </div>

                                <div className="dialog-scroll">
                                    <div className="dialog-form">
                                        <div className="form-col">
                                            <div className="v-field">
                                                <label>Product Name</label>
                                                <input 
                                                    id={showAddModal ? "add-name" : ""}
                                                    value={editingProduct?.name || ''} 
                                                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} 
                                                    placeholder="Enter name..."
                                                />
                                            </div>
                                            <div className="v-row">
                                                <div className="v-field">
                                                    <label>Price (₹)</label>
                                                    <input 
                                                        id={showAddModal ? "add-price" : ""}
                                                        type="number" 
                                                        value={editingProduct?.price || ''} 
                                                        onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value) || 0})} 
                                                    />
                                                </div>
                                                <div className="v-field">
                                                    <label>Stock</label>
                                                    <input 
                                                        id={showAddModal ? "add-stock" : ""}
                                                        type="number" 
                                                        value={editingProduct?.stock || 0} 
                                                        onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value) || 0})} 
                                                    />
                                                </div>
                                            </div>
                                            <div className="v-field">
                                                <label>Collection / Category</label>
                                                <input 
                                                    id={showAddModal ? "add-cat" : ""}
                                                    value={editingProduct?.category || ''} 
                                                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} 
                                                    placeholder="e.g. Traditional, Luxury..."
                                                />
                                            </div>
                                        </div>

                                        <div className="form-col">
                                            <div className="v-field">
                                                <label>Visual URL (Media Library)</label>
                                                <input 
                                                    id={showAddModal ? "add-image" : ""}
                                                    value={editingProduct?.image || ''} 
                                                    onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} 
                                                />
                                            </div>
                                            <div className="v-field">
                                                <label>The Story (Description)</label>
                                                <textarea 
                                                    id={showAddModal ? "add-desc" : ""}
                                                    value={editingProduct?.description || ''} 
                                                    onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} 
                                                    placeholder="What makes this special?"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="dialog-footer">
                                    <button className="v-btn-cancel" onClick={() => { setEditingProduct(null); setShowAddModal(false); }}>Discard</button>
                                    <button 
                                        className="v-btn-save" 
                                        disabled={isSaving}
                                        onClick={async () => {
                                            if (editingProduct) {
                                                await handleUpdate();
                                            } else {
                                                const name = document.getElementById('add-name').value;
                                                const price = Number(document.getElementById('add-price').value);
                                                const stock = Number(document.getElementById('add-stock').value || 0);
                                                const category = document.getElementById('add-cat').value;
                                                const image = document.getElementById('add-image').value;
                                                const description = document.getElementById('add-desc').value;

                                                if(!name || !price || !image) {
                                                    toast.error("Please fill Name, Price & Image!");
                                                    return;
                                                }

                                                setIsSaving(true);
                                                try {
                                                    const newId = Date.now();
                                                    await setDoc(doc(db, "products", newId.toString()), {
                                                        id: newId, name, price, category, image, stock, description,
                                                        timestamp: new Date().toISOString()
                                                    });
                                                    toast.success("New product launched! ✨");
                                                    setShowAddModal(false);
                                                } catch (e) {
                                                    toast.error("Creation failed.");
                                                } finally {
                                                    setIsSaving(false);
                                                }
                                            }
                                        }}
                                    >
                                        {isSaving ? <RefreshCw className="animate-spin" /> : <Sparkles size={18} />}
                                        {isSaving ? 'Processing...' : (editingProduct ? 'Update Details' : 'Launch Masterpiece')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .manager-v3 { background: transparent; padding-bottom: 200px; }
                .v3-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; gap: 30px; }
                .v3-search { flex: 1; height: 60px; background: #fff; border: 1.5px solid #eee; border-radius: 16px; display: flex; align-items: center; padding: 0 25px; gap: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
                .v3-search input { width: 100%; border: none; background: transparent; outline: none; font-size: 1rem; color: #1a1a1a; }
                .v3-add-btn { height: 60px; padding: 0 35px; background: #1a1a1a; color: #fff; border-radius: 16px; border: none; display: flex; align-items: center; gap: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; white-space: nowrap; }
                .v3-add-btn:hover { background: #d4af37; transform: translateY(-3px); box-shadow: 0 10px 25px rgba(212,175,55,0.3); }

                .v3-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
                .v3-card { background: #fff; border-radius: 20px; border: 1px solid #f0f0f0; overflow: hidden; transition: 0.4s; position: relative; }
                .v3-card:hover { transform: translateY(-10px); box-shadow: 0 25px 60px rgba(0,0,0,0.1); border-color: #d4af37; }
                .v3-media { width: 100%; height: 260px; position: relative; background: #fafafa; }
                .v3-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; gap: 20px; opacity: 0; transition: 0.3s; }
                .v3-card:hover .v3-overlay { opacity: 1; }
                .v3-action { width: 50px; height: 50px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; background: #fff; color: #1a1a1a; transition: 0.2s; }
                .v3-action.edit:hover { background: #d4af37; color: #fff; }
                .v3-action.delete:hover { background: #ef4444; color: #fff; }
                .v3-price { position: absolute; bottom: 20px; right: 20px; background: #fff; padding: 8px 20px; border-radius: 50px; font-weight: 900; color: #1a1a1a; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                .v3-content { padding: 25px; }
                .v3-content h3 { font-size: 1.25rem; font-weight: 850; margin: 0 0 15px; color: #1a1a1a; letter-spacing: -0.5px; }
                .v3-content footer { display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #f8f8f8; }
                .v3-cat { color: #d4af37; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; }
                .v3-stock { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.9rem; }
                .v3-stock i { width: 10px; height: 10px; border-radius: 50%; }
                .v3-stock i.in { background: #10b981; box-shadow: 0 0 10px rgba(16,185,129,0.3); }
                .v3-stock i.out { background: #ef4444; }

                /* MASTER MODAL ENGINE */
                .master-modal-root {
                    position: fixed;
                    inset: 0;
                    z-index: 999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fff;
                }
                .master-backdrop {
                    display: none;
                }
                .master-dialog {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    max-width: 1000px;
                    background: #fff;
                    display: flex;
                    flex-direction: column;
                    padding-top: 40px;
                }
                .dialog-inner { display: flex; flex-direction: column; background: #fff; width: 100%; }
                .dialog-header { 
                    padding: 30px 40px; 
                    background: #fff; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                }
                .dialog-header h2 { font-size: 2.2rem; font-weight: 900; color: #1a1a1a; margin: 0; letter-spacing: -1px; }
                .close-x { background: #f5f5f5; border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #666; transition: 0.2s; }
                .close-x:hover { background: #ef4444; color: #fff; transform: rotate(90deg); }
                
                .dialog-scroll { padding: 40px; max-height: none; flex: 1; overflow-y: auto; background: #fff; }
                .dialog-form { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
                .form-col { display: flex; flex-direction: column; gap: 25px; }
                
                .v-field { display: flex; flex-direction: column; gap: 10px; }
                .v-field label { font-size: 0.75rem; font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 1.5px; }
                .v-field input, .v-field textarea { 
                    padding: 16px 20px; 
                    background: #fdfdfd; 
                    border: 1.5px solid #eee; 
                    border-radius: 14px; 
                    font-size: 1rem; 
                    color: #1a1a1a; 
                    outline: none;
                    transition: 0.2s;
                }
                .v-field input:focus, .v-field textarea:focus { border-color: #d4af37; background: #fff; box-shadow: 0 5px 15px rgba(212,175,55,0.05); }
                .v-field textarea { height: 160px; resize: none; }
                .v-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                
                .dialog-footer { 
                    padding: 40px 60px; 
                    background: #fff; 
                    border-top: 1.5px solid #f8f8f8; 
                    display: flex; 
                    justify-content: flex-end; 
                    align-items: center;
                    gap: 35px; 
                }
                .v-btn-cancel { 
                    background: #f5f5f5; 
                    border: none; 
                    padding: 12px 25px;
                    border-radius: 50px;
                    font-weight: 800; 
                    color: #666; 
                    cursor: pointer; 
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 0.75rem;
                    transition: all 0.3s; 
                }
                .v-btn-cancel:hover { background: #ef4444; color: #fff; transform: translateY(-2px); }
                
                .v-btn-save { 
                    padding: 12px 30px; 
                    background: #1a1a1a; 
                    color: #fff; 
                    border: none; 
                    border-radius: 50px; 
                    font-weight: 850; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    border: 1.5px solid #1a1a1a;
                }
                .v-btn-save:hover { 
                    background: #d4af37; 
                    border-color: #d4af37;
                    transform: translateY(-3px); 
                    box-shadow: 0 15px 35px rgba(212,175,55,0.3); 
                }
                .v-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
        </div>
    );
}
