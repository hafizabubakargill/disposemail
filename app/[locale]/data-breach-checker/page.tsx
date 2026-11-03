import DataBreachChecker from '@/components/DataBreachChecker';
import { getTranslations } from 'next-intl/server';
import { tr } from '@/lib/tr';
import { getLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const resolvedParams = await params;
    const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'DataBreach' });
    
    return {
        title: t('metaTitle') || 'Data Breach Checker | DisposeMail',
        description: t('metaDesc') || 'Securely verify if your email, passwords, or data have been compromised in known security database leaks.',
    };
}

export default async function DataBreachPage() {
    const locale = await getLocale();
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <div className="text-center mb-12 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white">
                        {tr(locale, "Data Breach")}
                        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 dark:from-red-400 dark:via-orange-400 dark:to-yellow-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                            Checker
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        {tr(locale, "Verify if your personal email address, passwords, or data have been compromised in known security breaches using the largest open-source breach database.")}
                    </p>
                </div>

                <div className="w-full flex justify-center mt-4">
                    <DataBreachChecker />
                </div>
                
                {/* SEO Text Content */}
                <div className="mt-24 max-w-4xl text-left bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-none rounded-2xl p-8 backdrop-blur-sm transition-colors">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{tr(locale, "Why check for Data Breaches?")}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {tr(locale, "Over billions of accounts have been compromised in various database leaks. When companies you use are hacked, your email, password, and personal information are often sold on the dark web. Checking your email against a known database is the first step in securing your digital identity.")}
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{tr(locale, "How does this tool work?")}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {tr(locale, "When you submit an address, our server forwards it to XposedOrNot, a public breach database, and returns the names of any breaches that include it. We do not run our own breach database, and the result is only as complete as XposedOrNot's data. A clean result does not guarantee an address was never exposed.")}</p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{tr(locale, "Is this search recorded?")}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {tr(locale, "We do not save the addresses you check or log them in our database. The address does travel to XposedOrNot to be looked up, so check only addresses you are comfortable sending to a third-party breach service. If a breach is found, change the password on the affected site and anywhere you reused it, and turn on two-factor authentication.")}<strong>{tr(locale, "Disposable Email Generator")}</strong> {tr(locale, "for future signups.")}
                    </p>
                </div>
            </div>
        </div>
    );
}
