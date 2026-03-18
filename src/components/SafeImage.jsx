'use client';
import React, { useState } from 'react';
import Image from 'next/image';

/**
 * SafeImage - Optimized resilient image component with fast loading
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
    const [isLoaded, setIsLoaded] = useState(false);
    const [errorTries, setErrorTries] = useState(0);

    const getCloudinaryUrl = (originalSrc) => {
        if (!originalSrc || typeof originalSrc !== 'string') return originalSrc || '/images/placeholder.svg';
        return originalSrc;
    };

    const initialSrc = React.useMemo(() => getCloudinaryUrl(src), [src]);

    const basename = (typeof src === 'string') ? src.split('/').pop().split('?')[0] : '';
    const fallbacks = [
        src && typeof src === 'string' && !src.startsWith('http') ? src : null,
        `/images/products/${basename}`,
        `/images/new_arrivals/${basename}`,
        `/images/hero/${basename}`,
        `/images/dessert/${basename}`,
        '/images/placeholder.svg'
    ].filter(Boolean);

    let currentSrc = initialSrc;
    if (errorTries > 0 && errorTries <= fallbacks.length) {
        currentSrc = fallbacks[errorTries - 1];
    } else if (errorTries > fallbacks.length) {
        currentSrc = '/images/placeholder.svg';
    }

    const handleError = () => {
        setErrorTries(prev => prev + 1);
    };

    const handleLoadingComplete = () => {
        setIsLoaded(true);
    };

    const imgProps = {
        src: currentSrc || '/images/placeholder.svg',
        alt: alt || 'Ambre Candle Product',
        className: className,
        onError: handleError,
        onClick: onClick,
        priority: priority || false,
        onLoadingComplete: handleLoadingComplete,
    };

    if (fill) {
        return (
            <div
                style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    overflow: 'hidden',
                    backgroundColor: '#f5efe6'
                }}
                suppressHydrationWarning
            >
                <Image
                    {...imgProps}
                    fill
                    unoptimized={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                        objectFit: style.objectFit || 'cover',
                        ...style,
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        top: 0,
                        left: 0,
                        opacity: isLoaded ? 1 : 0.8,
                        transition: 'opacity 0.3s ease'
                    }}
                />
            </div>
        );
    }

    return (
        <Image
            {...imgProps}
            unoptimized={true}
            width={width || 500}
            height={height || 500}
        />
    );
}
