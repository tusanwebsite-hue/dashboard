import React, { useState, useEffect } from 'react';
import {
  Search,
  Sun,
  Moon,
  Calendar,
  Clock,
  Sparkles,
  PhoneCall,
  X,
  FileCheck2,
  Wrench,
  Link2,
} from 'lucide-react';
import { toPersianDigits } from '../utils/tools';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCount: number;
  onOpenQuickRequest: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  activeCount,
  onOpenQuickRequest,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateShamsi, setDateShamsi] = useState<string>('سه‌شنبه ۲۸ مهر ۱۴۰۵');

  useEffect(() => {
    // Generate Persian Shamsi Date
    const updateDateTime = () => {
      const now = new Date();
      // Formatter for Persian locale
      try {
        const formatter = new Intl.DateTimeFormat('fa-IR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        setDateShamsi(formatter.format(now));

        const timeFormatter = new Intl.DateTimeFormat('fa-IR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        setTimeStr(timeFormatter.format(now));
      } catch {
        // Fallback
        setDateShamsi('سه‌شنبه ۲۸ مهر ۱۴۰۵');
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        setTimeStr(toPersianDigits(`${h}:${m}:${s}`));
      }
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
      {/* Top micro bar for fast contact & status */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">پیشخوان غیرحضوری کافی‌نت توسن فعال است</span>
            <span className="hidden sm:inline-block text-cyan-200">|</span>
            <span className="hidden sm:inline-block text-cyan-100">پشتیبانی و ثبت سفارش آنلاین: ۰۹۱۲۳۴۵۶۷۸۹</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-1 text-cyan-100">
              <Clock className="w-3.5 h-3.5" />
              ساعات کاری: ۸:۰۰ الی ۲۱:۰۰ یکسره
            </span>
            <button
              onClick={onOpenQuickRequest}
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full transition font-semibold"
            >
              ثبت درخواست سریع
            </button>
          </div>
        </div>
      </div>

      {/* Main Header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Portal Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center text-white">
                <div className="w-full h-full bg-slate-900/20 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white animate-spin-slow" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    پیشخوان خدمات کافی نت توسن
                  </h1>
                  <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-300/60 dark:border-emerald-800">
                    رسمی
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  سامانه متمرکز ثبت‌نام‌های کشوری، ابزارهای کاربردی و پنجره خدمات الکترونیک
                </p>
              </div>
            </div>

            {/* Mobile Theme Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label="تغییر حالت شب و روز"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
              </button>
            </div>
          </div>

          {/* Search bar & Live info widgets */}
          <div className="flex flex-1 max-w-2xl items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <label htmlFor="main-search" className="sr-only">جستجو در ثبت‌نام‌ها و ابزارها</label>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="main-search"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="جستجو در آزمون‌ها، وام، خودرو، ابزارها یا نام سامانه..."
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="پاک کردن جستجو"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Date & Time Widget */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 text-xs shrink-0">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span>{dateShamsi}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <div className="flex items-center gap-1 font-mono font-bold text-slate-800 dark:text-slate-100">
                <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>{timeStr || '۱۲:۰۰:۰۰'}</span>
              </div>
            </div>

            {/* Desktop Theme Switcher */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={darkMode ? 'تغییر به تم روشن' : 'تغییر به تم تاریک'}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-medium shrink-0"
              title={darkMode ? 'حالت روز' : 'حالت شب'}
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>روز</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>شب</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Quick Nav Chips */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-3 pt-2 text-xs">
          <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1 scrollbar-none text-slate-600 dark:text-slate-400 font-medium">
            <a
              href="#active-registrations"
              className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-cyan-400 transition whitespace-nowrap py-1"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>ثبت‌نام‌های فعال ({toPersianDigits(activeCount)})</span>
            </a>
            <a
              href="#useful-tools"
              className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-cyan-400 transition whitespace-nowrap py-1"
            >
              <Wrench className="w-3.5 h-3.5 text-indigo-500" />
              <span>ابزارهای کاربردی</span>
            </a>
            <a
              href="#related-links"
              className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-cyan-400 transition whitespace-nowrap py-1"
            >
              <Link2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>لینک‌های مرتبط و سامانه‌ها</span>
            </a>
            <a
              href="#contact-info"
              className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-cyan-400 transition whitespace-nowrap py-1"
            >
              <PhoneCall className="w-3.5 h-3.5 text-purple-500" />
              <span>تماس و پشتیبانی</span>
            </a>
          </nav>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[11px]">نسخه جامع ۱۴۰۵ توسن</span>
          </div>
        </div>
      </div>
    </header>
  );
};
