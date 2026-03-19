'use client';
import { useState, useEffect } from 'react';
import { db } from '@/src/config/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export function useSiteConfig() {
    const [config, setConfig] = useState(() => {
        // Initial state from localStorage to prevent flash/loss on refresh
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('ambre_site_config');
            return saved ? JSON.parse(saved) : null;
        }
        return null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "site_config", "general"), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setConfig(data);
                localStorage.setItem('ambre_site_config', JSON.stringify(data));
            }
            setLoading(false);
        }, (error) => {
            console.error("Config fetch error:", error);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const getHero = (page, fallback = '') => config?.hero?.[page] || fallback;
    const getAuth = (page, fallback = '') => config?.auth?.[page] || fallback;
    const getTitle = (section, fallback = '') => config?.titles?.[section] || fallback;
    const getCollectionHero = (category, fallback = '') => config?.collections?.[category] || fallback;

    return { config, loading, getHero, getAuth, getTitle, getCollectionHero };
}
