import JsonFormatterTool from '@/components/JsonFormatterTool';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'JsonFormatter' });
    return {
        title: `${t('title')} | DisposeMail Free Tools`,
        description: t('subtitle')
    };
}

export default async function JsonFormatterPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'JsonFormatter' });
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-black tracking-widest uppercase rounded-full border border-yellow-200 dark:border-yellow-800/50">
                    Free Dev Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    {t('title')}<span className="text-yellow-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    {t('subtitle')}
                </p>
            </div>
            <div className="w-full"><JsonFormatterTool /></div>
        </div>
    );
}
