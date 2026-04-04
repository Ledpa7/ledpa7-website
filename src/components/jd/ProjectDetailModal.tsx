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

// Prefetch: 카드 hover 시 해당 프로젝트의 JS 번들을 미리 다운로드
const prefetchMap: Record<string, () => void> = {
    '전자렌지 30초': () => import('./InstagramClone'),
    'Tesolar': () => import('./TesolarDesign'),
    'Dead Gear': () => import('./DeadGearDesign'),
    'Tray Light': () => import('./TrayLightDesign'),
    'Taks Tick': () => import('./TaksTickDesign'),
};

export const prefetchProject = (title: string) => {
    prefetchMap[title]?.();
};

// Premium Orbital Loading Animation
const LoadingFallback = () => {
    const keyframes = `
        @keyframes orbitSpin1 {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes orbitSpin2 {
            0% { transform: rotate(120deg); }
            100% { transform: rotate(480deg); }
        }
        @keyframes orbitSpin3 {
            0% { transform: rotate(240deg); }
            100% { transform: rotate(600deg); }
        }
        @keyframes corePulse {
            0%, 100% { transform: scale(0.6); opacity: 0.3; box-shadow: 0 0 8px rgba(255,60,60,0.2); }
            50% { transform: scale(1); opacity: 1; box-shadow: 0 0 20px rgba(255,60,60,0.6), 0 0 40px rgba(255,60,60,0.2); }
        }
        @keyframes textReveal {
            0% { opacity: 0; letter-spacing: 0.6em; }
            50% { opacity: 1; letter-spacing: 0.3em; }
            100% { opacity: 0.4; letter-spacing: 0.25em; }
        }
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    const ringBase: React.CSSProperties = {
        position: 'absolute',
        borderRadius: '50%',
        border: '1.5px solid transparent',
    };
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            minHeight: '70vh',
            paddingBottom: '10vh',
            gap: '28px',
            animation: 'fadeUp 0.5s ease-out',
        }}>
            <style>{keyframes}</style>
            {/* 오비탈 컨테이너 */}
            <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                {/* 링 1 - 바깥 */}
                <div style={{
                    ...ringBase,
                    width: '64px', height: '64px',
                    borderTopColor: 'rgba(255,60,60,0.8)',
                    borderRightColor: 'rgba(255,60,60,0.15)',
                    animation: 'orbitSpin1 1.8s cubic-bezier(0.45,0.05,0.55,0.95) infinite',
                }} />
                {/* 링 2 - 중간 */}
                <div style={{
                    ...ringBase,
                    width: '44px', height: '44px',
                    top: '10px', left: '10px',
                    borderTopColor: 'rgba(255,120,80,0.7)',
                    borderLeftColor: 'rgba(255,120,80,0.1)',
                    animation: 'orbitSpin2 1.4s cubic-bezier(0.45,0.05,0.55,0.95) infinite',
                }} />
                {/* 링 3 - 안쪽 */}
                <div style={{
                    ...ringBase,
                    width: '26px', height: '26px',
                    top: '19px', left: '19px',
                    borderBottomColor: 'rgba(255,180,120,0.6)',
                    borderRightColor: 'rgba(255,180,120,0.1)',
                    animation: 'orbitSpin3 1.0s cubic-bezier(0.45,0.05,0.55,0.95) infinite',
                }} />
                {/* 코어 닷 */}
                <div style={{
                    position: 'absolute',
                    width: '6px', height: '6px',
                    top: '29px', left: '29px',
                    borderRadius: '50%',
                    backgroundColor: '#ff3c3c',
                    animation: 'corePulse 1.8s ease-in-out infinite',
                }} />
            </div>
            {/* 텍스트 */}
            <span style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.65rem',
                letterSpacing: '0.25em',
                fontFamily: 'var(--font-oswald), sans-serif',
                textTransform: 'uppercase',
                animation: 'textReveal 2.4s ease-in-out infinite',
            }}>
                loading
            </span>
        </div>
    );
};

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

            // Trigger animation next frame (단일 rAF로 16ms 절약)
            requestAnimationFrame(() => {
                setIsAnimating(true);
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
            {/* 1. Close Button - Absolute Surface Level Priority */}
            {isMounted && (
                <button 
                className={styles.closeButton} 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("FORCE CLOSE TRIGGERED");
                    onClose();
                }}
                title="Close (Esc)" 
                style={{
                    position: 'fixed',
                    top: '32px',
                    right: '32px',
                    zIndex: 99999, // Ultimate priority
                    width: '60px', // Slightly larger for easier hit
                    height: '60px',
                    background: 'rgba(10, 10, 10, 0.8)', // Darker for contrast
                    backdropFilter: 'blur(30px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.4)', // Thicker border
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '40px',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                    pointerEvents: 'auto',
                    opacity: 1, // ALWAYS VISIBLE IF MOUNTED
                    transform: isAnimating ? 'scale(1)' : 'scale(0.5)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 60, 60, 1)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.borderColor = 'white';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(10, 10, 10, 0.8)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                >
                    <span style={{ display: 'block', transform: 'translateY(4px)', lineHeight: 1 }}>×</span>
                </button>
            )}

            {/* 2. Expanded Modal Card */}
            <div
                className={cardClass}
                style={initialStyles}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalContent}>
                    {/* === 제목/설명을 즉시 렌더링 (Suspense 밖) === */}
                    {displayProject.title === "전자렌지 30초" ? (
                        <div style={{ marginBottom: '40px' }}>
                            <FadeIn>
                                <h2 className={styles.title} style={{ textAlign: 'center', marginBottom: '8px' }}>{displayProject.title}</h2>
                                <p style={{ textAlign: 'center', color: '#ffffff', marginBottom: '32px' }}>{displayProject.description}</p>
                            </FadeIn>
                            <React.Suspense fallback={<LoadingFallback />}>
                                <InstagramClone />
                            </React.Suspense>
                        </div>
                    ) : displayProject.title === "Tesolar" ? (
                        <React.Suspense fallback={<LoadingFallback />}>
                            <FadeIn><TesolarDesign /></FadeIn>
                        </React.Suspense>
                    ) : displayProject.title === "Dead Gear" ? (
                        <React.Suspense fallback={<LoadingFallback />}>
                            <FadeIn><DeadGearDesign /></FadeIn>
                        </React.Suspense>
                    ) : displayProject.title === "Tray Light" ? (
                        <React.Suspense fallback={<LoadingFallback />}>
                            <FadeIn><TrayLightDesign /></FadeIn>
                        </React.Suspense>
                    ) : displayProject.title === "Taks Tick" ? (
                        <React.Suspense fallback={<LoadingFallback />}>
                            <FadeIn><TaksTickDesign /></FadeIn>
                        </React.Suspense>
                    ) : displayProject.galleryImages && displayProject.galleryImages.length > 0 ? (
                        /* Design Showcase: 헤더 텍스트 즉시 표시, 이미지는 뒤에서 로딩 */
                        <div className={styles.designShowcase}>
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
                                        loading="eager"
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
                        /* Standard Layout: 제목/메타 즉시 표시, 미디어는 프로그레시브 로딩 */
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
                                    <div className={styles.cinematicContainer}>
                                        <video
                                            ref={blurVideoRef}
                                            src={displayProject.video}
                                            autoPlay muted loop playsInline
                                            style={{
                                                position: 'absolute', top: '50%', left: '50%',
                                                transform: 'translate(-50%, -50%) scale(1.3)',
                                                width: '100%', height: '100%', objectFit: 'cover',
                                                filter: 'blur(40px) brightness(0.5)',
                                                zIndex: 0, pointerEvents: 'none',
                                            }}
                                        />
                                        <video
                                            ref={mainVideoRef}
                                            key={displayProject.video}
                                            src={displayProject.video}
                                            poster={displayProject.image}
                                            controls autoPlay muted loop playsInline
                                            className={styles.cinematicMainVideo}
                                            onTimeUpdate={() => {
                                                if (blurVideoRef.current && mainVideoRef.current) {
                                                    const diff = Math.abs(blurVideoRef.current.currentTime - mainVideoRef.current.currentTime);
                                                    if (diff > 0.05) {
                                                        blurVideoRef.current.currentTime = mainVideoRef.current.currentTime;
                                                    }
                                                }
                                            }}
                                            onPlay={() => { blurVideoRef.current?.play().catch(() => { }); }}
                                            onPause={() => { blurVideoRef.current?.pause(); }}
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
                                                        width: '100%', height: 'auto',
                                                        borderRadius: '12px', border: 'none', display: 'block'
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
                                                    controls autoPlay muted loop playsInline
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
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProjectDetailModal;
