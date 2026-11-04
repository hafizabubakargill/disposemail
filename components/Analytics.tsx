'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { readConsent, CONSENT_EVENT } from '@/lib/consent';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-DX89L9W9FL';

// Google Analytics is only loaded after the visitor accepts analytics cookies.
export function Analytics() {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        setEnabled(!!readConsent()?.analytics);
        const onChange = (e: Event) => setEnabled(!!(e as CustomEvent).detail?.analytics);
        window.addEventListener(CONSENT_EVENT, onChange);
        return () => window.removeEventListener(CONSENT_EVENT, onChange);
    }, []);

    if (!enabled) return null;
    return (
        <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
                {`gtag('js', new Date()); gtag('config', '${GA_ID}', { anonymize_ip: true });`}
            </Script>
        </>
    );
}
