'use client';

import { useState, useEffect } from 'react';

export default function ColorConverterTool() {
    const [hex, setHex] = useState('#3B82F6');
    const [rgb, setRgb] = useState('rgb(59, 130, 246)');
    const [hsl, setHsl] = useState('hsl(217, 91%, 60%)');
    
    // Extracted strictly for harmony generation
    const [h, setH] = useState(217);
    const [s, setS] = useState(91);
    const [l, setL] = useState(60);

    const [copied, setCopied] = useState<string | null>(null);

    // Helpers
    const hexToRgb = (hCode: string) => {
        let r = 0, g = 0, b = 0;
        if (hCode.length === 4) {
            r = parseInt(hCode[1] + hCode[1], 16);
            g = parseInt(hCode[2] + hCode[2], 16);
            b = parseInt(hCode[3] + hCode[3], 16);
        } else if (hCode.length === 7) {
            r = parseInt(hCode[1] + hCode[2], 16);
            g = parseInt(hCode[3] + hCode[4], 16);
            b = parseInt(hCode[5] + hCode[6], 16);
        }
        return [r, g, b] as const;
    };

    const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)] as const;
    };

    const parseAndSetFromHex = (val: string) => {
        setHex(val);
        if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
            const [r, g, b] = hexToRgb(val);
            setRgb(`rgb(${r}, ${g}, ${b})`);
            const [nh, ns, nl] = rgbToHsl(r, g, b);
            setHsl(`hsl(${nh}, ${ns}%, ${nl}%)`);
            setH(nh); setS(ns); setL(nl);
        }
    };

    const parseAndSetFromRgb = (val: string) => {
        setRgb(val);
        const match = val.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if (match) {
            let [_, r, g, b] = match;
            let rn = parseInt(r), gn = parseInt(g), bn = parseInt(b);
            if (rn <= 255 && gn <= 255 && bn <= 255) {
                const newHex = "#" + (1 << 24 | rn << 16 | gn << 8 | bn).toString(16).slice(1).toUpperCase();
                setHex(newHex);
                const [nh, ns, nl] = rgbToHsl(rn, gn, bn);
                setHsl(`hsl(${nh}, ${ns}%, ${nl}%)`);
                setH(nh); setS(ns); setL(nl);
            }
        }
    };

    const copy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    // Calculate harmony (Analogous Left, Analogous Right, Complementary, Triadic Left, Triadic Right, Split)
    const harmonies = [
        { label: 'Complementary', h: (h + 180) % 360 },
        { label: 'Analogous R', h: (h + 30) % 360 },
        { label: 'Analogous L', h: (h + 330) % 360 },
        { label: 'Triadic R', h: (h + 120) % 360 },
        { label: 'Triadic L', h: (h + 240) % 360 },
        { label: 'Monochrome-', l: Math.max(0, l - 20) },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-6">
                
                {/* Inputs */}
                <div className="flex-1 flex flex-col gap-5">
                    
                    {/* Color Picker Native */}
                    <div className="flex items-center gap-4 bg-white dark:bg-[#0a0a0a] p-4 rounded-3xl border border-gray-200 dark:border-[#2a2a2a] shadow-sm">
                        <input
                            type="color"
                            value={/^#([0-9A-F]{3}){1,2}$/i.test(hex) ? hex : '#000000'}
                            onChange={(e) => parseAndSetFromHex(e.target.value)}
                            className="w-16 h-16 shrink-0 rounded-2xl cursor-pointer bg-transparent border-0 p-0"
                            style={{ clipPath: 'circle(50% at 50% 50%)' }}
                        />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-gray-400">Master Swatch</span>
                            <span className="text-xl font-bold font-mono text-gray-900 dark:text-white">{hex.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 bg-gray-50 dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-[#222]">
                        <div className="flex flex-col relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-fuchsia-500 mb-2 pl-2">HEX Code</label>
                            <input 
                                value={hex} 
                                onChange={(e) => parseAndSetFromHex(e.target.value)}
                                className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] p-3 pl-4 text-gray-900 dark:text-white font-mono text-sm rounded-xl focus:ring-2 focus:ring-fuchsia-500/50 outline-none" 
                            />
                            <button onClick={() => copy(hex, 'hex')} className={`absolute right-2 top-[28px] text-[10px] uppercase font-bold px-2 py-1 rounded-md transition-colors ${copied === 'hex' ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-[#333] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>{copied==='hex' ? 'Copied' : 'Copy'}</button>
                        </div>
                        <div className="flex flex-col relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-fuchsia-500 mb-2 pl-2">RGB Array</label>
                            <input 
                                value={rgb} 
                                onChange={(e) => parseAndSetFromRgb(e.target.value)}
                                className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] p-3 pl-4 text-gray-900 dark:text-white font-mono text-sm rounded-xl focus:ring-2 focus:ring-fuchsia-500/50 outline-none" 
                            />
                            <button onClick={() => copy(rgb, 'rgb')} className={`absolute right-2 top-[28px] text-[10px] uppercase font-bold px-2 py-1 rounded-md transition-colors ${copied === 'rgb' ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-[#333] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>{copied==='rgb' ? 'Copied' : 'Copy'}</button>
                        </div>
                        <div className="flex flex-col relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-fuchsia-500 mb-2 pl-2">HSL Declaration</label>
                            <input 
                                readOnly
                                value={hsl} 
                                className="w-full bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] p-3 pl-4 text-gray-600 dark:text-gray-400 font-mono text-sm rounded-xl outline-none" 
                            />
                            <button onClick={() => copy(hsl, 'hsl')} className={`absolute right-2 top-[28px] text-[10px] uppercase font-bold px-2 py-1 rounded-md transition-colors ${copied === 'hsl' ? 'bg-green-100 text-green-700' : 'bg-white dark:bg-[#333] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>{copied==='hsl' ? 'Copied' : 'Copy'}</button>
                        </div>
                    </div>
                </div>

                {/* Swatch Demo */}
                <div className="flex-[1.5] flex flex-col items-center justify-center p-8 rounded-3xl overflow-hidden shadow-inner border border-gray-100 dark:border-black transition-colors duration-500" style={{ backgroundColor: `hsl(${h}, ${s}%, ${l}%)` }}>
                    <div className="bg-white/90 dark:bg-black/90 px-8 py-5 rounded-3xl backdrop-blur text-center shadow-xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#333] dark:text-[#ccc] mb-2">CSS Background Visualizer</p>
                        <p className="text-3xl font-bold font-mono text-black dark:text-white">{hex}</p>
                    </div>
                </div>
            </div>

            {/* Harmony Generator */}
            <div className="w-full flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 pl-2">Harmony Palette Generator</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {harmonies.map((harm, idx) => {
                        const localH = harm.h !== undefined ? harm.h : h;
                        const localS = s;
                        const localL = harm.l !== undefined ? harm.l : l;
                        const bgColor = `hsl(${localH}, ${localS}%, ${localL}%)`;
                        return (
                            <div key={idx} className="flex flex-col group cursor-pointer" onClick={() => copy(bgColor, `harm_${idx}`)}>
                                <div className="w-full h-[80px] rounded-2xl shadow-sm border border-black/5 dark:border-white/5 transition-transform group-hover:-translate-y-1 mb-2" style={{ backgroundColor: bgColor }}></div>
                                <span className="text-[10px] font-black uppercase text-gray-400">{harm.label}</span>
                                <span className="text-[11px] font-mono text-gray-600 dark:text-gray-300">{copied === `harm_${idx}` ? 'Copied!' : bgColor}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
