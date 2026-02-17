"use client";
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Initialize cart from local storage only on client side to prevent hydration errors
    useEffect(() => {
        const savedCart = localStorage.getItem('ambre_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Sync cart to local storage whenever it changes, but only after initialization
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('ambre_cart', JSON.stringify(cart));
        }
    }, [cart, isInitialized]);

    const addToCart = (product) => {
        const quantityToAdd = product.quantity || 1;

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantityToAdd }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: quantityToAdd }];
        });
        setIsCartOpen(true); // Open cart when adding item
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            subtotal,
            totalItems
        }}>
            {children}
        </CartContext.Provider>
    );
};
