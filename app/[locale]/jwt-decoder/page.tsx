import JwtDecoderTool from '@/components/JwtDecoderTool';

export const metadata = {
    title: 'JWT Decoder | DisposeMail Free Tools',
    description: 'Instantly decode JSON Web Tokens (JWT) safely in your browser. Inspect header algorithms and payload claims without network tracking.',
};

export default function JwtDecoderPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-xs font-black tracking-widest uppercase rounded-full border border-cyan-200 dark:border-cyan-800/50">
                    Free Dev Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    JWT Decoder<span className="text-cyan-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    Decode JSON Web Tokens and inspect local claims completely client-side. Zero external network requests are made, keeping your tokens safe and private.
                </p>
            </div>
            <div className="w-full"><JwtDecoderTool /></div>
        </div>
    );
}
