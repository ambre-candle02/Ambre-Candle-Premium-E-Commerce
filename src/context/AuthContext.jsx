"use client";
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedUser = localStorage.getItem('ambre_user');
                return savedUser ? JSON.parse(savedUser) : null;
            } catch (e) {
                console.error("Auth initialization failed:", e);
                return null;
            }
        }
        return null;
    });
    const loading = false; // Directly setting loading to false

    // The useEffect for initial user loading is no longer needed as useState now handles it.
    // The loading state is also set to false directly.

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('ambre_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ambre_user');
    };

    const signup = (userData) => {
        setUser(userData);
        localStorage.setItem('ambre_user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
