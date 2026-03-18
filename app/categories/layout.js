'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, LayoutGrid, IndianRupee } from 'lucide-react';
import '@/src/styles/Shop.css';
import '@/src/styles/Categories.css';

const productCategories = [
    'Favourites',
    'Baby Shower',
    'Bouquet Candle',
    'Pillar Candle',
    'Rakhi',
    'Tealight',
    'Tin Jar Candle',
    'Urli Candle',
    'Valentines'
];

function CategoriesContent({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initial max price from URL or default to 2000
    const initialMax = parseInt(searchParams.get('max')) || 2000;
    const [maxPrice, setMaxPrice] = useState(initialMax);
    const [isMounted, setIsMounted] = useState(false);

    // Determine active category from pathname
    const activeCategory = decodeURIComponent(pathname.split('/').pop());
    const isRootRequest = pathname === '/categories';

    useEffect(() => {
        setIsMounted(true);
    }, []);

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

    const handleCategoryClick = (cat) => {
        // Build query string if filters exist
        const params = new URLSearchParams(searchParams);
        if (params.toString()) {
            router.push(`/categories/${encodeURIComponent(cat)}?${params.toString()}`);
        } else {
            router.push(`/categories/${encodeURIComponent(cat)}`);
        }
    };

    const handleClearFilters = () => {
        setMaxPrice(2000);
        router.push('/categories');
    };

    if (!isMounted) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdfbf7' }}>
            <div style={{ textAlign: 'center', color: '#d4af37', letterSpacing: '2px' }}>Loading...</div>
        </div>
    );

    return (
        <div className="ambre-boutique-shop section categories-layout-wrapper" style={{ background: '#fdfbf7' }}>
            <div className="category-container-full">
                {/* Main Content - No Sidebar */}
                <main className="category-main-content">
                    {children}
                </main>
            </div>
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
