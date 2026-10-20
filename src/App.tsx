/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NewsTicker } from './components/NewsTicker';
import { ActiveRegistrations } from './components/ActiveRegistrations';
import { UsefulTools } from './components/UsefulTools';
import { RelatedLinks } from './components/RelatedLinks';
import { Footer } from './components/Footer';
import { ServiceRequestModal } from './components/ServiceRequestModal';
import { MOCK_REGISTRATIONS, MOCK_NEWS, MOCK_PORTALS, RegistrationItem } from './data/mockData';
import { Sparkles, Shield, Clock, Send, ArrowDown, CheckCircle2 } from 'lucide-react';
import { toPersianDigits } from './utils/tools';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tosan_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Sync dark mode class on <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tosan_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tosan_theme', 'light');
    }
  }, [darkMode]);

  const handleToggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const handleOpenServiceModal = (item?: RegistrationItem) => {
    setSelectedRegistration(item || null);
    setIsModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. Header with Title, Search, Shamsi Date, and Theme Toggle */}
      <Header
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCount={MOCK_REGISTRATIONS.length}
        onOpenQuickRequest={() => handleOpenServiceModal()}
      />

      {/* 2. News Ticker scrolling Left-to-Right */}
      <NewsTicker news={MOCK_NEWS} />

      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-slate-50 dark:from-slate-900/90 dark:via-slate-900/50 dark:to-slate-950 py-10 sm:py-14 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-blue-800 dark:text-cyan-300 text-xs font-bold border border-blue-200 dark:border-blue-800/80 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>پایگاه جامع امور اینترنتی، ثبت‌نام‌ها و پیشخوان دولت</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              کلیه خدمات کافی‌نت و اداری را <br className="hidden sm:inline" />
              <span className="bg-gradient-to-l from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                سریع، دقیق و غیرحضوری
              </span>{' '}
              انجام دهید
            </h2>

            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              مشاهده آخرین مهلت ثبت‌نام‌های کشوری (کنکور، استخدام، وام و خودرو)، اعتبارسنجی مدارک با ابزارهای آنلاین و ثبت سفارش خدمات با پیگیری کد رهگیری
            </p>

            {/* Quick action buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenServiceModal()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 active:scale-98 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>درخواست ثبت‌نام غیرحضوری</span>
              </button>

              <a
                href="#useful-tools"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition shadow-xs"
              >
                <ArrowDown className="w-4 h-4 text-indigo-500" />
                <span>ابزارهای رایگان (کد ملی، سن، سایز عکس)</span>
              </a>
            </div>

            {/* Stats badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-right">
              <div className="bg-white/90 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
                <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-cyan-400 block font-mono">
                  {toPersianDigits(MOCK_REGISTRATIONS.length)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">ثبت‌نام فعال در جریان</span>
              </div>
              <div className="bg-white/90 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
                <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 block font-mono">
                  {toPersianDigits('5')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">ابزار تخصصی برخط</span>
              </div>
              <div className="bg-white/90 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
                <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 block font-mono">
                  {toPersianDigits(MOCK_PORTALS.length)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">سامانه متصل کشوری</span>
              </div>
              <div className="bg-white/90 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
                <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 block font-mono">
                  ۱۰۰٪
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">پشتیبانی آنلاین و پیگیری</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 3. Active Registrations (ثبت‌نام‌های فعال با توضیحات بازشونده، نوار مهلت و دکمه درخواست) */}
        <ActiveRegistrations
          registrations={MOCK_REGISTRATIONS}
          searchQuery={searchQuery}
          onRequestService={(item) => handleOpenServiceModal(item)}
        />

        {/* 4. Useful Tools (ابزارهای کاربردی: استعلام کد ملی، محاسبه سن، تغییر سایز عکس، تعرفه) */}
        <UsefulTools />

        {/* 5. Related Links (لینک‌های مرتبط و سامانه‌های پرکاربرد) */}
        <RelatedLinks
          portals={MOCK_PORTALS}
          searchQuery={searchQuery}
        />
      </main>

      {/* 6. Footer */}
      <Footer />

      {/* Service Request Modal */}
      <ServiceRequestModal
        registration={selectedRegistration}
        isOpen={isModalOpen}
        onClose={handleCloseServiceModal}
      />

    </div>
  );
}
