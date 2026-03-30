import EpochConverterTool from '@/components/EpochConverterTool';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'EpochConverter' });
    return {
        title: `${t('title')} | DisposeMail Free Tools`,
        description: t('subtitle')
    };
}

export default async function EpochConverterPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'EpochConverter' });
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-black tracking-widest uppercase rounded-full border border-amber-200 dark:border-amber-800/50">
                    Free Time Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    {t('title')}<span className="text-amber-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    {t('subtitle')}
                </p>
            </div>
            <div className="w-full"><EpochConverterTool /></div>
        </div>
    );
}
