"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { prefetchProject } from "./ProjectDetailModal";
import styles from "./ProjectSection.module.css";

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
    imageFit?: "cover" | "contain";
    imagePadding?: string;
    imagePosition?: string;
    backgroundColor?: string;
    cardTitle?: string;
    externalLink?: string;
    imageScale?: number;
    galleryVideos?: string[];
    galleryImages?: string[];
};

type EllipseGalleryProps = {
    projects: Project[];
    onProjectSelect?: (project: Project, rect: DOMRect) => void;
};

/* ================================================================
   Cinema Engine 43.0 — The True Cylinder (MX Pro Build)
   CLIPPING-FREE & PERFECT Z-SORTING
   ================================================================ */
const EllipseGallery = ({ projects, onProjectSelect }: EllipseGalleryProps) => {
    const galleryRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]); // 비디오 최적화를 위한 참조 추가

    // Animation State (Degree-based rotation)
    const rotation = useRef(0);
    const velocity = useRef(0.12);
    const isDragging = useRef(false);
    const hasDragged = useRef(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const lastX = useRef(0);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    useEffect(() => {
        if (!isMounted) return;
        const gallery = galleryRef.current;
        if (!gallery) return;

        // Container to hold the mouse position for parallax
        const mouse = { x: 0, y: 0 };
        const tilt = { x: 0, y: 0 };

        // ANIMATION TICKER - The Studio MX Engine
        // Pre-calculated values to optimize ticker performance
        let cw = gallery.offsetWidth || window.innerWidth;
        let isMobile = cw <= 768;
        const totalItems = projects.length;
        const angleStep = 360 / totalItems;
        let radiusX = isMobile ? Math.min(cw * 1.5, 500) : Math.min(cw * 0.45, 520); // 1.5x spread as requested
        let radiusY = isMobile ? 120 : 115; // Adjusted depth

        const updateLayoutValues = () => {
            cw = gallery.offsetWidth || window.innerWidth;
            isMobile = cw <= 768;
            radiusX = isMobile ? Math.min(cw * 1.5, 500) : Math.min(cw * 0.45, 520);
            radiusY = isMobile ? 120 : 115;
            console.log("3D Gallery layout values updated");
        };

        window.addEventListener('resize', updateLayoutValues);

        // ANIMATION TICKER - The Studio MX Engine (Optimized)
        const update = () => {
            if (!isDragging.current) {
                const baseSpeed = isMobile ? 0.05 : 0.08;
                rotation.current += velocity.current;

                if (Math.abs(velocity.current) > baseSpeed) {
                    velocity.current *= 0.94;
                } else {
                    velocity.current = velocity.current > 0 ? baseSpeed : -baseSpeed;
                }
            }

            tilt.x += (mouse.x - tilt.x) * 0.05;
            tilt.y += (mouse.y - tilt.y) * 0.05;

            cardsRef.current.forEach((card, i) => {
                if (!card) return;

                const angle = (i * angleStep) + rotation.current;
                const rad = (angle * Math.PI) / 180;
                const sinVal = Math.sin(rad);
                const cosVal = Math.cos(rad);

                const bottomSqueeze = 1 - (Math.max(0, cosVal) * (isMobile ? 0.20 : 0.10));
                const tx = sinVal * radiusX * bottomSqueeze;
                const ty = (cosVal * radiusY) + (isMobile ? 50 : 30);
                // 모바일 원근 Z축 거리를 기존 300에서 360으로 대폭 증폭시켜, 앞쪽 카드(cosVal이 양수일 때)가 정면 눈앞으로 훌륭하고 압도적이게 돌출되도록 설계
                const tz = -cosVal * (isMobile ? 360 : 500); 
                const rotateY = 180 - angle;
                const baseScale = isMobile ? 0.65 : 0.70;
                const scale = baseScale - (cosVal * (isMobile ? 0.30 : 0.15));
                
                // [양옆 카드의 투명도 집중 제어 튜닝]
                // 가장 정면에 도달한 메인 카드(cosVal = 1 부근)는 0.98(거의 100% 선명도)로 돋보이게 지탱하고,
                // 정면에서 아주 살짝이라도 양옆으로 비껴나가는 대기용 양옆 카드들은 투명도를 확 낮추어 시선의 분산을 방지 (진폭 계수를 0.50 -> 0.70으로 상향)
                const opacity = isMobile 
                    ? (0.80 - (cosVal * 0.70)) 
                    : (0.60 - (cosVal * 0.40));

                card.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${rotateY}deg) scale(${scale})`;
                // 지시하신 사항에 맞춰 화면 바깥 카드의 시각적 층을 충분히 인지할 수 있도록 투명도 제한 최솟값을 0.35로 원복
                card.style.opacity = Math.max(0.35, Math.min(0.98, opacity)).toString();
                card.style.zIndex = Math.round(tz + 2000).toString();

                const video = videoRefs.current[i];
                if (video) {
                    if (tz > -150) {
                        if (video.paused) video.play().catch(() => { });
                    } else {
                        if (!video.paused) video.pause();
                    }
                }
            });
        };

        gsap.ticker.add(update);

        // DRAG & PARALLAX EVENT HANDLERS
        const onDown = (e: MouseEvent | TouchEvent) => {
            isDragging.current = true;
            hasDragged.current = false; // 마우스 클릭(터치) 시작 시 초기화
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            startX.current = clientX;
            startY.current = clientY;
            lastX.current = clientX;
            document.body.style.cursor = 'grabbing';
        };

        const onMove = (e: MouseEvent | TouchEvent) => {
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

            if (isDragging.current && 'touches' in e) {
                // Prevent browser jump/scroll during active gallery manipulation
                if (e.cancelable) e.preventDefault();
            }

            // Global mouse position normalized for parallax (-1 to 1)
            const cw = window.innerWidth;
            const ch = window.innerHeight;
            const isMobile = cw <= 768;
            mouse.x = (clientX / cw) * 2 - 1;
            mouse.y = (clientY / ch) * 2 - 1;

            if (!isDragging.current) return;

            // 드래그 판단: 시작점으로부터 5px 이상 움직였다면 단순 클릭이 아닌 '드래그'로 간주
            if (Math.abs(clientX - startX.current) > 5 || Math.abs(clientY - startY.current) > 5) {
                hasDragged.current = true;
            }

            const dx = (clientX - lastX.current);
            lastX.current = clientX;

            // Interaction 방향 반전 및 '쫀득한' 터치감 극대화
            const dragSensitivity = isMobile ? 0.28 : 0.15; // 모바일에서 손가락을 더 잘 따라오도록 민감도 대폭 상승
            rotation.current -= dx * dragSensitivity;
            velocity.current = -dx * dragSensitivity;
        };

        const onUp = () => {
            isDragging.current = false;
            document.body.style.cursor = '';
        };

        gallery.addEventListener("mousedown", onDown);
        gallery.addEventListener("touchstart", onDown, { passive: false });
        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchend", onUp);

        return () => {
            gsap.ticker.remove(update);
            gallery.removeEventListener("mousedown", onDown);
            gallery.removeEventListener("touchstart", onDown);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchend", onUp);
        };
    }, [isMounted, projects.length]);

    const [isMobileRender, setIsMobileRender] = useState(false);
    useEffect(() => {
        setIsMobileRender(window.innerWidth <= 768);
        const handleResize = () => setIsMobileRender(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={styles.ellipseGallery} ref={galleryRef}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transformStyle: 'preserve-3d' }}>
                {isMounted && projects.map((proj, i) => (
                    <div
                        key={`${proj.title}-${i}`}
                        className={styles.projectCard}
                        ref={el => { if (el) cardsRef.current[i] = el; }}
                        onDragStart={(e) => e.preventDefault()}
                        onMouseEnter={() => prefetchProject(proj.title)}
                        onTouchStart={() => prefetchProject(proj.title)}
                        onClick={(e) => {
                            if (hasDragged.current) {
                                e.preventDefault();
                                e.stopPropagation();
                                return;
                            }
                            
                            // Block popup ONLY for numbers 12 to 15
                            const isBlockedRange = i >= 11 && i <= 14;
                                
                            if (isBlockedRange) {
                                console.log(`No content for project number ${i + 1}, blocking popup.`);
                                return;
                            }
                            
                            if (proj.externalLink) {
                                window.open(proj.externalLink, '_blank', 'noopener,noreferrer');
                                return;
                            }
                            onProjectSelect?.(proj, e.currentTarget.getBoundingClientRect());
                        }}
                        style={{ cursor: (i >= 11 && i <= 14) ? 'default' : 'pointer' }}
                    >
                        <div className={styles.cardNumber}>{(i + 1).toString().padStart(2, '0')}</div>
                        <div className={styles.cardReflect} />
                        <div className={styles.imageOverlayContainer} style={{ backgroundColor: proj.backgroundColor || 'transparent' }}>
                            {proj.category && (
                                <div className={styles.categoryBadge}>
                                    {proj.category}
                                </div>
                            )}
                            {proj.title === "DoodleLog : AI 그림일기" ? (
                                <div className={styles.doodleLogCard}>
                                    <div className={styles.doodleLogLogo}>Doodle Log</div>
                                </div>
                            ) : proj.title === "유선생" ? (
                                <div className={styles.uTeacherCard}>
                                    <div className={styles.uTeacherLogo}>유선생</div>
                                </div>
                            ) : (proj.title === "키서" || proj.title === "Keysor" || proj.title === "Keysor 키서") ? (
                                <div className={styles.keysorCard}>
                                    <div className={styles.keysorLogo}>
                                        <span className={styles.keysorGreen}>Key</span>
                                        <span className={styles.keysorWhite}>sor</span>
                                    </div>
                                    <img src="/jd/images/keysor_logo.svg" className={styles.keysorIcon} alt="Keysor Icon" />
                                </div>
                            ) : proj.cardVideo ? (
                                <video
                                    ref={el => { if (el) videoRefs.current[i] = el; }}
                                    src={encodeURI(proj.cardVideo)}
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    disablePictureInPicture
                                />
                            ) : (
                                proj.image && <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: proj.imageFit || 'cover', objectPosition: proj.imagePosition || 'center', padding: isMobileRender && proj.imageFit === 'contain' ? '8px' : (proj.imagePadding || '0'), transform: proj.imageScale ? `scale(${proj.imageScale})` : 'none' }} draggable={false} loading="lazy" decoding="async" />
                            )}
                        </div>
                        <div className={styles.cardContent}>
                            <h4 className={styles.cardTitle}>
                                {(i >= 11 && i <= 14) // Numbers 12 to 15
                                    ? (i + 1).toString().padStart(2, '0') 
                                    : (proj.cardTitle || proj.title)}
                            </h4>
                            <p className={styles.cardDesc}>{proj.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EllipseGallery;
