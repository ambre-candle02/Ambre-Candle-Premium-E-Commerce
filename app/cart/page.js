'use client';
import { useCart } from '@/src/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '@/src/components/SafeImage';
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useSiteConfig } from '@/src/hooks/useSiteConfig';
import { useMemo } from 'react';
import '@/src/styles/Cart.css';

const COLLECTIONS_STATIC = [
  { title: "The Hampers", subtitle: "Golden Glow Candle", img: "/images/hd/hampers_hd.png", path: "/categories/Hampers | Combo", key: "Hampers | Combo" },
  { title: "The Glass Jars", subtitle: "Artisan Selection", img: "/images/hd/jars_hd.png", path: "/categories/Glass Jar Candle", key: "Glass Jar Candle" },
  { title: "The Bouquets", subtitle: "Floral Series", img: "/images/hd/bouquets_hd.png", path: "/categories/Bouquet Candle", key: "Bouquet Candle" },
  { title: "The Festive", subtitle: "Divine Series", img: "https://res.cloudinary.com/dmw5efwf5/image/upload/q_auto,f_auto,w_1200/v1770837023/ambre-candles/Diwali/ixm6kmfkiwgbu57zrztm.jpg", path: "/categories/Diwali", key: "Diwali" }
];

export default function CartPage() {
  const { cart: cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { getHero, config, getCollectionHero } = useSiteConfig();
  const heroBanner = getHero('cart');

  const finalCollections = useMemo(() => {
    return COLLECTIONS_STATIC.map(col => ({
        ...col,
        img: getCollectionHero(col.key) || col.img
    }));
  }, [config?.collections]);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-misa">
        <div className="cart-hero-portal" style={{ 
            backgroundImage: `url(${heroBanner || 'https://images.unsplash.com/photo-1595433707802-680461ff44a0?q=80&w=2000'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
          <div className="misa-hero-overlay"></div>
          <motion.span className="misa-hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Private Selection</motion.span>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>Your Collection</motion.h1>
          <p>A curated selection of your favorite artisan pieces, hand-crafted to illuminate your most cherished moments.</p>
        </div>

        <div className="misa-empty-cart">
          <motion.div className="misa-empty-orb" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <ShoppingBag size={60} strokeWidth={1} />
          </motion.div>
          <h2>Your bag is currently empty</h2>
          <Link href="/shop" className="btn-boutique-order" style={{ maxWidth: '300px' }}>
            Explore Boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-misa">
      {/* Full-Width Premium Hero */}
      <div className="cart-hero-portal" style={{ 
          backgroundImage: `url(${heroBanner || 'https://images.unsplash.com/photo-1595433707802-680461ff44a0?q=80&w=2000'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
      }}>
        <div className="misa-hero-overlay"></div>
        <div className="cart-back-btn-wrapper">
          <button onClick={() => router.back()} className="btn-luxury-back">
            <ArrowLeft size={16} /> Back
          </button>
        </div>
        <motion.span
          className="misa-hero-subtitle"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Private Selection
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Your Collection
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          A curated selection of your favorite artisan pieces, hand-crafted to illuminate your most cherished moments.
        </motion.p>
      </div>

      <div className="cart-layout-misa">
        {/* Items List */}
        <div className="cart-items-column">
          <AnimatePresence mode='popLayout'>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="misa-cart-card"
              >
                <div className="misa-cart-card-img">
                  <Link href={`/product/${item.id}`} style={{ display: 'block', height: '100%', width: '100%' }}>
                    <SafeImage src={item.image} alt={item.name} />
                  </Link>
                </div>

                <div className="misa-cart-card-info">
                  <span className="misa-item-badge">ARTISAN SERIES</span>
                  <Link href={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="misa-item-title">{item.name}</h3>
                  </Link>
                  <div className="misa-cart-controls-row">
                    <div className="misa-qty-group">
                      <div className="misa-qty-stepper">
                        <button className="btn-qty" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button className="btn-qty" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="misa-item-unit-price-wrap">
                        <span className="currency-symbol">₹</span>
                        <span className="unit-price-value">{item.price}</span>
                      </div>
                    </div>

                    <button className="misa-trash-btn-new" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Sticky */}
        <div className="cart-summary-column">
          <div className="misa-summary-sticky">
            <h2 className="summary-title-caps">COLLECTION SUMMARY</h2>

            <div className="summary-rows-group">
              <div className="summary-row-misa">
                <span>Boutique Subtotal</span>
                <span>
                  <span className="currency-symbol">₹</span>{subtotal}
                </span>
              </div>

              <div className="summary-row-misa complimentary">
                <span>Artisan Delivery</span>
                <span>Complimentary</span>
              </div>
            </div>

            <div className="summary-total-misa">
              <span className="total-label-huge">Total</span>
              <div className="total-amount-huge">
                <span className="currency-symbol">₹</span>{subtotal}
              </div>
            </div>

            <div className="misa-trust-badges">
              <div className="trust-item">
                <ShieldCheck size={16} />
                <span>Authenticity Guaranteed</span>
              </div>
              <div className="trust-item">
                <Truck size={16} />
                <span>Premium Insured Shipping</span>
              </div>
            </div>

            <button className="btn-boutique-complete" onClick={() => router.push('/checkout')}>
              SECURE CHECKOUT <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Explore Section */}
      <section className="explore-signatures-misa">
        <div className="section-accent-line"></div>
        <h2>Explore Signature Collections</h2>
        <div className="collection-swiper-wrapper">
          {isMounted && (
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              centeredSlides={true}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2.2, centeredSlides: false },
                1024: { slidesPerView: 4, spaceBetween: 20, centeredSlides: false }
              }}
              className="collection-swiper-boutique"
            >
              {finalCollections.map((col, idx) => (
                <SwiperSlide key={idx}>
                  <Link href={col.path} className="col-card-misa">
                    <SafeImage src={col.img} alt={col.title} priority={idx < 2} />
                    <div className="col-overlay-info">
                      <span>{col.subtitle}</span>
                      <h3>{col.title}</h3>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>
    </div>
  );
}
