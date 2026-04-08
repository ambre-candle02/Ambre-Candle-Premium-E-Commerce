/* eslint-disable */
'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, Trash2, Upload, Search, Filter, Image as ImageIcon, Copy, Folder, ArrowLeft, LayoutGrid, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImg } from '@/src/utils/cropUtils';
import { useRef } from 'react';
import { PRODUCT_CATEGORIES } from '@/src/config/constants';
import { getCloudinarySignatureAction } from '@/src/actions/mediaActions';
import SafeImage from '@/src/components/SafeImage';
import '@/src/styles/Admin.css';
import toast from 'react-hot-toast';

const BANNED_URLS = [
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770841190/ambre-candles/Glass_Jar_Candle/ixav3l7sm2un33okblls.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770841196/ambre-candles/Glass_Jar_Candle/chz8ggyalvo9oog5l1wq.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770841198/ambre-candles/Glass_Jar_Candle/o2nmsqyon5oivoheby9n.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770841200/ambre-candles/Glass_Jar_Candle/esb2rdnbcrlnnjg3jcfl.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770841201/ambre-candles/Glass_Jar_Candle/niww0h7vjrk9dxnnynrb.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770841203/ambre-candles/Glass_Jar_Candle/kbyef5tbqfaixxiqojfa.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770881876/ambre-candles/Favourites/avf2saud9glrbz70wtjh.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770841199/ambre-candles/Glass_Jar_Candle/twjoqjhf8nsom8n46eri.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770840521/ambre-candles/Figure_Candle/atygqmtuacchwgy6bntd.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770840522/ambre-candles/Figure_Candle/b2oqplxpaqlwvx84ghjk.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770840523/ambre-candles/Figure_Candle/rcstrodzcfuql7rdj2cv.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770840524/ambre-candles/Figure_Candle/ygemcuaibd5cilfy4cyu.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770840525/ambre-candles/Figure_Candle/gdflao7wqbg4cwhwgxsf.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770840526/ambre-candles/Figure_Candle/hjdz7uanowirmxfsf6si.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770840528/ambre-candles/Figure_Candle/rt4b7ant3bgphnhdkw4n.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770840529/ambre-candles/Figure_Candle/bdwvatd0os60ewhnzgrd.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770840530/ambre-candles/Figure_Candle/uv4rrqo7cauk3tfbzero.jpg',
    'https://res.cloudinary.com/dmw5efwf5/image/upload/v1770840531/ambre-candles/Figure_Candle/v3lidy5a2dgnxor2zcd6.jpg'
];

export default function MediaLibrary() {
    const [mounted, setMounted] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [mediaList, setMediaList] = useState([]); // Array of {url, public_id, category}
    const [view, setView] = useState('folders'); // 'folders' | 'gallery'
    const [currentCategory, setCurrentCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Cropper States (Dynamic Box)
    const imgRef = useRef(null);
    const [imageToCrop, setImageToCrop] = useState(null); // {file, url}
    const [crop, setCrop] = useState(); // Unified crop state
    const [completedCrop, setCompletedCrop] = useState(null);
    const [aspect, setAspect] = useState(1); // Default to 1:1

    const router = useRouter();

    useEffect(() => {
        setMounted(true);

        const savedAuth = sessionStorage.getItem('ambre_admin_session');
        if (!savedAuth || savedAuth !== 'active') {
            router.push('/admin');
            return;
        }
        const processMediaList = (list) => {
            return list.filter(item => !BANNED_URLS.includes(item.url));
        };

        const savedMedia = localStorage.getItem('ambre_media_v2');
        if (savedMedia) {
            const list = JSON.parse(savedMedia);
            const cleanList = processMediaList(list);
            setMediaList(cleanList);
            // Update storage if we filtered anything
            if (cleanList.length !== list.length) {
                localStorage.setItem('ambre_media_v2', JSON.stringify(cleanList));
            }
        } else {
            const oldUrls = localStorage.getItem('ambre_uploaded_images');
            if (oldUrls) {
                // Legacy migration
                const legacy = JSON.parse(oldUrls).map(url => ({ url, public_id: null, category: 'All' }));
                const cleanLegacy = processMediaList(legacy);
                setMediaList(cleanLegacy);
                localStorage.setItem('ambre_media_v2', JSON.stringify(cleanLegacy));
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

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        const file = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImageToCrop({ file, url: reader.result });
            // Let the onImageLoad handle the initial crop
        };
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        let initialCrop;
        
        if (aspect) {
            initialCrop = centerCrop(
                makeAspectCrop(
                    { unit: '%', width: 90 },
                    aspect,
                    width,
                    height
                ),
                width,
                height
            );
        } else {
            // Default to full image if no aspect ratio is set (Original/Free Hand)
            initialCrop = {
                unit: '%',
                width: 100,
                height: 100,
                x: 0,
                y: 0
            };
            setCompletedCrop({
                unit: 'px',
                x: 0,
                y: 0,
                width: width,
                height: height
            });
        }
        setCrop(initialCrop);
    };

    const processUpload = async () => {
        if (!imageToCrop || !completedCrop || !imgRef.current) return;
        
        setUploading(true);
        try {
            const finalFile = await getCroppedImg(imgRef.current, completedCrop, imageToCrop.file.name);

            // 3. Folder path
            const folderPath = `ambre-candles/${(currentCategory || 'All').toString().replace(/\s+/g, '_')}`;

            // 4. Get secure signature
            const sigResult = await getCloudinarySignatureAction({ folder: folderPath });
            if (!sigResult.success) throw new Error(sigResult.error);

            // 5. FormData
            const formData = new FormData();
            formData.append('file', finalFile);
            formData.append('api_key', sigResult.apiKey);
            formData.append('timestamp', sigResult.timestamp);
            formData.append('signature', sigResult.signature);
            formData.append('folder', folderPath);

            // 6. Direct Upload
            const res = await fetch(`https://api.cloudinary.com/v1_1/${sigResult.cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                const newItem = {
                    url: data.secure_url,
                    public_id: data.public_id,
                    category: currentCategory || 'All'
                };
                const updatedList = [newItem, ...mediaList].slice(0, 1000);
                setMediaList(updatedList);
                localStorage.setItem('ambre_media_v2', JSON.stringify(updatedList));
                toast.success(`Success! Masterpiece uploaded to ${currentCategory}.`);
                setImageToCrop(null);
            } else {
                toast.error('Cloudinary upload failed.');
            }
        } catch (err) {
            console.error("Upload error:", err);
            toast.error('Processing failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleImageDelete = async (item) => {
        toast(
            (t) => (
                <span style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    Delete this image?
                    <span style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={async () => { toast.dismiss(t.id); await doDelete(item); }} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontWeight: 700 }}>Delete</button>
                        <button onClick={() => toast.dismiss(t.id)} style={{ background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                    </span>
                </span>
            ),
            { duration: 6000 }
        );
    };

    const doDelete = async (item) => {
        if (item.public_id) {
            try {
                const res = await fetch('/api/delete', {
                    method: 'POST',
                    body: JSON.stringify({ public_id: item.public_id }),
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!res.ok) {
                    toast.error('Could not delete from Cloudinary, but removing from dashboard.');
                }
            } catch (err) {
                console.error('Delete error:', err);
            }
        }
        const newList = mediaList.filter(m => m.url !== item.url);
        setMediaList(newList);
        localStorage.setItem('ambre_media_v2', JSON.stringify(newList));
        toast.success('Image removed from library.');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('URL Copied to clipboard!');
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
                <div className="admin-header-flex" style={{ marginBottom: '25px', paddingTop: '0px' }}>
                    <div>
                        <p style={{ color: '#d4af37', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '2px' }}>Overview</p>
                        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 6vw, 2.5rem)', margin: 0, whiteSpace: 'nowrap' }}>Media Library</h1>
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
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    borderColor: '#d4af37' /* ALWAYS SOLID GOLD */
                                }}
                                whileHover={{
                                    y: -8,
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
                                <p style={{ color: '#d4af37', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Folder View</p>
                                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0, color: '#1a1a1a', lineHeight: 1.1 }}>{currentCategory}</h1>
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
                                        <SafeImage
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
            {/* CROPPING MODAL */}
            <AnimatePresence>
                {imageToCrop && (
                    <div className="cropper-modal-root" style={{ position: 'fixed', inset: 0, zIndex: 1000000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="cropper-backdrop" 
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)' }}
                            onClick={() => !uploading && setImageToCrop(null)}
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="cropper-dialog"
                            style={{ position: 'relative', width: '90%', maxWidth: '800px', height: '80vh', background: '#fff', borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ padding: '25px 40px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Crop Masterpiece</h2>
                                    <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.9rem' }}>Align your visual for the perfect storefront display.</p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => {
                                            setAspect(1);
                                            if (imgRef.current) {
                                                const { width, height } = imgRef.current;
                                                setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1, width, height), width, height));
                                            }
                                        }}
                                        style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #d4af37', background: aspect === 1 ? '#d4af37' : '#fff', color: aspect === 1 ? '#fff' : '#d4af37', fontWeight: '700', cursor: 'pointer' }}
                                    >1:1 Square</button>
                                    <button 
                                        onClick={() => {
                                            setAspect(4/5);
                                            if (imgRef.current) {
                                                const { width, height } = imgRef.current;
                                                setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 4/5, width, height), width, height));
                                            }
                                        }}
                                        style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #d4af37', background: aspect === 4/5 ? '#d4af37' : '#fff', color: aspect === 4/5 ? '#fff' : '#d4af37', fontWeight: '700', cursor: 'pointer' }}
                                    >4:5 Premium</button>
                                    <button 
                                        onClick={() => {
                                            setAspect(undefined);
                                            if (imgRef.current) {
                                                const { width, height } = imgRef.current;
                                                const fullCrop = { unit: '%', width: 100, height: 100, x: 0, y: 0 };
                                                setCrop(fullCrop);
                                                // Set completed crop in pixels for immediate save
                                                setCompletedCrop({
                                                    unit: 'px',
                                                    x: 0,
                                                    y: 0,
                                                    width: width,
                                                    height: height
                                                });
                                            }
                                        }}
                                        style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #d4af37', background: aspect === undefined ? '#d4af37' : '#fff', color: aspect === undefined ? '#fff' : '#d4af37', fontWeight: '700', cursor: 'pointer' }}
                                    >Original (No Crop)</button>
                                    <button 
                                        onClick={() => setAspect(undefined)}
                                        style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #666', background: '#fff', color: '#666', fontWeight: '700', cursor: 'pointer' }}
                                    >Free Hand</button>
                                </div>
                            </div>

                            <div style={{ flex: 1, position: 'relative', background: '#000', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspect}
                                    className="ambre-crop-box"
                                >
                                    <img 
                                        ref={imgRef}
                                        src={imageToCrop.url} 
                                        onLoad={onImageLoad}
                                        alt="Crop" 
                                        style={{ maxWidth: '100%', maxHeight: '60vh', display: 'block' }}
                                    />
                                </ReactCrop>
                            </div>

                            <div style={{ padding: '30px 40px', background: '#fff', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <button 
                                        disabled={uploading}
                                        onClick={() => setImageToCrop(null)}
                                        style={{ padding: '14px 30px', borderRadius: '12px', border: 'none', background: '#f5f5f5', color: '#666', fontWeight: '700', cursor: 'pointer' }}
                                    >Discard</button>
                                    <button 
                                        disabled={uploading || !completedCrop}
                                        onClick={processUpload}
                                        className="admin-btn-premium"
                                        style={{ padding: '14px 40px', borderRadius: '12px', border: 'none', background: '#d4af37', color: '#fff', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                                    >
                                        {uploading ? <RefreshCw className="spin" size={18} /> : <Sparkles size={18} />}
                                        {uploading ? 'Processing & Upload...' : 'Save & Publish Asset'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
