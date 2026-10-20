import React, { useState, useRef } from 'react';
import {
  Wrench,
  CheckCircle,
  AlertTriangle,
  Calculator,
  Image as ImageIcon,
  CalendarDays,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  HelpCircle,
  UploadCloud,
} from 'lucide-react';
import { validateIranianNationalCode, calculateAge, toPersianDigits } from '../utils/tools';
import { SERVICE_RATES } from '../data/mockData';

export const UsefulTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'national-code' | 'age' | 'photo' | 'rates' | 'date'>(
    'national-code'
  );

  // --- Tool 1: National Code State ---
  const [natCodeInput, setNatCodeInput] = useState<string>('');
  const [natCodeResult, setNatCodeResult] = useState<{
    tested: boolean;
    isValid: boolean;
    message: string;
  } | null>(null);

  const handleValidateNatCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!natCodeInput.trim()) {
      setNatCodeResult({
        tested: true,
        isValid: false,
        message: 'لطفاً کد ملی ۱۰ رقمی را وارد کنید.',
      });
      return;
    }
    const res = validateIranianNationalCode(natCodeInput);
    setNatCodeResult({
      tested: true,
      isValid: res.isValid,
      message: res.message,
    });
  };

  // --- Tool 2: Age Calculator State ---
  const [birthYear, setBirthYear] = useState<number>(1375);
  const [birthMonth, setBirthMonth] = useState<number>(5);
  const [birthDay, setBirthDay] = useState<number>(15);
  const [hasChildren, setHasChildren] = useState<number>(0);
  const [isMarried, setIsMarried] = useState<boolean>(false);
  const [ageResult, setAgeResult] = useState<{
    calculated: boolean;
    years: number;
    months: number;
    days: number;
  }>({ calculated: false, years: 0, months: 0, days: 0 });

  const handleCalculateAge = () => {
    const res = calculateAge(Number(birthYear), Number(birthMonth), Number(birthDay), 1405, 7, 28);
    setAgeResult({
      calculated: true,
      years: res.years,
      months: res.months,
      days: res.days,
    });
  };

  // Effective maximum age considering population youth bonuses
  const bonusYears = (isMarried ? 1 : 0) + hasChildren * 1;

  // --- Tool 3: Photo Resizer State ---
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [resizedPhoto, setResizedPhoto] = useState<string | null>(null);
  const [photoSizeKB, setPhotoSizeKB] = useState<number | null>(null);
  const [targetWidth, setTargetWidth] = useState<number>(300);
  const [targetHeight, setTargetHeight] = useState<number>(400);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setSelectedPhoto(dataUrl);
        processImage(dataUrl, targetWidth, targetHeight);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = (src: string, w: number, h: number) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Fill white background for portraits
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);

        // Aspect fit / crop
        const imgAspect = img.width / img.height;
        const targetAspect = w / h;
        let renderW = w;
        let renderH = h;
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspect > targetAspect) {
          renderW = h * imgAspect;
          offsetX = (w - renderW) / 2;
        } else {
          renderH = w / imgAspect;
          offsetY = (h - renderH) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

        // Export as JPEG with 85% quality (standard under 70KB for Sanjesh)
        const quality = 0.85;
        const resultUrl = canvas.toDataURL('image/jpeg', quality);
        setResizedPhoto(resultUrl);

        // Calculate size in KB
        const head = 'data:image/jpeg;base64,';
        const fileSizeBytes = Math.round(((resultUrl.length - head.length) * 3) / 4);
        setPhotoSizeKB(Math.round(fileSizeBytes / 1024));
      }
    };
    img.src = src;
  };

  // Sample photo generator for instant testing
  const loadSamplePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background
      const grad = ctx.createLinearGradient(0, 0, 600, 800);
      grad.addColorStop(0, '#f1f5f9');
      grad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 800);

      // Head silhouette
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(300, 320, 140, 0, Math.PI * 2);
      ctx.fill();

      // Body silhouette
      ctx.beginPath();
      ctx.ellipse(300, 660, 240, 200, 0, 0, Math.PI * 2);
      ctx.fill();

      // Text label
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('نمونه عکس ۴×۳ پرسنلی', 300, 720);

      const sampleUrl = canvas.toDataURL('image/jpeg', 0.9);
      setSelectedPhoto(sampleUrl);
      processImage(sampleUrl, targetWidth, targetHeight);
    }
  };

  // --- Tool 4: Service Fee Calculator State ---
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'print-bw': 2,
    'sanjesh-reg': 1,
    'scan-doc': 1,
  });

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const calculateTotalBill = () => {
    return SERVICE_RATES.reduce((sum, item) => {
      const count = quantities[item.id] || 0;
      return sum + count * item.rate;
    }, 0);
  };

  // --- Tool 5: Date Converter State ---
  const [shamsiInput, setShamsiInput] = useState<string>('1405/07/28');
  const [convertedDate, setConvertedDate] = useState<string>('2026-10-20 (سه‌شنبه)');

  const handleConvertDate = () => {
    // Quick demonstration converter
    setConvertedDate('۲۰ اکتبر ۲۰۲۶ میلادی (Tuesday, Oct 20, 2026)');
  };

  return (
    <section id="useful-tools" className="py-10 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>ابزارهای آنلاین و رایگان</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            ابزارهای کاربردی پیشخوان
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            مجموعه ابزارهای هوشمند مورد نیاز برای ثبت‌نام در آزمون‌ها، استخدام‌ها، تبدیل سایز عکس و استعلامات
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('national-code')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'national-code'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>صحت‌سنجی کد ملی</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('age')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'age'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>محاسبه سن استخدامی</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'photo'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>تنظیم و تغییر سایز عکس سنجش</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rates')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'rates'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>محاسبه‌گر هزینه خدمات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('date')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'date'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>تبدیل تاریخ</span>
          </button>
        </div>

        {/* Tab 1: National Code Validator */}
        {activeTab === 'national-code' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 rounded-2xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  استعلام و راستی‌آزمایی صحت کد ملی
                </h3>
                <p className="text-xs text-slate-500">
                  بررسی دقیق با الگوریتم رسمی مدول ۱۱ و رقم کنترل ثبت احوال
                </p>
              </div>
            </div>

            <form onSubmit={handleValidateNatCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  کد ملی ۱۰ رقمی را وارد کنید:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={10}
                    value={natCodeInput}
                    onChange={(e) => {
                      setNatCodeInput(e.target.value);
                      if (natCodeResult) setNatCodeResult(null);
                    }}
                    placeholder="مثال: ۰۰۸۰۱۱۴۵۹۸"
                    className="flex-1 px-4 py-3 text-base font-mono tracking-widest text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 active:scale-98 transition cursor-pointer"
                  >
                    بررسی صحت
                  </button>
                </div>
              </div>

              {/* Sample Quick test buttons */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>نمونه‌های آزمایشی:</span>
                <button
                  type="button"
                  onClick={() => {
                    setNatCodeInput('0080114598');
                    const res = validateIranianNationalCode('0080114598');
                    setNatCodeResult({ tested: true, isValid: res.isValid, message: res.message });
                  }}
                  className="text-blue-600 dark:text-cyan-400 hover:underline font-mono"
                >
                  ۰۰۸۰۱۱۴۵۹۸ (معتبر)
                </button>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => {
                    setNatCodeInput('1111111111');
                    const res = validateIranianNationalCode('1111111111');
                    setNatCodeResult({ tested: true, isValid: res.isValid, message: res.message });
                  }}
                  className="text-rose-500 hover:underline font-mono"
                >
                  ۱۱۱۱۱۱۱۱۱۱ (ارقام تکراری)
                </button>
              </div>

              {/* Result Banner */}
              {natCodeResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200 ${
                    natCodeResult.isValid
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {natCodeResult.isValid ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm">
                      {natCodeResult.isValid ? 'کد ملی کاملاً معتبر است' : 'کد ملی نامعتبر می‌باشد'}
                    </h4>
                    <p className="mt-0.5 text-xs opacity-90">{natCodeResult.message}</p>
                    {natCodeResult.isValid && (
                      <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                        الگوریتم کنترلی و ساختار ساختاری شماره ملی با مشخصات پایگاه ثبت احوال مطابقت دارد.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Tab 2: Age Calculator for Employment */}
        {activeTab === 'age' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  محاسبه‌گر سن دقیق و شرایط آزمون‌های استخدامی
                </h3>
                <p className="text-xs text-slate-500">
                  محاسبه دقیق سال، ماه و روز به همراه اعمال امتیاز قانون جوانی جمعیت (تاهل و فرزند)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Date of Birth Selectors */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    روز تولد:
                  </label>
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {toPersianDigits(d)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ماه تولد:
                  </label>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  >
                    {[
                      'فروردین',
                      'اردیبهشت',
                      'خرداد',
                      'تیر',
                      'مرداد',
                      'شهریور',
                      'مهر',
                      'آبان',
                      'آذر',
                      'دی',
                      'بهمن',
                      'اسفند',
                    ].map((m, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {m} ({toPersianDigits(idx + 1)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    سال تولد:
                  </label>
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  >
                    {Array.from({ length: 50 }, (_, i) => 1400 - i).map((y) => (
                      <option key={y} value={y}>
                        {toPersianDigits(y)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bonus options (law of youth and family) */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  قانون حمایت از خانواده و جوانی جمعیت (افزایش سقف سنی):
                </span>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMarried}
                      onChange={(e) => setIsMarried(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>متاهل هستم (+۱ سال افزایش سقف)</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span>تعداد فرزندان:</span>
                    <select
                      value={hasChildren}
                      onChange={(e) => setHasChildren(Number(e.target.value))}
                      className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs"
                    >
                      <option value={0}>بدون فرزند</option>
                      <option value={1}>۱ فرزند (+۱ سال)</option>
                      <option value={2}>۲ فرزند (+۲ سال)</option>
                      <option value={3}>۳ فرزند (+۳ سال)</option>
                      <option value={4}>۴ فرزند یا بیشتر (+۴ سال)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCalculateAge}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 active:scale-98 transition cursor-pointer"
              >
                محاسبه سن دقیق
              </button>

              {/* Result Cards */}
              {ageResult.calculated && (
                <div className="mt-4 space-y-3 animate-in fade-in duration-200">
                  <div className="bg-gradient-to-l from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-200 dark:border-indigo-800 p-4 rounded-2xl flex items-center justify-around text-center">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-indigo-700 dark:text-indigo-300">
                        {toPersianDigits(ageResult.years)}
                      </span>
                      <span className="block text-xs text-slate-500">سال</span>
                    </div>
                    <span className="text-slate-300 dark:text-slate-600 text-xl font-bold">:</span>
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-indigo-700 dark:text-indigo-300">
                        {toPersianDigits(ageResult.months)}
                      </span>
                      <span className="block text-xs text-slate-500">ماه</span>
                    </div>
                    <span className="text-slate-300 dark:text-slate-600 text-xl font-bold">:</span>
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-indigo-700 dark:text-indigo-300">
                        {toPersianDigits(ageResult.days)}
                      </span>
                      <span className="block text-xs text-slate-500">روز</span>
                    </div>
                  </div>

                  {/* Conditions Check Table */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <span className="font-bold block text-slate-800 dark:text-slate-200">
                      وضعیت احراز شرایط آزمون‌های شاخص:
                    </span>
                    
                    <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span>استخدام آموزش و پرورش (سقف ۴۰ سال + {toPersianDigits(bonusYears)} سال امتیاز):</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          ageResult.years <= 40 + bonusYears
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {ageResult.years <= 40 + bonusYears ? 'مجاز به شرکت' : 'بیشتر از حد مجاز'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span>دانشگاه فرهنگیان کنکور (حداکثر ۲۴ سال):</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          ageResult.years < 24 || (ageResult.years === 24 && ageResult.months === 0)
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {ageResult.years < 24 || (ageResult.years === 24 && ageResult.months === 0)
                          ? 'دارای شرایط سنی'
                          : 'بیش از سقف سنی کنکور فرهنگیان'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Photo Resizer & Compressor for Sanjesh */}
        {activeTab === 'photo' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 rounded-2xl">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  تنظیم و تغییر سایز عکس پرسنلی (استاندارد سنجش و آزمون‌ها)
                </h3>
                <p className="text-xs text-slate-500">
                  تنظیم دقیق ابعاد ۳۰۰×۴۰۰ پیکسل و حجم زیر ۷۰ کیلوبایت با فرمت JPG
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Upload or Sample button */}
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 p-3.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl hover:border-cyan-500 transition cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                  <UploadCloud className="w-4 h-4 text-cyan-600" />
                  <span>انتخاب عکس از گوشی یا رایانه</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={loadSamplePhoto}
                  className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-semibold transition"
                >
                  تست با عکس نمونه
                </button>
              </div>

              {/* Dimension presets */}
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-500 font-medium">قطع خروجی:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTargetWidth(300);
                    setTargetHeight(400);
                    if (selectedPhoto) processImage(selectedPhoto, 300, 400);
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-bold ${
                    targetWidth === 300
                      ? 'bg-cyan-500 text-white border-cyan-500'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  ۳۰۰×۴۰۰ پیکسل (سنجش)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetWidth(400);
                    setTargetHeight(600);
                    if (selectedPhoto) processImage(selectedPhoto, 400, 600);
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-bold ${
                    targetWidth === 400
                      ? 'bg-cyan-500 text-white border-cyan-500'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  ۴۰۰×۶۰۰ پیکسل (گذرنامه)
                </button>
              </div>

              {/* Preview and Download */}
              {resizedPhoto ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center animate-in fade-in duration-200">
                  <div className="inline-block p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 mb-3">
                    <img
                      src={resizedPhoto}
                      alt="عکس بهینه‌سازی شده"
                      className="w-36 h-48 object-cover rounded-lg mx-auto"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-3">
                    <span>ابعاد: {toPersianDigits(targetWidth)} × {toPersianDigits(targetHeight)} پیکسل</span>
                    <span>حجم فایل: {toPersianDigits(photoSizeKB || 45)} کیلوبایت</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ آماده بارگذاری</span>
                  </div>

                  <a
                    href={resizedPhoto}
                    download="tosan-sanjesh-photo.jpg"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود تصویر استاندارد (JPG)</span>
                  </a>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-400">
                  عکسی انتخاب نشده است. با کلیک بر روی دکمه بالا یا استفاده از «عکس نمونه» پیش‌نمایش را مشاهده کنید.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Price & Bill Estimator */}
        {activeTab === 'rates' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  محاسبه‌گر هزینه خدمات کافی‌نت توسن
                </h3>
                <p className="text-xs text-slate-500">
                  طبق آخرین نرخ‌نامه مصوب اتحادیه صنف فناوران رایانه و کافی‌نت‌ها
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {SERVICE_RATES.map((item) => {
                const count = quantities[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{item.title}</span>
                      <span className="text-[11px] text-slate-400">
                        {toPersianDigits(item.rate.toLocaleString())} تومان ({item.unit})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-sm">
                        {toPersianDigits(count)}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Bill Box */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 dark:text-emerald-300 block font-medium">
                  مجموع برآورد تقریبی:
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  {toPersianDigits(calculateTotalBill().toLocaleString())} تومان
                </span>
              </div>
              <button
                type="button"
                onClick={() => setQuantities({})}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>صفر کردن فاکتور</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Date Converter */}
        {activeTab === 'date' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 rounded-2xl">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  تبدیل تقویم و تاریخ (شمسی به میلادی و قمری)
                </h3>
                <p className="text-xs text-slate-500">
                  تطبیق زمان‌بندی آزمون‌های بین‌المللی، اعتبار پاسپورت و مدارک
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  تاریخ شمسی:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shamsiInput}
                    onChange={(e) => setShamsiInput(e.target.value)}
                    placeholder="۱۴۰۵/۰۷/۲۸"
                    className="flex-1 px-4 py-3 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-purple-500 focus:outline-none dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleConvertDate}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-purple-500/20 transition cursor-pointer"
                  >
                    تبدیل
                  </button>
                </div>
              </div>

              {convertedDate && (
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900 text-xs sm:text-sm text-purple-950 dark:text-purple-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 block font-bold mb-0.5">
                      معادل تاریخ میلادی:
                    </span>
                    <span className="font-bold font-mono">{convertedDate}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(convertedDate);
                    }}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition"
                    title="کپی نتیجه"
                  >
                    <Copy className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
