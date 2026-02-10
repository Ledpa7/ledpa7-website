import React, { useEffect, useRef } from 'react';
import { useScroll, useSpring } from 'framer-motion';

interface HeroVideoSequenceProps {
    videoPath: string;
}

export const HeroVideoSequence: React.FC<HeroVideoSequenceProps> = ({ videoPath }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Spring physics for smooth movement
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Force initial frame
        video.currentTime = 0;

        const updateVideo = () => {
            if (video.duration) {
                // Buffer the progress to stay at the end for a bit
                const progress = Math.min(smoothProgress.get() / 0.9, 1);
                const targetTime = progress * video.duration;

                // Only seek if needed to avoid overhead
                if (Math.abs(video.currentTime - targetTime) > 0.01) {
                    video.currentTime = targetTime;
                }
            }
            requestRef.current = requestAnimationFrame(updateVideo);
        };

        requestRef.current = requestAnimationFrame(updateVideo);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [smoothProgress]);

    return (
        <div ref={containerRef} className="w-full h-full relative bg-black">
            <video
                ref={videoRef}
                src={videoPath}
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                style={{ filter: 'contrast(1.05) brightness(1.02)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
        </div>
    );
};
