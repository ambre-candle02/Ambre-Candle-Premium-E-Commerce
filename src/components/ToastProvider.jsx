'use client';

import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function ToastProvider() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Toaster
            position="bottom-center"
            toastOptions={{
                style: {
                    background: '#1a1a1a',
                    color: '#d4af37',
                    border: '1px solid #d4af37',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                }
            }}
        />
    );
}
