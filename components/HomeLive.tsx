'use client';

import Inbox from "@/components/Inbox";
import { Hero } from "@/components/Hero";
import { useEmailSession } from "@/hooks/useEmailSession";

export default function HomeLive() {
        const {
        email,
        timeLeft,
        progress,
        handleRefresh,
        isCustom,
        setIsCustom,
        customPrefix,
        setCustomPrefix,
        isMounted,
        sessionToken,
        error: sessionError
    } = useEmailSession();

    if (!isMounted || (!email && !sessionError)) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center pt-20 px-4">
                {/* Hero Skeleton omitted for brevity, same as before */}
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center mb-12 animate-pulse">
                    <div className="h-4 w-48 bg-gray-200 dark:bg-[#222] rounded-full mb-8"></div>
                    <div className="h-16 w-3/4 bg-gray-200 dark:bg-[#222] rounded-3xl mb-6"></div>
                    <div className="h-6 w-1/2 bg-gray-200 dark:bg-[#222] rounded-xl mb-12"></div>
                    <div className="w-full max-w-2xl h-20 bg-gray-100 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222]"></div>
                </div>
            </div>
        );
    }

    if (sessionError === 'session_failed' && !email) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500 border border-red-500/20">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h1 className="text-3xl font-black mb-4 dark:text-white">System Overloaded</h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
                    We are currently experiencing high traffic or database limits. 
                    Please try refreshing the page or try again in a few minutes.
                </p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                >
                    REFRESH PAGE
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Hero
                email={email || ""}
                timeLeft={timeLeft}
                progress={progress}
                handleRefresh={handleRefresh}
                isCustom={isCustom}
                setIsCustom={setIsCustom}
                customPrefix={customPrefix}
                setCustomPrefix={setCustomPrefix}
            />

            {/* Inbox Section */}
            <div className="w-full px-4 z-10 pb-12">
                <Inbox emailAddress={email || ""} sessionToken={sessionToken || ""} />
            </div>
        </div>
    );
}
