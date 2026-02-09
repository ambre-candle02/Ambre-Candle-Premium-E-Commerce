'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const mouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    const variants = {
        default: {
            x: mousePosition.x - 10,
            y: mousePosition.y - 10,
            height: 20,
            width: 20,
            backgroundColor: "#d4af37",
            mixBlendMode: "difference"
        },
        hover: {
            x: mousePosition.x - 30,
            y: mousePosition.y - 30,
            height: 60,
            width: 60,
            backgroundColor: "transparent",
            border: "2px solid #d4af37",
            mixBlendMode: "normal"
        }
    };

    return (
        <motion.div
            className="custom-cursor"
            variants={variants}
            animate={isHovering ? "hover" : "default"}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 28
            }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9999
            }}
        />
    );
}
