import FakeCreditCardGenerator from '@/components/FakeCreditCardGenerator';

export default function FakeCreditCardPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-black tracking-widest uppercase rounded-full border border-rose-200 dark:border-rose-800/50">
                    Developer Tools
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-tight">
                    Test Card Generator<span className="text-rose-500">.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                    Generate Luhn-valid test credit card numbers for Visa, Mastercard, Amex, Discover, JCB, and Diner's Club — for payment gateway testing only.
                </p>
            </div>
            <div className="w-full"><FakeCreditCardGenerator /></div>
        </div>
    );
}
