import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';

interface HeroVideoScrubberProps {
    videoPath: string;
    frameCount?: number;
}

export const HeroVideoScrubber: React.FC<HeroVideoScrubberProps> = ({
    videoPath,
    frameCount = 120
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [frames, setFrames] = useState<ImageBitmap[]>([]);
    const [isReady, setIsReady] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [initialFrameReady, setInitialFrameReady] = useState(false);

    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // 🎥 Phase 1: Frame Extraction & Caching
    useEffect(() => {
        const video = document.createElement('video');
        video.src = videoPath;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';

        const extractFrames = async () => {
            // Load metadata first
            if (video.readyState < 1) {
                await new Promise((resolve) => {
                    video.addEventListener('loadedmetadata', resolve, { once: true });
                });
            }

            const duration = video.duration;
            const capturedFrames: ImageBitmap[] = [];
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Step 1: Capture the FIRST frame immediately to show the user
            video.currentTime = 0;
            await new Promise((resolve) => {
                video.addEventListener('seeked', resolve, { once: true });
            });

            if (ctx) {
                ctx.drawImage(video, 0, 0);
                const firstBitmap = await createImageBitmap(canvas);
                capturedFrames.push(firstBitmap);
                setFrames([firstBitmap]);
                setInitialFrameReady(true); // Now we can show the canvas
            }

            // Step 2: Capture the rest in background
            for (let i = 1; i < frameCount; i++) {
                const time = (i / (frameCount - 1)) * duration;
                video.currentTime = time;

                await new Promise((resolve) => {
                    video.addEventListener('seeked', resolve, { once: true });
                });

                if (ctx) {
                    ctx.drawImage(video, 0, 0);
                    const bitmap = await createImageBitmap(canvas);
                    capturedFrames[i] = bitmap;

                    // Periodically update the state to allow scrolling even if not 100% finished
                    if (i % 20 === 0) {
                        setFrames([...capturedFrames]);
                    }

                    setLoadingProgress(Math.round(((i + 1) / frameCount) * 100));
                }
            }

            setFrames(capturedFrames);
            setIsReady(true);
        };

        extractFrames();
    }, [videoPath, frameCount]);

    // 🎨 Phase 2: Canvas Rendering
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const frame = frames[Math.floor(index)] || frames[0]; // Fallback to first frame if requested frame isn't loaded yet

        if (ctx && canvas && frame) {
            const canvasAspect = canvas.width / canvas.height;
            const imgAspect = frame.width / frame.height;
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
            ctx.drawImage(frame, offsetX, offsetY, drawWidth, drawHeight);
        }
    };

    // Continuous rendering loop to sync with framer-motion smoothProgress
    useEffect(() => {
        if (!initialFrameReady) return;

        let animationFrameId: number;

        const loop = () => {
            const index = Math.min(Math.floor(smoothProgress.get() * (frameCount - 1)), frames.length - 1);
            if (index >= 0) {
                renderFrame(index);
            }
            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [initialFrameReady, frames, smoothProgress, frameCount]);

    // Resize Handler
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                if (initialFrameReady) renderFrame(smoothProgress.get() * (frameCount - 1));
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [initialFrameReady]);

    return (
        <div className="w-full h-full relative bg-black overflow-hidden">
            {/* Loading Overlay (Only show until first frame is ready) */}
            {!isReady && (
                <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${initialFrameReady ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="mb-4 text-xs text-white opacity-50 font-mono uppercase tracking-[0.2em]">Initialising Sequence...</div>
                    <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-white transition-all duration-300"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Canvas is visible as soon as the first frame is ready */}
            <canvas
                ref={canvasRef}
                className={`w-full h-full block transition-opacity duration-1000 ${initialFrameReady ? 'opacity-100' : 'opacity-0'}`}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
        </div>
    );
};
