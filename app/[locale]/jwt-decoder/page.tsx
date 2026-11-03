import JwtDecoderTool from '@/components/JwtDecoderTool';
import { getTranslations } from 'next-intl/server';
import { tr } from '@/lib/tr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'JwtDecoder' });
    return {
        title: `${t('title')}`,
        description: t('subtitle')
    };
}

export default async function JwtDecoderPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'JwtDecoder' });
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-xs font-black tracking-widest uppercase rounded-full border border-cyan-200 dark:border-cyan-800/50">
                    Developer Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    {t('title')}<span className="text-cyan-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    {t('subtitle')}
                </p>
            </div>
            <div className="w-full"><JwtDecoderTool /></div>
            <section className="max-w-3xl mx-auto mt-20 text-left space-y-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tr(locale, 'How do you verify a JWT?')}</h2>
                <p>{tr(locale, 'Decoding and verifying are different. A JWT has three Base64URL parts: header, payload and signature. Anyone can decode the first two, which is what this tool does in your browser. Verifying means recomputing the signature with the right key and comparing it to the one in the token.')}</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tr(locale, 'Steps to verify a token')}</h3>
                <ol className="list-decimal pl-6 space-y-2">
                    <li>{tr(locale, 'Read the alg header and accept only the algorithm you expect (never none).')}</li>
                    <li>{tr(locale, "Verify the signature: with the shared secret for HS256, or the issuer's public key (often from its JWKS endpoint) for RS256 or ES256.")}</li>
                    <li>{tr(locale, 'Check exp and nbf so expired or not-yet-valid tokens are rejected.')}</li>
                    <li>{tr(locale, 'Check iss and aud match your issuer and your application.')}</li>
                </ol>
                <p>{tr(locale, 'Do verification on your server with a maintained library, not by trusting what a decoded payload says. Avoid pasting production tokens into websites. This page decodes locally and does not send your token anywhere, but a token you have shared is best treated as compromised and rotated.')}</p>
            </section>
        </div>
    );
}
