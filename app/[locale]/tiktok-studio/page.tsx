'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import Inbox, { Email } from "@/components/Inbox";
import { Footer } from "@/components/Footer";
import { getSortedPosts } from "@/lib/blog";

export default function TikTokStudioPage() {
  const [viewport, setViewport] = useState<'full' | 'mobile' | 'desktop'>('full');
  const [activePreset, setActivePreset] = useState<number>(0);
  const [email, setEmail] = useState<string>('generating...');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customPrefix, setCustomPrefix] = useState<string>('');
  const [progress, setProgress] = useState<number>(100);
  const [timeLeft, setTimeLeft] = useState<number>(1200);
  const [inboxEmails, setInboxEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [hideControls, setHideControls] = useState<boolean>(false);

  // Translations & Locale for 100% Website Parity
  const tf = useTranslations('Features');
  const tfaq = useTranslations('FAQ');
  const ts = useTranslations('Steps');
  const tuc = useTranslations('UseCases');
  const twhy = useTranslations('Why');
  const tb = useTranslations('Blog');
  const tht = useTranslations('HomeTools');
  const thf = useTranslations('HomeFeaturedTools');
  const locale = useLocale();

  // Preset Configurations
  const presets = [
    {
      title: "1. The 3-Sec Hack (Netflix OTP)",
      targetEmail: "e8b7f2a1@disposemail.xyz",
      emailData: {
        id: "1",
        from_address: "Netflix Verification <no-reply@netflix.com>",
        subject: "Your One-Time Verification Code is 849-201",
        text: "Hi there, your verification code is 849-201",
        received_at: Date.now(),
        is_read: false,
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #fff; background: #141414; border-radius: 16px; border: 1px solid #222;">
            <h2 style="color: #e50914; margin-top: 0; font-size: 28px; font-weight: 900;">NETFLIX</h2>
            <p style="font-size: 16px; color: #ccc;">Hi there, complete your sign-up by entering the verification code below:</p>
            <div style="background: #222; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0; border: 1px solid #333;">
              <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #22c55e;">849-201</span>
            </div>
            <p style="font-size: 13px; color: #777;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `
      }
    },
    {
      title: "2. Data Broker Defense (Pixel Block)",
      targetEmail: "privacy-shield-99@disposemail.xyz",
      emailData: {
        id: "2",
        from_address: "Daily Health Trends <newsletter@health-tracker-ad.com>",
        subject: "⚡ 5 Secrets to Better Sleep (Exclusive Guide)",
        text: "Welcome to our weekly newsletter!",
        received_at: Date.now(),
        is_read: false,
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #333; background: #fff; border-radius: 16px;">
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 14px; border-radius: 10px; margin-bottom: 24px; color: #1e40af; font-size: 13px; font-weight: bold; display: flex; items-center: gap-2;">
              <span>🛡️</span>
              <span><strong>DisposeMail Security:</strong> Removed 3 invisible 1x1 tracking pixels (track.analytics.com/pixel.gif) and protected your real IP address.</span>
            </div>
            <h2 style="color: #111; font-weight: 900; font-size: 24px;">5 Secrets to Better Sleep</h2>
            <p style="font-size: 15px; color: #444; line-height: 1.6;">Welcome to our weekly newsletter! We share top wellness tips and science-backed sleep hacks...</p>
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-top: 20px; color: #666; font-size: 13px; font-style: italic;">
              [Newsletter content sanitized & safe to read without surveillance]
            </div>
          </div>
        `
      }
    },
    {
      title: "3. QA Automation API (Playwright/Cypress)",
      targetEmail: "test-runner-ci-88@disposemail.xyz",
      emailData: {
        id: "3",
        from_address: "Staging Auth <auth@yourapp.example.com>",
        subject: "[CI/CD #8492] E2E Test Verification OTP: 921-844",
        text: "AUTOMATED E2E TEST WEBHOOK PAYLOAD",
        received_at: Date.now(),
        is_read: false,
        html: `
          <div style="font-family: monospace; padding: 24px; color: #00ff66; background: #0d1117; border-radius: 16px; border: 1px solid #30363d;">
            <p style="color: #8b949e; margin-bottom: 12px;">// AUTOMATED E2E TEST WEBHOOK PAYLOAD</p>
            <p style="margin: 6px 0;">STATUS: <span style="color: #58a6ff; font-weight: bold;">200 OK</span></p>
            <p style="margin: 6px 0;">ROUTING: <span style="color: #f0883e;">v4-uuid-isolated-queue</span></p>
            <p style="margin: 6px 0;">LATENCY: <span style="color: #238636; font-weight: bold; background: #102a1e; padding: 2px 6px; border-radius: 4px;">382ms</span></p>
            <hr style="border-color: #30363d; margin: 20px 0;" />
            <p style="font-size: 18px; color: #fff; margin-top: 10px;">VERIFICATION TOKEN: <strong style="color: #00ff66; background: #161b22; padding: 6px 12px; border-radius: 6px; border: 1px solid #30363d;">921-844</strong></p>
          </div>
        `
      }
    }
  ];

  // Trigger Animation
  const runAnimation = (presetIndex: number) => {
    setIsAnimating(true);
    setActivePreset(presetIndex);
    setSelectedEmail(null);
    setInboxEmails([]);
    setEmail('generating...');

    const preset = presets[presetIndex];

    // Step 1: Type out email into the ACTUAL Hero Component (after 600ms)
    setTimeout(() => {
      setEmail(preset.targetEmail);
    }, 600);

    // Step 2: Trigger incoming email into the ACTUAL Inbox Component (after 3000ms)
    setTimeout(() => {
      setInboxEmails([preset.emailData]);
    }, 3000);

    // Step 3: Auto-open email inside the ACTUAL Inbox Component (after 4500ms)
    setTimeout(() => {
      setSelectedEmail(preset.emailData);
      setIsAnimating(false);
    }, 4500);
  };

  const handleRefresh = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setEmail('generating...');
    setTimeout(() => {
      setEmail(presets[activePreset].targetEmail);
    }, 400);
  };

  // Timer countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 1200));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-blue-500/30">
      
      {/* 🟢 STUDIO CONTROL BAR (Hidden during screen recording) */}
      {!hideControls && (
        <div className="w-full bg-[#111] border-b border-[#222] p-4 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-sm text-white">
              🎬
            </div>
            <div>
              <h1 className="font-black text-sm md:text-base tracking-tight text-white">DisposeMail Video Studio</h1>
              <p className="text-[11px] text-gray-400">Using 100% of your actual website UI/UX (Navbar, Hero, Inbox & Homepage)</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => runAnimation(idx)}
                disabled={isAnimating}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${activePreset === idx && isAnimating ? 'bg-amber-500 text-black animate-pulse' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
              >
                <span>▶️</span>
                <span>{p.title.split('(')[0]}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-[#222] p-1 rounded-xl border border-[#333]">
              <button
                onClick={() => setViewport('full')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewport === 'full' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                🌐 100% Live Window
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewport === 'mobile' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                📱 9:16 Phone
              </button>
              <button
                onClick={() => setViewport('desktop')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewport === 'desktop' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                💻 16:9 Laptop
              </button>
            </div>

            <button
              onClick={() => setHideControls(true)}
              className="px-3 py-1.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-white text-xs font-bold transition-all"
              title="Hide controls for clean screen recording"
            >
              👁️ Hide Studio Controls
            </button>
          </div>
        </div>
      )}

      {/* Hidden mode exit trigger */}
      {hideControls && (
        <button
          onClick={() => setHideControls(false)}
          className="fixed bottom-4 right-4 z-50 bg-blue-600/80 hover:bg-blue-600 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xl border border-blue-400/40 animate-bounce"
        >
          👁️ Show Studio Controls
        </button>
      )}

      {/* 🖼️ VIEWPORT WRAPPER */}
      <div className={`w-full flex justify-center items-center ${viewport !== 'full' ? 'p-4 md:p-8 bg-[#0a0a0a]' : ''}`}>
        <div 
          className={`relative transition-all duration-500 overflow-hidden ${
            viewport === 'mobile' 
              ? 'w-[390px] h-[844px] rounded-[50px] border-[10px] border-[#222] shadow-[0_0_80px_rgba(37,99,235,0.15)] bg-background' 
              : viewport === 'desktop'
              ? 'w-full max-w-[1280px] min-h-[800px] rounded-3xl border-4 border-[#222] shadow-[0_0_80px_rgba(37,99,235,0.15)] bg-background'
              : 'w-full min-h-screen bg-background'
          }`}
        >
          {/* Mobile Notch Simulation */}
          {viewport === 'mobile' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-[#222] rounded-b-2xl z-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-black/60"></div>
            </div>
          )}

          {/* 100% ACTUAL WEBSITE CONTENT (Navbar, Hero, Inbox, Homepage & Footer) */}
          <div className="w-full h-full overflow-y-auto bg-background text-foreground flex flex-col font-sans">
            
            {/* Background Grid & Noise Effects (Exact Homepage Parity) */}
            <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-5 pointer-events-none z-0"></div>
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>

            {/* ACTUAL NAVBAR */}
            <Navbar />

            {/* ACTUAL MAIN HOMEPAGE CONTENT */}
            <main className="flex-grow z-10 w-full">
              
              {/* ACTUAL HERO COMPONENT */}
              <Hero
                email={email}
                timeLeft={timeLeft}
                progress={progress}
                handleRefresh={handleRefresh}
                isCustom={isCustom}
                setIsCustom={setIsCustom}
                customPrefix={customPrefix}
                setCustomPrefix={setCustomPrefix}
              />

              {/* ACTUAL INBOX COMPONENT (With Override Props for Recording) */}
              <div className="w-full px-4 z-10 pb-12">
                <Inbox 
                  emailAddress={email} 
                  sessionToken="mock-session-token"
                  overrideEmails={inboxEmails}
                  overrideSelectedEmail={selectedEmail}
                  onOverrideSelect={setSelectedEmail}
                />
              </div>

              {/* --- ACTUAL HOMEPAGE FEATURES GRID --- */}
              <div className="w-full max-w-5xl mx-auto px-6 py-20 border-t border-gray-100 dark:border-[#222]">
                  <h2 className="text-3xl font-black tracking-tighter text-center mb-12 text-gray-900 dark:text-white">{tf('title')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222]">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4 text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          </div>
                          <h3 className="font-bold text-lg mb-2">{tf('sockets_title')}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{tf('sockets_desc')}</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222]">
                          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mb-4 text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                          </div>
                          <h3 className="font-bold text-lg mb-2">{tf('tls_title')}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{tf('tls_desc')}</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222]">
                          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-4 text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                          </div>
                          <h3 className="font-bold text-lg mb-2">{tf('domain_title')}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{tf('domain_desc')}</p>
                      </div>
                  </div>
              </div>

              {/* --- ACTUAL HOMEPAGE ADSENSE / WHY SECTION --- */}
              <div className="w-full max-w-5xl mx-auto px-6 py-20 border-t border-gray-100 dark:border-[#222]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                      <div className="space-y-6">
                          <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-gray-100">
                              {tf('secure_life')}<span className="text-blue-700 dark:text-blue-400">.</span>
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                              {tf('secure_desc')}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700">
                                  <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-1">{tf('privacy_first')}</h3>
                                  <p className="text-[11px] text-gray-700 dark:text-gray-300 uppercase font-black">{tf('no_logs')}</p>
                              </div>
                              <div className="p-4 rounded-2xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
                                  <h3 className="font-bold text-green-900 dark:text-green-300 mb-1">{tf('zero_cost')}</h3>
                                  <p className="text-xs text-center font-bold text-green-800 dark:text-green-200">{tf('free_forever')}</p>
                              </div>
                          </div>
                      </div>

                      <div className="space-y-8">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest text-[11px]">{tfaq('homepage_faq')}</h3>
                          <div className="space-y-6">
                              <div>
                                  <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{tfaq('q1')}</h4>
                                  <p className="text-sm text-gray-500">{tfaq('a1')}</p>
                              </div>
                              <div>
                                  <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{tfaq('q2')}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{tfaq('a2')}</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* How it Works / Steps */}
                  <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50/50 dark:bg-[#111] border border-gray-100 dark:border-[#222]">
                          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black mb-6 shadow-xl shadow-blue-600/20">1</div>
                          <h3 className="font-bold text-lg mb-2">{ts('step1_title')}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{ts('step1_desc')}</p>
                      </div>
                      <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50/50 dark:bg-[#111] border border-gray-100 dark:border-[#222]">
                          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black mb-6 shadow-xl shadow-blue-600/20">2</div>
                          <h3 className="font-bold text-lg mb-2">{ts('step2_title')}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{ts('step2_desc')}</p>
                      </div>
                      <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50/50 dark:bg-[#111] border border-gray-100 dark:border-[#222]">
                          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black mb-6 shadow-xl shadow-blue-600/20">3</div>
                          <h3 className="font-bold text-lg mb-2">{ts('step3_title')}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{ts('step3_desc')}</p>
                      </div>
                  </div>
              </div>

              {/* --- ACTUAL HOMEPAGE FREE TOOLS PREVIEW --- */}
              <div className="w-full py-24 px-6 border-t border-gray-100 dark:border-[#1a1a1a]">
                  <div className="max-w-5xl mx-auto">
                      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                          <div className="max-w-xl text-left">
                              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">{tht('title')}</h2>
                              <p className="text-gray-700 dark:text-gray-400">{tht('subtitle')}</p>
                          </div>
                          <Link href="/free-tools" className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-[#111] text-gray-900 dark:text-gray-100 font-bold hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest text-[11px]">
                              {tht('view_all')}
                          </Link>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <Link href="/secure-notes" className="group p-8 rounded-3xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 hover:border-orange-500/50 transition-all hover:shadow-xl">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">🔥</div>
                              <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2">{thf('tool1_title')}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{thf('tool1_desc')}</p>
                          </Link>
                          
                          <Link href="/data-breach-checker" className="group p-8 rounded-3xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 hover:border-red-500/50 transition-all hover:shadow-xl">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">🛡️</div>
                              <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2">{thf('tool2_title')}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{thf('tool2_desc')}</p>
                          </Link>
                          
                          <Link href="/password-generator" className="group p-8 rounded-3xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-500/50 transition-all hover:shadow-xl">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">🔐</div>
                              <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2">{thf('tool3_title')}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{thf('tool3_desc')}</p>
                          </Link>
                      </div>
                  </div>
              </div>

              {/* --- ACTUAL HOMEPAGE USE CASES --- */}
              <div className="w-full py-20 px-6 border-t border-gray-100 dark:border-[#222]">
                  <div className="max-w-4xl mx-auto">
                      <h2 className="text-3xl font-black tracking-tighter mb-8 text-center text-gray-900 dark:text-white uppercase">Common Use Cases</h2>
                      <div className="space-y-4">
                          <details className="group p-4 bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] open:bg-blue-50 dark:open:bg-blue-900/10 transition-colors">
                              <summary className="font-bold cursor-pointer list-none flex justify-between items-center bg-transparent text-gray-900 dark:text-gray-100">
                                  <span>{tuc('case1_title')}</span>
                                  <span className="transition-transform group-open:rotate-180">▼</span>
                              </summary>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                                  {tuc('case1_desc')}
                              </p>
                          </details>
                          <details className="group p-4 bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] open:bg-blue-50 dark:open:bg-blue-900/10 transition-colors">
                              <summary className="font-bold cursor-pointer list-none flex justify-between items-center bg-transparent text-gray-900 dark:text-gray-100">
                                  <span>{tuc('case2_title')}</span>
                                  <span className="transition-transform group-open:rotate-180">▼</span>
                              </summary>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                                  {tuc('case2_desc')}
                              </p>
                          </details>
                          <details className="group p-4 bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] open:bg-blue-50 dark:open:bg-blue-900/10 transition-colors">
                              <summary className="font-bold cursor-pointer list-none flex justify-between items-center bg-transparent text-gray-900 dark:text-gray-100">
                                  <span>{tuc('case3_title')}</span>
                                  <span className="transition-transform group-open:rotate-180">▼</span>
                              </summary>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                                  {tuc('case3_desc')}
                              </p>
                          </details>
                      </div>
                  </div>
              </div>

            </main>

            {/* ACTUAL FOOTER */}
            <Footer />
            
          </div>
        </div>
      </div>

    </div>
  );
}
