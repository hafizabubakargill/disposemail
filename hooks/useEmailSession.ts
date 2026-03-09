'use client';

import { useState, useEffect } from 'react';
import { generateRandomDomain, DEFAULT_DOMAIN } from "@/lib/domains";

/** Generates a short random 4-char alphanumeric suffix for inbox isolation */
function randomSuffix(): string {
    return Math.random().toString(36).substring(2, 6);
}

export function useEmailSession() {
    const [email, setEmail] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(3600);
    const [progress, setProgress] = useState(100);
    const [selectedDomain, setSelectedDomain] = useState(() => DEFAULT_DOMAIN);
    const [isMounted, setIsMounted] = useState(false);
    const [isCustom, setIsCustom] = useState(false);
    const [customPrefix, setCustomPrefix] = useState('');
    const [sessionToken, setSessionToken] = useState<string>('');

    useEffect(() => {
        setIsMounted(true);
        let stored = localStorage.getItem('disposemail_address');
        const created = localStorage.getItem('disposemail_created');
        let storedToken = localStorage.getItem('disposemail_token');
        const now = Date.now();

        if (!storedToken) {
            storedToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
            localStorage.setItem('disposemail_token', storedToken);
        }
        setSessionToken(storedToken);

        if (stored && created) {
            const diff = now - parseInt(created);
            if (diff > 60 * 60 * 1000) {
                stored = null;
            } else {
                const remaining = Math.max(0, 3600 - Math.floor(diff / 1000));
                setTimeLeft(remaining);
                setProgress((remaining / 3600) * 100);
                setSelectedDomain(stored.split('@')[1] || DEFAULT_DOMAIN);
            }
        }

        if (!stored) {
            const domain = generateRandomDomain();
            const userPart = Math.random().toString(36).substring(2, 10);
            stored = `${userPart}@${domain}`;
            localStorage.setItem('disposemail_address', stored);
            localStorage.setItem('disposemail_created', now.toString());
            setTimeLeft(3600);
            setProgress(100);
            setSelectedDomain(domain);
        }

        setEmail(stored);

        const timer = setInterval(() => {
            const createdTime = localStorage.getItem('disposemail_created');
            if (createdTime) {
                const elapsed = Math.floor((Date.now() - parseInt(createdTime)) / 1000);
                const remaining = Math.max(0, 3600 - elapsed);
                setTimeLeft(remaining);
                setProgress((remaining / 3600) * 100);

                if (remaining <= 0) {
                    handleRefresh();
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleRefresh = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const domain = generateRandomDomain();

        let userPart: string;
        if (isCustom && customPrefix.length > 0) {
            // Sanitise the user-chosen prefix
            const clean = customPrefix.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
            // Always append a random 4-char suffix so two users who pick the
            // same name NEVER share an inbox (privacy parity with the old
            // subdomain approach, without requiring wildcard DNS routing).
            const suffix = randomSuffix();
            userPart = `${clean}-${suffix}`;
        } else {
            userPart = Math.random().toString(36).substring(2, 10);
        }

        const newEmail = `${userPart}@${domain}`;
        const newToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        
        localStorage.setItem('disposemail_address', newEmail);
        localStorage.setItem('disposemail_created', Date.now().toString());
        localStorage.setItem('disposemail_token', newToken);
        
        setEmail(newEmail);
        setSessionToken(newToken);
        setTimeLeft(3600);
        setProgress(100);
        setSelectedDomain(domain);
    };

    return {
        email,
        timeLeft,
        progress,
        selectedDomain,
        isMounted,
        handleRefresh,
        isCustom,
        setIsCustom,
        customPrefix,
        setCustomPrefix,
        sessionToken
    };
}
