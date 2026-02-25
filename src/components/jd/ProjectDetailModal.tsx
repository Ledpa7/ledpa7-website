"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './ProjectDetailModal.module.css';
import FadeIn from './FadeIn';

// Optimization: Lazy Load sub-pages for better initial performance
const InstagramClone = React.lazy(() => import('./InstagramClone'));
const TesolarDesign = React.lazy(() => import('./TesolarDesign'));
const DeadGearDesign = React.lazy(() => import('./DeadGearDesign'));
const TrayLightDesign = React.lazy(() => import('./TrayLightDesign'));
const TaksTickDesign = React.lazy(() => import('./TaksTickDesign'));

// Simple Premium Loader Fallback
const LoadingFallback = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
        color: 'var(--accent-primary)',
        fontSize: '0.9rem',
        letterSpacing: '0.2em',
        fontFamily: 'var(--font-oswald), sans-serif'
    }}>
        LOADING...
    </div>
);

const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

type Project = {
    title: string;
    description: string;
    detailDescription?: string;
    period: string;
    image?: string;
    tags?: string[];
    video?: string;
    galleryVideos?: string[];
    galleryImages?: string[]; // New field for Design projects
};

type Props = {
    project: Project | null;
    initialRect: { top: number; left: number; width: number; height: number } | null;
    onClose: () => void;
};

const VideoTile = ({ src }: { src: string }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current?.play().catch(() => {
                            // Autoplay might be blocked
                        });
                    } else {
                        videoRef.current?.pause();
                    }
                });
            },
            { threshold: 0.5 } // Play when 50% visible
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className={styles.videoTile}>
            <video
                ref={videoRef}
                src={src ? encodeURI(src) : undefined}
                muted
                loop
                playsInline
            />
        </div>
    );
};

const ProjectDetailModal = ({ project, initialRect, onClose }: Props) => {
    // 1. All Hooks Must be at the top level
    const [mounted, setMounted] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const mainVideoRef = React.useRef<HTMLVideoElement>(null);
    const blurVideoRef = React.useRef<HTMLVideoElement>(null);

    // We keep a local copy to display while closing
    const [displayProject, setDisplayProject] = useState<Project | null>(null);
    const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Logic to handle opening/closing animations
    useEffect(() => {
        if (project && initialRect) {
            // Opening
            setDisplayProject(project);
            setRect(initialRect);
            setIsMounted(true);
            setVideoError(false); // Reset error state on new project

            // Trigger animation next frame
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true);
                });
            });
        } else {
            // Closing
            if (isMounted) {
                setIsAnimating(false);
                const timer = setTimeout(() => {
                    setIsMounted(false);
                    setDisplayProject(null);
                    setRect(null);
                }, 500); // Wait for transition
                return () => clearTimeout(timer);
            }
        }
    }, [project, initialRect]);

    // Dedicated Scroll Lock Effect
    useEffect(() => {
        if (isMounted) {
            const originalBodyOverflow = window.getComputedStyle(document.body).overflow;
            const originalHtmlOverflow = window.getComputedStyle(document.documentElement).overflow;
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden'; // Lock html too

            return () => {
                document.body.style.overflow = originalBodyOverflow;
                document.documentElement.style.overflow = originalHtmlOverflow;
            };
        }
    }, [isMounted]);

    // 2. Conditional Rendering AFTER hooks
    if (!mounted) return null;

    // If we are not open and not animating (waiting to close), don't render DOM
    if (!isMounted || !displayProject) return null;

    const overlayClass = `${styles.overlay} ${isAnimating ? styles.visible : ''}`;
    const cardClass = `${styles.modalCard} ${isAnimating ? styles.fullscreen : ''}`;

    const initialStyles: React.CSSProperties = rect ? {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        background: '#0a0a0a'
    } : {
        top: '50%',
        left: '50%',
        width: '0px',
        height: '0px',
        opacity: 0,
        background: '#0a0a0a'
    };

    const formatDescription = (text: string) => {
        return text.split('\n').map((line, i, arr) => (
            <React.Fragment key={i}>
                {line.split(/(\*.*?\*|\[.*?\])/g).map((part, j) => {
                    if (part.startsWith('*') && part.endsWith('*')) {
                        return <strong key={j}>{part.slice(1, -1)}</strong>;
                    }
                    if (part.startsWith('[') && part.endsWith(']')) {
                        return (
                            <span key={j} style={{ color: '#ff3c3c', fontWeight: 900 }}>
                                {part}
                            </span>
                        );
                    }
                    return part;
                })}
                {i < arr.length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return createPortal(
        <div className={overlayClass} onClick={onClose}>
            <div
                className={cardClass}
                style={initialStyles}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <div className={styles.modalContent}>
                    <React.Suspense fallback={<LoadingFallback />}>
                        {/* Special Case: Instagram Project */}
                        {displayProject.title === "전자렌지 30초" ? (
                            <div style={{ marginBottom: '40px' }}>
                                <FadeIn>
                                    <h2 className={styles.title} style={{ textAlign: 'center', marginBottom: '8px' }}>{displayProject.title}</h2>
                                    <p style={{ textAlign: 'center', color: '#ffffff', marginBottom: '32px' }}>{displayProject.description}</p>
                                    <InstagramClone />
                                </FadeIn>
                            </div>
                        ) : displayProject.title === "Tesolar" ? (
                            /* Special Case: Tesolar Design Study */
                            <FadeIn>
                                <TesolarDesign />
                            </FadeIn>
                        ) : displayProject.title === "Dead Gear" ? (
                            <FadeIn>
                                <DeadGearDesign />
                            </FadeIn>
                        ) : displayProject.title === "Tray Light" ? (
                            <FadeIn>
                                <TrayLightDesign />
                            </FadeIn>
                        ) : displayProject.title === "Taks Tick" ? (
                            <FadeIn>
                                <TaksTickDesign />
                            </FadeIn>
                        ) : displayProject.galleryImages && displayProject.galleryImages.length > 0 ? (
                            /* Special Case: Design Showcase Project */
                            <div className={styles.designShowcase}>
                                {/* Magazine Header */}
                                <div className={styles.designHeader}>
                                    <h2 className={styles.bigTitle}>{displayProject.title}</h2>
                                    <div className={styles.designMeta}>
                                        <span className={styles.period}>{displayProject.period}</span>
                                        <div className={styles.tags}>
                                            {displayProject.tags?.map(tag => (
                                                <span key={tag} className={styles.tagBadge}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className={styles.designDescription}>
                                        {formatDescription(displayProject.detailDescription || displayProject.description)}
                                    </p>
                                </div>

                                {/* Hero Image */}
                                {displayProject.image && (
                                    <div className={styles.heroImageContainer} style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                                        <img
                                            src={displayProject.image}
                                            alt={displayProject.title}
                                            className={styles.heroImage}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            loading="lazy"
                                        />
                                    </div>
                                )}

                                {/* Vertical Image Gallery */}
                                <div className={styles.imageStack}>
                                    {displayProject.galleryImages.map((img, idx) => (
                                        <div key={idx} className={styles.stackItem} style={{ position: 'relative', width: '100%', marginBottom: '20px' }}>
                                            <img
                                                src={img}
                                                alt={`${displayProject.title} detail ${idx}`}
                                                style={{ width: '100%', height: 'auto', display: 'block' }}
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Standard Layout (Video/General) */
                            <>
                                <h2 className={styles.title}>{displayProject.title}</h2>
                                <div className={styles.meta}>
                                    <span style={{ color: 'var(--accent-primary)' }}>{displayProject.period}</span>
                                    <span>{displayProject.tags?.join(', ')}</span>
                                </div>

                                <p className={styles.description}>
                                    {formatDescription(displayProject.detailDescription || displayProject.description)}
                                </p>

                                {(displayProject.video || displayProject.image) && (
                                    displayProject.title === 'Led.발광다이오드' && displayProject.video && !videoError ? (
                                        /* 발광다이오드 전용: 시네마틱 블러 배경 비디오 */
                                        <div className={styles.cinematicContainer}>
                                            {/* 블러 배경 비디오 (동기 재생) */}
                                            <video
                                                ref={blurVideoRef}
                                                src={displayProject.video}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%) scale(1.3)',
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    filter: 'blur(40px) brightness(0.5)',
                                                    zIndex: 0,
                                                    pointerEvents: 'none',
                                                }}
                                            />
                                            {/* 메인 비디오 */}
                                            <video
                                                ref={mainVideoRef}
                                                key={displayProject.video}
                                                src={displayProject.video}
                                                poster={displayProject.image}
                                                controls
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                className={styles.cinematicMainVideo}
                                                onTimeUpdate={() => {
                                                    if (blurVideoRef.current && mainVideoRef.current) {
                                                        const diff = Math.abs(blurVideoRef.current.currentTime - mainVideoRef.current.currentTime);
                                                        // More aggressive sync if drift is detected
                                                        if (diff > 0.05) {
                                                            blurVideoRef.current.currentTime = mainVideoRef.current.currentTime;
                                                        }
                                                    }
                                                }}
                                                onPlay={() => {
                                                    blurVideoRef.current?.play().catch(() => { });
                                                }}
                                                onPause={() => {
                                                    blurVideoRef.current?.pause();
                                                }}
                                                onError={(e) => {
                                                    const error = (e.target as HTMLVideoElement).error;
                                                    console.error("Video Error:", error?.code, error?.message);
                                                    setVideoError(true);
                                                }}
                                            />
                                        </div>

                                    ) : (
                                        <div className={styles.mediaContainer}>
                                            {displayProject.video && !videoError ? (
                                                getYoutubeId(displayProject.video) ? (
                                                    <iframe
                                                        width="100%"
                                                        style={{
                                                            aspectRatio: displayProject.video.includes('shorts/') ? '9/16' : '16/9',
                                                            width: '100%',
                                                            height: 'auto',
                                                            borderRadius: '12px',
                                                            border: 'none',
                                                            display: 'block'
                                                        }}
                                                        src={`https://www.youtube.com/embed/${getYoutubeId(displayProject.video)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeId(displayProject.video)}`}
                                                        title="YouTube video player"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <video
                                                        key={displayProject.video}
                                                        src={displayProject.video}
                                                        poster={displayProject.image}
                                                        controls
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                        className={styles.projectVideo}
                                                        onError={(e) => {
                                                            const error = (e.target as HTMLVideoElement).error;
                                                            console.error("Video Error:", error?.code, error?.message);
                                                            setVideoError(true);
                                                        }}
                                                    />
                                                )
                                            ) : (
                                                <div className={styles.imagePlaceholder}>
                                                    {displayProject.image && (
                                                        <img
                                                            src={displayProject.image}
                                                            alt={displayProject.title}
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}


                                {displayProject.galleryVideos && displayProject.galleryVideos.length > 0 && (
                                    <div className={styles.videoGrid}>
                                        {displayProject.galleryVideos.map((videoSrc, idx) => (
                                            <VideoTile key={idx} src={videoSrc} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </React.Suspense>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProjectDetailModal;
