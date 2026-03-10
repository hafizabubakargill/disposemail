'use client';

import { useState, useCallback } from 'react';
import { COUNTRIES, generateIdentity, GeneratedIdentity, CountryCode } from '@/lib/identity-data';

const COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[];

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      title={`Copy ${label ?? ''}`}
      className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shrink-0"
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

function FieldRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] hover:border-blue-300 dark:hover:border-blue-800 transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-blue-500 dark:text-blue-400 shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">{label}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{value}</p>
        </div>
      </div>
      <CopyButton value={value} label={label} />
    </div>
  );
}

export default function IdentityGenerator() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('US');
  const [selectedGender, setSelectedGender] = useState<'Male' | 'Female' | 'Random'>('Random');
  const [identity, setIdentity] = useState<GeneratedIdentity | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = useCallback(() => {
    const gender = selectedGender === 'Random' ? undefined : selectedGender;
    setIdentity(generateIdentity(selectedCountry, gender));
  }, [selectedCountry, selectedGender]);

  const copyAll = () => {
    if (!identity) return;
    const text = [
      `Full Name: ${identity.fullName}`,
      `Username: ${identity.username}`,
      `Gender: ${identity.gender}`,
      `Date of Birth: ${identity.dob}`,
      `Phone: ${identity.phone}`,
      `Address: ${identity.address}`,
      `City: ${identity.city}`,
      `State: ${identity.state}`,
      `Postal Code: ${identity.postalCode}`,
      `Country: ${identity.country_name}`,
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">

      {/* Controls */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm space-y-4">

        {/* Country Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Country</label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {COUNTRY_CODES.map((code) => (
              <button
                key={code}
                onClick={() => setSelectedCountry(code)}
                title={COUNTRIES[code].name}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all gap-1 ${
                  selectedCountry === code
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105'
                    : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-700'
                }`}
              >
                <span className="text-xl leading-none">{COUNTRIES[code].flag}</span>
                <span>{code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gender Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Gender</label>
          <div className="flex gap-2">
            {(['Random', 'Male', 'Female'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                  selectedGender === g
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-700'
                }`}
              >
                {g === 'Random' ? '🎲 Random' : g === 'Male' ? '♂ Male' : '♀ Female'}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-base tracking-wide transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Generate Random Identity
        </button>
      </div>

      {/* Result Card */}
      {identity && (
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">

          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{COUNTRIES[identity.country].flag}</span>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{identity.country_name} · {identity.gender}</p>
                <p className="text-lg font-black text-gray-900 dark:text-white">{identity.fullName}</p>
              </div>
            </div>
            <button
              onClick={copyAll}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                copiedAll
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a2a2a] hover:border-blue-400 dark:hover:border-blue-700'
              }`}
            >
              {copiedAll ? (
                <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Copied!</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy All</>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FieldRow label="First Name" value={identity.firstName}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />
            <FieldRow label="Middle Name" value={identity.middleName}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />
            <FieldRow label="Last Name" value={identity.lastName}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />
            <FieldRow label="Username" value={identity.username}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            />
            <FieldRow label="Date of Birth" value={identity.dob}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            />
            <FieldRow label="Gender" value={identity.gender}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            />
            <FieldRow label="Phone Number" value={identity.phone}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
            />
            <FieldRow label="Street Address" value={identity.address}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
            />
            <FieldRow label="City" value={identity.city}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            />
            <FieldRow label="State / Province" value={identity.state}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>}
            />
            <FieldRow label="Postal Code" value={identity.postalCode}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />
            <FieldRow label="Country" value={`${COUNTRIES[identity.country].flag} ${identity.country_name}`}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>

          {/* Regenerate */}
          <button
            onClick={generate}
            className="w-full py-3 mt-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-400 font-bold text-sm hover:border-blue-400 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generate Another
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-600 leading-relaxed">
        All data is randomly generated and entirely fictional. For anonymity, testing, and development purposes only. Not intended for fraud or misuse.
      </p>
    </div>
  );
}
