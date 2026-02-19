import { PRODUCTS } from './src/config/products.js';
import fs from 'fs';

const lines = PRODUCTS.map(p => `ID: ${p.id} | Name: ${p.name} | Type: ${p.productType}`);
fs.writeFileSync('products_list.txt', lines.join('\n'));
console.log(`Listed ${PRODUCTS.length} products to products_list.txt`);
