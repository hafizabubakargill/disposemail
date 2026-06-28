'use client';

import { useState, useEffect } from 'react';
import { generateRandomDomain, DEFAULT_DOMAIN } from "@/lib/domains";

export function useEmailSession() {
    const [email, setEmail] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(3600);
    const [progress, setProgress] = useState(100);
    const [selectedDomain, setSelectedDomain] = useState(() => DEFAULT_DOMAIN);
    const [isMounted, setIsMounted] = useState(false);
    const [isCustom, setIsCustom] = useState(false);
    const [customPrefix, setCustomPrefix] = useState('');
    const [sessionToken, setSessionToken] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Internal helper to get a token from the server
    const fetchToken = async (emailAddr: string) => {
        try {
            const res = await fetch('/api/session/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailAddr })
            });
            if (!res.ok) throw new Error('Token generation failed');
            const data = await res.json();
            return data.token;
        } catch (err) {
            console.error('Failed to get session token:', err);
            setError('session_failed');
            return null;
        }
    };

    useEffect(() => {
        setIsMounted(true);
        const initialize = async () => {
            let stored = localStorage.getItem('disposemail_address');
            let created = localStorage.getItem('disposemail_created');
            let storedToken = localStorage.getItem('disposemail_token');
            const now = Date.now();

            if (stored && created) {
                const diff = now - parseInt(created);
                if (diff > 60 * 60 * 1000) {
                    stored = null;
                } else {
                    const remaining = Math.max(0, 3600 - Math.floor(diff / 1000));
                    setTimeLeft(remaining);
                    setProgress((remaining / 3600) * 100);
                    setSelectedDomain(stored.split('@')[1] || DEFAULT_DOMAIN);
                    
                    // If we have an email but no token (or need a fresh one), get it
                    if (!storedToken) {
                        storedToken = await fetchToken(stored);
                        if (storedToken) localStorage.setItem('disposemail_token', storedToken);
                    }
                }
            }

            if (!stored) {
                const domain = generateRandomDomain();
                const userPart = Math.random().toString(36).substring(2, 10);
                stored = `${userPart}@${domain}`;
                
                storedToken = await fetchToken(stored);
                
                localStorage.setItem('disposemail_address', stored);
                localStorage.setItem('disposemail_created', now.toString());
                if (storedToken) localStorage.setItem('disposemail_token', storedToken);
                
                setTimeLeft(3600);
                setProgress(100);
                setSelectedDomain(domain);
            }

            setEmail(stored);
            if (storedToken) setSessionToken(storedToken);
        };

        initialize();

        const syncFromStorage = () => {
            const storedAddr = localStorage.getItem('disposemail_address');
            if (storedAddr) {
                setEmail(prev => {
                    if (prev !== storedAddr) {
                        setSelectedDomain(storedAddr.split('@')[1] || DEFAULT_DOMAIN);
                        return storedAddr;
                    }
                    return prev;
                });
            }
        };

        window.addEventListener('storage', syncFromStorage);
        window.addEventListener('disposemail_sync', syncFromStorage);

        const timer = setInterval(() => {
            syncFromStorage();
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
        }, 250);

        return () => {
            clearInterval(timer);
            window.removeEventListener('storage', syncFromStorage);
            window.removeEventListener('disposemail_sync', syncFromStorage);
        };
    }, []);

    const handleRefresh = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const domain = generateRandomDomain();

        let userPart: string;
        if (isCustom && customPrefix.length > 0) {
            userPart = customPrefix.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
        } else {
            userPart = Math.random().toString(36).substring(2, 10);
        }

        const newEmail = `${userPart}@${domain}`;
        const newToken = await fetchToken(newEmail);
        
        localStorage.setItem('disposemail_address', newEmail);
        localStorage.setItem('disposemail_created', Date.now().toString());
        if (newToken) localStorage.setItem('disposemail_token', newToken);
        window.dispatchEvent(new Event('disposemail_sync'));
        
        setEmail(newEmail);
        if (newToken) setSessionToken(newToken);
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
        sessionToken,
        error
    };
}
