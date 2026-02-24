"use client";
import React, { useEffect, useState, useRef } from "react";

type Particle = {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
};

const ClickSpark = () => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const particlesRef = useRef<Particle[]>([]); // Ref for animation loop to avoid state lag
    const frameId = useRef<number>(0);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            // We want global coordinates, e.pageX/Y includes scroll
            // Fixed position container needs clientX/Y
            const x = e.clientX;
            const y = e.clientY;

            const newParticles: Particle[] = [];
            const count = 8 + Math.random() * 6; // 8 to 14 particles

            // Get color from CSS variable if possible, or hardcode generic
            // We can compute it once or read it.
            const colors = ['var(--accent-primary)', '#fff', 'var(--accent-secondary, #808080)'];

            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 4;
                newParticles.push({
                    id: Date.now() + i + Math.random(),
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1.0,
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }

            particlesRef.current = [...particlesRef.current, ...newParticles];
        };

        window.addEventListener("click", handleClick);

        const animate = () => {
            const currentParticles = particlesRef.current;

            if (currentParticles.length > 0) {
                // Update particles
                const aliveParticles = currentParticles
                    .map((p) => ({
                        ...p,
                        x: p.x + p.vx,
                        y: p.y + p.vy,
                        vy: p.vy + 0.2, // Gravity
                        life: p.life - 0.02,
                    }))
                    .filter((p) => p.life > 0);

                particlesRef.current = aliveParticles;
                setParticles(aliveParticles); // Update state to render
            }

            frameId.current = requestAnimationFrame(animate);
        };

        frameId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("click", handleClick);
            cancelAnimationFrame(frameId.current);
        };
    }, []);

    if (particles.length === 0) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 9999,
                overflow: "hidden",
            }}
        >
            {particles.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: "absolute",
                        left: p.x,
                        top: p.y,
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: p.color,
                        opacity: p.life,
                        transform: `scale(${p.life})`,
                        boxShadow: `0 0 4px ${p.color}`,
                    }}
                />
            ))}
        </div>
    );
};

export default ClickSpark;
