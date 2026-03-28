import ColorConverterTool from '@/components/ColorConverterTool';

export const metadata = {
    title: 'Color Converter & Harmony Generator | DisposeMail Free Tools',
    description: 'Instantly convert colors between HEX, RGB, and HSL. Visually build harmony palettes directly inside your browser.',
};

export default function ColorConverterPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-400 text-xs font-black tracking-widest uppercase rounded-full border border-fuchsia-200 dark:border-fuchsia-800/50">
                    Free Dev Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    Color Converter<span className="text-fuchsia-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    Translate specific colors seamlessly. Automatically generates 6 CSS-ready beautiful harmony variants (complementary, analogous, triadic, monochrome) instantly via math algorithms.
                </p>
            </div>
            <div className="w-full"><ColorConverterTool /></div>
        </div>
    );
}
