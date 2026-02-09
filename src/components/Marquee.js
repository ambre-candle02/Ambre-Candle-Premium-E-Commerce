'use client';
import { motion } from 'framer-motion';
import styles from '../styles/Home.css'; // Assuming styles will be handled globally or inline for simplicity

export default function Marquee() {
    return (
        <div style={{
            background: 'transparent',
            color: '#1a1a1a',
            padding: '20px 0',
            borderBottom: '1px solid #eaeaea',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div
                style={{
                    display: 'flex',
                    gap: '40px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    fontFamily: '"Playfair Display", serif',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}
            >
                <span>Hand Poured Luxury</span>
                <span>|</span>
                <span>100% Organic Soy Wax</span>
                <span>|</span>
                <span>Artisan Craftsmanship</span>
                <span>|</span>
                <span>Made in India</span>
            </div>
        </div>
    );
}
