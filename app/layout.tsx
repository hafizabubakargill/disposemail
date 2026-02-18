import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
    preload: false,
});

export const metadata: Metadata = {
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
        locale: "en_US",
        url: "https://disposemail.xyz",
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
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Google AdSense */}
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5210079727285405"
                    crossOrigin="anonymous"
                ></script>
                <link rel="icon" href="/icon.svg" type="image/svg+xml" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#0a0a0a" />

                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="mobile-web-app-capable" content="yes" />
            </head>
            <body className={`${inter.className} min-h-screen bg-background text-foreground overflow-x-hidden antialiased selection:bg-blue-500/30 font-sans flex flex-col`}>
                {/* Background Grid & Noise Effects (Global) */}
                <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-5 pointer-events-none z-0"></div>
                <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>

                {/* Google Analytics (GTags) */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-DX89L9W9FL"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-DX89L9W9FL');
                    `}
                </Script>

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
            </body>
        </html>
    );
}
