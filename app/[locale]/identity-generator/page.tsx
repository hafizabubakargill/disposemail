import IdentityGenerator from '@/components/IdentityGenerator';

export default function IdentityGeneratorPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center">

            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black tracking-widest uppercase rounded-full border border-emerald-200 dark:border-emerald-800/50">
                    Privacy Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    Random Identity<span className="text-emerald-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto mb-8">
                    Generate a complete fictional identity — name, address, phone, and more — for 8 countries. Stay anonymous online.
                </p>
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 text-sm text-left flex gap-3 text-amber-800 dark:text-amber-200">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>All generated data is entirely fictional and randomly produced. For use in testing, development, and online privacy — never for fraudulent activity.</p>
                </div>
            </div>

            <div className="w-full">
                <IdentityGenerator />
            </div>

        </div>
    );
}
