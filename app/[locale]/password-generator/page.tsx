import PasswordGenerator from '@/components/PasswordGenerator';
import { useTranslations } from 'next-intl';

export default function PasswordGeneratorPage() {
    const t = useTranslations('PasswordGenerator');

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center">
            
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-black tracking-widest uppercase rounded-full border border-blue-200 dark:border-blue-800/50">
                    Security Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    {t('title')}<span className="text-blue-600">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto mb-8">
                    {t('subtitle')}
                </p>
                <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 text-sm text-left flex gap-3 text-orange-800 dark:text-orange-200">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p>{t('hero_desc')}</p>
                </div>
            </div>

            <div className="w-full">
                <PasswordGenerator />
            </div>

        </div>
    );
}
