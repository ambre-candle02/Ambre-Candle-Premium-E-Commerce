"use client";
import { ReactLenis } from "lenis/react";

function SmoothScrolling({ children }) {
    return (
        <ReactLenis root options={{
            lerp: 0.1,
            duration: 1.2,
            smoothTouch: false, // Disable on touch devices for native feel
            wheelMultiplier: 1,
            touchMultiplier: 2,
        }}>
            {children}
        </ReactLenis>
    );
}

export default SmoothScrolling;
