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
    maximumScale: 1,
    userScalable: false,
};

export const metadata = {
    metadataBase: new URL('https://www.ambrecandle.com'),
    title: {
        default: "Ambre Candle | Luxury Hand-Poured Scented Candles",
        template: "%s | Ambre Candle"
    },
    description: "Discover the elite collection of luxury hand-poured soy candles at Ambre Candle. Artisan pillars, aromatic jars, and festive gift sets for every occasion. Experience the best scented candles in India.",
    keywords: [
        "scented candles", "luxury candles", "hand-poured candles", "soy candles India", 
        "aroma candles", "decorative candles", "home fragrance", "gift sets", 
        "premium candles", "Ambre Candle", "organic candles", "artisan candles",
        "best candles for home", "luxury gifting India"
    ],
    authors: [{ name: "Ambre Candle Team" }],
    creator: "Ambre Candle",
    publisher: "Ambre Candle",
    openGraph: {
        title: "Ambre Candle | Luxury Artisan Candles",
        description: "Elevate your space with our premium hand-poured soy candles. Discover artisan pillars and aromatic jars.",
        url: 'https://www.ambrecandle.com',
        siteName: 'Ambre Candle',
        images: [
            {
                url: 'https://res.cloudinary.com/dmw5efwf5/image/upload/v1773905349/ambre-candles/Favourites/rlmc6m2snbm9zhemalro.png',
                width: 1200,
                height: 630,
                alt: 'Ambre Candle Luxury Collection',
            },
        ],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Ambre Candle | Luxury Artisan Candles",
        description: "Premium hand-poured soy candles for every occasion.",
        images: ['https://res.cloudinary.com/dmw5efwf5/image/upload/v1773905349/ambre-candles/Favourites/rlmc6m2snbm9zhemalro.png'],
    },
    icons: {
        icon: 'https://res.cloudinary.com/dmw5efwf5/image/upload/w_128,h_128,c_fit/v1773867035/ambre-candles/Favourites/nxssshl9qeqvv7dpfa0j.png',
        apple: 'https://res.cloudinary.com/dmw5efwf5/image/upload/w_256,h_256,c_fit/v1773867035/ambre-candles/Favourites/nxssshl9qeqvv7dpfa0j.png'
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: "jQ7mjafbcvwuDD5hoIopSVqiWgQAjCme_k0K8MdWqQE",
    },
};
import SmoothScroll from "@/src/components/SmoothScroll";

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "Ambre Candle",
                            "url": "https://www.ambrecandle.com",
                            "logo": "https://res.cloudinary.com/dmw5efwf5/image/upload/v1773867035/ambre-candles/Favourites/nxssshl9qeqvv7dpfa0j.png",
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+91-XXXXXXXXXX",
                                "contactType": "customer service"
                            },
                            "sameAs": [
                                "https://www.instagram.com/ambrecandle"
                            ]
                        })
                    }}
                />
            </head>
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
