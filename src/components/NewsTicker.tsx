import React, { useState } from 'react';
import { Megaphone, Pause, Play, ChevronLeft, ChevronRight, X, Info } from 'lucide-react';
import { NewsItem } from '../data/mockData';

interface NewsTickerProps {
  news: NewsItem[];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ news }) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  const getTagColor = (tag: NewsItem['tag']) => {
    switch (tag) {
      case 'فوری':
        return 'bg-red-500 text-white';
      case 'تمدید':
        return 'bg-amber-500 text-slate-900 font-bold';
      case 'مهم':
        return 'bg-indigo-600 text-white';
      case 'خدمات توسن':
        return 'bg-cyan-600 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  return (
    <section aria-label="نوار زیرنویس اخبار" className="relative z-30 bg-slate-900 text-white border-y border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-3">
          
          {/* Ticker Title Badge */}
          <div className="flex items-center gap-1.5 bg-gradient-to-l from-red-600 to-rose-600 text-white px-3 py-1 rounded-lg text-xs font-bold shrink-0 shadow-sm shadow-red-500/20">
            <Megaphone className="w-3.5 h-3.5 animate-bounce" />
            <span className="whitespace-nowrap">زیرنویس اخبار</span>
          </div>

          {/* Marquee Container with Left-to-Right Scrolling */}
          <div
            className={`relative flex-1 overflow-hidden py-1 ${isPaused ? 'ticker-paused' : ''}`}
            aria-live="polite"
          >
            {/* The scrolling track moving from left to right */}
            <div className="animate-marquee-ltr flex items-center gap-8">
              {/* Duplicate array twice for smooth infinite loop */}
              {[...news, ...news].map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  type="button"
                  onClick={() => setSelectedNews(item)}
                  className="group inline-flex items-center gap-2 text-xs sm:text-sm text-slate-200 hover:text-cyan-300 transition shrink-0 cursor-pointer text-right"
                >
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${getTagColor(
                      item.tag
                    )}`}
                  >
                    {item.tag}
                  </span>
                  <span className="font-medium group-hover:underline">{item.title}</span>
                  <span className="text-slate-500 text-xs">({item.dateShamsi})</span>
                  <span className="text-slate-600 font-bold mr-2">✦</span>
                </button>
              ))}
            </div>
          </div>

          {/* Controls: Pause / Play and Stepper */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-1 border-r border-slate-700/80 pr-2">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? 'پخش حرکت زیرنویس' : 'مکث زیرنویس'}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={isPaused ? 'ادامه حرکت' : 'توقف حرکت'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="خبر قبلی"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="خبر قبلی"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="خبر بعدی"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="خبر بعدی"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Selected News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-900 dark:text-slate-100"
            role="dialog"
            aria-modal="true"
            aria-labelledby="news-modal-title"
          >
            <button
              type="button"
              onClick={() => setSelectedNews(null)}
              aria-label="بستن پنجره خبر"
              className="absolute top-4 left-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${getTagColor(
                  selectedNews.tag
                )}`}
              >
                {selectedNews.tag}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                تاریخ انتشار: {selectedNews.dateShamsi}
              </span>
            </div>

            <h3 id="news-modal-title" className="text-base sm:text-lg font-bold leading-relaxed mb-3">
              {selectedNews.title}
            </h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 mb-5 border border-slate-200/60 dark:border-slate-700/50">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p>{selectedNews.summary}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">منبع: پیشخوان خدمات توسن</span>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
