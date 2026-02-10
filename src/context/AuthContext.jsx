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

    // Monitor Firebase Auth State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
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

    const logout = () => {
        return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
