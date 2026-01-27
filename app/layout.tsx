import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "DisposeMail - Secure Disposable Email",
    description: "Instant, secure, and temporary email addresses.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen bg-[#050505] text-white overflow-x-hidden antialiased selection:bg-blue-500/30`}>
                {children}
            </body>
        </html>
    );
}
