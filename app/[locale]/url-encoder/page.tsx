import UrlEncoderTool from '@/components/UrlEncoderTool';

export const metadata = {
    title: 'URL Encoder / Decoder | DisposeMail Free Tools',
    description: 'Instantly encode or decode URL parameters offline. Fast and private developer utility.',
};

export default function UrlEncoderPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 text-xs font-black tracking-widest uppercase rounded-full border border-sky-200 dark:border-sky-800/50">
                    Free Dev Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    URL Encoder/Decoder<span className="text-sky-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    Toggle securely between processing standard strings into URI-compatible blocks and parsing URL-encoded strings back to human-readable formats.
                </p>
            </div>
            <div className="w-full"><UrlEncoderTool /></div>
        </div>
    );
}
