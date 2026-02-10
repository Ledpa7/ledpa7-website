import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Cursor: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isClicked, setIsClicked] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Check if hovering over clickable elements
            const target = e.target as HTMLElement;
            const isClickable = target.closest('a, button, .te-item') !== null;
            setIsHovering(isClickable);
        };

        const handleMouseDown = () => setIsClicked(true);
        const handleMouseUp = () => setIsClicked(false);

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <motion.div
                className="absolute bg-[#FF0000] z-[9999]"
                animate={{
                    x: mousePosition.x - (isHovering ? 12 : 6),
                    y: mousePosition.y - (isHovering ? 12 : 6),
                    width: isHovering ? 24 : 12,
                    height: isHovering ? 24 : 12,
                    scale: isClicked ? 0.8 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 1500,
                    damping: 40,
                    mass: 0.1
                }}
            />

            {/* Click Ripple Effect - Industrial Square Pulse */}
            <AnimatePresence>
                {isClicked && (
                    <motion.div
                        key="click-pulse"
                        className="absolute border-2 border-[#FF0000]"
                        initial={{
                            x: mousePosition.x - 6,
                            y: mousePosition.y - 6,
                            width: 12,
                            height: 12,
                            opacity: 1,
                        }}
                        animate={{
                            x: mousePosition.x - 25,
                            y: mousePosition.y - 25,
                            width: 50,
                            height: 50,
                            opacity: 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                )}
            </AnimatePresence>

            {/* Crosshair lines on click for precision feel */}
            <AnimatePresence>
                {isClicked && (
                    <>
                        <motion.div
                            initial={{ width: 0, opacity: 1 }}
                            animate={{ width: 200, opacity: 0 }}
                            className="absolute h-[1px] bg-[#FF0000]"
                            style={{ top: mousePosition.y, left: mousePosition.x - 100 }}
                        />
                        <motion.div
                            initial={{ height: 0, opacity: 1 }}
                            animate={{ height: 200, opacity: 0 }}
                            className="absolute w-[1px] bg-[#FF0000]"
                            style={{ left: mousePosition.x, top: mousePosition.y - 100 }}
                        />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
