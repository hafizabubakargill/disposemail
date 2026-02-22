import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-inter',
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const baseUrl = "https://disposemail.xyz";
    const path = locale === 'en' ? '' : `/${locale}`;
    const canonical = `${baseUrl}${path}`;

    return {
        title: {
            default: "DisposeMail - Secure Disposable Email",
            template: "%s | DisposeMail"
        },
        description: "Instantly create secure, temporary email addresses. Protect your privacy, avoid spam, and stay anonymous with DisposeMail's end-to-end encrypted disposable inbox.",
        keywords: ["disposable email", "temporary email", "temp mail", "anonymous email", "privacy", "secure email", "throwaway email"],
        authors: [{ name: "DisposeMail Team" }],
        creator: "DisposeMail",
        openGraph: {
            type: "website",
            locale: locale === 'zh' ? 'zh_CN' : locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`,
            url: canonical,
            title: "DisposeMail - Secure Disposable Email",
            description: "Instant, secure, and temporary email addresses for privacy protection.",
            siteName: "DisposeMail",
        },
        twitter: {
            card: "summary_large_image",
            title: "DisposeMail - Secure Disposable Email",
            description: "Protect your real inbox from spam with instant disposable email addresses.",
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: canonical,
            languages: {
                'en': `${baseUrl}`,
                'es': `${baseUrl}/es`,
                'pt': `${baseUrl}/pt`,
                'ru': `${baseUrl}/ru`,
                'zh': `${baseUrl}/zh`,
                'x-default': baseUrl,
            },
        }
    };
}

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>

                <link rel="icon" href="/icon.svg" type="image/svg+xml" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#0a0a0a" />

                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="mobile-web-app-capable" content="yes" />
            </head>
            <body className={`${inter.variable} min-h-screen bg-background text-foreground overflow-x-hidden antialiased selection:bg-blue-500/30 font-sans flex flex-col`}>
                {/* Background Grid & Noise Effects (Global) */}
                <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-5 pointer-events-none z-0"></div>
                <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>

                {/* Google Analytics (GTags) */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-DX89L9W9FL"
                    strategy="lazyOnload"
                />
                <Script id="google-analytics" strategy="lazyOnload">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-DX89L9W9FL');
                    `}
                </Script>

                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="flex flex-col min-h-screen relative z-10 w-full">
                            <Navbar />
                            <main className="flex-1 w-full">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
