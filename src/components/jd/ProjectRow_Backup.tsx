"use client";
import React, { useRef, useEffect } from "react";
import styles from "./ProjectSection.module.css";

// Project type definition
type Project = {
    title: string;
    description: string;
    detailDescription?: string;
    period: string;
    image?: string;
    tags?: string[];
    video?: string;
    cardVideo?: string;
};

type ProjectRowProps = {
    title: string;
    projects: Project[];
    onProjectSelect?: (project: Project, rect: DOMRect) => void;
};

const ProjectRow = ({ title, projects, onProjectSelect }: ProjectRowProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let lastScrollLeft = scrollContainer.scrollLeft;
        let animationFrameId: number;
        let targetVelocity = 0;
        let currentVelocity = 0;

        const handleScroll = () => {
            const currentScrollLeft = scrollContainer.scrollLeft;
            const diff = currentScrollLeft - lastScrollLeft;

            // Mask Logic
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            const fadeSize = 60;
            const leftFade = currentScrollLeft > 10 ? fadeSize : 0; // Buffer of 10px
            const rightFade = currentScrollLeft < maxScroll - 10 ? fadeSize : 0;

            scrollContainer.style.setProperty('--mask-left', `${leftFade}px`);
            scrollContainer.style.setProperty('--mask-right', `${rightFade}px`);

            // Calculate velocity (limit max value)
            targetVelocity = Math.max(Math.min(diff * 0.5, 15), -15);

            lastScrollLeft = currentScrollLeft;
        };

        // Init Mask
        handleScroll();

        const animate = () => {
            currentVelocity += (targetVelocity - currentVelocity) * 0.1;
            targetVelocity *= 0.9; // Decay

            if (Math.abs(currentVelocity) > 0.01) {
                cardsRef.current.forEach(card => {
                    if (card) {
                        // REPLACED SKEW: Use RotateY for a 3D turn effect + slight Scale
                        card.style.transform = `perspective(1000px) rotateY(${-currentVelocity}deg) scale(${1 - Math.abs(currentVelocity) * 0.005})`;
                    }
                });
            } else {
                cardsRef.current.forEach(card => {
                    if (card) card.style.transform = `none`;
                });
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        scrollContainer.addEventListener("scroll", handleScroll);
        animate();

        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Drag to Scroll Logic WITH Click Detection
    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider) return;

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;
        let hasMoved = false;

        const onMouseDown = (e: MouseEvent) => {
            isDown = true;
            hasMoved = false;
            slider.classList.add(styles.active);
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };

        const onMouseLeave = () => {
            isDown = false;
            slider.classList.remove(styles.active);
        };

        const onMouseUp = () => {
            isDown = false;
            slider.classList.remove(styles.active);
            // We use (slider as any) hack to communicate with React or we rely on React event handler logic below by not blocking bubbling?
            // "click" event fires after mouseup. 
            // If we mark "isDragging" on the element, the click handler can check it.
            if (Math.abs(startX - (startX)) > 5) {
                // Check not needed here if logic is in mousemove
            }
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5;
            if (Math.abs(x - startX) > 5) {
                hasMoved = true;
                slider.setAttribute('data-dragging', 'true');
            }
            slider.scrollLeft = scrollLeft - walk;
        };

        // Reset dragging attr on down
        const resetDrag = () => slider.setAttribute('data-dragging', 'false');
        slider.addEventListener('mousedown', resetDrag);

        slider.addEventListener('mousedown', onMouseDown);
        slider.addEventListener('mouseleave', onMouseLeave);
        slider.addEventListener('mouseup', onMouseUp);
        slider.addEventListener('mousemove', onMouseMove);

        return () => {
            slider.removeEventListener('mousedown', resetDrag);
            slider.removeEventListener('mousedown', onMouseDown);
            slider.removeEventListener('mouseleave', onMouseLeave);
            slider.removeEventListener('mouseup', onMouseUp);
            slider.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    const handleCardClick = (project: Project, e: React.MouseEvent<HTMLDivElement>) => {
        // Check if drag occurred
        const isDragging = scrollRef.current?.getAttribute('data-dragging') === 'true';
        if (isDragging) return;

        const rect = e.currentTarget.getBoundingClientRect();
        if (onProjectSelect) {
            onProjectSelect(project, rect);
        }
    };

    return (
        <div className={styles.subcategoryRow}>
            <h3 className={styles.subcategoryTitle} style={{ display: 'none' }}>{title}</h3>
            <div className={styles.horizontalScroll} ref={scrollRef}>
                {projects.length > 0 ? (
                    projects.map((project, pIndex) => (
                        <div
                            key={pIndex}
                            className={styles.projectCard}
                            ref={(el) => { cardsRef.current[pIndex] = el; }}
                            onClick={(e) => handleCardClick(project, e)}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                e.currentTarget.style.setProperty('--x', `${x}px`);
                                e.currentTarget.style.setProperty('--y', `${y}px`);
                            }}
                        >
                            <div className={styles.cardReflect} />

                            {project.cardVideo ? (
                                <video
                                    src={project.cardVideo}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    style={{
                                        width: '100%',
                                        height: '240px',
                                        objectFit: 'cover',
                                        borderBottom: '1px solid var(--surface-2)'
                                    }}
                                />
                            ) : project.image ? (
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    style={{
                                        width: '100%',
                                        height: '240px',
                                        objectFit: project.title.includes("전자렌지") ? 'contain' : 'cover',
                                        objectPosition: project.title === "Tray Light" ? "center 75%" : "center center",
                                        padding: project.title.includes("전자렌지") ? '60px' : '0',
                                        backgroundColor: project.title.includes("전자렌지") ? '#ff7e36' : 'transparent',
                                        borderBottom: '1px solid var(--surface-2)'
                                    }}
                                />
                            ) : (
                                <div className={styles.cardImagePlaceholder} />
                            )}
                            <div className={styles.cardContent}>
                                <h4 className={styles.cardTitle}>{project.title}</h4>
                                <p className={styles.cardDesc}>{project.description}</p>
                                <div className={styles.cardMeta}>
                                    <span>{project.period}</span>
                                </div>
                                <div className={styles.tags}>
                                    {project.tags?.map((t) => (
                                        <span key={t}>#{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyCard}>
                        <span>Coming Soon</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectRow;
