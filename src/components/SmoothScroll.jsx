'use client';
import { ReactLenis } from 'lenis/react';

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={{ 
        lerp: 0.15, // Slightly faster for snappier feel
        duration: 1.0, 
        smoothWheel: true,
        wheelMultiplier: 1.2,
        touchMultiplier: 1.5,
        smoothTouch: false, // Prevents tiny tap delay on mobile
        infinite: false
    }}>
      {children}
    </ReactLenis>
  );
}
