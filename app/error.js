'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f8f8',
            color: '#1a1a1a',
            fontFamily: 'Lato, sans-serif',
            textAlign: 'center',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', marginBottom: '10px' }}>Something went wrong!</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>Don't worry, our artisans are looking into it.</p>

                <button
                    onClick={() => reset()}
                    style={{
                        padding: '12px 30px',
                        background: '#1a1a1a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    Try again
                </button>
            </motion.div>
        </div>
    );
}
