import UUIDGenerator from '@/components/UUIDGenerator';

export default function UUIDGeneratorPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-black tracking-widest uppercase rounded-full border border-blue-200 dark:border-blue-800/50">
                    Free Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    UUID Generator<span className="text-blue-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    Generate UUIDs in every version — v1 (time-based), v4 (random), v7 (time-ordered), v5 (name hash), NIL, and Windows-style GUIDs.
                </p>
            </div>
            <div className="w-full"><UUIDGenerator /></div>
        </div>
    );
}
