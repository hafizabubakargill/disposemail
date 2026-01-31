import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'DisposeMail - Privacy Policy',
    description: 'Privacy policy and data usage information for DisposeMail.',
};

export default function PrivacyPolicy() {
    return (
        <main className="flex min-h-screen flex-col items-center bg-gray-50 dark:bg-[#0a0a0a] px-6 py-20">
            <div className="max-w-3xl w-full bg-white dark:bg-[#111] p-10 rounded-2xl border border-gray-200 dark:border-[#222] shadow-xl">
                <a href="/" className="text-blue-600 hover:text-blue-500 mb-8 inline-block font-medium">← Back to Inbox</a>

                <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>

                <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">1. Data Collection</h2>
                        <p>
                            DisposeMail is designed to be a privacy-first service. We **do not** collect personal information, IP addresses, or browser history.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">2. Email Retention</h2>
                        <p>
                            All incoming emails are automatically and permanently deleted from our servers after **1 hour**. We do not keep backups of deleted emails.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">3. Cookies & Tracking</h2>
                        <p>
                            We use local storage only to remember your temporary email address during your session. We do not use tracking cookies or third-party analytics that identify you personally.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">4. Third-Party Services</h2>
                        <p>
                            We may use third-party advertising services (such as Google AdSense) to support the service. These partners may use non-personal data (like cookies) to provide relevant advertisements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">5. Contact</h2>
                        <p>
                            If you have any questions about this policy, please contact us through our discord or community channels.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-[#222] text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </main>
    );
}
