/**
 * Script: delete-all-products.mjs
 * Deletes ALL documents from the Firestore 'products' collection.
 * Run: node scripts/delete-all-products.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAgxslTs9BtrmQgvA1zaeP0yIdotUZQO5U",
    authDomain: "ambre-candle-product-catalog.firebaseapp.com",
    projectId: "ambre-candle-product-catalog",
    storageBucket: "ambre-candle-product-catalog.firebasestorage.app",
    messagingSenderId: "694492559564",
    appId: "1:694492559564:web:fba507b7435d4e0bc62a69"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteAllProducts() {
    console.log('🔥 Connecting to Firestore...');

    try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);

        if (snapshot.empty) {
            console.log('✅ No products found. Collection is already empty!');
            process.exit(0);
        }

        console.log(`📦 Found ${snapshot.size} products. Deleting...`);

        const deletePromises = snapshot.docs.map(d => {
            console.log(`   ❌ Deleting product: ${d.id}`);
            return deleteDoc(doc(db, 'products', d.id));
        });

        await Promise.all(deletePromises);

        console.log(`\n✅ SUCCESS! All ${snapshot.size} products deleted from Firestore.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error deleting products:', error.message);
        process.exit(1);
    }
}

deleteAllProducts();
