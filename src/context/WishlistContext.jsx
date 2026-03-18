"use client";
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function useWishlist() {
    return useContext(WishlistContext);
}

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount & sync across tabs
    useEffect(() => {
        try {
            const keptWishlist = localStorage.getItem('ambre_wishlist');
            if (keptWishlist) {
                setWishlist(JSON.parse(keptWishlist));
            }
        } catch (e) {
            console.error("Wishlist initialization failed:", e);
        }
        setIsLoaded(true);

        const handleWishlistSync = (e) => {
            if (e.key === 'ambre_wishlist') {
                try {
                    setWishlist(JSON.parse(e.newValue || '[]'));
                } catch (err) {
                    console.error("Wishlist sync error", err);
                }
            }
        };

        window.addEventListener('storage', handleWishlistSync);
        return () => window.removeEventListener('storage', handleWishlistSync);
    }, []);

    // Save to localStorage when wishlist changes, but only after initial load
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('ambre_wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, isLoaded]);

    const addToWishlist = (product) => {
        setWishlist(prev => {
            if (prev.find(item => String(item.id) === String(product.id))) {
                return prev; // Already in wishlist
            }
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id) => {
        setWishlist(prev => prev.filter(item => String(item.id) !== String(id)));
    };

    const isInWishlist = (id) => {
        return wishlist.some(item => String(item.id) === String(id));
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
            toggleWishlist,
            isLoaded
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
