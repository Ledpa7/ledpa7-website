
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
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Mouse relative pos (0 ~ 1)
        const x = (e.clientX - rect.left) / width;
        const y = (e.clientY - rect.top) / height;

        // Rotation Calculation
        // Y축 회전은 X축 이동에 따라 (왼쪽가면 왼쪽(-)으로 회전.. 아니지, 왼쪽가면 오른쪽이 튀어나와야.. 아님. 왼쪽 위를 누르면 왼쪽위가 들어가야 함)
        // e.g. x가 0(왼쪽)이면 rotateY는 -max (왼쪽이 뒤로감) -> NO. 
        // 보통: 마우스가 왼쪽 -> 왼쪽이 내려감(rotateY < 0). 마우스가 위쪽 -> 위쪽이 내려감 (rotateX > 0).

        const rotateY = (x - 0.5) * 2 * max;      // -max ~ +max
        const rotateX = (y - 0.5) * 2 * -max;     // +max ~ -max (위쪽이 +Y좌표가 작으므로, e.clientY작을때 rotateX는 커야 함(위가 뒤로가려면? 아니 앞으로 오려면?))
        // CSS rotateX: positive = top goes back. 
        // We want: Mouse Top -> Top goes BACK (rotateX > 0).
        // y=0 -> (0 - 0.5)*-20 = 10. (rotateX=10 -> top back). Correct.

        setRotation({ x: rotateX, y: rotateY });
        setGlarePos({ x: x * 100, y: y * 100, opacity: 1 });
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setRotation({ x: 0, y: 0 });
        setGlarePos(prev => ({ ...prev, opacity: 0 }));
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
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transition: 'transform 0.4s cubic-bezier(0.1, 0.5, 0.2, 1)',
                    transform: `
                        rotateX(${rotation.x}deg) 
                        rotateY(${rotation.y}deg) 
                        scale(${isHovering ? scale : 1})
                    `,
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
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`,
                        opacity: isHovering ? 0.4 : 0,
                        transition: 'opacity 0.3s',
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
