import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MainLayout } from '../layouts/MainLayout';
import { FurnitureVideo } from '../components/FurnitureCanvas';
import { ArrowUpRight } from 'lucide-react';

const GridItemStyle: React.FC<{
    title?: string;
    price?: string;
    image?: string;
    className?: string;
    children?: React.ReactNode;
    hoverColor?: string;
    href?: string;
    productDetails?: {
        priceTag: string;
        specs: string[];
        description: string;
    };
}> = ({ title, price, className = "", children, hoverColor = "bg-[#FF0000]", href, productDetails }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    // Pass isHovered state to children (FurnitureVideo)
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { isHovered } as any);
        }
        return child;
    });

    return (
        <div
            className={`te-item group relative overflow-hidden flex flex-col ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`flex-grow w-full h-full relative flex items-center justify-center min-h-[220px] md:min-h-[300px] transition-transform duration-700 ease-out ${isHovered ? 'scale-[1.2]' : 'scale-100'}`}>
                {childrenWithProps}
            </div>

            {/* Hover Overlay */}
            <div className={`absolute inset-0 bg-transparent transition-opacity duration-500 p-4 md:p-8 flex flex-col justify-between text-black pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                {productDetails ? (
                    <div className="space-y-4 md:space-y-6">
                        <div className="pointer-events-auto">
                            <h3 className="text-xl md:text-2xl font-black text-[#FF0000] leading-none">{title}</h3>
                            <p className="text-[12px] md:text-sm font-medium mt-1 text-black">{productDetails.priceTag}</p>
                        </div>

                        <div className="space-y-1 md:space-y-1.5 pt-3 md:pt-4 border-t border-black/20">
                            {productDetails.specs.map((spec, i) => (
                                <p key={i} className="text-[10px] md:text-[14px] leading-tight md:tracking-wide text-black font-medium">{spec}</p>
                            ))}
                        </div>

                        <div className="pt-2 md:pt-4 pointer-events-auto hidden md:block">
                            <p className="text-[14px] leading-relaxed text-black font-normal">
                                {productDetails.description}
                            </p>
                        </div>
                    </div>
                ) : title && (
                    <div className="flex justify-between items-end h-full">
                        <div className="pointer-events-auto">
                            <span className="text-sm font-bold uppercase tracking-tight leading-none text-black bg-white/80 px-1">{title}</span>
                            {price && <div className="mt-1"><span className="text-[10px] text-black bg-white/80 px-1 font-bold">{price}</span></div>}
                        </div>
                    </div>
                )}

                <div className="flex justify-end mt-auto">
                    {href ? (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${hoverColor} text-white rounded-full p-3 hover:scale-110 transition-transform pointer-events-auto shadow-xl group/btn`}
                        >
                            <ArrowUpRight size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </a>
                    ) : (
                        <button className={`${hoverColor} text-white rounded-full p-3 hover:scale-110 transition-transform pointer-events-auto shadow-xl`}>
                            <ArrowUpRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Aliasing GridItemStyle for use in Home
const GridItem = GridItemStyle;

export const Home: React.FC = () => {
    const heroRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end end"]
    });

    // --- Advanced Assembly Sequence Transforms ---

    // Text Overlay Animations
    const text1Opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
    const text1Scale = useTransform(scrollYProgress, [0, 0.25], [1, 0.85]);
    const text1Y = useTransform(scrollYProgress, [0, 0.25], [0, -120]);
    const bodyOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

    // Backdrop & Video adjustment transforms
    const heroBlur = useTransform(scrollYProgress, [0, 0.3], [6, 0]);
    const heroSaturate = useTransform(scrollYProgress, [0, 0.3], [1, 1.5]);
    const heroOverlayOpacity = useTransform(scrollYProgress, [0, 0.3], [0.1, 0]);

    // Hero Image/Video Zoom Sequence
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

    return (
        <MainLayout>
            <div className="w-full bg-white min-h-screen relative font-['LINE_Seed_Sans_KR']">

                {/* 1. LARGE IMAGE (Hero) - Auto Playing Video with Zoom */}
                <section ref={heroRef} className="relative h-auto md:h-[200vh] w-full bg-white md:bg-black">

                    {/* MOBILE VERSION: Vertical Stack, Non-overlapping */}
                    <div className="flex flex-col md:hidden w-full bg-white pt-12">
                        <div className="w-full aspect-square flex items-center justify-center bg-white">
                            <video
                                src="/videos/Led_video.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="relative z-10 flex flex-col items-center justify-center text-center text-black px-6 py-16 w-full">
                            <h1 className="text-[36px] font-bold tracking-tighter uppercase leading-none mb-12 flex flex-row items-center justify-center gap-2 font-['LINE_Seed_Sans_KR']">
                                <span className="text-black">100 - 100 =</span>
                                <span className="text-[#FF0000] text-[64px] -translate-y-[0.05em] font-['Noto_Sans_KR'] font-black">∞</span>
                            </h1>

                            <div className="text-[14px] tracking-widest max-w-3xl leading-relaxed font-['Noto_Sans_KR'] font-medium space-y-4">
                                <p>Led.발광다이오드는 첫번째 프로젝트로</p>
                                <p><span className="text-[#FF0000] font-bold">알루미늄프로파일 가구</span>를 만듭니다.</p>
                                <p><span className="text-[#FF0000] font-bold">모든 디자인은 100개만 완제품으로 판매</span> 됩니다.</p>
                                <p>모두 판매되면 만드는 방법을 공유하고,</p>
                                <p>알루미늄프로파일을 구하여 만들거나,</p>
                                <p>판매되는 키트를 구매하여</p>
                                <p>직접 만들 수 있습니다.</p>
                            </div>
                        </div>
                    </div>

                    {/* DESKTOP VERSION: Sticky Overlap (Preserved exactly as before) */}
                    <div
                        className="sticky top-0 h-screen w-full hidden md:flex items-center justify-center overflow-hidden"
                    >
                        {/* LAYER 1: Standard Video Background with Saturation Transform */}
                        <motion.div
                            style={{
                                scale: heroScale,
                                filter: useTransform(heroSaturate, (s) => `saturate(${s})`)
                            }}
                            className="absolute inset-0 z-0"
                        >
                            <video
                                src="/videos/Led_video.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* LAYER 2: Glassmorphism Blur Overlay with Scroll Transform */}
                        <motion.div
                            style={{
                                backdropFilter: useTransform(heroBlur, (b) => `blur(${b}px)`),
                                backgroundColor: useTransform(heroOverlayOpacity, (o) => `rgba(0,0,0,${o})`)
                            }}
                            className="absolute inset-0 z-0"
                        />

                        {/* LAYER 3: Text Overlay Layer */}
                        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-6 w-full">
                            <motion.h1
                                style={{ opacity: text1Opacity, scale: text1Scale, y: text1Y }}
                                className="text-[110px] font-bold tracking-tighter uppercase leading-none mb-12 flex flex-row items-center justify-center gap-6 drop-shadow-sm font-['LINE_Seed_Sans_KR']"
                            >
                                <span className="text-black">100 - 100 =</span>
                                <span className="text-[#FF0000] text-[160px] -translate-y-[0.05em] drop-shadow-2xl font-['Noto_Sans_KR']">∞</span>
                            </motion.h1>

                            <motion.div
                                style={{
                                    opacity: bodyOpacity,
                                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8)) drop-shadow(0 4px 12px rgba(0,0,0,0.5))"
                                }}
                                className="text-lg font-light tracking-widest max-w-3xl mix-blend-difference leading-[2] body-font"
                            >
                                <p>
                                    Led.발광다이오드는 첫번째 프로젝트로<br />
                                    산업에서 쓰이는 <span className="text-[#FF0000] font-medium">알루미늄프로파일로 가구</span>를 만듭니다.<br /><br />
                                    모든 <span className="text-[#FF0000] font-medium">디자인은 100개만 완제품으로 판매</span> 됩니다.<br /><br />
                                    모두 판매되면 만드는 방법을 공유하고,<br />
                                    알루미늄프로파일을 구하여 만들거나,<br />
                                    판매되는 키트를 구매하여 <br />
                                    직접 만들 수 있습니다.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 2. PRODUCT GRID SECTION (Final Corrected Grid) */}
                <section className="grid grid-cols-1 md:grid-cols-3 border-t border-x border-black overflow-hidden px-px md:px-0">
                    <GridItem
                        className="border-b border-black md:border-r"
                        title="첫번째, S013스툴"
                        href="https://smartstore.naver.com/led-/products/10956015251"
                        productDetails={{
                            priceTag: "판매가 : 128,000원",
                            specs: [
                                "사이즈 / size : 320 x 320 x 440 mm",
                                "무게 / weight : 2.3 Kg",
                                "소재 / material : Aluminum",
                                "하중 / capacity : 100 Kg"
                            ],
                            description: "가장 작은 단위라 생각하는 가구인 스툴을 단순한 형태와 최소한의 재료로 쉽게 사용할 수 있는 손잡이가 달린 '스툴 & 사이드테이블'입니다."
                        }}
                    >
                        <FurnitureVideo videoPath="/videos/01_S013.532.mp4#t=0.001" />
                    </GridItem>

                    <GridItem
                        className="border-b border-black md:border-r"
                        title="두번째, P028벤치"
                        href="https://smartstore.naver.com/led-/products/10995630001"
                        productDetails={{
                            priceTag: "판매가 : 288,000원",
                            specs: [
                                "사이즈 / size : 1040 x 300 x 320 mm",
                                "무게 / weight : 5 Kg",
                                "소재 / material : Aluminum",
                                "하중 / capacity : 250 Kg"
                            ],
                            description: "'짧은 휴식'을 위해 디자인되었습니다. 상판 격자형태는 튼튼하면서 개성이 느껴지게 만들었습니다. 일반적인 벤치보다 낮은데, 이는 300mm 사이즈를 모듈화하여 다른 가구들에도 적용하고자 설계하였습니다."
                        }}
                    >
                        <FurnitureVideo videoPath="/videos/02_P028.mp4#t=0.001" />
                    </GridItem>

                    <GridItem
                        className="border-b border-black md:border-r-0"
                        title="세번째, S012쿠션의자"
                        href="https://smartstore.naver.com/led-/products/11030137738"
                        productDetails={{
                            priceTag: "판매가 : 348,000원",
                            specs: [
                                "사이즈 / size : 680 x 680 x 680 mm",
                                "무게 / weight : 6.5 Kg",
                                "소재 / material : Aluminum / Fabric",
                                "하중 / capacity : 100 Kg"
                            ],
                            description: "프로파일로 편한 의자를 만드는 것에 한계가 있어 최대한 해소하려고 큰 쿠션을 사용하여 편안하게 앉고 팔걸이를 이용해 쉽게 일어날 수 있는 '쿠션 의자'입니다."
                        }}
                    >
                        <FurnitureVideo videoPath="/videos/03_S012.mp4#t=0.001" />
                    </GridItem>

                    <GridItem
                        className="border-b border-black md:border-r"
                        title="네번째, S018사이드테이블"
                        href="https://smartstore.naver.com/led-/products/11192497421"
                        productDetails={{
                            priceTag: "판매가 : 256,000원",
                            specs: [
                                "사이즈 / size : 400 x 400 x 460 mm",
                                "무게 / weight : 4.8 Kg",
                                "소재 / material : Aluminum",
                                "하중 / capacity : 100 Kg"
                            ],
                            description: "침대 옆에서 사용할 작은 테이블이 필요했습니다. 핸드폰과 조명, 책등이 놓여졌으면 하는 생각으로 디자인하였습니다. 상판에는 물건을 떨어뜨리지 않기 위한 2cm 턱이 있고 하판에는 큰 물건을 수납할 수 있습니다. 기둥은 라운드 프로파일을 사용하여 부드러운 느낌을 주고자 하였습니다."
                        }}
                    >
                        <FurnitureVideo videoPath="/videos/04_S018.mp4#t=0.001" />
                    </GridItem>

                    <GridItem className="border-b border-black md:border-r">
                        <div className="flex items-center justify-center w-full h-full bg-[#FAFAFA] text-center">
                            <span className="text-gray-300 font-bold tracking-[0.2em] text-[10px] uppercase italic">Coming<br />Soon</span>
                        </div>
                    </GridItem>

                    <GridItem className="border-b border-black md:border-r-0">
                        <div className="flex items-center justify-center w-full h-full bg-[#FAFAFA] text-center">
                            <span className="text-gray-300 font-bold tracking-[0.2em] text-[10px] uppercase italic">Coming<br />Soon</span>
                        </div>
                    </GridItem>
                </section>

                {/* Footnotes and Middle sections removed as per user request */}

            </div>
        </MainLayout>
    );
};
