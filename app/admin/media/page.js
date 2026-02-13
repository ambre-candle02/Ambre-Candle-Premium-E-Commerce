'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, Trash2, Upload, Search, Filter, Image as ImageIcon, Copy, Folder, ArrowLeft, Grid, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCT_CATEGORIES } from '../../../src/config/constants';
import { getCloudinarySignatureAction } from '@/src/actions/mediaActions';
import '@/src/styles/Admin.css';

export default function MediaLibrary() {
    const [mounted, setMounted] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [mediaList, setMediaList] = useState([]); // Array of {url, public_id, category}
    const [view, setView] = useState('folders'); // 'folders' | 'gallery'
    const [currentCategory, setCurrentCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setMounted(true);
        const savedMedia = localStorage.getItem('ambre_media_v2');
        if (savedMedia) {
            setMediaList(JSON.parse(savedMedia));
        } else {
            const oldUrls = localStorage.getItem('ambre_uploaded_images');
            if (oldUrls) {
                // Legacy migration
                const legacy = JSON.parse(oldUrls).map(url => ({ url, public_id: null, category: 'All' }));
                setMediaList(legacy);
                localStorage.setItem('ambre_media_v2', JSON.stringify(legacy));
            }
        }
    }, []);

    // Get counts per category
    const getCategoryCount = (cat) => {
        if (cat === 'All') return mediaList.length;
        return mediaList.filter(item => item.category === cat).length;
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Max resolution for 10MB limit while keeping high quality
                    const MAX_WIDTH = 4096;
                    if (width > MAX_WIDTH) {
                        height = (MAX_WIDTH / width) * height;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        }));
                    }, 'image/jpeg', 0.85); // 0.85 quality is great for web
                };
            };
        });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        const newMedia = [];

        for (let file of files) {
            try {
                // Auto-compress if file is larger than 9MB
                if (file.size > 9 * 1024 * 1024) {

                    file = await compressImage(file);

                }

                // 1. Get folder path
                const folderPath = `ambre-candles/${(currentCategory || 'All').toString().replace(/\s+/g, '_')}`;

                // 2. Get secure signature from server
                const sigResult = await getCloudinarySignatureAction({
                    folder: folderPath
                });

                if (!sigResult.success) {
                    throw new Error(sigResult.error || 'Failed to get signature');
                }

                // 3. Construct FormData for Cloudinary
                const formData = new FormData();
                formData.append('file', file);
                formData.append('api_key', sigResult.apiKey);
                formData.append('timestamp', sigResult.timestamp);
                formData.append('signature', sigResult.signature);
                formData.append('folder', folderPath);

                // 4. Upload DIRECTLY to Cloudinary
                const res = await fetch(`https://api.cloudinary.com/v1_1/${sigResult.cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {
                    const data = await res.json();
                    newMedia.push({
                        url: data.secure_url,
                        public_id: data.public_id,
                        category: currentCategory || 'All'
                    });
                } else {
                    const errorMsg = await res.text();
                    console.error('Cloudinary Direct Upload Error:', errorMsg);
                }
            } catch (err) {
                console.error("Upload execution error for:", file.name, err);
            }
        }

        if (newMedia.length > 0) {
            const updatedList = [...newMedia, ...mediaList].slice(0, 1000);
            setMediaList(updatedList);
            localStorage.setItem('ambre_media_v2', JSON.stringify(updatedList));
            alert(`Successfully uploaded ${newMedia.length} images to ${currentCategory}!`);
        } else {
            alert('Upload failed. Please check your network or try again.');
        }
        setUploading(false);
    };

    const handleImageDelete = async (item) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        if (item.public_id) {
            try {
                const res = await fetch('/api/delete', {
                    method: 'POST',
                    body: JSON.stringify({ public_id: item.public_id }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!res.ok) {
                    alert('Could not delete from Cloudinary, but removing from dashboard.');
                }
            } catch (err) {
                console.error('Delete error:', err);
            }
        }

        const newList = mediaList.filter(m => m.url !== item.url);
        setMediaList(newList);
        localStorage.setItem('ambre_media_v2', JSON.stringify(newList));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('URL Copied to clipboard!');
    };

    if (!mounted) return null;

    const filteredMedia = mediaList.filter(item => {
        const matchesSearch = item.url.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = currentCategory === 'All' || item.category === currentCategory || (!item.category && currentCategory === 'All');
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="admin-media-container">
            {/* Header Area */}
            {view === 'folders' && (
                <div className="admin-header-flex" style={{ marginBottom: '40px' }}>
                    <div>
                        <p style={{ color: '#d4af37', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '5px' }}>Overview</p>
                        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: 0 }}>Media Library</h1>
                    </div>
                </div>
            )}

            {/* Folder Grid View */}
            {view === 'folders' && (
                <div className="admin-media-grid">
                    {PRODUCT_CATEGORIES.map(cat => {
                        const count = getCategoryCount(cat);
                        const isAll = cat === 'All';
                        return (
                            <motion.div
                                key={cat}
                                className="admin-folder-card"
                                onClick={() => { setCurrentCategory(cat); setView('gallery'); }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{
                                    y: -8,
                                    borderColor: '#d4af37',
                                    boxShadow: '0 15px 30px rgba(212, 175, 55, 0.15)'
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="admin-folder-icon-wrapper" style={{
                                    background: isAll ? 'rgba(212, 175, 55, 0.1)' : undefined,
                                    borderColor: isAll ? 'rgba(212, 175, 55, 0.3)' : undefined
                                }}>
                                    {isAll ? (
                                        <LayoutGrid size={32} color="#d4af37" />
                                    ) : (
                                        <Folder size={32} color={count > 0 ? '#d4af37' : '#ccc'} fill={count > 0 ? 'rgba(212, 175, 55, 0.2)' : 'none'} />
                                    )}
                                </div>
                                <div>
                                    <h3 className="admin-folder-title">{cat}</h3>
                                    {isAll && <span style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: '600', display: 'block', marginTop: '5px' }}>MASTER VIEW</span>}
                                </div>
                                <div className="admin-folder-count">
                                    {count} assets
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Gallery View */}
            {view === 'gallery' && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="media-header-v2">
                        <div className="media-header-left">
                            <motion.button
                                onClick={() => { setView('folders'); setCurrentCategory(null); setSearchTerm(''); }}
                                className="back-btn-circle"
                                whileHover={{ scale: 1.05, borderColor: '#d4af37', color: '#d4af37', boxShadow: '0 8px 20px rgba(212, 175, 55, 0.15)' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowLeft size={24} />
                            </motion.button>
                            <div>
                                <p style={{ color: '#d4af37', fontSize: '1rem', marginBottom: '2px', fontWeight: '500', opacity: 0.7 }}>Folder</p>
                                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', margin: 0, color: '#1a1a1a', lineHeight: 1 }}>{currentCategory}</h1>
                            </div>
                        </div>

                        <div className="media-header-right">
                            <div className="media-search-input-wrapper">
                                <Search size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#d4af37', zIndex: 1 }} />
                                <input
                                    type="text"
                                    placeholder={`Search in ${currentCategory}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="admin-search-input"
                                    style={{ width: '100%', paddingLeft: '55px' }}
                                />
                            </div>

                            <input
                                type="file"
                                id="cloudinary-upload-media"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                                accept="image/*"
                                multiple
                            />
                            <motion.button
                                onClick={() => document.getElementById('cloudinary-upload-media').click()}
                                disabled={uploading}
                                className="admin-btn-premium"
                                whileHover={{
                                    scale: 1.02,
                                    background: '#d4af37',
                                    boxShadow: '0 10px 25px rgba(212, 175, 55, 0.3)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    padding: '16px 25px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    fontWeight: '700',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {uploading ? <RefreshCw size={20} className="spin" /> : <Upload size={20} />}
                                {uploading ? 'Wait...' : `Upload to ${currentCategory}`}
                            </motion.button>
                        </div>
                    </div>

                    <div className="admin-media-grid">
                        <AnimatePresence>
                            {filteredMedia.map((item, idx) => (
                                <motion.div
                                    key={item.public_id || idx}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="media-item-card"
                                    style={{
                                        background: '#fff',
                                        padding: '12px',
                                        borderRadius: '16px',
                                        border: '1px solid #eee',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                                        position: 'relative'
                                    }}
                                >
                                    <div className="media-card-img-container" style={{
                                        height: '220px',
                                        background: '#f5f5f5',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        marginBottom: '12px',
                                        position: 'relative'
                                    }}>
                                        <img
                                            src={item.url}
                                            alt=""
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            display: 'flex',
                                            gap: '5px'
                                        }}>
                                            <button
                                                onClick={() => handleImageDelete(item)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '8px',
                                                    background: 'rgba(255, 255, 255, 0.9)',
                                                    color: '#ef4444',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => copyToClipboard(item.url)}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                borderRadius: '10px',
                                                border: '1px solid #d4af37',
                                                background: '#fff',
                                                color: '#d4af37',
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#d4af37'; }}
                                        >
                                            <Copy size={14} />
                                            Copy URL
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredMedia.length === 0 && (
                        <div style={{ padding: '80px', textAlign: 'center', color: '#999', background: '#fff', borderRadius: '24px', border: '1px dashed #eee' }}>
                            <ImageIcon size={48} style={{ marginBottom: '20px', opacity: 0.3 }} />
                            <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>This folder is empty.</p>
                            <p style={{ fontSize: '0.9rem', color: '#ccc' }}>Upload images using the button above.</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
