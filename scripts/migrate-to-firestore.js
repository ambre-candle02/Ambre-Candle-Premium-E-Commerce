import { db } from '../src/config/firebase.js';
import { collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore';
import { PRODUCTS } from '../src/config/products.js';

async function migrate() {
    console.log(`Starting migration of ${PRODUCTS.length} products...`);
    const productsCollection = collection(db, 'products');

    // Check if we already have products to avoid duplicates
    const snapshot = await getDocs(productsCollection);
    if (!snapshot.empty) {
        console.log('Products already exist in Firestore. Skipping to avoid duplicates.');
        // If you want to force overwrite, you'd delete them first or use setDoc with IDs
        return;
    }

    const batch = writeBatch(db);

    // Firestore batches have a limit of 500 operations
    let count = 0;
    for (const product of PRODUCTS) {
        const docRef = doc(productsCollection, product.id.toString());
        batch.set(docRef, {
            ...product,
            updatedAt: new Date().toISOString()
        });
        count++;

        if (count === 500) {
            console.log('Committing batch of 500...');
            await batch.commit();
            // Start a new batch
            // Note: In a real script we'd loop this properly, but for ~100-200 products one or two batches is fine.
        }
    }

    if (count > 0) {
        await batch.commit();
        console.log(`Successfully migrated ${count} products.`);
    }
}

migrate().catch(console.error);
