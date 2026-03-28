import HashGeneratorTool from '@/components/HashGeneratorTool';

export const metadata = {
    title: 'Hash Generator | DisposeMail Free Tools',
    description: 'Instantly generate SHA-1, SHA-256, and SHA-512 hashes from 100% client-side computations. Secure, offline, and free.',
};

export default function HashGeneratorPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400 text-xs font-black tracking-widest uppercase rounded-full border border-slate-200 dark:border-slate-800/50">
                    Free Cryptography Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    Hash Generator<span className="text-slate-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    Generate secure cryptographic strings on the fly. Calculations are executed blazingly fast in-browser using <code className="text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">crypto.subtle</code> — absolutely no data is transmitted to our servers.
                </p>
            </div>
            <div className="w-full"><HashGeneratorTool /></div>
        </div>
    );
}
