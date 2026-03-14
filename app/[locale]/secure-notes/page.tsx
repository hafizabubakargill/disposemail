"use client";

import SecureNotesCreator from '@/components/SecureNotesCreator';
import { Shield, Lock } from 'lucide-react';

export default function SecureNotesPage() {
    return (
        <div className="min-h-screen bg-black relative flex flex-col pt-32 pb-20 items-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
                
                <div className="text-center mb-12 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
                        <Shield className="w-4 h-4" /> End-to-End Encrypted
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Notes</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Create passwords, secrets, or messages that automatically self-destruct the absolute millisecond they are read. Completely secure, strictly one-time view.
                    </p>
                </div>

                <div className="w-full flex justify-center mb-24">
                    <SecureNotesCreator />
                </div>

                {/* SEO & Explanation Content */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center mb-6">
                            <span className="text-rose-400 font-bold text-xl">1</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Burn After Reading</h3>
                        <p className="text-gray-400 leading-relaxed">
                            When the recipient opens your secret link, the server reads the encrypted database file and permanently deletes the record from existence before serving it to the browser.
                        </p>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
                            <Lock className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Mathematical Privacy</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Because the note is physically wiped from the JSON disk storage at the exact moment of compilation, it is mathematically impossible for anyone—even us—to recover the text after it has been viewed.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
