'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

// ~200 simple, memorable words for passphrase generation
const WORDLIST = [
  'Tiger','Castle','River','Falcon','Bridge','Stone','Storm','Cloud','Arrow','Flame',
  'Forest','Pebble','Silver','Thunder','Copper','Shadow','Mirror','Lantern','Crystal','Anchor',
  'Blaze','Frost','Ember','Canyon','Harbor','Meadow','Glacier','Rapid','Summit','Valley',
  'Petal','Dagger','Shield','Knight','Wizard','Raven','Phoenix','Dragon','Comet','Planet',
  'Maple','Cedar','Birch','Willow','Aspen','Bonsai','Cactus','Lotus','Orchid','Tulip',
  'Amber','Cobalt','Indigo','Scarlet','Violet','Teal','Olive','Crimson','Onyx','Pearl',
  'Hammer','Chisel','Anvil','Spark','Torch','Compass','Lanyard','Satchel','Capsule','Beacon',
  'Walrus','Cheetah','Coyote','Jaguar','Mamba','Osprey','Badger','Lynx','Condor','Manta',
];

function generatePassphrase(wordCount: number): string {
  const words: string[] = [];
  const arr = new Uint32Array(wordCount);
  window.crypto.getRandomValues(arr);
  for (let i = 0; i < wordCount; i++) {
    words.push(WORDLIST[arr[i] % WORDLIST.length]);
  }
  // Append a small number for extra strength
  const numArr = new Uint8Array(1);
  window.crypto.getRandomValues(numArr);
  const num = (numArr[0] % 90) + 10; // 10-99
  return words.join('-') + '-' + num;
}

export default function PasswordGenerator() {
  const t = useTranslations('PasswordGenerator');

  const [mode, setMode] = useState<'random' | 'memorable'>('random');
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [wordCount, setWordCount] = useState(4);
  const [copied, setCopied] = useState(false);

  // Count how many options are active
  const activeCount = [uppercase, lowercase, numbers, symbols].filter(Boolean).length;

  const toggle = (current: boolean, setter: (v: boolean) => void) => {
    // Prevent turning off the last remaining option
    if (current && activeCount === 1) return;
    setter(!current);
  };

  const generatePassword = useCallback(() => {
    if (mode === 'memorable') {
      setPassword(generatePassphrase(wordCount));
      setCopied(false);
      return;
    }

    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$&*-_=+?';

    if (charset.length === 0) { setPassword(''); return; }

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length];
    }
    setPassword(newPassword);
    setCopied(false);
  }, [mode, length, uppercase, lowercase, numbers, symbols, wordCount]);

  useEffect(() => { generatePassword(); }, [generatePassword]);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const calculateStrength = () => {
    if (!password) return { label: t('weak'), color: 'bg-red-500', width: '25%' };
    if (mode === 'memorable') {
      const segments = password.split('-').length;
      if (segments >= 5) return { label: t('very_strong'), color: 'bg-indigo-500', width: '100%' };
      if (segments >= 4) return { label: t('strong'), color: 'bg-green-500', width: '75%' };
      return { label: t('good'), color: 'bg-amber-500', width: '50%' };
    }
    let score = 0;
    if (password.length > 8) score += 1;
    if (password.length > 12) score += 1;
    if (password.length >= 16) score += 1;
    if (uppercase) score += 1;
    if (lowercase) score += 1;
    if (numbers) score += 1;
    if (symbols) score += 1;
    if (score <= 3) return { label: t('weak'), color: 'bg-red-500', width: '25%' };
    if (score <= 5) return { label: t('good'), color: 'bg-amber-500', width: '50%' };
    if (score <= 6) return { label: t('strong'), color: 'bg-green-500', width: '75%' };
    return { label: t('very_strong'), color: 'bg-indigo-500', width: '100%' };
  };

  const strength = calculateStrength();

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl">

      {/* Mode switcher */}
      <div className="flex items-center bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-1 mb-8">
        <button
          onClick={() => setMode('random')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'random' ? 'bg-white dark:bg-[#1a1a1a] shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          🔀 {t('mode_random')}
        </button>
        <button
          onClick={() => setMode('memorable')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'memorable' ? 'bg-white dark:bg-[#1a1a1a] shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          🧠 {t('mode_memorable')}
        </button>
      </div>

      {/* Memorable mode hint */}
      {mode === 'memorable' && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
          {t('memorable_hint')}
        </div>
      )}

      {/* Display Area */}
      <div className="relative mb-8">
        <div className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 break-all">
          <span className={`text-2xl sm:text-3xl font-mono tracking-tight font-bold ${password ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
            {password || 'Select options...'}
          </span>
          <button
            onClick={handleCopy}
            disabled={!password}
            className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              copied
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 active:scale-95'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                <span>{t('copied')}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                <span>{t('copy')}</span>
              </>
            )}
          </button>
        </div>

        {/* Strength Meter */}
        <div className="mt-4 flex items-center gap-4 px-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 w-24">{t('strength')}</span>
          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 ease-out ${strength.color}`} style={{ width: strength.width }}></div>
          </div>
          <span className={`text-xs font-bold uppercase tracking-widest ${strength.color.replace('bg-', 'text-')} w-24 text-right`}>{strength.label}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        {mode === 'random' ? (
          <>
            {/* Length Slider */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('length')}</label>
                <span className="text-lg font-black text-blue-600 dark:text-blue-400">{length}</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-100 dark:bg-[#222] rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: t('uppercase'), state: uppercase, setter: setUppercase },
                { label: t('lowercase'), state: lowercase, setter: setLowercase },
                { label: t('numbers'),   state: numbers,   setter: setNumbers   },
                { label: t('symbols'),   state: symbols,   setter: setSymbols   },
              ].map((item, idx) => {
                const isLastActive = item.state && activeCount === 1;
                return (
                  <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isLastActive ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-100 dark:border-[#222] bg-gray-50/50 dark:bg-[#111]'}`}>
                    <div>
                      <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                      {isLastActive && (
                        <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">{t('min_one_required')}</p>
                      )}
                    </div>
                    <button
                      onClick={() => toggle(item.state, item.setter)}
                      disabled={isLastActive}
                      title={isLastActive ? t('min_one_required') : undefined}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.state ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'} ${isLastActive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.state ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Memorable mode — word count slider */
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('word_count')}</label>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400">{wordCount} {t('words')}</span>
            </div>
            <input
              type="range"
              min="3"
              max="6"
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-100 dark:bg-[#222] rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {t('memorable_example')} <span className="font-mono font-bold text-gray-700 dark:text-gray-300">Tiger-Castle-River-42</span>
            </p>
          </div>
        )}

        <button
          onClick={generatePassword}
          className="w-full mt-4 py-4 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <span>{t('generate')}</span>
        </button>
      </div>
    </div>
  );
}
