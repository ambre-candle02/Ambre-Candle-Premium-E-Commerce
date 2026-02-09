'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const products = [
        {
            id: 801,
            name: 'Bouquet candle',
            category: 'Pillar Candle',
            price: 250,
            image: 'https://www.ambrecandle.com/cdn/shop/files/b97213b8-3e2f-4858-8f85-684ded0f7ecf_3294eca4-a32a-4bd7-9a47-7d94dcae5102.jpg?v=1761578738',
            description: 'Intricately sculpted floral bouquet candle hand-poured with premium soy wax.'
        },
        {
            id: 802,
            name: 'Bubble candle',
            category: 'Pillar Candle',
            price: 120,
            image: 'https://www.ambrecandle.com/cdn/shop/files/2c681722-e4f6-4308-b097-968026bc85b1.jpg?v=1760297485',
            description: 'Minimalist aesthetic bubble pillar candle, perfect for home decor.'
        },
        {
            id: 803,
            name: 'Daisy candle (Set of 4)',
            category: 'Gift Set',
            price: 100,
            image: 'https://www.ambrecandle.com/cdn/shop/files/WhatsAppImage2025-10-07at11.34.53AM_1.jpg?v=1759819864',
            description: 'Set of 4 delicate daisy-shaped candles, perfect for gifting.'
        },
        {
            id: 804,
            name: 'Daisy jar candle',
            category: 'Jar Candle',
            price: 200,
            image: 'https://www.ambrecandle.com/cdn/shop/files/a96c2a84-b8d9-4f81-8634-828506ac3fe9.jpg?v=1760269864',
            description: 'Elegant jar topped with a daisy motif and calming fragrance.'
        },
        {
            id: 805,
            name: 'Flower Heart (Set of 2)',
            category: 'Gift Set',
            price: 120,
            image: 'https://www.ambrecandle.com/cdn/shop/files/8edaaddf-1693-4475-aaf9-5464343fd7d4.jpg?v=1760274931',
            description: 'Beautiful heart-shaped floral candles, ideal for romantic settings.'
        },
        {
            id: 806,
            name: 'Flower Urli Candle',
            category: 'Tealight',
            price: 350,
            image: 'https://www.ambrecandle.com/cdn/shop/files/bd4dcff1-2d70-4173-ada6-bed7cf51ab70.jpg?v=1760296634',
            description: 'Traditional metal urli with floating floral candles.'
        },
        {
            id: 807,
            name: 'Sandalwood Urli',
            category: 'Tealight',
            price: 350,
            image: 'https://www.ambrecandle.com/cdn/shop/files/185dcfa6-6cab-4306-bd57-b27a38c77d35.jpg?v=1760275359',
            description: 'Rich sandalwood scented urli candle for deep relaxation.'
        },
        {
            id: 808,
            name: 'Ladoo candle (pack of 4)',
            category: 'Gift Set',
            price: 150,
            image: 'https://www.ambrecandle.com/cdn/shop/files/7370bac1-67cd-4f34-898a-a43667f9ff81.jpg?v=1759939529',
            description: 'Hyper-realistic ladoo-shaped festive candles with cardamom scent.'
        },
        {
            id: 809,
            name: 'Lotus Candle (Set of 2)',
            category: 'Gift Set',
            price: 500,
            image: 'https://www.ambrecandle.com/cdn/shop/files/276bee9d-72cc-4fc4-affa-588cc5772cf2.jpg?v=1760193469',
            description: 'Premium twin lotus designs for auspicious occasions.'
        },
        {
            id: 810,
            name: 'Lotus Urli (Small)',
            category: 'Tealight',
            price: 250,
            image: 'https://www.ambrecandle.com/cdn/shop/files/c7f9a190-a257-4656-b9ba-ac55e896c465.jpg?v=1760272062',
            description: 'Compact lotus urli for elegant table settings.'
        },
        {
            id: 811,
            name: 'Lotus Urli (Large)',
            category: 'Tealight',
            price: 399,
            image: 'https://www.ambrecandle.com/cdn/shop/files/dd00ec79-d22f-4a5c-a03f-8115101b3d7a.jpg?v=1760275135',
            description: 'Grand lotus urli centerpiece for festive decor.'
        },
        {
            id: 812,
            name: 'Mini Bubble Candle',
            category: 'Pillar Candle',
            price: 130,
            image: 'https://www.ambrecandle.com/cdn/shop/files/7eb94026-cffe-44ba-93cf-3f1dff92e08c.jpg?v=1760297002',
            description: 'Cute mini bubble candle, perfect for favors and small spaces.'
        },
        {
            id: 813,
            name: 'Ocean Jar Candle',
            category: 'Jar Candle',
            price: 299,
            image: 'https://www.ambrecandle.com/cdn/shop/files/c5bddc45-0e6a-4415-8666-a2ce7e37b70e.png?v=1760273973',
            description: 'Refreshing ocean mist fragrance ensuring a spa-like experience.'
        },
        {
            id: 814,
            name: 'Amber Sunflower',
            category: 'Tealight',
            price: 320,
            image: 'https://www.ambrecandle.com/cdn/shop/files/9e692ddb-43fe-48d3-b869-fe6fcb9203a7.png?v=1761584004',
            description: 'Warm amber warmth combined with a unique sunflower design.'
        },
        {
            id: 815,
            name: 'Peacock Urli Candle',
            category: 'Tealight',
            price: 299,
            image: 'https://www.ambrecandle.com/cdn/shop/files/f9b6153e-2773-4b06-93d0-d96f33784619.jpg?v=1761584280',
            description: 'Intricately designed peacock urli candle for traditional settings.'
        },
        {
            id: 816,
            name: 'Peacock Urli (Spice)',
            category: 'Tealight',
            price: 399,
            image: 'https://www.ambrecandle.com/cdn/shop/files/332be99a-2ead-4f6c-b148-e800e9394104.jpg?v=1761584422',
            description: 'A premium spicy aromatic candle with cinnamon notes.'
        },
        {
            id: 817,
            name: 'Chamomile & Lavender Jar',
            category: 'Jar Candle',
            price: 200,
            image: 'https://www.ambrecandle.com/cdn/shop/files/a96c2a84-b8d9-4f81-8634-828506ac3fe9.jpg?v=1760269864',
            description: 'Soothing chamomile and lavender notes for a peaceful sleep.'
        },
        {
            id: 818,
            name: 'Rose Garden Set',
            category: 'Gift Set',
            price: 350,
            image: 'https://www.ambrecandle.com/cdn/shop/files/8edaaddf-1693-4475-aaf9-5464343fd7d4.jpg?v=1760274931',
            description: 'A romantic collection of rose-infused floral candles.'
        },
        {
            id: 819,
            name: 'Peony candle',
            category: 'Flower Candle',
            price: 130,
            image: '/images/new_arrivals/peony_candle.jpg',
            description: 'Beautifully sculpted peony flower candle.'
        },
        {
            id: 820,
            name: 'Rasmalai candle',
            category: 'Dessert Candle',
            price: 120,
            image: '/images/new_arrivals/rasmalai_candle.jpg',
            description: 'Sweet and delightful Rasmalai shaped candle.'
        },
        {
            id: 821,
            name: 'Rose (set of 2)',
            category: 'Flower Candle',
            price: 120,
            image: '/images/new_arrivals/rose__set_of_2_.jpg',
            description: 'Pair of elegant rose shaped candles.'
        },
        {
            id: 822,
            name: 'Rose pillar candle',
            category: 'Pillar Candle',
            price: 150,
            image: '/images/new_arrivals/rose_pillar_candle.jpg',
            description: 'Classic pillar candle with rose engravings.'
        },
        {
            id: 823,
            name: 'Snake pillar candle',
            category: 'Shape Candle',
            price: 199,
            image: '/images/new_arrivals/snake_pillar_candle.jpg',
            description: 'Unique snake design pillar candle.'
        },
        {
            id: 824,
            name: 'Strip pillar candle (set of2)',
            category: 'Pillar Candle',
            price: 299,
            image: '/images/new_arrivals/strip_pillar_candle__set_of2_.jpg',
            description: 'Modern striped pillar candles (Set of 2).'
        },
        {
            id: 825,
            name: 'Sunflower urli candle',
            category: 'Diya',
            price: 150,
            image: '/images/new_arrivals/sunflower_urli_candle.jpg',
            description: 'Festive sunflower shaped urli candle.'
        },
        {
            id: 826,
            name: 'Sunflower urli candle (6.5inch)',
            category: 'Diya',
            price: 400,
            image: '/images/new_arrivals/sunflower_urli_candle__6_5inch_.jpg',
            description: 'Large statement sunflower urli candle (6.5 inch).'
        },
        {
            id: 827,
            name: 'Teddy bear scented candles',
            category: 'Shape Candle',
            price: 119,
            image: '/images/new_arrivals/teddy_bear_scented_candles.jpg',
            description: 'Adorable teddy bear scented candle.'
        },
        {
            id: 828,
            name: 'Tulip candle',
            category: 'Flower Candle',
            price: 200,
            image: '/images/new_arrivals/tulip_candle.jpg',
            description: 'Elegant tulip shaped candle.'
        },
        {
            id: 901,
            name: 'First Light',
            category: 'Jar Series',
            price: 55,
            image: '/images/first-light-opt.jpg',
            description: 'A gentle, morning-fresh fragrance that fills the room with soft light.'
        },
        {
            id: 902,
            name: 'Rich Lavender',
            category: 'Aromatherapy',
            price: 640,
            image: '/images/rich-lavender-opt.jpg',
            description: 'Pure, calming lavender essential oils for ultimate relaxation.'
        },
        {
            id: 903,
            name: 'Sacred Garden',
            category: 'Jar Series',
            price: 925,
            image: '/images/sacred-garden-opt.png',
            description: 'An exotic blend of floral notes inspired by ancient temples.'
        }
    ];

    const product = products.find(p => p.id === parseInt(id));

    if (!product) return <div className="container section">Product not found</div>;

    return (
        <div className="product-detail-v5 section">
            <div className="container">
                <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px', color: '#666' }}>
                    <ArrowLeft size={16} /> Back to Shop
                </Link>

                <div className="detail-layout-v5">
                    <motion.div
                        className="main-visual-v5"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="main-visual-container" style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', height: '100%', position: 'relative', minHeight: '500px' }}>
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </motion.div>

                    <div className="main-info-v5">
                        <span className="p-cat-v5">{product.category}</span>
                        <h1>{product.name}</h1>
                        <p className="p-price-v5">Rs. {product.price.toFixed(2)}</p>
                        <p className="p-desc-v5">{product.description}</p>

                        <div className="p-actions-v5">
                            <div className="qty-v5">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                            </div>
                            <button className="add-v5-big" onClick={() => addToCart({ ...product, quantity })}>
                                Add to Cart
                            </button>
                        </div>

                        <div className="product-trust-badges-v5">
                            <div className="trust-badge-v5">
                                <span className="trust-icon-v5">🌿</span>
                                <span>100% Organic Soy Wax</span>
                            </div>
                            <div className="trust-badge-v5">
                                <span className="trust-icon-v5">🚚</span>
                                <span>Free Shipping above Rs. 999</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
