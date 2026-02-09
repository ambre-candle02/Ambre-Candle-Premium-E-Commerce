'use client';
import { useCart } from '@/src/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, subtotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="cart-empty section">
                <div className="container cart-empty-container">
                    <div className="empty-icon-wrapper">
                        <ShoppingBag size={64} strokeWidth={1} />
                    </div>
                    <h2 className="cart-empty-title">Your Box is Empty</h2>
                    <p className="cart-empty-text">The perfect scent is waiting for you.</p>
                    <Link href="/shop" className="btn-primary btn-shop-now">Explore Collection</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page section">
            <div className="container">
                <h1 className="cart-page-title">Your Bag</h1>
                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.map((item) => (
                            <motion.div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p className="item-category">{item.category}</p>
                                    <div className="item-controls">
                                        <div className="quantity-control">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="item-price">
                                    <p>Rs. {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>Rs. {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>Rs. {subtotal.toFixed(2)}</span>
                        </div>
                        <Link href="/checkout" className="btn-primary checkout-btn">
                            Order Now <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
