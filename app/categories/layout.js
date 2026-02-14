'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PRODUCT_CATEGORIES } from '@/src/config/constants';
import '@/src/styles/Shop.css';
import { ChevronRight, LayoutGrid, IndianRupee, Sparkles } from 'lucide-react';

function CategoriesContent({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initial max price from URL or default to 2000
    const initialMax = parseInt(searchParams.get('max')) || 2000;
    const [maxPrice, setMaxPrice] = useState(initialMax);

    const categories = PRODUCT_CATEGORIES.filter(cat => cat !== 'All');

    // Sync state with URL when slider changes
    const handleSliderChange = (e) => {
        const val = e.target.value;
        setMaxPrice(val);
    };

    const handleSliderCommit = () => {
        const params = new URLSearchParams(searchParams);
        params.set('max', maxPrice);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="sidebar-shop-container">
            {/* Stylish Sidebar - Always Visible */}
            <aside className="shop-sidebar">
                {/* Header Section */}
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '20px',
                        fontSize: '0.75rem',
                        letterSpacing: '4px',
                        color: '#d4af37',
                        fontWeight: '700'
                    }}>
                        <Sparkles size={16} />
                        <span>AMBRE BOUTIQUE</span>
                    </div>

                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '2.4rem',
                        color: '#fff',
                        marginBottom: '5px',
                        fontWeight: '300',
                        letterSpacing: '2px'
                    }}>
                        Artisan
                    </h2>
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.4rem',
                        color: '#fff',
                        marginBottom: '25px',
                        fontWeight: '300',
                        opacity: 0.8,
                        letterSpacing: '5px'
                    }}>
                        Selection
                    </h2>

                    <div style={{
                        width: '50px',
                        height: '2px',
                        background: '#d4af37',
                        margin: '0 auto',
                        boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                    }}></div>
                </div>

                <div className="sidebar-section">
                    <h3 className="section-subtitle"><LayoutGrid size={16} /> Collections</h3>
                    <nav className="sidebar-nav">
                        {categories.map((cat) => {
                            const isActive = pathname.includes(encodeURIComponent(cat));
                            return (
                                <Link
                                    key={cat}
                                    href={`/categories/${encodeURIComponent(cat)}`}
                                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                                >
                                    <span>{cat}</span>
                                    {isActive && <ChevronRight size={14} />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Divider */}
                <div style={{
                    width: '100%',
                    height: '1px',
                    background: 'rgba(212, 175, 55, 0.2)',
                    margin: '35px 0'
                }}></div>

                {/* Price Filter Section */}
                <div className="sidebar-section">
                    <h3 className="section-subtitle"><IndianRupee size={16} /> Price Range</h3>
                    <div className="price-slider-container">
                        <div className="price-labels">
                            <span style={{ color: '#999', fontSize: '0.85rem' }}>₹0</span>
                            <span className="current-max" style={{
                                color: '#d4af37',
                                fontSize: '0.9rem',
                                fontWeight: '700'
                            }}>
                                Up to ₹{maxPrice}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="2000"
                            step="50"
                            value={maxPrice}
                            onChange={handleSliderChange}
                            onMouseUp={handleSliderCommit}
                            onTouchEnd={handleSliderCommit}
                            className="price-slider"
                            style={{
                                width: '100%',
                                height: '6px',
                                borderRadius: '10px',
                                background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${(maxPrice / 2000) * 100}%, rgba(255,255,255,0.1) ${(maxPrice / 2000) * 100}%, rgba(255,255,255,0.1) 100%)`,
                                outline: 'none',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                cursor: 'pointer',
                                marginTop: '15px'
                            }}
                        />
                    </div>
                </div>
            </aside>

            {/* Main Content (Right Side) */}
            <main className="shop-main-view">
                {/* Mobile Category Navigation */}
                <div className="category-bar">
                    <Link href="/shop" className="category-pill">
                        All
                    </Link>
                    {categories.map((cat) => {
                        const isActive = pathname.includes(encodeURIComponent(cat));
                        return (
                            <motion.div key={cat} whileTap={{ scale: 0.9 }}>
                                <Link
                                    href={`/categories/${encodeURIComponent(cat)}`}
                                    className={`category-pill ${isActive ? 'active' : ''}`}
                                >
                                    {cat}
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
                {children}
            </main>
        </div>
    );
}

export default function CategoriesLayout({ children }) {
    return (
        <Suspense fallback={<div>Loading Selection...</div>}>
            <CategoriesContent>{children}</CategoriesContent>
        </Suspense>
    );
}
