'use client';

import { useState } from "react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="w-full flex justify-between items-center px-6 md:px-8 py-6 z-50 max-w-7xl mx-auto relative">
            <Link href="/" className="flex items-center space-x-2.5 group" aria-label="Home">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-800/20 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-gray-100">DisposeMail</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-[10px] font-black uppercase">v1.0</span>
                </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
                <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400 font-medium font-bold uppercase tracking-widest text-[10px]">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-white transition-colors">Home</Link>
                    <Link href="/about" className="hover:text-blue-600 dark:hover:text-white transition-colors">About</Link>
                    <Link href="/blog" className="hover:text-blue-600 dark:hover:text-white transition-colors">Blog</Link>
                    <Link href="/contact" className="hover:text-blue-600 dark:hover:text-white transition-colors">Contact</Link>
                </div>
                <ModeToggle />
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-3">
                <ModeToggle />
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] rounded-lg transition-colors"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <div className="absolute top-20 left-0 right-0 bg-white dark:bg-[#111] border-y border-gray-200 dark:border-[#222] p-6 flex flex-col gap-4 z-50 md:hidden animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
                    <Link href="/" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link href="/about" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>About Us</Link>
                    <Link href="/blog" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>Blog</Link>
                    <Link href="/contact" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>Contact Us</Link>
                </div>
            )}
        </nav>
    );
}
