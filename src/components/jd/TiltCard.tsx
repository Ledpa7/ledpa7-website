
"use client";
import React, { useRef, useState, useEffect } from 'react';

interface TiltCardProps {
    children: React.ReactNode;
    max?: number;        // 최대 회전 각도 (deg)
    scale?: number;      // 호버 시 확대 비율
    perspective?: number;// 원근감 (px)
    className?: string;
    style?: React.CSSProperties;
}

const TiltCard: React.FC<TiltCardProps> = ({
    children,
    max = 10,
    scale = 1.05,
    perspective = 1000,
    className,
    style
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || !innerRef.current || !glareRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const x = (e.clientX - rect.left) / width;
        const y = (e.clientY - rect.top) / height;

        const rotateY = (x - 0.5) * 2 * max;
        const rotateX = (y - 0.5) * 2 * -max;

        innerRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`;
        glareRef.current.style.opacity = '0.4';
    };

    const handleMouseEnter = () => {
        if (innerRef.current && glareRef.current) {
            innerRef.current.style.transition = 'none';
            glareRef.current.style.transition = 'none';
        }
    };

    const handleMouseLeave = () => {
        if (innerRef.current && glareRef.current) {
            innerRef.current.style.transition = 'transform 0.5s cubic-bezier(0.1, 0.5, 0.2, 1)';
            innerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            
            glareRef.current.style.transition = 'opacity 0.5s ease';
            glareRef.current.style.opacity = '0';
        }
    };

    return (
        <div
            ref={cardRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: `${perspective}px`,
                transformStyle: 'preserve-3d',
                cursor: 'pointer',
                ...style
            }}
        >
            <div
                ref={innerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transition: 'transform 0.5s cubic-bezier(0.1, 0.5, 0.2, 1)',
                    transformStyle: 'preserve-3d',
                    borderRadius: 'inherit',
                }}
            >
                {/* Content */}
                <div style={{ transform: 'translateZ(20px)', borderRadius: 'inherit', overflow: 'visible', height: '100%' }}>
                    {children}
                </div>

                {/* Glare Effect */}
                <div
                    ref={glareRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)',
                        opacity: 0,
                        transition: 'opacity 0.5s ease',
                        pointerEvents: 'none',
                        zIndex: 10,
                        borderRadius: 'inherit',
                        mixBlendMode: 'overlay'
                    }}
                />
            </div>
        </div>
    );
};

export default TiltCard;
