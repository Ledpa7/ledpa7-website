"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
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
        const update = () => {
            const cw = gallery.offsetWidth || window.innerWidth;
            const isMobile = cw <= 768;

            if (!isDragging.current) {
                // Continuous slow rotation like Studio MX
                const baseSpeed = isMobile ? 0.05 : 0.08; // 모바일에서는 기본 속도를 조금 낮춰 부드럽게
                rotation.current += velocity.current;

                // Apply friction if moving fast after a drag, otherwise maintain a base speed
                if (Math.abs(velocity.current) > baseSpeed) {
                    velocity.current *= 0.94; // 0.96 -> 0.94로 마찰력을 조정하여 너무 오래 미끄러지지 않고 '쫀득하게' 감속
                } else {
                    velocity.current = velocity.current > 0 ? baseSpeed : -baseSpeed;
                }
            }

            // Smooth parallax tilt towards mouse
            tilt.x += (mouse.x - tilt.x) * 0.05;
            tilt.y += (mouse.y - tilt.y) * 0.05;

            // Optional: Tilt the entire scene slightly (Disabled to fix "strange movement" feeling)
            if (gallery.firstElementChild) {
                (gallery.firstElementChild as HTMLElement).style.transform = `
                    translate(-50%, -50%)
                `;
            }

            // ==========================================
            // CONNECTED RING ENGINE: CLEAN TILTED ELLIPSE
            // ==========================================
            const totalItems = projects.length;
            const angleStep = 360 / totalItems; // Map ALL items to ONE loop

            // Dimensions for a wide, organized oval track
            // 모바일 겹침 현상 해결: 가로 반경을 0.88로 확장하여 카드 간 간격을 넓힘
            const radiusX = isMobile ? cw * 0.88 : Math.min(cw * 0.45, 520);
            // 세로 반경도 살짝 줄여서 앞뒷줄 간격을 타이트하게 조임 (120 -> 110)
            const radiusY = isMobile ? 110 : 115;

            cardsRef.current.forEach((card, i) => {
                if (!card) return;

                const angle = (i * angleStep) + rotation.current;
                const rad = (angle * Math.PI) / 180;

                const sinVal = Math.sin(rad);
                const cosVal = Math.cos(rad);

                // 1. Mathematics of a Clean Elliptical Ring
                // 모바일에서는 뒷줄 Squeeze를 더 강하게 줘서 양옆 여백을 확보
                const bottomSqueeze = 1 - (Math.max(0, cosVal) * (isMobile ? 0.35 : 0.10));
                const tx = sinVal * radiusX * bottomSqueeze;
                // 모바일은 화면이 좁으므로 세로축 상단도 살짝 올려줌
                // 모바일은 타이틀과의 거리를 어느정도 두면서도 너무 멀어지지 않게 조절 (+50)
                const ty = (cosVal * radiusY) + (isMobile ? 50 : 30);

                // 2. Clean Z-Tilt 
                // 원근감 조절: 너무 멀지도 겹치지도 않게 적정선 타협 (420 -> 380)
                const tz = -cosVal * (isMobile ? 380 : 500);

                // 3. True Cylinder Rotation
                const rotateY = 180 - angle;

                // 4. Clean Scaling & Opacity
                // 모바일 카드 크기 살짝 증폭: 너무 작아보이지 않도록 0.50 -> 0.55
                const baseScale = isMobile ? 0.55 : 0.70;
                const scale = baseScale - (cosVal * 0.15);

                const opacity = 0.60 - (cosVal * 0.40);

                card.style.display = "flex"; // All cards always visible
                card.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${rotateY}deg) scale(${scale})`;
                card.style.opacity = opacity.toString();
                card.style.zIndex = Math.round(tz + 2000).toString();

                // Allow clicking everywhere
                card.style.pointerEvents = "auto";

                // 5. Video Performance Optimization (Lazy View)
                // 카드가 앞쪽(tz > -150)에 위치할 때만 비디오 재생, 뒤로 넘어가면 일시정지하여 리소스 최적화
                const video = videoRefs.current[i];
                if (video) {
                    if (tz > -150) {
                        if (video.paused) {
                            video.play().catch(() => { }); // 자동재생 정책에 의한 오류 방지
                        }
                    } else {
                        if (!video.paused) {
                            video.pause();
                        }
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
        gallery.addEventListener("touchstart", onDown, { passive: true });
        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchmove", onMove, { passive: true });
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
                        onClick={(e) => {
                            if (hasDragged.current) {
                                e.preventDefault();
                                e.stopPropagation();
                                return; // 드래그 중이었다면 클릭 무시
                            }
                            onProjectSelect?.(proj, e.currentTarget.getBoundingClientRect());
                        }}
                    >
                        <div className={styles.cardNumber}>{(i + 1).toString().padStart(2, '0')}</div>
                        <div className={styles.cardReflect} />
                        <div className={styles.imageOverlayContainer} style={{ backgroundColor: proj.backgroundColor || 'transparent' }}>
                            {proj.category && (
                                <div className={styles.categoryBadge}>
                                    {proj.category}
                                </div>
                            )}
                            {proj.cardVideo ? (
                                <video
                                    ref={el => { if (el) videoRefs.current[i] = el; }}
                                    src={encodeURI(proj.cardVideo)}
                                    muted
                                    loop
                                    playsInline
                                    preload="auto" // auto로 변경하여 사용자가 도달하기 직전에 알아서 미리 로드하도록 최적화
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    disablePictureInPicture
                                />
                            ) : (
                                proj.image && <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: proj.imageFit || 'cover', objectPosition: proj.imagePosition || 'center', padding: isMobileRender && proj.imageFit === 'contain' ? '24px' : (proj.imagePadding || '0') }} draggable={false} />
                            )}
                        </div>
                        <div className={styles.cardContent}>
                            <h4 className={styles.cardTitle}>{proj.cardTitle || proj.title}</h4>
                            <p className={styles.cardDesc}>{proj.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EllipseGallery;
