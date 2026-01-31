'use client';

import { useEffect } from 'react';

interface GoogleAdProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    className?: string;
    responsive?: boolean;
}

export default function GoogleAd({ slot, format = 'auto', className = '', responsive = true }: GoogleAdProps) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className={`overflow-hidden my-4 ${className}`}>
            {/* Placeholder for Development */}
            <div className="text-[10px] text-gray-400 dark:text-gray-600 mb-1 uppercase tracking-widest text-center">Advertisement</div>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-5210079727285405"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
            />
        </div>
    );
}
