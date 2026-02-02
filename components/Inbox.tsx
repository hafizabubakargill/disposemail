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

    const playNotificationSound = () => {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio blocked (needs interaction):', e));
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
            fetch('/api/emails/read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: email.id })
            }).catch(console.error);
        }
    };

    const fetchEmails = () => {
        fetch('/api/emails?address=' + emailAddress)
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Fetch failed');
            })
            .then((data: Email[]) => {
                setEmails(current => {
                    if (data.length > current.length && current.length > 0) {
                        playNotificationSound();
                        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                            const newEmail = data[0];
                            new Notification('New Email from ' + (newEmail.from_address.split('<')[0] || newEmail.from_address), {
                                body: newEmail.subject,
                                icon: '/icon.svg'
                            });
                        }
                        document.title = "(*) New Email! | DisposeMail";
                    }
                    return data;
                });
            })
            .catch(err => console.debug('Sync failed:', err));
    };

    useEffect(() => {
        fetchEmails();

        // Optimized socket config for backgrounding
        socketRef.current = io({
            path: '/socket.io-live',
            addTrailingSlash: false,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 500, // Faster reconnect
            reconnectionDelayMax: 5000,
            timeout: 60000, // Longer timeout for backgrounding resilience
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
                if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                    new Notification('New Email: ' + email.subject, {
                        body: 'From: ' + email.from_address,
                        icon: '/icon.svg'
                    });
                }
                document.title = "(*) New Email! | DisposeMail";
                return [{ ...email, is_read: false }, ...prev];
            });
        });

        const handleFocus = () => {
            fetchEmails();
            document.title = "DisposeMail - Secure Disposable Email";
        };
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
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
        }, isConnected ? 20000 : 5000);
        return () => clearInterval(interval);
    }, [emailAddress, isConnected]);

    const formatDate = (ts: number) => {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-4 md:mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px] md:h-[600px] relative">

                {/* Email List - Hide on mobile if reading */}
                <div className={`col-span-1 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl overflow-hidden flex flex-col shadow-sm ${showMobileContent ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#161616] flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-200">Inbox ({emails.length})</h3>

                        {/* Enhanced Status Indicator */}
                        <div className="flex items-center">
                            {isConnected ? (
                                <div className="flex items-center px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-[10px] font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                    <span className="w-2 h-2 rounded-full mr-2 bg-green-500 animate-pulse"></span>
                                    LIVE
                                </div>
                            ) : (
                                <div className="flex items-center px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-500 text-[10px] font-bold">
                                    <span className="w-2 h-2 rounded-full mr-2 bg-amber-500 animate-pulse"></span>
                                    SYNCING
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {emails.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6 text-center">
                                <div className="w-10 h-10 mb-3 rounded-full border border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center animate-spin-slow">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                </div>
                                <p className="text-sm font-medium">Waiting for emails...</p>
                            </div>
                        ) : (
                            emails.map(email => (
                                <div
                                    key={email.id}
                                    onClick={() => handleSelectEmail(email)}
                                    className={`p-4 border-b border-gray-100 dark:border-[#222] cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-[#1a1a1a] ${selectedEmail?.id === email.id ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1 overflow-hidden">
                                        <div className="flex items-center overflow-hidden flex-1">
                                            {!email.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 flex-shrink-0"></span>}
                                            <span className={`text-sm truncate ${!email.is_read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>{email.from_address.split('<')[0]}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-500 shrink-0 ml-2 font-mono">{formatDate(email.received_at)}</span>
                                    </div>
                                    <div className={`text-xs truncate ${!email.is_read ? 'font-bold text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>{email.subject}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Email Content - Full height on mobile */}
                <div className={`col-span-1 md:col-span-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl overflow-hidden flex flex-col relative shadow-sm ${showMobileContent ? 'flex fixed inset-x-4 top-[15vh] bottom-[5vh] z-50 md:relative md:inset-auto md:h-auto' : 'hidden md:flex'}`}>
                    {selectedEmail ? (
                        <>
                            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#161616] flex justify-between items-start sticky top-0 z-10">
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center gap-2 mb-1">
                                        <button
                                            onClick={() => setShowMobileContent(false)}
                                            className="md:hidden p-1.5 -ml-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                                        </button>
                                        <h2 className="text-base md:text-xl font-bold text-gray-900 dark:text-white truncate">{selectedEmail.subject}</h2>
                                    </div>
                                    <div className="flex flex-col text-[11px] md:text-sm gap-0.5">
                                        <div className="text-gray-500 dark:text-gray-400 truncate">From: <span className="text-blue-600 dark:text-blue-400 font-bold">{selectedEmail.from_address}</span></div>
                                        <div className="text-gray-400 font-mono">{new Date(selectedEmail.received_at).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="ml-2 flex gap-1">
                                    <button
                                        onClick={() => window.print()}
                                        className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-[#222] rounded-lg transition-colors"
                                        title="Print Email"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2-2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white text-gray-900 email-content printable-area">
                                {/* Render HTML content safely - in production use DOMPurify */}
                                {selectedEmail.html ? (
                                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                                ) : (
                                    <pre className="whitespace-pre-wrap font-sans text-sm">{selectedEmail.text}</pre>
                                )}
                            </div>

                            <div className="mt-8 p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-[#222]">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recommended for Privacy</p>
                                            <a
                                                href="https://www.expressvpn.com/refer-a-friend/30-days-free?referrer_id=103461074"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                            >
                                                Surf securely with our partner ExpressVPN
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7.171-5.353a2 2 0 012.22 0l7.171 5.353A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"></path></svg>
                            </div>
                            <p>Select an email to read</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
