import JsonFormatterTool from '@/components/JsonFormatterTool';

export const metadata = {
    title: 'JSON Formatter & Validator | DisposeMail Free Tools',
    description: 'Format, validate, prettify, or minify JSON data safely. Private client-side offline parser.',
};

export default function JsonFormatterPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-black tracking-widest uppercase rounded-full border border-yellow-200 dark:border-yellow-800/50">
                    Free Dev Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    JSON Formatter<span className="text-yellow-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    A beautiful, strict JSON validator and editor. Parse messy payloads into precise 2-space indented formats, or compress them entirely. No backend required.
                </p>
            </div>
            <div className="w-full"><JsonFormatterTool /></div>
        </div>
    );
}
