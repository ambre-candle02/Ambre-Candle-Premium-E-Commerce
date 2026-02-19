'use client';
import { useState } from 'react';
import { db } from '@/src/config/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { PRODUCTS } from '@/src/config/products';

export default function MigratePage() {
    const [status, setStatus] = useState('Ready');
    const [loading, setLoading] = useState(false);

    const runMigration = async () => {
        setLoading(true);
        setStatus('Migrating...');
        try {
            const productsCollection = collection(db, 'products');
            const batch = writeBatch(db);

            PRODUCTS.forEach((product) => {
                const docRef = doc(productsCollection, product.id.toString());
                batch.set(docRef, {
                    ...product,
                    updatedAt: new Date().toISOString()
                });
            });

            await batch.commit();
            setStatus(`Success! Migrated ${PRODUCTS.length} products.`);
        } catch (error) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <h1>Migration Tool</h1>
            <p>Target: Firebase Firestore Collection "products"</p>
            <p>Source: products.js ({PRODUCTS.length} items)</p>
            <button
                onClick={runMigration}
                disabled={loading}
                style={{
                    padding: '15px 30px',
                    fontSize: '18px',
                    background: '#d4af37',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}
            >
                {loading ? 'Migrating...' : 'Start Migration'}
            </button>
            <p>{status}</p>
        </div>
    );
}
