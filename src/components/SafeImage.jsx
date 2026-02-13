'use client';
import React from 'react';
import Image from 'next/image';

/**
 * SafeImage - A resilient image component that leverages next/image for optimization
 * and handles broken paths with multiple fallback strategies.
 */
export default function SafeImage({
    src,
    alt = '',
    className = '',
    style = {},
    onClick,
    priority = false,
    fill = true,
    width,
    height
}) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // Synchronous URL helper
    const getCloudinaryUrl = (originalSrc) => {
        if (!originalSrc || typeof originalSrc !== 'string') return originalSrc || '/images/placeholder.svg';

        if (originalSrc.includes('cloudinary.com')) {
            if (originalSrc.includes('/upload/')) {
                const parts = originalSrc.split('/upload/');
                if (!parts[1].startsWith('f_auto')) {
                    return `${parts[0]}/upload/f_auto,q_auto/${parts[1]}`;
                }
            }
            return originalSrc;
        }

        const basename = originalSrc.split('/').pop().split('?')[0];
        if (cloudName && cloudName !== 'your_cloud_name' && !originalSrc.startsWith('http')) {
            return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/ambre-candles/${basename}`;
        }
        return originalSrc;
    };

    // UseMemo to compute the source synchronously before render
    const initialSrc = React.useMemo(() => getCloudinaryUrl(src), [src, cloudName]);

    const [currentSrc, setCurrentSrc] = React.useState(initialSrc);
    const [tries, setTries] = React.useState(0);

    const handleError = () => {
        const basename = (typeof src === 'string') ? src.split('/').pop().split('?')[0] : '';
        const fallbacks = [
            src && typeof src === 'string' && !src.startsWith('http') ? src : null,
            `/images/products/${basename}`,
            `/images/new_arrivals/${basename}`,
            `/images/hero/${basename}`,
            `/images/dessert/${basename}`,
            '/images/placeholder.svg'
        ].filter(Boolean);

        if (tries < fallbacks.length) {
            setCurrentSrc(fallbacks[tries]);
            setTries(prev => prev + 1);
        } else {
            setCurrentSrc('/images/placeholder.svg');
        }
    };

    // Keep state in sync with computed initialSrc
    React.useEffect(() => {
        setCurrentSrc(initialSrc);
        setTries(0);
    }, [initialSrc]);

    const imgProps = {
        src: currentSrc || '/images/placeholder.svg',
        alt: alt || 'Ambre Candle Product',
        className: className,
        style: { ...style },
        onError: handleError,
        onClick: onClick,
        priority: priority,
    };

    if (fill) {
        return (
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <Image
                    {...imgProps}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: style.objectFit || 'cover' }}
                />
            </div>
        );
    }

    return (
        <Image
            {...imgProps}
            width={width || 500}
            height={height || 500}
        />
    );
}
