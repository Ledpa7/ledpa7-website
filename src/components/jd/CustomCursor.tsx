"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // Move cursor logic
        const moveCursor = (e: MouseEvent) => {
            // Use standard CSS transform for performance
            // Subtract half width/height (10px) to center
            cursor.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
        };

        window.addEventListener("mousemove", moveCursor);

        // Optional: Add hover effect for clickable elements
        // We can add a class to the cursor when hovering links
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
                cursor.classList.add('hovering');
            } else {
                cursor.classList.remove('hovering');
            }
        };

        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          background-color: var(--accent-primary);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          transition: width 0.2s, height 0.2s, background-color 0.2s;
          will-change: transform;
        }
        .custom-cursor.hovering {
            width: 40px;
            height: 40px;
            opacity: 0.5;
            transform: translate3d(-20px, -20px, 0) !important;
        }
      `}} />
            <div
                ref={cursorRef}
                className="custom-cursor"
                style={{
                    // Start off-screen
                    transform: 'translate3d(-100px, -100px, 0)'
                }}
            />
        </>
    );
}
