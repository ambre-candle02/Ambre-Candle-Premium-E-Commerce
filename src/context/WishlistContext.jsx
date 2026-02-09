"use client";
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function useWishlist() {
    return useContext(WishlistContext);
}

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const keptWishlist = localStorage.getItem('ambre_wishlist');
                return keptWishlist ? JSON.parse(keptWishlist) : [];
            } catch (e) {
                console.error("Wishlist initialization failed:", e);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('ambre_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        setWishlist(prev => {
            if (prev.find(item => item.id === product.id)) {
                return prev; // Already in wishlist
            }
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id) => {
        setWishlist(prev => prev.filter(item => item.id !== id));
    };

    const isInWishlist = (id) => {
        return wishlist.some(item => item.id === id);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            toggleWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
