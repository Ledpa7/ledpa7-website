import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const VerticalNav: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { label: 'MAIN', path: '/' },
        { label: 'ABOUT', path: '/about' },
        { label: 'SHOP', path: 'https://smartstore.naver.com/led-', external: true },
    ];

    return (
        <nav className="fixed left-0 top-0 h-full w-[240px] z-50 hidden md:flex flex-col justify-center pl-16">
            <ul className="flex flex-col gap-6">
                {navItems.map((item) => (
                    <li key={item.label}>
                        {item.external ? (
                            <a
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold tracking-[0.2em] text-gray-400 hover:text-[#FF0000] transition-colors uppercase"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <Link
                                to={item.path}
                                className={`text-xs font-bold tracking-[0.2em] transition-colors uppercase block relative group ${isActive(item.path) ? 'text-black' : 'text-gray-400 hover:text-[#FF0000]'}`}
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};
