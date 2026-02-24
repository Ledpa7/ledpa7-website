'use client';

import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import styles from './MagnifiedImage.module.css';

interface MagnifiedImageProps {
    src: string;
    alt: string;
    className?: string;
    zoom?: number;
    magSize?: number;
    useNativeResolution?: boolean;
}

import { createPortal } from 'react-dom';

const MagnifiedImage = ({ src, alt, className, zoom = 2.5, magSize = 150, useNativeResolution = false }: MagnifiedImageProps) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    // State to track if we have valid initial coordinates to show the lens
    const [isActive, setIsActive] = useState(false);
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

    // Refs
    const magnifierRef = useRef<HTMLDivElement>(null);
    const innerImgRef = useRef<HTMLImageElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Live Inputs
    const mouseRef = useRef({ x: 0, y: 0 });
    const currentGlobalPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        setPortalContainer(document.body);
    }, []);

    const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        mouseRef.current = { x: clientX, y: clientY };
        // Snap immediately to start position (no lerp for first frame)
        currentGlobalPos.current = { x: clientX, y: clientY };
        setShowMagnifier(true);

        // Delay revealing the magnifier to ensure the first frame has positioned it correctly.
        // This prevents the "flash at 0,0" issue.
        setTimeout(() => {
            setIsActive(true);
        }, 50);
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
        setShowMagnifier(false);
        setIsActive(false);
    };

    useEffect(() => {
        if (!showMagnifier) return;

        let animationFrameId: number;

        const loop = () => {
            if (!containerRef.current || !magnifierRef.current || !innerImgRef.current || !imgRef.current) {
                animationFrameId = requestAnimationFrame(loop);
                return;
            }

            const rect = containerRef.current.getBoundingClientRect();

            if (rect.width === 0 || rect.height === 0) {
                animationFrameId = requestAnimationFrame(loop);
                return;
            }

            // Lerp - Only after first frame?
            // Actually, since we snapped currentGlobalPos in handleMouseEnter, 
            // the first frame will have delta close to 0 unless mouse moved fast.
            // This is desired.
            const lerpFactor = 0.2;
            currentGlobalPos.current.x += (mouseRef.current.x - currentGlobalPos.current.x) * lerpFactor;
            currentGlobalPos.current.y += (mouseRef.current.y - currentGlobalPos.current.y) * lerpFactor;

            const globalX = currentGlobalPos.current.x;
            const globalY = currentGlobalPos.current.y;

            const localX = globalX - rect.left;
            const localY = globalY - rect.top;

            // Effective Zoom
            let effectiveZoom = zoom;
            const naturalWidth = imgRef.current.naturalWidth;
            // Fallback: if naturalWidth is 0 (broken?), use explicit zoom or 1
            if (useNativeResolution && naturalWidth > 0) {
                effectiveZoom = naturalWidth / rect.width;
            }

            // Update DOM
            magnifierRef.current.style.transform = `translate3d(${globalX - magSize / 2}px, ${globalY - magSize / 2}px, 0)`;

            const zoomedWidth = rect.width * effectiveZoom;
            const zoomedHeight = rect.height * effectiveZoom;

            const innerX = -localX * effectiveZoom + magSize / 2;
            const innerY = -localY * effectiveZoom + magSize / 2;

            innerImgRef.current.style.width = `${zoomedWidth}px`;
            innerImgRef.current.style.height = `${zoomedHeight}px`;
            innerImgRef.current.style.transform = `translate3d(${innerX}px, ${innerY}px, 0)`;

            // Visibility Hack: ensure opacity is 0 until valid position? 
            // Or just trust the snap.
            // If we want to be super safe, we can fade in the magnifier via CSS opacity
            // magnifierRef.current.style.opacity = '1';

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [showMagnifier, zoom, magSize, useNativeResolution]);

    return (
        <div
            ref={containerRef}
            className={`${styles.container} ${className || ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'crosshair' }} // Visual feedback that logic is working
        >
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={styles.image}
                style={{ pointerEvents: 'auto' }} // Ensure image catches events
            />

            {showMagnifier && portalContainer && createPortal(
                <div
                    ref={magnifierRef}
                    className={styles.magnifier}
                    style={{
                        width: magSize,
                        height: magSize,
                        display: 'block',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none',
                        zIndex: 2147483647,
                        opacity: isActive ? 1 : 0, // Hide until active/snapped
                        transition: 'opacity 0.1s ease', // Smooth entry
                    }}
                >
                    <img
                        ref={innerImgRef}
                        src={src}
                        alt=""
                        className={styles.magnifierImage}
                    />
                </div>,
                portalContainer
            )}
        </div>
    );
};

export default MagnifiedImage;
