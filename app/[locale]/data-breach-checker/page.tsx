"use client";

import DataBreachChecker from '@/components/DataBreachChecker';

export default function DataBreachPage() {
    return (
        <div className="min-h-screen bg-black relative flex flex-col pt-32 pb-20 items-center overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
                <div className="text-center mb-12 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Data Breach
                        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                            Checker
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Verify if your personal email address, passwords, or data have been compromised in known security breaches using the largest open-source breach database.
                    </p>
                </div>

                <div className="w-full flex justify-center mt-4">
                    <DataBreachChecker />
                </div>
                
                {/* SEO Text Content */}
                <div className="mt-24 max-w-4xl text-left bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">Why check for Data Breaches?</h2>
                    <p className="text-gray-400 mb-6">
                        Over billions of accounts have been compromised in various database leaks. When companies you use are hacked, your email, password, and personal information are often sold on the dark web. Checking your email against a known database is the first step in securing your digital identity.
                    </p>
                    <h2 className="text-2xl font-bold text-white mb-4">How does this tool work?</h2>
                    <p className="text-gray-400 mb-6">
                        DisposeMail securely hashes your email request and queries it against public data breach records (such as those recorded by XposedOrNot). If a match is found, you immediately know which platform leaked your information so you can change your passwords immediately.
                    </p>
                    <h2 className="text-2xl font-bold text-white mb-4">Is this search recorded?</h2>
                    <p className="text-gray-400">
                        No. We do not store the email addresses you check on our servers. The query is performed live and routed securely to maintain your privacy. If your real email is frequently exposed, consider using our <strong>Disposable Email Generator</strong> for future signups.
                    </p>
                </div>
            </div>
        </div>
    );
}
