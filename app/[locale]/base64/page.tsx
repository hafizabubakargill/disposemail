import Base64Tool from '@/components/Base64Tool';

export default function Base64Page() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-black tracking-widest uppercase rounded-full border border-teal-200 dark:border-teal-800/50">
                    Free Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    Base64 Encoder<span className="text-teal-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    Encode and decode Base64 text, files, and images instantly. Supports URL-safe mode and Data URL output. 100% client-side — nothing leaves your browser.
                </p>
            </div>
            <div className="w-full"><Base64Tool /></div>
        </div>
    );
}
