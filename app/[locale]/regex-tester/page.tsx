import RegexTesterTool from '@/components/RegexTesterTool';

export const metadata = {
    title: 'Regex Tester & Validator | DisposeMail Free Tools',
    description: 'A powerful regular expression tester. Evaluate regex matching, capture groups, and timing directly within your browser.',
};

export default function RegexTesterPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-xs font-black tracking-widest uppercase rounded-full border border-pink-200 dark:border-pink-800/50">
                    Free Dev Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    Regex Tester<span className="text-pink-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    Evaluate and execute regular expressions securely offline. Configure active flags and parse multi-line target strings, displaying instant visual match indices and capture groups.
                </p>
            </div>
            <div className="w-full"><RegexTesterTool /></div>
        </div>
    );
}
