import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Send,
  AlertCircle,
  Filter,
  Check,
  Building2,
  Sparkles,
} from 'lucide-react';
import { RegistrationItem } from '../data/mockData';
import { calculateRegistrationProgress, toPersianDigits } from '../utils/tools';

interface ActiveRegistrationsProps {
  registrations: RegistrationItem[];
  searchQuery: string;
  onRequestService: (item: RegistrationItem) => void;
}

export const ActiveRegistrations: React.FC<ActiveRegistrationsProps> = ({
  registrations,
  searchQuery,
  onRequestService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    // Expand the first item by default for great first impression
    [registrations[0]?.id || '']: true,
  });
  const [sortBy, setSortBy] = useState<'deadline' | 'newest'>('deadline');

  const categories = [
    'همه',
    'سنجش و دانشگاه',
    'استخدامی',
    'خودرو و مسکن',
    'وام و بانکی',
    'خدمات عمومی',
  ];

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter registrations
  const filtered = registrations
    .filter((item) => {
      const matchesCategory = selectedCategory === 'همه' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.organizer.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.requirements.some((r) => r.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        const progA = calculateRegistrationProgress(a.startDate, a.endDate);
        const progB = calculateRegistrationProgress(b.startDate, b.endDate);
        return progA.daysRemaining - progB.daysRemaining;
      } else {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
    });

  return (
    <section id="active-registrations" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ثبت‌نام‌های برخط و فراخوان‌ها</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            ثبت نام های فعال
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            فهرست به‌روز آزمون‌های سراسری، استخدامی، سهمیه خودرو، مسکن و تسهیلات بانکی
          </p>
        </div>

        {/* Sort & Quick Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>مرتب‌سازی:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'deadline' | 'newest')}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="deadline">نزدیک‌ترین پایان مهلت</option>
              <option value="newest">جدیدترین فراخوان‌ها</option>
            </select>
          </div>
          <span className="text-xs px-2.5 py-1 bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold">
            {toPersianDigits(filtered.length)} مورد
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Registrations List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            موردی با شرایط جستجوی شما یافت نشد
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            لطفاً عبارت دیگری را جستجو کنید یا دسته‌بندی را روی «همه» قرار دهید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((item) => {
            const progress = calculateRegistrationProgress(item.startDate, item.endDate);
            const isExpanded = !!expandedIds[item.id];

            return (
              <article
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                {/* Card Top: Header & Badges */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.category}
                      </span>
                      {item.isUrgent && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-300/60 dark:border-rose-900">
                          فوری / پرمخاطب
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 shrink-0">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.organizer}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-3">
                    {item.title}
                  </h3>

                  {/* Date Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">تاریخ شروع:</span>
                        <span className="font-semibold">{item.startDateShamsi}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">مهلت پایان:</span>
                        <span className="font-semibold">{item.endDateShamsi}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deadline Progress Bar (نوار پایان زمان ثبت نام) */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        وضعیت مهلت:
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            progress.badgeColor === 'red'
                              ? 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300'
                              : progress.badgeColor === 'amber'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          }`}
                        >
                          {progress.statusText}
                        </span>
                      </span>
                      <span className="text-slate-600 dark:text-slate-300 font-mono">
                        {toPersianDigits(progress.percentage)}٪ سپری شده
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/50">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress.badgeColor === 'red'
                            ? 'bg-gradient-to-r from-red-500 to-rose-600'
                            : progress.badgeColor === 'amber'
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        }`}
                        style={{ width: `${Math.max(5, progress.percentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Expandable Accordion Header Button */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    aria-expanded={isExpanded}
                    className="w-full flex items-center justify-between py-2 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 border-t border-slate-100 dark:border-slate-800/80 pt-3 transition cursor-pointer"
                  >
                    <span>{isExpanded ? 'بستن توضیحات و مدارک' : 'مشاهده توضیحات، شرایط و مدارک مورد نیاز'}</span>
                    <ChevronDown
                      className={`w-4 h-4 transform transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Expandable Body (Accordion content) */}
                  {isExpanded && (
                    <div className="pt-3 space-y-3.5 text-xs text-slate-600 dark:text-slate-300 border-t border-dashed border-slate-200 dark:border-slate-800 mt-2 animate-in fade-in duration-200">
                      {/* Description */}
                      <p className="leading-relaxed bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-xl">
                        {item.description}
                      </p>

                      {/* Requirements */}
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                          <span>مدارک و اطلاعات مورد نیاز:</span>
                        </h4>
                        <ul className="space-y-1.5 pr-2">
                          {item.requirements.map((req, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Notes / Tips */}
                      {item.notes.length > 0 && (
                        <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/50 text-amber-900 dark:text-amber-200">
                          <span className="font-bold block mb-1">نکات و تعرفه:</span>
                          <ul className="list-disc list-inside space-y-1">
                            {item.notes.map((note, nIdx) => (
                              <li key={nIdx}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions Bottom Bar */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition"
                  >
                    <span>سامانه مرجع</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Primary Service Request Button */}
                  <button
                    type="button"
                    onClick={() => onRequestService(item)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 active:scale-98 transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>درخواست خدمات کافی‌نت</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
