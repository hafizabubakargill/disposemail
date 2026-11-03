import QRCodeGenerator from '@/components/QRCodeGenerator';
import { tr, localizeMeta } from '@/lib/tr';
import { getLocale } from 'next-intl/server';

const baseMetadata = {
    title: 'Free QR Code Generator: Create QR Codes for Links and Text',
    description: 'Generate a QR code for a URL, text or an email address and download it as an image. Free, no signup, runs in your browser.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return localizeMeta(baseMetadata as any, locale);
}

export default async function QRCodeGeneratorPage() {
    const locale = await getLocale();
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-black tracking-widest uppercase rounded-full border border-violet-200 dark:border-violet-800/50">
                    {tr(locale, "Free Tools")}
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    {tr(locale, "QR Code Generator")}<span className="text-violet-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    {tr(locale, "Generate QR codes for URLs, text, email, phone, SMS, and Wi-Fi. Customize colors, size, and download as PNG — no registration required.")}
                </p>
            </div>
            <div className="w-full"><QRCodeGenerator /></div>
        </div>
    );
}
