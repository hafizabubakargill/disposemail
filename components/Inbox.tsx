'use client';

import { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface Email {
    id: string;
    from_address: string;
    subject: string;
    text: string;
    html?: string;
    received_at: number;
    is_read?: boolean;
}

export default function Inbox({ emailAddress }: { emailAddress: string }) {
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [showMobileContent, setShowMobileContent] = useState(false);
    const socketRef = useRef<any>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isTabActive, setIsTabActive] = useState(true);

    const playNotificationSound = () => {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio blocked:', e));
        } catch (e) {
            console.error('Audio error:', e);
        }
    };

    const handleSelectEmail = (email: Email) => {
        setSelectedEmail(email);
        setShowMobileContent(true); // Switch view on mobile

        // Mark as read immediately in UI
        if (!email.is_read) {
            setEmails(prev => prev.map(e => e.id === email.id ? { ...e, is_read: true } : e));

            // Call API to persist
            fetch('/x-feed/emails/read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: email.id })
            }).catch(console.error);
        }
    };

    const handleMarkAsUnread = (email: Email) => {
        setEmails(prev => prev.map(e => e.id === email.id ? { ...e, is_read: false } : e));
        fetch('/x-feed/emails/unread', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: email.id })
        }).catch(console.error);
        setShowMobileContent(false);
        setSelectedEmail(null);
    };

    const fetchEmails = () => {
        fetch('/x-feed/emails?address=' + emailAddress)
            .then(res => res.ok ? res.json() : Promise.reject())
            .then((data: Email[]) => {
                setEmails(current => {
                    const newEmails = data.filter(e => !current.some(c => c.id === e.id));
                    if (newEmails.length > 0 && current.length > 0) {
                        playNotificationSound();
                        if (!isTabActive) {
                            setUnreadCount(prev => prev + newEmails.length);
                        }
                    }
                    return data;
                });
            })
            .catch(err => console.debug('Sync blink:', err));
    };

    // Update Title Flashing
    useEffect(() => {
        let interval: any;
        if (!isTabActive && unreadCount > 0) {
            let toggle = false;
            interval = setInterval(() => {
                document.title = toggle ? `(${unreadCount}) New Mail!` : 'DisposeMail';
                toggle = !toggle;
            }, 1000);
        } else {
            document.title = 'DisposeMail - Secure Disposable Email';
            if (isTabActive) setUnreadCount(0);
        }
        return () => clearInterval(interval);
    }, [isTabActive, unreadCount]);

    useEffect(() => {
        // --- 1. Register Service Worker for Background Alerts ---
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }

        fetchEmails();

        // Optimized socket config for backgrounding
        socketRef.current = io({
            path: '/socket.io-live',
            reconnection: true,
            transports: ['websocket', 'polling'],
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('join-room', emailAddress);
            fetchEmails();
        });

        socket.on('connect_error', () => setIsConnected(false));
        socket.on('disconnect', () => setIsConnected(false));

        socket.on('new-email', (email: Email) => {
            setEmails(prev => {
                if (prev.some(e => e.id === email.id)) return prev;
                playNotificationSound();
                if (!isTabActive) setUnreadCount(count => count + 1);
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

    // Request notification permission
    useEffect(() => {
        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // POLLING FALLBACK (Increased frequency when disconnected)
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
            {/* Header / Info Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        Inbox
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-xs">{emails.length}</span>
                    </h3>
                    <div className="flex items-center">
                        {isConnected ? (
                            <div className="flex items-center px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-[10px] font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                <span className="w-1.5 h-1.5 rounded-full mr-2 bg-green-500 animate-pulse"></span>
                                LIVE
                            </div>
                        ) : (
                            <div className="flex items-center px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-500 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full mr-2 bg-amber-500 animate-pulse"></span>
                                SYNCING
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Horizontal Scrollable Inbox List */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl overflow-hidden shadow-xl">
                <div className="flex overflow-x-auto p-4 gap-4 no-scrollbar scroll-smooth">
                    {emails.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-500">
                            <div className="w-12 h-12 mb-4 rounded-full bg-gray-50 dark:bg-[#161616] flex items-center justify-center animate-pulse">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <p className="text-sm font-medium">Waiting for your first email...</p>
                            <p className="text-xs text-gray-400 mt-1">Keep this tab open to receive real-time alerts</p>
                        </div>
                    ) : (
                        emails.map(email => (
                            <div
                                key={email.id}
                                onClick={() => handleSelectEmail(email)}
                                className={`flex-shrink-0 w-[280px] md:w-[320px] p-5 rounded-xl border transition-all cursor-pointer relative group ${selectedEmail?.id === email.id
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-gray-50 dark:bg-[#161616] border-gray-100 dark:border-[#262626] hover:border-blue-500/50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        {!email.is_read && <span className={`w-2 h-2 rounded-full ${selectedEmail?.id === email.id ? 'bg-white' : 'bg-blue-500'}`}></span>}
                                        <span className={`text-xs truncate font-bold uppercase tracking-wider ${selectedEmail?.id === email.id ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'}`}>
                                            {email.from_address.split('<')[0] || email.from_address}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] font-mono ${selectedEmail?.id === email.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {formatDate(email.received_at)}
                                    </span>
                                </div>
                                <div className={`text-sm font-bold truncate mb-1 ${selectedEmail?.id === email.id ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                    {email.subject}
                                </div>
                                <div className={`text-xs truncate ${selectedEmail?.id === email.id ? 'text-blue-50' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {email.text.slice(0, 60)}...
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* FULL SCREEN MODAL / POPUP */}
            {selectedEmail && showMobileContent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileContent(false)}></div>
                    <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-4xl h-full md:max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col border border-gray-200 dark:border-[#222]">

                        {/* Modal Header */}
                        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#141414] flex justify-between items-start shrink-0">
                            <div className="flex-1 overflow-hidden pr-8">
                                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                                    {selectedEmail.subject}
                                </h2>
                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                    <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                                        From: {selectedEmail.from_address}
                                    </div>
                                    <div className="text-gray-400 font-medium">
                                        Received: {new Date(selectedEmail.received_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => handleMarkAsUnread(selectedEmail)}
                                    className="p-3 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-xl transition-all"
                                    title="Mark as Unread"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="p-3 text-gray-500 hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl transition-all"
                                    title="Print Email"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2-2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setShowMobileContent(false)}
                                    className="p-3 bg-gray-100 dark:bg-[#222] text-gray-900 dark:text-white hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white text-gray-900 email-content printable-area text-lg leading-relaxed">
                            {selectedEmail.html ? (
                                <div className="max-w-none prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                            ) : (
                                <pre className="whitespace-pre-wrap font-sans">{selectedEmail.text}</pre>
                            )}

                            {/* Affiliate Footer inside Modal */}
                            <div className="mt-12 p-6 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-[#222]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Recommended for Privacy</p>
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
        </div>
    );
}
