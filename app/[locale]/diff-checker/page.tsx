import DiffCheckerTool from '@/components/DiffCheckerTool';

export const metadata = {
    title: 'Diff Checker | DisposeMail Free Tools',
    description: 'Compare text and code instantly. Lightning-fast LCS diff computation in your browser. Line-by-line red and green highlights.',
};

export default function DiffCheckerPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black tracking-widest uppercase rounded-full border border-green-200 dark:border-green-800/50">
                    Free Dev Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    Diff Checker<span className="text-green-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    Compare two blocks of code or plain text. Built securely with lightning-fast Longest Common Subsequence line diffing algorithms executing locally.
                </p>
            </div>
            <div className="w-full"><DiffCheckerTool /></div>
        </div>
    );
}
