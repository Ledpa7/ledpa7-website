"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import styles from "./ProjectSection.module.css";

// Project type definition
export type Project = {
    title: string;
    description: string;
    detailDescription?: string;
    period: string;
    image?: string;
    tags?: string[];
    video?: string;
    cardVideo?: string;
    category?: string;
};

type ProjectRowProps = {
    title: string;
    projects: Project[];
    onProjectSelect?: (project: Project, rect: DOMRect) => void;
    isPaused?: boolean;
    speed?: number;
    initialOffset?: number;
};

const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const VideoCard = ({ src, poster }: { src: string; poster?: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShouldLoad(true);
                        videoRef.current?.play().catch(() => { });
                    } else {
                        videoRef.current?.pause();
                    }
                });
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (videoRef.current) observer.observe(videoRef.current);
        return () => observer.disconnect();
    }, []);

    const youtubeId = getYoutubeId(src);
    if (youtubeId) {
        return (
            <div className={styles.imageOverlayContainer}>
                {shouldLoad && (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1`}
                        style={{ border: 'none', pointerEvents: 'none', width: '100%', height: '100%' }}
                        allow="autoplay; encrypted-media"
                    />
                )}
            </div>
        );
    }

    return (
        <div className={styles.imageOverlayContainer}>
            <video
                ref={videoRef}
                src={shouldLoad ? encodeURI(src) : undefined}
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    backgroundColor: '#000'
                }}
            />
        </div>
    );
};

const ProjectRow = ({ title, projects, onProjectSelect, isPaused = false, speed = 1.35, initialOffset = 0 }: ProjectRowProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const isCentering = useRef(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const isPausedRef = useRef(isPaused);
    const centeringTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const loopedProjects = useMemo(() => {
        if (!projects || projects.length === 0) return [];
        return [...projects, ...projects, ...projects];
    }, [projects]);

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    // Enhanced Initialization logic
    useEffect(() => {
        if (loopedProjects.length === 0) return;

        const slider = scrollRef.current;
        if (!slider) return;

        let retryCount = 0;
        const maxRetries = 20;

        const initScroll = () => {
            const singleWidth = slider.scrollWidth / 3;
            if (singleWidth > 100) {
                slider.scrollLeft = singleWidth + initialOffset;
                // Force a minor paint cycle before showing
                requestAnimationFrame(() => {
                    setIsLoaded(true);
                });
            } else if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(initScroll, 100);
            }
        };

        const timer = setTimeout(initScroll, 50);

        // Also observe for future size changes to keep it robust
        const ro = new ResizeObserver(() => {
            if (!isLoaded && slider.scrollWidth > 300) {
                initScroll();
            }
        });
        ro.observe(slider);

        return () => {
            clearTimeout(timer);
            ro.disconnect();
        };
    }, [loopedProjects, isLoaded]);

    // Animation Engine
    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider || loopedProjects.length === 0) return;

        let isDown = false;
        let lastPageX = 0;
        let velX = 0;
        let momentumID: number;
        let animFrameId: number;

        const updateCarousel = () => {
            if (!slider) {
                animFrameId = requestAnimationFrame(updateCarousel);
                return;
            }

            const totalWidth = slider.scrollWidth;
            const singleSetWidth = totalWidth / 3;

            // 1. Infinity Scroll Jump
            if (singleSetWidth > 100) {
                if (slider.scrollLeft >= 2 * singleSetWidth) {
                    slider.scrollLeft -= singleSetWidth;
                } else if (slider.scrollLeft <= 5) { // Small buffer
                    slider.scrollLeft += singleSetWidth;
                }
            }

            // 2. Auto Motion
            if (!isPausedRef.current && !isCentering.current && !isDown && singleSetWidth > 100) {
                slider.scrollLeft += speed;
            }

            // 3. 🎡 Calibrated Cylindrical 3D Engine
            const containerWidth = slider.offsetWidth;
            const scrollLength = slider.scrollLeft;
            const centerPoint = scrollLength + (containerWidth / 2);
            const radius = Math.min(containerWidth * 1.5, 1100); // More stable radius
            const currentCards = cardsRef.current;

            for (let i = 0; i < loopedProjects.length; i++) {
                const card = currentCards[i];
                if (!card) continue;

                const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
                const signedDist = cardCenter - centerPoint;
                const dist = Math.abs(signedDist);

                // 🎡 Angle calculation (Cinema-standard Curve)
                const angle = (signedDist / radius) * 60;
                const clampedAngle = Math.max(-80, Math.min(80, angle));

                // 🌑 Depth & Scale - Organic Concave Arc
                const translateZ = -Math.pow(dist / 9, 1.35);
                const scale = Math.max(0.8, 1.05 - (dist / (containerWidth * 1.6)));
                const opacity = Math.max(0.35, 1.1 - (dist / (containerWidth * 0.7)));

                // 💡 Reflection Sync
                const reflectX = 50 + (angle * 0.8);
                card.style.setProperty('--x', `${reflectX}%`);

                const zIndex = Math.round(1000 - dist);

                // No individual perspective here; shared from parent container
                card.style.transform = `rotateY(${clampedAngle}deg) translateZ(${translateZ}px) scale(${scale})`;
                card.style.zIndex = zIndex.toString();
                card.style.opacity = isNaN(opacity) ? '1' : opacity.toString();
            }

            animFrameId = requestAnimationFrame(updateCarousel);
        };

        animFrameId = requestAnimationFrame(updateCarousel);

        const momentumLoop = () => {
            if (isDown) return;
            velX *= 0.95;
            if (Math.abs(velX) > 0.4) {
                slider.scrollLeft -= velX;
                momentumID = requestAnimationFrame(momentumLoop);
            } else {
                cancelAnimationFrame(momentumID);
            }
        };

        const onMouseDown = (e: MouseEvent) => {
            isDown = true;
            slider.classList.add(styles.active);
            lastPageX = e.pageX;
            cancelAnimationFrame(momentumID);
            velX = 0;
            slider.setAttribute('data-dragging', 'false');
        };

        const onMouseUp = () => {
            isDown = false;
            slider.classList.remove(styles.active);
            momentumLoop();
        };

        const onMouseMove = (e: MouseEvent) => {
            if (isDown) {
                const delta = e.pageX - lastPageX;
                lastPageX = e.pageX;
                velX = delta;
                slider.scrollLeft -= delta * 1.4;
                if (Math.abs(delta) > 1) {
                    slider.setAttribute('data-dragging', 'true');
                }
            }
        };

        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                slider.scrollLeft += e.deltaX;
                velX = 0;
                cancelAnimationFrame(momentumID);
            }
        };

        slider.addEventListener('wheel', onWheel, { passive: false });
        slider.addEventListener('mousedown', onMouseDown);
        slider.addEventListener('mouseleave', onMouseUp);
        slider.addEventListener('mouseup', onMouseUp);
        slider.addEventListener('mousemove', onMouseMove);
        // @ts-ignore
        slider.addEventListener('scrollend', () => { isCentering.current = false; });

        return () => {
            slider.removeEventListener('wheel', onWheel);
            slider.removeEventListener('mousedown', onMouseDown);
            slider.removeEventListener('mouseleave', onMouseUp);
            slider.removeEventListener('mouseup', onMouseUp);
            slider.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(momentumID);
            cancelAnimationFrame(animFrameId);
        };
    }, [loopedProjects]);

    const handleCardClick = (project: Project, e: React.MouseEvent<HTMLDivElement>) => {
        const slider = scrollRef.current;
        const card = e.currentTarget;
        if (!slider || !card) return;

        const isDragging = slider.getAttribute('data-dragging') === 'true';
        if (isDragging) {
            slider.setAttribute('data-dragging', 'false');
            return;
        }

        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const containerCenter = slider.offsetWidth / 2;
        const targetScrollLeft = cardCenter - containerCenter;

        isCentering.current = true;
        if (centeringTimerRef.current) clearTimeout(centeringTimerRef.current);

        slider.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
        centeringTimerRef.current = setTimeout(() => { isCentering.current = false; }, 850);

        setTimeout(() => {
            if (onProjectSelect) {
                onProjectSelect(project, card.getBoundingClientRect());
            }
        }, 220); // Sync with scroll speed
    };

    return (
        <div className={styles.subcategoryRow}>
            <div
                className={styles.horizontalScroll}
                ref={scrollRef}
                style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                }}
            >
                {loopedProjects.map((project, index) => (
                    <div
                        key={`${project.title}-${index}`}
                        className={styles.projectCard}
                        ref={(el) => { if (el) cardsRef.current[index] = el; }}
                        onClick={(e) => handleCardClick(project, e)}
                    >
                        <div className={styles.cardReflect} />

                        {project.cardVideo ? (
                            <VideoCard src={project.cardVideo} poster={project.image} />
                        ) : (
                            <div className={styles.imageOverlayContainer}>
                                {project.image && (
                                    <img
                                        src={project.image} alt={project.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        <div className={styles.cardContent}>
                            <span className={styles.cardCategoryLabel}>{project.category || title}</span>
                            <h4 className={styles.cardTitle}>{project.title}</h4>
                            <p className={styles.cardDesc}>{project.description}</p>
                            <div className={styles.cardMeta}><span>{project.period}</span></div>
                            <div className={styles.tags}>
                                {project.tags?.slice(0, 3).map((t) => (
                                    <span key={t}>{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectRow;
