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

    useEffect(() => {
        // Initial Fetch
        fetch('/api/emails?address=' + emailAddress)
            .then(res => res.json())
            .then(data => setEmails(data));

        // Initialize socket with strategy: Start with polling, then upgrade to WebSocket.
        // This stops "WebSocket closed before establishment" warnings.
        socketRef.current = io({
            path: '/socket.io-live',
            addTrailingSlash: false,
            transports: ['polling', 'websocket'],
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Socket Connected:', socket.id);
            setIsConnected(true);
            socket.emit('join-room', emailAddress);
        });

        socket.on('connect_error', (err: Error) => {
            // Polling handles this fallback naturally
            console.debug('Socket connection message:', err.message);
        });

        socket.on('disconnect', (reason: string) => {
            console.warn('Socket Disconnected:', reason);
            setIsConnected(false);
        });

        socket.on('new-email', (email: Email) => {
            const newEmail = { ...email, is_read: false };
            setEmails(prev => [newEmail, ...prev]);
            playNotificationSound();

            if (Notification.permission === 'granted') {
                new Notification('New Email', { body: email.subject });
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [emailAddress]);

    // Request notification permission
    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // POLLING FALLBACK: Fetch emails every 5 seconds to ensure data freshness
    // even if sockets are disconnected or failing.
    useEffect(() => {
        const interval = setInterval(() => {
            fetch('/api/emails?address=' + emailAddress)
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Fetch failed');
                })
                .then((data: Email[]) => {
                    setEmails(current => {
                        // Simple check: if we have more emails
                        if (data.length > current.length) {
                            playNotificationSound();
                            if (Notification.permission === 'granted') {
                                const newCount = data.length - current.length;
                                if (newCount > 0) new Notification('New Email Received');
                            }
                            return data;
                        }

                        // If IDs differ but count is same (unlikely unless replacement), or just re-syncing
                        if (data.length !== current.length || (data.length > 0 && data[0].id !== current[0]?.id)) {
                            return data;
                        }
                        return current; // No change
                    });
                })
                .catch(err => console.debug('Polling skipped:', err));
        }, 5000);

        return () => clearInterval(interval);
    }, [emailAddress]);

    const formatDate = (ts: number) => {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
                {/* Email List */}
                <div className="col-span-1 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl overflow-hidden flex flex-col shadow-sm">
                    <div className="p-4 border-b border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#161616] flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 dark:text-gray-200">Inbox ({emails.length})</h3>

                        {/* Enhanced Status Indicator */}
                        <div className="flex items-center">
                            {isConnected ? (
                                <div className="flex items-center px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-[10px] font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-in fade-in zoom-in duration-300" title="Real-time Sync Active">
                                    <span className="w-2 h-2 rounded-full mr-2 bg-green-500 animate-pulse"></span>
                                    CONNECTED
                                </div>
                            ) : (
                                <div className="flex items-center px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-500 text-[10px] font-bold" title="Using Smart Auto-Refresh">
                                    <span className="w-2 h-2 rounded-full mr-2 bg-amber-500 animate-pulse"></span>
                                    AUTO-REFRESH
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
                                <p className="text-sm animate-pulse">Waiting for emails...</p>
                            </div>
                        ) : (
                            emails.map(email => (
                                <div
                                    key={email.id}
                                    onClick={() => handleSelectEmail(email)}
                                    className={`p-4 border-b border-gray-100 dark:border-[#222] cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-[#1a1a1a] ${selectedEmail?.id === email.id ? 'bg-blue-50 dark:bg-[#1a1a1a] border-l-4 border-l-blue-500' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center overflow-hidden">
                                            {!email.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 flex-shrink-0"></span>}
                                            <span className={`text-sm truncate w-28 ${!email.is_read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>{email.from_address}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 flex-shrink-0 ml-1">{formatDate(email.received_at)}</span>
                                    </div>
                                    <div className={`text-sm truncate mb-1 ${!email.is_read ? 'font-bold text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>{email.subject}</div>
                                    <div className="text-xs text-gray-500 truncate">{email.text.substring(0, 50)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Email Content */}
                <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl overflow-hidden flex flex-col relative shadow-sm">
                    {selectedEmail ? (
                        <>
                            <div className="p-6 border-b border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#161616] flex justify-between items-start">
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedEmail.subject}</h2>
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm gap-2">
                                        <div className="text-gray-500 dark:text-gray-400">From: <span className="text-blue-600 dark:text-blue-400 font-medium">{selectedEmail.from_address}</span></div>
                                        <div className="text-gray-400 text-xs">{new Date(selectedEmail.received_at).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="ml-4 flex gap-2">
                                    <button
                                        onClick={() => window.print()}
                                        className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-[#222] rounded-lg transition-colors"
                                        title="Print Email"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2-2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 bg-white text-gray-900 email-content printable-area">
                                {/* Render HTML content safely - in production use DOMPurify */}
                                {selectedEmail.html ? (
                                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                                ) : (
                                    <pre className="whitespace-pre-wrap font-sans text-sm">{selectedEmail.text}</pre>
                                )}
                            </div>

                            {/* Affiliate Link Placeholder */}
                            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border-t border-gray-100 dark:border-[#222] text-center">
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Recommended for Privacy</p>
                                <a href="#" className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center justify-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    Surf securely with our partner VPN →
                                </a>
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
