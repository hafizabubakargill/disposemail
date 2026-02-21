import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'DisposeMail - Privacy Policy',
    description: 'Privacy policy and data usage information for DisposeMail.',
};

export default function PrivacyPolicy() {
    return (
        <main className="flex min-h-screen flex-col items-center bg-transparent px-6 py-20">
            <div className="max-w-3xl w-full bg-white dark:bg-[#111] p-10 rounded-[32px] border border-gray-100 dark:border-[#222] shadow-xl relative z-10">
                <a href="/" className="text-blue-600 hover:text-blue-500 mb-8 inline-block font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Inbox
                </a>

                <h1 className="text-5xl font-black mb-8 text-gray-900 dark:text-white tracking-tighter">Privacy Policy</h1>

                <div className="space-y-10 text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 1. Information Overview
                        </h2>
                        <p>
                            At DisposeMail, we take your privacy with extreme seriousness. Our mission is to provide an anonymous buffer for your digital life.
                            We do not collect names, phone numbers, physical addresses, or any other personally identifiable information (PII).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 2. Data Retention Policy
                        </h2>
                        <p>
                            All incoming emails processed by our infrastructure are held in short-term volatile memory. The system is configured to
                            automatically purge and shred every email and mailbox metadata after **60 minutes**. We do not maintain any archival databases
                            or backup services for user emails. Once it's gone, it's gone forever.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 3. Cookies and Local Storage
                        </h2>
                        <p>
                            We use standard browser "Local Storage" strictly to maintain your current temporary email address throughout your active session.
                            This allows you to refresh the page without losing your current inbox. We do not use persistent tracking cookies, cross-site beacons,
                            or any technology designed to build a profile of your browsing behavior.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 4. Advertising Partners
                        </h2>
                        <p>
                            To keep our high-speed infrastructure 100% free for everyone, we display advertisements provided by partners like Google AdSense.
                            These third-party vendors may use non-personal information (such as your device type or general geographic region)
                            to serve relevant ads. You can opt-out of personalized advertising through your browser's "Do Not Track" settings
                            or Google's Ad Settings page.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 5. Security Measures
                        </h2>
                        <p>
                            All communications between your browser and DisposeMail are encrypted using modern SSL/TLS protocols.
                            Our server-side processes run in isolated environments to prevent any internal cross-talk between different users' mailboxes.
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 dark:border-[#222] text-[10px] text-gray-400 font-bold uppercase tracking-widest flex justify-between">
                    <span>Effective Date: 2026-02-11</span>
                    <span className="text-blue-600">Verified Secure</span>
                </div>
            </div>
        </main>
    );
}
