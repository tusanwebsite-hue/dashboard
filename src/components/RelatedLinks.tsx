import React, { useState } from 'react';
import {
  Link2,
  ExternalLink,
  Copy,
  Check,
  Search,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Car,
  Scale,
  Home,
  HeartPulse,
  Receipt,
  Briefcase,
  FileBadge,
  Gauge,
  Coins,
  Sparkles,
} from 'lucide-react';
import { UsefulPortal } from '../data/mockData';
import { toPersianDigits } from '../utils/tools';

interface RelatedLinksProps {
  portals: UsefulPortal[];
  searchQuery: string;
}

export const RelatedLinks: React.FC<RelatedLinksProps> = ({ portals, searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'همه',
    'آموزشی و سنجش',
    'دولتی و عمومی',
    'خودرو و مسکن',
    'مالیات و بیمه',
  ];

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPortalIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-blue-600 dark:text-cyan-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Car':
        return <Car className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'Home':
        return <Home className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-blue-700 dark:text-blue-300" />;
      case 'FileBadge':
        return <FileBadge className="w-5 h-5 text-cyan-700 dark:text-cyan-300" />;
      case 'Gauge':
        return <Gauge className="w-5 h-5 text-indigo-500 dark:text-indigo-300" />;
      case 'Coins':
        return <Coins className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Link2 className="w-5 h-5 text-blue-600" />;
    }
  };

  const filteredPortals = portals.filter((p) => {
    const matchesCat = selectedCategory === 'همه' || p.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.url.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <section id="related-links" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
            <Link2 className="w-3.5 h-3.5" />
            <span>پایگاه‌های الکترونیک و پنجره واحد</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            لینک‌های مرتبط و سامانه‌های پرکاربرد
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            دسترسی سریع و مستقیم به درگاه‌های معتبر دولتی، آموزشی، ثبت اسناد، خودرو و قضایی
          </p>
        </div>

        {/* Counter badge */}
        <span className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold self-start md:self-end border border-slate-200 dark:border-slate-700">
          {toPersianDigits(filteredPortals.length)} سامانه فعال
        </span>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Portals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPortals.map((portal) => (
          <div
            key={portal.id}
            className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 group-hover:scale-105 transition">
                  {getPortalIcon(portal.icon)}
                </div>
                {portal.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {portal.badge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                {portal.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {portal.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleCopyLink(portal.url, portal.id)}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                title="کپی لینک سامانه"
              >
                {copiedId === portal.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-bold">کپی شد</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی آدرس</span>
                  </>
                )}
              </button>

              <a
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-bold transition"
              >
                <span>ورود به سامانه</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
