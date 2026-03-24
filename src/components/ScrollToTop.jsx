'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // Force scroll to top on path change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Instant is better for navigation to prevent "catching" mid-scroll
        });
    }, [pathname]);

    return null;
}
