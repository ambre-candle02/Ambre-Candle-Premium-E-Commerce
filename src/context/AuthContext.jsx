"use client";
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Monitor Firebase Auth State & Cross-tab logout
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        const handleStorageSync = (e) => {
            // If admin session or auth-related keys are removed in another tab
            if (e.key === 'ambre_admin_session' && !e.newValue) {
                window.location.reload(); // Force refresh to drop admin state
            }
            if (e.key === null) {
                // localStorage.clear() was called in another tab (logout)
                window.location.href = '/';
            }
        };

        window.addEventListener('storage', handleStorageSync);
        return () => {
            unsubscribe();
            window.removeEventListener('storage', handleStorageSync);
        };
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signup = async (name, email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update the user's display name
        await updateProfile(userCredential.user, {
            displayName: name
        });
        // Force update local user state to include display name immediately
        setUser({ ...userCredential.user, displayName: name });
        return userCredential;
    };

    const logout = async () => {
        await signOut(auth);

        // SECURITY: Clear all user-specific data from storage on logout
        // This prevents the next person on this computer from seeing your stuff
        localStorage.removeItem('ambre_cart');
        localStorage.removeItem('ambre_wishlist');
        localStorage.removeItem('ambre_admin_session');
        sessionStorage.removeItem('ambre_admin_session');

        // Refresh page or state to trigger context clears
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
