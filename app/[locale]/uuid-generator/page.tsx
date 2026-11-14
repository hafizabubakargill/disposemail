import UUIDGenerator from '@/components/UUIDGenerator';
import { tr, localizeMeta } from '@/lib/tr';
import { getLocale } from 'next-intl/server';

const baseMetadata = {
    title: 'UUID Generator: v1, v4, v5, v7 and GUID Online',
    description: 'Generate UUIDs in versions 1, 4, 5 and 7, plus the nil UUID and Windows-style GUIDs, and copy them in one click. Free and created in your browser.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return localizeMeta(baseMetadata as any, locale);
}

export default async function UUIDGeneratorPage() {
    const locale = await getLocale();
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-black tracking-widest uppercase rounded-full border border-blue-200 dark:border-blue-800/50">
                    {tr(locale, "Free Tools")}
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    {tr(locale, "UUID Generator")}<span className="text-blue-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    {tr(locale, "Generate UUIDs in every version — v1 (time-based), v4 (random), v7 (time-ordered), v5 (name hash), NIL, and Windows-style GUIDs.")}
                </p>
            </div>
            <div className="w-full"><UUIDGenerator /></div>
            {locale === 'en' && (
                <section className="w-full max-w-3xl mx-auto mt-20 text-gray-600 dark:text-gray-400">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Last reviewed: November 2026</p>
                    <h2 className="text-3xl font-black tracking-tight mb-4 text-gray-900 dark:text-white">What is a UUID?</h2>
                    <p className="leading-relaxed mb-6">A UUID (universally unique identifier) is a 128-bit value written as 32 hexadecimal digits in five groups, in the pattern 8-4-4-4-12, for example <code>f47ac10b-58cc-4372-a567-0e02b2c3d479</code>. Any computer can create one without asking a central server, which makes UUIDs popular for database keys, file names and request IDs in distributed systems. A GUID is the same thing under Microsoft&apos;s name.</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Which version should I use?</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>v4 (random):</strong> the default choice when you just need a unique, hard-to-guess ID.</li>
                        <li><strong>v7 (time-ordered):</strong> starts with a timestamp, so new IDs sort roughly by creation time. A good fit for database primary keys.</li>
                        <li><strong>v1 (time-based):</strong> uses the current time and a node value. It can reveal when an ID was created, so avoid it for public identifiers.</li>
                        <li><strong>v5 (name-based):</strong> hashes a name inside a namespace with SHA-1, so the same input always gives the same UUID.</li>
                        <li><strong>NIL:</strong> all zeros, used as a &quot;no value&quot; placeholder.</li>
                    </ul>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Example</h3>
                    <p className="leading-relaxed mb-6">Generate five version 4 UUIDs and paste them into test fixtures. For a stable ID per email address, use v5 with the DNS namespace and the address as the name: running it twice gives the same result.</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Frequently asked questions</h3>
                    <div className="space-y-5 mb-6">
                        <div><h4 className="font-bold text-gray-900 dark:text-white mb-1">Can two UUIDs be the same?</h4><p className="text-sm leading-relaxed">With a sound random source, a v4 collision is so unlikely that you would need to generate around 2.7 quintillion before the chance reached 50 percent.</p></div>
                        <div><h4 className="font-bold text-gray-900 dark:text-white mb-1">Is a UUID a good password or access token?</h4><p className="text-sm leading-relaxed">No. It is hard to guess, but tokens need expiry and server-side checks. Use a purpose-built token, or our password generator for secrets.</p></div>
                        <div><h4 className="font-bold text-gray-900 dark:text-white mb-1">Are my UUIDs sent anywhere?</h4><p className="text-sm leading-relaxed">No. They are created in your browser and are not sent to our servers.</p></div>
                    </div>
                    <p className="text-sm leading-relaxed">Read our <a className="text-blue-600 dark:text-blue-400 font-semibold underline" href="/blog/what-is-a-uuid-and-why-it-matters">full UUID guide</a> for formats, collision odds and database tips.</p>
                </section>
            )}
        </div>
    );
}
