'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trash2, Search, Package, AlertCircle, X, Loader2 } from 'lucide-react';
import { db } from '@/src/config/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import SafeImage from '@/src/components/SafeImage';
import toast from 'react-hot-toast';
import '@/src/styles/Admin.css';

export default function CatalogManagerPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, product: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleStatusChange = async (docId, newStatus) => {
        try {
            await updateDoc(doc(db, 'products', String(docId)), {
                status: newStatus
            });
            setProducts(products.map(p => (p.docId === docId || p.id === docId) ? { ...p, status: newStatus } : p));
            toast.success('Product status updated successfully!');
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status.");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const productsData = querySnapshot.docs.map(doc => ({
                docId: doc.id,
                ...doc.data(),
                id: doc.data().id || doc.id
            }));
            // Sort appropriately, maybe by id or name
            productsData.sort((a, b) => (b.id || 0) - (a.id || 0));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products from database");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.product) return;
        setIsDeleting(true);
        try {
            // Delete from Firestore
            await deleteDoc(doc(db, 'products', String(deleteModal.product.docId || deleteModal.product.id)));

            // Remove from local state
            setProducts(products.filter(p => p.docId !== (deleteModal.product.docId || deleteModal.product.id) && p.id !== (deleteModal.product.docId || deleteModal.product.id)));

            toast.success(`${deleteModal.product.name} deleted successfully!`);

            // Note: Ideally, we'd also call an API route to delete the image from Cloudinary here to save space,
            // but for now, deleting from db achieves the main goal of removing it from the site.

        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product. Please try again.");
        } finally {
            setIsDeleting(false);
            setDeleteModal({ show: false, product: null });
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.productType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id?.toString().includes(searchQuery)
    );

    if (loading) {
        return (
            <div className="admin-main-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: '#d4af37' }} />
            </div>
        );
    }

    return (
        <div className="admin-main-container">
            <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d4af37', marginBottom: '8px' }}>
                        <Sparkles size={24} />
                        <span style={{ fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '0.75rem' }}>Management</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0 }}>Product Catalog</h1>
                    <p style={{ color: '#666', fontSize: '1rem', marginTop: '5px' }}>Manage and remove products currently live on the website.</p>
                </div>

                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                    <input
                        type="text"
                        placeholder="Search products by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 15px 12px 45px',
                            borderRadius: '12px',
                            border: '1px solid #d4af37',
                            outline: 'none',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>
            </header>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #d4af37', overflow: 'hidden' }}>
                {filteredProducts.length === 0 ? (
                    <div style={{ padding: '60px 20px', textAlign: 'center', color: '#666' }}>
                        <Package size={48} style={{ margin: '0 auto 15px', color: '#ccc' }} />
                        <p>No products found matching your search.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-catalog-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                                <tr>
                                    <th style={{ padding: '15px 20px', fontSize: '0.85rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Image</th>
                                    <th style={{ padding: '15px 20px', fontSize: '0.85rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Product Details</th>
                                    <th style={{ padding: '15px 20px', fontSize: '0.85rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Category/Type</th>
                                    <th style={{ padding: '15px 20px', fontSize: '0.85rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Price</th>
                                    <th style={{ padding: '15px 20px', fontSize: '0.85rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '15px 20px', fontSize: '0.85rem', color: '#666', fontWeight: '600', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((p) => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td data-label="Image" style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                                            <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', position: 'relative', background: '#f5f5f5' }}>
                                                {p.image ? (
                                                    <SafeImage src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                                        <Package size={24} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td data-label="Product Details" style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                                            <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>{p.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#999' }}>ID: {p.id}</div>
                                        </td>
                                        <td data-label="Category/Type" style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                                            <span style={{ background: '#f5f5f5', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', color: '#666' }}>
                                                {p.productType || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td data-label="Price" style={{ padding: '15px 20px', verticalAlign: 'middle', fontWeight: '600' }}>
                                            ₹{p.price}
                                        </td>
                                        <td data-label="Status" style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                                            <select
                                                value={p.status || 'available'}
                                                onChange={(e) => handleStatusChange(p.docId || p.id, e.target.value)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #d4af37',
                                                    background: '#f9f9f9',
                                                    outline: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    color: '#333'
                                                }}
                                            >
                                                <option value="available">Available</option>
                                                <option value="out_of_stock">Out of Stock</option>
                                                <option value="coming_soon">Coming Soon</option>
                                            </select>
                                        </td>
                                        <td data-label="Actions" style={{ padding: '15px 20px', verticalAlign: 'middle', textAlign: 'right' }}>
                                            <button
                                                onClick={() => setDeleteModal({ show: true, product: p })}
                                                style={{
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444',
                                                    border: 'none',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                            >
                                                <Trash2 size={16} /> <span style={{ display: 'none', '@media (minWidth: 768px)': { display: 'inline' } }}>Delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {deleteModal.show && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px'
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                background: '#fff', borderRadius: '24px', padding: '30px',
                                maxWidth: '400px', width: '100%', position: 'relative',
                                textAlign: 'center'
                            }}
                        >
                            <button
                                onClick={() => setDeleteModal({ show: false, product: null })}
                                style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
                                disabled={isDeleting}
                            >
                                <X size={24} />
                            </button>

                            <div style={{ width: '60px', height: '60px', borderRadius: '30px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <AlertCircle size={32} />
                            </div>

                            <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Delete Product?</h2>
                            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '25px', lineHeight: '1.5' }}>
                                Are you sure you want to delete <strong style={{ color: '#1a1a1a' }}>{deleteModal.product?.name}</strong>? This action cannot be undone and it will be immediately removed from the live website.
                            </p>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => setDeleteModal({ show: false, product: null })}
                                    style={{ flex: 1, padding: '12px', background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', color: '#666' }}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    style={{ flex: 1, padding: '12px', background: '#ef4444', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
