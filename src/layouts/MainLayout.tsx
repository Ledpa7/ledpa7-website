import React from 'react';
import { Cursor } from '../components/Cursor';
import { VerticalNav } from '../components/VerticalNav';
import { ShoppingCart, Menu, X, Instagram } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const menuLinks = [
        { name: 'MAIN', path: '/' },
        { name: 'ABOUT', path: '/about' },
        { name: 'SHOP', path: 'https://smartstore.naver.com/led-' },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col font-['LINE_Seed_Sans_KR'] text-black relative">
            <div className="hidden md:block">
                <style>{`
                    * {
                        cursor: none !important;
                    }
                    body, html {
                        cursor: none !important;
                    }
                    canvas {
                        cursor: none !important;
                    }
                `}</style>
                <Cursor />
            </div>
            <VerticalNav />

            {/* Minimal Header (Cart is here) */}
            <motion.header
                variants={{
                    visible: { y: 0, opacity: 1 },
                    hidden: { y: -48, opacity: 0 }
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 w-full bg-white/50 backdrop-blur-md z-[70] h-12 pointer-events-none text-black transition-colors duration-300"
            >
                <div className="w-full h-full flex justify-between items-center px-6 md:px-12">
                    {/* Left: Brand Logo Image */}
                    <a href="/" className="pointer-events-auto flex items-center h-full">
                        <img src="/logo.png" alt="Led.발광다이오드" className="h-[40px] w-auto object-contain" />
                    </a>

                    {/* Right: Cart Link (Restored to top) */}
                    <div className="pointer-events-auto flex items-center">
                        <a
                            href="https://smartstore.naver.com/led-"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:text-[#FF0000] transition-colors relative"
                        >
                            <ShoppingCart size={20} strokeWidth={1.5} />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FF0000] rounded-full"></span>
                        </a>
                    </div>
                </div>
            </motion.header>

            {/* Bottom Right Floating Instagram Button (Only when menu is open) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-24 right-8 z-[80] pointer-events-auto"
                    >
                        <a
                            href="https://www.instagram.com/ledpa7/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#FF0000] transition-all duration-300 transform active:scale-90"
                        >
                            <Instagram size={24} strokeWidth={1.5} />
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Right Floating Menu Button */}
            <div className="fixed bottom-8 right-8 z-[80] pointer-events-auto">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#FF0000] transition-all duration-300 transform active:scale-90"
                >
                    {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
                </button>
            </div>

            {/* Side Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-60 md:cursor-none"
                        />

                        {/* Menu Panel (Tiny Modern Design) */}
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
                            className="fixed top-0 right-0 h-full w-[200px] md:w-[240px] bg-white z-[70] shadow-2xl flex flex-col p-10 justify-center"
                        >
                            <nav className="flex flex-col space-y-6 items-end">
                                {menuLinks.map((link, idx) => (
                                    <motion.a
                                        key={link.name}
                                        href={link.path}
                                        initial={{ opacity: 0, x: 5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * idx }}
                                        className="text-[14px] md:text-[16px] font-bold tracking-[0.25em] hover:text-[#FF0000] transition-colors duration-300 group flex items-center font-['LINE_Seed_Sans_KR'] text-right"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.name}
                                        <span className="text-[7px] font-black text-[#FF0000] ml-4 opacity-30 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                                    </motion.a>
                                ))}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-grow pt-0">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-black py-20 border-t border-[#111] text-[11px] leading-relaxed tracking-[0.1em] text-gray-500 font-light font-['Noto_Sans_KR']">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start">

                    {/* Left Side: Brand / Email / Copyright / Privacy */}
                    <div className="flex flex-col space-y-3 mb-12 md:mb-0">
                        <h4 className="text-gray-400 font-medium text-[12px] tracking-tight mb-2">Led.발광다이오드</h4>
                        <a href="mailto:led@kakao.com" className="hover:text-gray-300 transition-colors">led@kakao.com</a>
                        <p>© 2024 Designed by Led</p>
                        <a href="/privacypolicy" className="hover:text-gray-300 transition-colors pt-2 block">개인정보보호방침</a>
                    </div>

                    {/* Right Side: Business Info & Keywords */}
                    <div className="flex flex-col md:items-end md:text-right space-y-8">
                        {/* Business Info */}
                        <div className="space-y-1">
                            <p>상호명 : 발광다이오드 <span className="mx-2 text-gray-800">|</span> 대표자명 : 정지두</p>
                            <p>연락처 : 010-9077-1261 <span className="mx-2 text-gray-800">|</span> Email : led@kakao.com</p>
                            <p>사업자 번호 : 781-37-01142 <span className="mx-2 text-gray-800">|</span> 통신판매신고번호 : 2024-안양동안-1692</p>
                            <p>사업장 주소 : 경기도 안양시 동안구 관악대로 359번길 28-20</p>
                        </div>

                        {/* Keywords */}
                        <div className="flex flex-col md:items-end uppercase tracking-[0.2em] scale-[0.9] origin-right">
                            <p>aluminum furniture</p>
                            <p>design furniture</p>
                            <p>kit furniture</p>
                            <p>design object</p>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
};
