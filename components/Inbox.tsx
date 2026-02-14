'use client';

import { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface Email {
    id: string;
    from_address: string;
    subject: string;
    text: string;
    html?: string;
    raw?: string; // Phase 36: Raw Source
    received_at: number;
    is_read?: boolean;
}

export default function Inbox({ emailAddress }: { emailAddress: string }) {
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [showMobileContent, setShowMobileContent] = useState(false);
    const [showRawSource, setShowRawSource] = useState(false); // Phase 36
    const [showBurnConfirm, setShowBurnConfirm] = useState(false); // Phase 37
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

    const handleSafetySync = () => {
        setIsConnected(false); // Show syncing state
        const API_SECRET = "change_me_to_a_secure_secret";
        fetch(`https://disposemail.xyz/sync-safety-net?secret=${API_SECRET}`)
            .then(res => res.json())
            .then(data => {
                if (data.count > 0) fetchEmails();
            })
            .catch(err => console.error('Sync failed:', err))
            .finally(() => setIsConnected(socketRef.current?.connected));
    };

    const fetchEmails = () => {
        fetch('/x-feed/emails?address=' + emailAddress, {
            credentials: 'omit', // Bypass strict WAF/Cookie checks
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
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
        // --- 1. THE NUCLEAR CACHE PURGE (Kill old workers) ---
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (let registration of registrations) {
                    if (!registration.active?.scriptURL.includes('v=1.0.11')) {
                        registration.unregister();
                        console.log('Nuclear Purge: Old Service Worker unregistered');
                    }
                }
            });
            // Register new version
            navigator.serviceWorker.register('/sw.js?v=1.0.11').catch(console.error);
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
            // Force Sync on Connect (Phase 20)
            console.log('Auto-Sync Triggered');
            handleSafetySync();
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
            <div className="flex flex-row justify-between items-center mb-6 gap-4 border-b border-gray-100 dark:border-[#222] pb-6">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        Inbox ({emails.length})
                        <div className="flex items-center ml-2">
                            {isConnected ? (
                                <div className="flex items-center px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-[10px] font-black shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-green-500 animate-pulse"></span>
                                    LIVE
                                </div>
                            ) : (
                                <div className="flex items-center px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-500 text-[10px] font-black">
                                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-amber-500 animate-pulse"></span>
                                    SYNCING
                                </div>
                            )}
                        </div>
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBurnInbox}
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all shadow-sm shrink-0"
                        title="Destroy this inbox"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        <span className="hidden md:inline">Burn Inbox</span>
                        <span className="md:hidden">Burn</span>
                    </button>

                    <button
                        onClick={handleSafetySync}
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-[#161616] active:scale-95 transition-all shadow-sm shrink-0"
                        title="Rescue missing emails"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                        </svg>
                        Sync <span className="hidden md:inline">Emails</span>
                    </button>
                </div>
            </div>

            {/* Vertical Row Inbox List */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl overflow-hidden shadow-2xl transition-all">
                <div className="flex flex-col divide-y divide-gray-100 dark:divide-[#222]">
                    {emails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <div className="w-16 h-16 mb-6 rounded-full bg-gray-50 dark:bg-[#161616] flex items-center justify-center animate-pulse border border-gray-100 dark:border-[#222]">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <p className="text-base font-bold text-gray-900 dark:text-gray-100">Waiting for your first email...</p>
                            <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-black">Secure Real-time Monitoring Active</p>
                        </div>
                    ) : (
                        emails.map(email => (
                            <div
                                key={email.id}
                                onClick={() => handleSelectEmail(email)}
                                className={`group flex items-center justify-between p-4 md:p-6 transition-all cursor-pointer relative ${selectedEmail?.id === email.id
                                    ? 'bg-transparent border-l-4 border-l-blue-600' // Phase 37: No bg, just border
                                    : !email.is_read
                                        ? 'bg-blue-500/10' // Light blue for NEW/UNREAD
                                        : 'bg-transparent hover:bg-gray-50 dark:hover:bg-[#151515]' // Read look (Transparent/Dark)
                                    }`}
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${email.is_read ? 'hidden' : 'bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]'}`}></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mb-1">
                                            <span className={`text-xs font-black uppercase tracking-widest truncate ${!email.is_read ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                From: <span className="lowercase">{email.from_address.split('<')[0] || email.from_address}</span>
                                            </span>
                                            <span className={`text-[10px] font-mono shrink-0 text-gray-400`}>
                                                {formatDate(email.received_at)}
                                            </span>
                                        </div>
                                        <div className={`text-sm md:text-base font-bold truncate ${!email.is_read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                                            Subject: {email.subject}
                                        </div>
                                        <div className={`text-xs truncate mt-1 opacity-70 text-gray-500 dark:text-gray-400`}>
                                            {email.text.slice(0, 100)}...
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

                            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                                <button
                                    onClick={() => handleMarkAsUnread(selectedEmail)}
                                    className="flex items-center gap-2 px-3 md:px-4 py-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-xl transition-all border border-transparent hover:border-amber-200"
                                    title="Mark as Unread"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    <span className="text-xs md:text-sm font-bold hidden sm:inline">Mark as Unread</span>
                                </button>
                                <button
                                    onClick={() => setShowRawSource(true)}
                                    className="flex items-center gap-2 px-3 md:px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#222] rounded-xl transition-all border border-transparent hover:border-gray-200"
                                    title="View Source"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                    <span className="text-xs md:text-sm font-bold hidden sm:inline">Source</span>
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 px-3 md:px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#222] rounded-xl transition-all border border-transparent hover:border-gray-200"
                                    title="Print Email"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2-2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                                    </svg>
                                    <span className="text-xs md:text-sm font-bold hidden sm:inline">Print Email</span>
                                </button>
                                <button
                                    onClick={() => setShowMobileContent(false)}
                                    className="p-3 bg-gray-100 dark:bg-[#222] text-gray-900 dark:text-white hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
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
            {/* RAW SOURCE MODAL */}
            {selectedEmail && showRawSource && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowRawSource(false)}></div>
                    <div className="bg-[#1e1e1e] text-gray-300 w-full max-w-5xl h-[90vh] rounded-xl overflow-hidden shadow-2xl relative flex flex-col font-mono border border-gray-700">
                        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-[#252526]">
                            <h3 className="text-sm font-bold text-gray-100">Raw Email Source</h3>
                            <button onClick={() => setShowRawSource(false)} className="text-gray-400 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            <pre className="text-xs whitespace-pre-wrap">{selectedEmail.raw || "Raw source not available for this email."}</pre>
                        </div>
                    </div>
                </div>
            )}

            {/* BURN CONFIRMATION MODAL */}
            {showBurnConfirm && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBurnConfirm(false)}></div>
                    <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-sm rounded-2xl shadow-2xl relative flex flex-col border border-gray-200 dark:border-[#333] overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Are you sure?</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                This will delete this address and all emails forever. This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex border-t border-gray-100 dark:border-[#333]">
                            <button
                                onClick={() => setShowBurnConfirm(false)}
                                className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                            >
                                Cancel
                            </button>
                            <div className="w-px bg-gray-100 dark:bg-[#333]"></div>
                            <button
                                onClick={confirmBurn}
                                className="flex-1 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Burn It
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
