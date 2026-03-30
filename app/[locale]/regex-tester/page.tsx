import RegexTesterTool from '@/components/RegexTesterTool';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'RegexTester' });
    return {
        title: `${t('title')} | DisposeMail Free Tools`,
        description: t('subtitle')
    };
}

export default async function RegexTesterPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'RegexTester' });
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-xs font-black tracking-widest uppercase rounded-full border border-pink-200 dark:border-pink-800/50">
                    Free Dev Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    {t('title')}<span className="text-pink-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    {t('subtitle')}
                </p>
            </div>
            <div className="w-full"><RegexTesterTool /></div>
        </div>
    );
}
