import { PRODUCTS } from '@/src/config/products';

export default function sitemap() {
  const baseUrl = 'https://www.ambrecandle.com';

  // Core pages
  const corePages = [
    '',
    '/shop',
    '/collection',
    '/about',
    '/contact',
    '/shipping',
    '/returns',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic product pages
  const productPages = PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Potential category pages (unique categories)
  const categories = [...new Set(PRODUCTS.map(p => p.productType || p.category))];
  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/categories/${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...corePages, ...categoryPages, ...productPages];
}
