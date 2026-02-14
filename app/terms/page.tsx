import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'DisposeMail - Terms of Service',
    description: 'Terms of service and usage guidelines for DisposeMail.',
};

export default function TermsOfService() {
    return (
        <main className="flex min-h-screen flex-col items-center px-6 py-20 bg-transparent">
            <div className="max-w-3xl w-full bg-white dark:bg-[#111] p-10 rounded-2xl border border-gray-200 dark:border-[#222] shadow-xl relative z-10">
                <a href="/" className="text-blue-600 hover:text-blue-500 mb-8 inline-block font-medium">← Back to Inbox</a>

                <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white font-sans tracking-tight">Terms of Service</h1>

                <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using DisposeMail, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">2. Service Description</h2>
                        <p>
                            DisposeMail provides temporary, disposable email addresses. These addresses are designed for short-term use. We do not guarantee the permanent storage or availability of any email received through our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">3. Prohibited Conduct</h2>
                        <p>
                            You agree not to use DisposeMail for any illegal activities, including but not limited to spamming, harassment, or distributing malicious content. Any abuse of our infrastructure will result in an immediate block of your access.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">4. Limitation of Liability</h2>
                        <p>
                            DisposeMail is provided "as is" without any warranties. We are not responsible for any loss of data or access to third-party accounts created using our temporary addresses.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">5. Termination</h2>
                        <p>
                            We reserve the right to terminate or suspend access to our service at any time, without prior notice, for any reason whatsoever.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 6. Changes to Terms
                        </h2>
                        <p>
                            We may revise these terms at any time by updating this page. Your continued use of the service after such changes signifies your acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 7. User Privacy and Data Security
                        </h2>
                        <p>
                            We value your privacy. While we do not require personal information to use our service, we employ industry-standard security measures to protect the temporary data that passes through our servers. Please refer to our Privacy Policy for detailed information on how we handle data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 8. Third-Party Services
                        </h2>
                        <p>
                            Our service may contain links to third-party websites or services that are not owned or controlled by DisposeMail. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 9. Governing Law
                        </h2>
                        <p>
                            These terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 10. Contact Information
                        </h2>
                        <p>
                            If you have any questions about these Terms, please contact us at support@inveromail.info.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-[#222] text-sm text-gray-500 font-bold uppercase tracking-widest">
                    Last updated: February 11, 2026
                </div>
            </div>
        </main>
    );
}
