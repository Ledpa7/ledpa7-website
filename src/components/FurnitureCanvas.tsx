import React, { useRef, useEffect } from 'react';

interface FurnitureVideoProps {
    videoPath: string;
    posterPath?: string;
    isHovered?: boolean;
}

export const FurnitureVideo: React.FC<FurnitureVideoProps> = ({ videoPath, posterPath, isHovered = false }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Sync play/pause with external isHovered state
    useEffect(() => {
        if (!videoRef.current) return;

        if (isHovered) {
            videoRef.current.play().catch(err => {
                if (err.name !== 'AbortError') {
                    console.log("Video play failed:", err);
                }
            });
        } else {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isHovered]);

    // Ensure video is muted for autoplay policy
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.defaultMuted = true;
        }
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#FAFAFA]">
            <video
                ref={videoRef}
                src={videoPath}
                poster={posterPath}
                muted
                loop
                playsInline
                preload="auto"
                className={`w-full h-full object-cover brightness-105 contrast-110 transition-all duration-700 ${isHovered ? 'grayscale-0 blur-0' : 'grayscale'}`}
            />
            {/* 세련된 느낌을 위한 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
        </div>
    );
};
