import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navigation: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    interface NavItem {
        label: string;
        path: string;
        external?: boolean;
    }

    const navItems: NavItem[] = [
        { label: 'store', path: '/store' },
        { label: 'products', path: '/products' },
        { label: 'guides', path: '/guides' },
        { label: 'newsletter', path: '/newsletter' },
    ];



    return (
        <nav className="relative z-50">
            {/* Desktop Nav */}
            <ul className="hidden md:flex gap-16 text-[10px] font-mono font-bold tracking-[0.4em]">
                {navItems.map((item) => (
                    <li key={item.label}>
                        {item.external ? (
                            <a
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black hover:text-industrial-accent transition-colors uppercase"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <Link
                                to={item.path}
                                className={`transition-colors uppercase ${isActive(item.path) ? 'text-black border-b border-black' : 'text-black/40 hover:text-black'}`}
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>


            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <div className="absolute top-12 right-0 w-48 bg-white border border-gray-100 shadow-xl rounded-lg p-4 flex flex-col gap-4 md:hidden">
                    {navItems.map((item) => (
                        <div key={item.label}>
                            {item.external ? (
                                <a
                                    href={item.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm hover:text-gray-500"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={`block text-sm hover:text-gray-500 ${isActive(item.path) ? 'font-bold' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
};
