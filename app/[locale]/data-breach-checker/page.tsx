import DataBreachChecker from '@/components/DataBreachChecker';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const resolvedParams = await params;
    const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'DataBreach' });
    
    return {
        title: t('metaTitle') || 'Data Breach Checker | DisposeMail',
        description: t('metaDesc') || 'Securely verify if your email, passwords, or data have been compromised in known security database leaks.',
    };
}

export default function DataBreachPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <div className="text-center mb-12 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white">
                        Data Breach
                        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 dark:from-red-400 dark:via-orange-400 dark:to-yellow-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                            Checker
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Verify if your personal email address, passwords, or data have been compromised in known security breaches using the largest open-source breach database.
                    </p>
                </div>

                <div className="w-full flex justify-center mt-4">
                    <DataBreachChecker />
                </div>
                
                {/* SEO Text Content */}
                <div className="mt-24 max-w-4xl text-left bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-none rounded-2xl p-8 backdrop-blur-sm transition-colors">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why check for Data Breaches?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Over billions of accounts have been compromised in various database leaks. When companies you use are hacked, your email, password, and personal information are often sold on the dark web. Checking your email against a known database is the first step in securing your digital identity.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How does this tool work?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        DisposeMail securely hashes your email request and queries it against public data breach records (such as those recorded by XposedOrNot). If a match is found, you immediately know which platform leaked your information so you can change your passwords immediately.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Is this search recorded?</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        No. We do not store the email addresses you check on our servers. The query is performed live and routed securely to maintain your privacy. If your real email is frequently exposed, consider using our <strong>Disposable Email Generator</strong> for future signups.
                    </p>
                </div>
            </div>
        </div>
    );
}
