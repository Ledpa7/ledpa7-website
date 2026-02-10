import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';

interface HeroSequenceProps {
    frameCount: number;
    basePath: string; // e.g., "/images/sequence/frame_"
    extension: string; // e.g., "webp"
}

export const HeroSequence: React.FC<HeroSequenceProps> = ({
    frameCount,
    basePath,
    extension
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);

    // Use the global scroll from framer-motion
    const { scrollYProgress } = useScroll();

    // Map scroll progress (0-1) to frame index (0 - frameCount-1)
    const frameIndex = useTransform(scrollYProgress, [0, 0.8], [1, frameCount]);

    // Preload images
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `${basePath}${i.toString().padStart(4, '0')}.${extension}`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    setImages(loadedImages);
                    renderFrame(1); // Initial frame
                }
            };
            loadedImages[i] = img;
        }
    }, [frameCount, basePath, extension]);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = images[Math.floor(index)];

        if (ctx && canvas && img) {
            // Draw image while maintaining aspect ratio (cover style)
            const canvasAspect = canvas.width / canvas.height;
            const imgAspect = img.width / img.height;
            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasAspect > imgAspect) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgAspect;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawWidth = canvas.height * imgAspect;
                drawHeight = canvas.height;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
    };

    // Update canvas whenever the scroll-driven frameIndex changes
    useEffect(() => {
        return frameIndex.onChange((v) => {
            renderFrame(v);
        });
    }, [images]);

    // Resize handler
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                renderFrame(frameIndex.get());
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [images]);

    return (
        <div className="w-full h-full relative">
            <canvas
                ref={canvasRef}
                className="w-full h-full object-cover"
            />
            {/* Optional Overlay for extra premium feel */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
        </div>
    );
};
