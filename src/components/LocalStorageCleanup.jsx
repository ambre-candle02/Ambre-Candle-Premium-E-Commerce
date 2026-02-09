'use client';

import { useEffect } from 'react';

/**
 * LocalStorageCleanup - Client component to safely clean corrupted localStorage
 * This prevents hydration errors by running only on the client side
 */
export default function LocalStorageCleanup() {
    useEffect(() => {
        // Safety check to clear corrupted localStorage data
        ['ambre_user', 'ambre_cart', 'ambre_wishlist', 'ambre_orders'].forEach(key => {
            try {
                const data = localStorage.getItem(key);
                if (data) JSON.parse(data);
            } catch (e) {
                console.warn(`Clearing corrupted key: ${key}`);
                localStorage.removeItem(key);
            }
        });
    }, []);

    return null; // This component doesn't render anything
}
