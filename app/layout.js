// Rebuild Trigger
import { Inter, Playfair_Display } from "next/font/google";
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



const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });
export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata = {
    title: "Ambre Candle | Luxury Hand-Poured Scented Candles",
    description: "Discover the elite collection of luxury hand-poured soy candles at Ambre Candle. Artisan pillars, aromatic jars, and festive gift sets for every occasion.",
};
export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
                <LocalStorageCleanup />
                <AuthProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <Navbar />
                            <SmartAuthOverlay />
                            <main>{children}</main>
                            <FloatingHelp />
                            <Footer />
                        </WishlistProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
