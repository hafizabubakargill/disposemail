'use client';

import { useCallback, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useTranslations } from 'next-intl';
import DOMPurify from 'dompurify';

export interface Email {
    id: string;
    from_address: string;
    subject: string;
    text: string;
    html?: string;
    raw?: string;
    attachments?: {
        filename: string;
        contentType: string;
        size: number;
        checksum: string;
    }[];
    received_at: number;
    is_read?: boolean;
}

export default function Inbox({ emailAddress, sessionToken }: { emailAddress: string; sessionToken: string }) {
    const t = useTranslations('Inbox');
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [showMobileContent, setShowMobileContent] = useState(false);
    const [showRawSource, setShowRawSource] = useState(false);
    const [showBurnConfirm, setShowBurnConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const socketRef = useRef<any>(null);
    const lastSyncRef = useRef<number>(0);
    const [isTabActive, setIsTabActive] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // SEC-FIX: Keep token in a ref so fetchEmails closure always reads the latest value
    const sessionTokenRef = useRef<string>(sessionToken);
    useEffect(() => { sessionTokenRef.current = sessionToken; }, [sessionToken]);

    const unreadEmailsCount = emails.filter(e => !e.is_read).length;

    useEffect(() => {
        // Securely intercept and rewrite all image/link attributes to prevent IP-tracking and target hijacking
        DOMPurify.addHook('afterSanitizeAttributes', function (node) {
            if (node.tagName && node.tagName.toLowerCase() === 'img' && node.hasAttribute('src')) {
                const originalSrc = node.getAttribute('src');
                if (originalSrc && originalSrc.startsWith('http')) {
                    // Proxy all images through backend node fetch to hide client IP
                    node.setAttribute('src', `/api/proxy-image?url=${encodeURIComponent(originalSrc)}`);
                }
            }
            if (node.tagName && node.tagName.toLowerCase() === 'a') {
                node.setAttribute('target', '_blank');
                node.setAttribute('rel', 'noopener noreferrer');
            }
        });
        
        return () => {
            DOMPurify.removeHook('afterSanitizeAttributes');
        };
    }, []);

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const [blockedSenders, setBlockedSendersState] = useState<string[]>([]);
    const blockedSendersRef = useRef<string[]>([]);
    const [blockSenderConfirm, setBlockSenderConfirm] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem(`blocked_senders_${emailAddress}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setBlockedSendersState(parsed);
                blockedSendersRef.current = parsed;
            } catch (e) { }
        }
    }, [emailAddress]);

    const setBlockedSenders = (senders: string[]) => {
        setBlockedSendersState(senders);
        blockedSendersRef.current = senders;
        localStorage.setItem(`blocked_senders_${emailAddress}`, JSON.stringify(senders));

        setEmails(prev => prev.filter(e => !senders.includes(e.from_address)));
        if (selectedEmail && senders.includes(selectedEmail.from_address)) {
            setSelectedEmail(null);
            setShowMobileContent(false);
        }
    };

    const confirmBlockSender = () => {
        if (blockSenderConfirm) {
            setBlockedSenders([...blockedSendersRef.current, blockSenderConfirm]);
            showToast(`${t('block')} ${blockSenderConfirm}`);
        }
        setBlockSenderConfirm(null);
    };

    const playNotificationSound = () => {
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gain = context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(440, context.currentTime + 0.1);

            gain.gain.setValueAtTime(0.3, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

            oscillator.connect(gain);
            gain.connect(context.destination);

            oscillator.start();
            oscillator.stop(context.currentTime + 0.5);
        } catch (e) {
            console.log('Audio blocked or unsupported');
        }
    };

    const showNotification = (title: string, body: string) => {
        if (!("Notification" in window)) return;
        if (Notification.permission === "granted") {
            const n = new Notification(title, {
                body: body,
                icon: '/icon.svg'
            });
            n.onclick = () => {
                window.focus();
                n.close();
            };
        }
    };

    const requestNotificationPermission = () => {
        if (!("Notification" in window)) return;
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    };

    const handleBurnInbox = () => {
        setShowBurnConfirm(true);
    };

    const confirmBurn = () => {
        localStorage.removeItem('disposemail_address');
        localStorage.removeItem('disposemail_created');
        window.location.reload();
    };

    const handleSelectEmail = (email: Email) => {
        setSelectedEmail(email);
        setShowMobileContent(true);

        if (!email.is_read) {
            setEmails(prev => prev.map(e => e.id === email.id ? { ...e, is_read: true } : e));

            fetch('/x-feed/emails/read', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionTokenRef.current}` 
                },
                body: JSON.stringify({ id: email.id })
            }).catch(console.error);
        }
    };

    const handleMarkAsUnread = (email: Email) => {
        setEmails(prev => prev.map(e => e.id === email.id ? { ...e, is_read: false } : e));
        fetch('/x-feed/emails/unread', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionTokenRef.current}` 
            },
            body: JSON.stringify({ id: email.id })
        }).catch(console.error);
        setShowMobileContent(false);
        setSelectedEmail(null);
    };

    const confirmDeleteEmail = () => {
        if (!showDeleteConfirm) return;
        
        // Optimistic UI update
        setEmails(prev => prev.filter(e => e.id !== showDeleteConfirm));
        setShowMobileContent(false);
        setSelectedEmail(null);

        // Network request to SQLite backend
        fetch('/x-feed/emails/delete', {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionTokenRef.current}` 
            },
            body: JSON.stringify({ id: showDeleteConfirm })
        }).catch(err => {
            console.error('Failed to delete email from backend:', err);
            showToast(t('error')); 
        });

        setShowDeleteConfirm(null);
    };

    const fetchEmails = () => {
        const token = sessionTokenRef.current;
        // Don't fetch if we don't have a token yet — server will 401 us
        if (!token) return;
        
        fetch('/x-feed/emails?address=' + emailAddress, {
            credentials: 'omit',
            headers: { 
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.json();
            })
            .then((data: Email[]) => {
                const nonBlockedData = data.filter(e => !blockedSendersRef.current.includes(e.from_address));
                setEmails(current => {
                    const newEmails = nonBlockedData.filter(e => !current.some(c => c.id === e.id));
                    if (newEmails.length > 0 && current.length > 0) {
                        playNotificationSound();
                        const latest = newEmails[0];
                        showNotification(`New Email: ${latest.subject || '(No Subject)'}`, `From: ${latest.from_address || 'Unknown'}`);
                    }
                    return nonBlockedData;
                });
                setError(null);
                setIsInitialLoading(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setError('system_busy');
                setIsInitialLoading(false);
            });
    };

    useEffect(() => {
        let toggle = false;
        const interval = setInterval(() => {
            if (unreadEmailsCount > 0) {
                document.title = toggle ? `(${unreadEmailsCount}) New Mail!` : 'DisposeMail';
                toggle = !toggle;
            } else {
                document.title = 'DisposeMail - Secure Disposable Email';
            }
        }, 1000);

        return () => {
            clearInterval(interval);
            document.title = 'DisposeMail - Secure Disposable Email';
        };
    }, [unreadEmailsCount]);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            const registerSW = () => {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    for (let registration of registrations) {
                        if (!registration.active?.scriptURL.includes('v=1.0.11')) {
                            registration.unregister();
                            console.log('Nuclear Purge: Old Service Worker unregistered');
                        }
                    }
                });
                navigator.serviceWorker.register('/sw.js?v=1.0.13').catch(console.error);
            };

            if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(registerSW);
            } else {
                setTimeout(registerSW, 2000);
            }
        }

        requestNotificationPermission();
        fetchEmails();

        const socketProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const socketUrl = `${window.location.protocol}//${window.location.host}`;

        socketRef.current = io(socketUrl, {
            path: '/socket.io-live',
            reconnection: true,
            transports: ['websocket', 'polling'],
            secure: window.location.protocol === 'https:',
            rejectUnauthorized: false
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            setIsConnected(true);
            // Use ref to avoid stale closure — token may not be ready yet
            socket.emit('join-room', { email: emailAddress, token: sessionTokenRef.current });
            fetchEmails();

            const now = Date.now();
            if (now - lastSyncRef.current > 5000) {
                lastSyncRef.current = now;
            }
        });

        socket.on('connect_error', () => setIsConnected(false));
        socket.on('disconnect', () => setIsConnected(false));

        socket.on('new-email', (email: Email) => {
            if (blockedSendersRef.current.includes(email.from_address)) return;
            setEmails(prev => {
                if (prev.some(e => e.id === email.id)) return prev;
                playNotificationSound();
                showNotification(`New Email: ${email.subject || '(No Subject)'}`, `From: ${email.from_address || 'Unknown'}`);
                return [{ ...email, is_read: false }, ...prev];
            });
        });

        const handleFocus = () => {
            setIsTabActive(true);
            fetchEmails();
        };
        const handleBlur = () => setIsTabActive(false);
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setIsTabActive(true);
                fetchEmails();
            } else {
                setIsTabActive(false);
            }
        };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [emailAddress]);

    // When token arrives: fetch emails AND (re-)join the socket room
    useEffect(() => {
        if (!sessionToken) return;
        fetchEmails();
        // Re-emit join-room in case the socket connected before the token was ready
        if (socketRef.current?.connected) {
            socketRef.current.emit('join-room', { email: emailAddress, token: sessionToken });
        }
    }, [sessionToken]);

    useEffect(() => {
        if (selectedEmail && showMobileContent) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [selectedEmail, showMobileContent]);

    useEffect(() => {
        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isConnected) fetchEmails();
        }, isConnected ? 30000 : 5000);
        return () => clearInterval(interval);
    }, [emailAddress, isConnected]);

    const formatDate = (ts: number) => {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }


    return (
        <div className="w-full max-w-5xl mx-auto mt-4 md:mt-8 px-4">
            <div className="flex flex-row justify-between items-center mb-6 gap-4 border-b border-gray-100 dark:border-[#222] pb-6">
                <div className="flex items-center gap-3">
                    <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {t('title')} ({emails.length})
                        <div className="flex items-center ml-2">
                            {isConnected ? (
                                <div className="flex items-center px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-[11px] font-black shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-green-500 animate-pulse"></span>
                                    LIVE
                                </div>
                            ) : (
                                <div className="flex items-center px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-[11px] font-black">
                                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-amber-600 animate-pulse"></span>
                                    {isInitialLoading ? 'CONNECTING...' : 'SYNCING...'}
                                </div>
                            )}
                        </div>
                    </h2>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={handleBurnInbox}
                        className="group relative flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all active:scale-95 z-10"
                        aria-label="Burn Inbox"
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        <span className="hidden sm:inline text-red-800 dark:text-red-300 font-bold">{t('burn')}</span>
                        <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 border border-gray-700 text-white text-[11px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">{t('burn_tooltip')}</div>
                    </button>
                </div>
            </div>
            
            {error === 'system_busy' && (
                <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl flex items-center gap-3 text-amber-800 dark:text-amber-200 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <svg className="w-5 h-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <span className="font-medium">System is currently busy (MongoDB Atlas limit reached). Retrying connection in 5 seconds...</span>
                        <button 
                            onClick={() => fetchEmails()}
                            className="text-xs font-bold uppercase bg-amber-200/50 dark:bg-amber-500/20 px-3 py-1 rounded-lg hover:bg-amber-300/50 transition-all border border-amber-300/30"
                        >
                            Retry Now
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl overflow-hidden shadow-2xl transition-all">
                <div className="flex flex-col divide-y divide-gray-100 dark:divide-[#222]">
                    {emails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <div className="w-16 h-16 mb-6 rounded-full bg-gray-50 dark:bg-[#161616] flex items-center justify-center animate-pulse border border-gray-100 dark:border-[#222]">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <p className="text-base font-bold text-gray-900 dark:text-gray-100">{t('waiting')}</p>
                            <p className="text-xs text-gray-700 dark:text-gray-300 mt-2 uppercase tracking-widest font-black">{t('monitoring')}</p>
                        </div>
                    ) : (
                        emails.map(email => (
                            <div
                                key={email.id}
                                onClick={() => handleSelectEmail(email)}
                                className={`group flex items-center justify-between p-4 md:p-6 transition-all cursor-pointer relative ${selectedEmail?.id === email.id
                                    ? 'bg-transparent border-l-4 border-l-blue-600'
                                    : !email.is_read
                                        ? 'bg-blue-500/10'
                                        : 'bg-transparent hover:bg-gray-50 dark:hover:bg-[#151515]'
                                    }`}
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${email.is_read ? 'hidden' : 'bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]'}`}></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mb-1">
                                            <span className={`text-xs font-black tracking-widest truncate ${!email.is_read ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                From: <span className="lowercase font-bold">{email.from_address.split('<')[0] || email.from_address}</span>
                                            </span>
                                            <div className="flex items-center gap-2 ml-auto md:ml-0">
                                                {email.attachments && email.attachments.length > 0 && (
                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-[#222] border border-gray-100 dark:border-[#333]">
                                                        <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                                        </svg>
                                                        <span className="text-[9px] font-black text-gray-600 dark:text-gray-400">{email.attachments.length}</span>
                                                    </div>
                                                )}
                                                <span className={`text-[11px] font-mono shrink-0 text-gray-500 dark:text-gray-400`}>
                                                    {formatDate(email.received_at)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`text-sm md:text-base font-bold line-clamp-2 md:truncate ${!email.is_read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                                            Subject: {email.subject}
                                        </div>
                                        <div className={`text-xs line-clamp-2 md:truncate mt-1 opacity-70 text-gray-500 dark:text-gray-400`}>
                                            {email.text}
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                    <svg className={`w-5 h-5 text-blue-600 underline`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {selectedEmail && showMobileContent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-200 overflow-hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileContent(false)}></div>
                    <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-4xl h-[100dvh] md:h-full md:max-h-[85vh] rounded-none md:rounded-3xl shadow-2xl relative flex flex-col border-none md:border border-gray-200 dark:border-[#222] overflow-hidden">

                        <div className="flex flex-col border-b border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#141414] shrink-0 pt-safe-top">
                            <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-6">
                                <button
                                    onClick={() => setShowMobileContent(false)}
                                    className="md:hidden flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                    <span className="font-bold text-sm">Inbox</span>
                                </button>

                                <div className="flex items-center gap-2 ml-auto">
                                    <button
                                        onClick={() => setBlockSenderConfirm(selectedEmail.from_address)}
                                        className="group relative flex items-center gap-1.5 p-2 px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full md:rounded-lg transition-all"
                                        aria-label="Block Sender"
                                    >
                                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                        <span className="hidden md:inline text-sm font-bold">{t('block')}</span>
                                        <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 border border-gray-700 text-white text-[11px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">{t('block')}</div>
                                    </button>
                                    <button
                                        onClick={() => handleMarkAsUnread(selectedEmail)}
                                        className="group relative flex items-center gap-1.5 p-2 px-3 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-full md:rounded-lg transition-all"
                                        aria-label="Mark as Unread"
                                    >
                                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                        <span className="hidden md:inline text-sm font-bold">{t('unread')}</span>
                                        <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 border border-gray-700 text-white text-[11px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">{t('unread')}</div>
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(selectedEmail.id)}
                                        className="group relative flex items-center gap-1.5 p-2 px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full md:rounded-lg transition-all"
                                        aria-label="Delete Email"
                                    >
                                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        <span className="hidden md:inline text-sm font-bold">Delete</span>
                                        <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 border border-gray-700 text-white text-[11px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">Delete</div>
                                    </button>
                                    <button
                                        onClick={() => setShowRawSource(true)}
                                        className="group relative flex items-center gap-1.5 p-2 px-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#222] rounded-full md:rounded-lg transition-all"
                                        aria-label="View Source"
                                    >
                                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                        <span className="hidden md:inline text-sm font-bold">{t('code')}</span>
                                        <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 border border-gray-700 text-white text-[11px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">{t('code')}</div>
                                    </button>
                                    <button
                                        onClick={() => setShowMobileContent(false)}
                                        className="group relative flex items-center gap-1.5 p-2 px-3 bg-gray-200 dark:bg-[#333] text-gray-900 dark:text-white rounded-full md:rounded-lg transition-all hover:bg-red-500 hover:text-white ml-2"
                                        aria-label="Close"
                                    >
                                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        <span className="hidden md:inline text-sm font-bold">{t('close')}</span>
                                        <div className="md:hidden absolute top-full right-0 mt-2 px-2 py-1 bg-gray-900 border border-gray-700 text-white text-[11px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">{t('close')}</div>
                                    </button>
                                </div>
                            </div>

                            <div className="px-4 pb-4 md:px-8 md:pb-6">
                                <h2 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white mb-3 leading-snug break-words">
                                    {selectedEmail.subject}
                                </h2>
                                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                                    <div className="max-w-full px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20 truncate">
                                        {selectedEmail.from_address}
                                    </div>
                                    <div className="text-gray-400 font-medium whitespace-nowrap">
                                        {new Date(selectedEmail.received_at).toLocaleString(undefined, {
                                            dateStyle: 'short',
                                            timeStyle: 'short'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-10 bg-white text-gray-900 email-content printable-area text-base md:text-lg leading-relaxed">
                            <div className="min-w-0 max-w-full">
                                {selectedEmail.html ? (
                                    <div className="max-w-full prose prose-sm md:prose-lg dark:prose-invert break-words [&>img]:max-w-full [&>img]:h-auto [&>table]:max-w-full [&>table]:overflow-x-auto [&>*]:max-w-full" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedEmail.html) }} />
                                ) : (
                                    <pre className="whitespace-pre-wrap font-sans break-words">{selectedEmail.text}</pre>
                                )}
                            </div>

                            {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-[#222]">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                        Attachments ({selectedEmail.attachments.length})
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedEmail.attachments.map((att, idx) => (
                                            <a
                                                key={idx}
                                                href={`/x-feed/emails/attachment?id=${selectedEmail.id}&checksum=${att.checksum}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download={att.filename}
                                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-[#222] hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#222] overflow-hidden flex items-center justify-center border border-gray-200 dark:border-[#333] group-hover:border-blue-300 dark:group-hover:border-blue-700">
                                                        {att.contentType.startsWith('image/') ? (
                                                            <img
                                                                src={`/x-feed/emails/attachment?id=${selectedEmail.id}&checksum=${att.checksum}`}
                                                                alt={att.filename}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                        )}
                                                    </div>
                                                    <div className="truncate">
                                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{att.filename}</p>
                                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-black tracking-tight">{(att.size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                </div>
                                                <div className="p-2 bg-blue-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-12 p-6 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-[#222]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Recommended for Privacy</p>
                                        <a
                                            href="https://www.expressvpn.com/refer-a-friend/30-days-free?referrer_id=103461074"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-base font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                                        >
                                            Surf securely with ExpressVPN (30 Days Free)
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)}></div>
                    <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-sm rounded-2xl shadow-2xl relative flex flex-col border border-gray-200 dark:border-[#333] overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Email?</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                This action is permanent. The email will be removed from your Inbox and permanently wiped from the server.
                            </p>
                        </div>
                        <div className="flex border-t border-gray-100 dark:border-[#333]">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <div className="w-px bg-gray-100 dark:bg-[#333]"></div>
                            <button
                                onClick={confirmDeleteConfirm => confirmDeleteEmail()}
                                className="flex-1 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {selectedEmail && showRawSource && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowRawSource(false)}></div>
                    <div className="bg-[#1e1e1e] text-gray-300 w-full max-w-5xl h-[90vh] rounded-xl overflow-hidden shadow-2xl relative flex flex-col font-mono border border-gray-700">
                        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-[#252526]">
                            <h3 className="text-sm font-bold text-gray-100">Raw Email Source</h3>
                            <button onClick={() => setShowRawSource(false)} className="text-gray-400 hover:text-white" aria-label="Close">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            <pre className="text-xs whitespace-pre-wrap">{selectedEmail.raw || t('no_raw')}</pre>
                        </div>
                    </div>
                </div>
            )}

            {showBurnConfirm && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBurnConfirm(false)}></div>
                    <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-sm rounded-2xl shadow-2xl relative flex flex-col border border-gray-200 dark:border-[#333] overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('are_you_sure')}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('burn_confirm_desc')}
                            </p>
                        </div>
                        <div className="flex border-t border-gray-100 dark:border-[#333]">
                            <button
                                onClick={() => setShowBurnConfirm(false)}
                                className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <div className="w-px bg-gray-100 dark:bg-[#333]"></div>
                            <button
                                onClick={confirmBurn}
                                className="flex-1 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                {t('confirm_burn')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {blockSenderConfirm && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBlockSenderConfirm(null)}></div>
                    <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-sm rounded-2xl shadow-2xl relative flex flex-col border border-gray-200 dark:border-[#333] overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('block_sender')}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t.rich('block_sender_desc', {
                                    address: blockSenderConfirm,
                                    strong: (chunks) => <strong className="text-gray-900 dark:text-gray-200 break-all">{chunks}</strong>
                                })}
                            </p>
                        </div>
                        <div className="flex border-t border-gray-100 dark:border-[#333]">
                            <button
                                onClick={() => setBlockSenderConfirm(null)}
                                className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <div className="w-px bg-gray-100 dark:bg-[#333]"></div>
                            <button
                                onClick={confirmBlockSender}
                                className="flex-1 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                {t('block')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toastMessage && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900 border border-gray-700 text-white text-sm font-bold rounded-full shadow-2xl z-[200] animate-in slide-in-from-bottom-5">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}
