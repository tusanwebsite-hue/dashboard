import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import { toPersianDigits } from '../utils/tools';

export const Footer: React.FC = () => {
  return (
    <footer id="contact-info" className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      {/* Top Banner inside Footer */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-slate-900 border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider block mb-1">
              پیشخوان خدمات غیرحضوری و آنلاین
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              نیاز به ثبت‌نام یا پیگیری امور اداری دارید؟
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              مدارک خود را از طریق شبکه‌های اجتماعی برای کافی‌نت توسن ارسال کنید و رسید معتبر تحویل بگیرید.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:09123456789"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md shadow-emerald-600/20"
            >
              <Phone className="w-4 h-4" />
              <span>تماس مستقیم: {toPersianDigits('09123456789')}</span>
            </a>
            <a
              href="#active-registrations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition"
            >
              <span>مشاهده ثبت‌نام‌های جاری</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: About Tosan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-base font-black text-white">کافی‌نت و پیشخوان توسن</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              مرکز تخصصی ارائه خدمات اینترنتی، ثبت‌نام آزمون‌های سراسری و استخدامی، اظهارنامه‌های مالیاتی، پیگیری امور انتظامی، خودرو و املاک با بیش از ۱۰ سال سابقه درخشان و مجوز رسمی اتحادیه.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-300 font-semibold text-[11px]">دارای پروانه کسب معتبر از اتاق اصناف</span>
            </div>
          </div>

          {/* Col 2: Contact & Working Hours */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white mb-3 border-r-2 border-blue-500 pr-2">
              اطلاعات تماس و نشانی
            </h4>
            <div className="flex items-start gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>تهران، میدان آزادی، بلوار آزادی، نبش کوچه شقایق، پلاک ۲۴، کافی‌نت توسن</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <span>تلفن دفتر: {toPersianDigits('021-66001234')}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="font-sans">tusanwebsite@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>شنبه تا چهارشنبه: ۸:۰۰ الی ۲۱:۰۰ | پنجشنبه: ۸:۰۰ الی ۱۸:۰۰</span>
            </div>
          </div>

          {/* Col 3: Quick Messengers */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white mb-3 border-r-2 border-cyan-500 pr-2">
              پشتیبانی و ارسال مدارک
            </h4>
            <p className="text-slate-400 text-xs">
              جهت سفارش غیرحضوری می‌توانید مدارک خود را به شناسه‌های زیر ارسال فرمایید:
            </p>
            <div className="space-y-1.5">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">پیام‌رسان ایتا (Eitaa):</span>
                <span className="font-mono text-cyan-400">@Tosan_Net</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">پیام‌رسان بله (Bale):</span>
                <span className="font-mono text-cyan-400">@Tosan_Services</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">تلگرام و واتساپ:</span>
                <span className="font-mono text-cyan-400">{toPersianDigits('09123456789')}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Trust Badges */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white mb-3 border-r-2 border-indigo-500 pr-2">
              نمادهای اعتماد و مجوزها
            </h4>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-center">
                <ShieldCheck className="w-8 h-8 text-cyan-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-300 font-bold block">پروانه کسب اتحادیه</span>
                <span className="text-[9px] text-slate-500">شماره ثبت معتبر</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-center">
                <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-300 font-bold block">امنیت حریم خصوصی</span>
                <span className="text-[9px] text-slate-500">امحای خودکار اطلاعات</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              اطلاعات شخصی و هویتی مشتریان پس از انجام ثبت‌نام به صورت محرمانه حفظ می‌گردد.
            </p>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            تمامی حقوق این وب‌سایت متعلق به پیشخوان خدمات الکترونیک و کافی‌نت توسن می‌باشد.
          </span>
          <span className="text-slate-600">
            طراحی اختصاصی ۱۴۰۵ • داده‌های آزمایشی آماده اتصال به دیتابیس
          </span>
        </div>
      </div>
    </footer>
  );
};
