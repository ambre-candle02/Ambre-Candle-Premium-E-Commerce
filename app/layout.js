// Update Trigger: Syncing latest mobile & admin fixes
import { Inter, Playfair_Display } from "next/font/google";
import { Suspense } from 'react';
import "./globals.css";
import "@/src/styles/Navbar.css";
import "@/src/styles/Footer.css";
import "@/src/styles/Home.css";
import "@/src/styles/Shop.css";
import "@/src/styles/ProductDetail.css";
import "@/src/styles/Cart.css";
import "@/src/styles/Checkout.css";
import "@/src/styles/AuthModern.css";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

import { AuthProvider } from "@/src/context/AuthContext";
import { CartProvider } from "@/src/context/CartContext";
import { WishlistProvider } from "@/src/context/WishlistContext";
import SmartAuthOverlay from "@/src/components/SmartAuthOverlay";
import FloatingHelp from "@/src/components/FloatingHelp";
import LocalStorageCleanup from "@/src/components/LocalStorageCleanup";
import { Toaster } from 'react-hot-toast';
import ScrollToTop from "@/src/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });
export const viewport = {
    width: 'device-width',
    initialScale: 1,
};

export const metadata = {
    title: "Ambre Candle | Luxury Hand-Poured Scented Candles",
    description: "Discover the elite collection of luxury hand-poured soy candles at Ambre Candle. Artisan pillars, aromatic jars, and festive gift sets for every occasion.",
    icons: {
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231a1a1a' rx='20'/><text x='50' y='74' font-family='serif' font-weight='bold' font-size='75' fill='%23d4af37' text-anchor='middle'>A</text></svg>",
        apple: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231a1a1a' rx='20'/><text x='50' y='74' font-family='serif' font-weight='bold' font-size='75' fill='%23d4af37' text-anchor='middle'>A</text></svg>"
    }
};
import SmoothScroll from "@/src/components/SmoothScroll";

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning={true}>
                <ScrollToTop />
                <Toaster position="bottom-center" toastOptions={{
                    style: {
                        background: '#1a1a1a',
                        color: '#d4af37',
                        border: '1px solid #d4af37',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }
                }} />
                <LocalStorageCleanup />
                <AuthProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <Navbar />
                            <Suspense fallback={null}>
                                <SmartAuthOverlay />
                            </Suspense>
                            <SmoothScroll>
                                <main>{children}</main>
                            </SmoothScroll>
                            <FloatingHelp />
                            <Footer />
                        </WishlistProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
