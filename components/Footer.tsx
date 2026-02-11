'use client';

export function Footer() {
    return (
        <footer className="w-full bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-[#1a1a1a] py-12 px-6 mt-auto">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl font-black tracking-tighter text-blue-600">DisposeMail</span>
                        <span className="px-2 py-0.5 rounded bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase">v1.0</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">© 2026 DisposeMail. Secure, anonymous, temporary.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <a href="/about" className="hover:text-blue-500 transition-colors">About Us</a>
                    <a href="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
                    <a href="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</a>
                    <a href="/faq" className="hover:text-blue-500 transition-colors">FAQ</a>
                    <a href="mailto:support@disposemail.xyz" className="hover:text-blue-500 transition-colors">Support</a>
                </div>
            </div>
        </footer>
    );
}
