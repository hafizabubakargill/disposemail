'use client';

import { useEffect, useState } from 'react';
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
    let socket: any;

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

        // Initialize socket with explicit config
        socket = io({
            transports: ['websocket', 'polling'], // Try websocket first, then polling
            reconnectionAttempts: 5,
        });

        socket.on('connect', () => {
            console.log('Socket Connected:', socket.id);
            setIsConnected(true);
            socket.emit('join-room', emailAddress);
        });

        socket.on('connect_error', (err: Error) => {
            // Sockets are optional now (progressive enhancement).
            // We have polling as backup.
            console.debug('Socket connection failed, using polling:', err.message);
        });

        socket.on('disconnect', (reason: string) => {
            console.warn('Socket Disconnected:', reason);
            setIsConnected(false);
        });

        socket.on('new-email', (email: Email) => {
            // New emails are unread by default
            const newEmail = { ...email, is_read: false };
            setEmails(prev => [newEmail, ...prev]);

            playNotificationSound();

            // Optional: Browser notification
            if (Notification.permission === 'granted') {
                new Notification('New Email', { body: email.subject });
            }
        });

        return () => {
            socket.disconnect();
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

                        {/* Status Indicator moved here */}
                        <div className="text-[10px] font-mono">
                            {isConnected ? (
                                <div className="flex items-center text-green-600 dark:text-green-400" title="Values updated via WebSocket">
                                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-green-500 animate-pulse"></span>
                                    CONNECTED
                                </div>
                            ) : (
                                <div className="flex items-center text-amber-600 dark:text-amber-500" title="Values updated via Polling">
                                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-amber-500 animate-pulse"></span>
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
                            <div className="p-6 border-b border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#161616]">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedEmail.subject}</h2>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="text-gray-500 dark:text-gray-400">From: <span className="text-blue-600 dark:text-blue-400">{selectedEmail.from_address}</span></div>
                                    <div className="text-gray-500">{new Date(selectedEmail.received_at).toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 bg-white text-gray-900 email-content">
                                {/* Render HTML content safely - in production use DOMPurify */}
                                {selectedEmail.html ? (
                                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                                ) : (
                                    <pre className="whitespace-pre-wrap font-sans text-sm">{selectedEmail.text}</pre>
                                )}
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
