import React, { useState } from 'react';
import {
  X,
  Send,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  Printer,
  Copy,
  Check,
  Building,
} from 'lucide-react';
import { RegistrationItem } from '../data/mockData';
import { validateIranianNationalCode, toPersianDigits } from '../utils/tools';

interface ServiceRequestModalProps {
  registration: RegistrationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  registration,
  isOpen,
  onClose,
}) => {
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [nationalCode, setNationalCode] = useState<string>('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [notes, setNotes] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedTrackingCode, setSubmittedTrackingCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).map((f) => ({
        name: f.name,
        size: `${Math.round(f.size / 1024)} کیلوبایت`,
      }));
      setUploadedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      newErrors.fullName = 'لطفاً نام و نام خانوادگی خود را کامل وارد نمایید.';
    }

    const cleanPhone = phone.trim().replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
    if (!cleanPhone || !/^09\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'شماره تلفن معتبر نیست (باید ۱۱ رقم و با ۰۹ آغاز شود).';
    }

    if (nationalCode) {
      const natCheck = validateIranianNationalCode(nationalCode);
      if (!natCheck.isValid) {
        newErrors.nationalCode = natCheck.message;
      }
    } else {
      newErrors.nationalCode = 'کد ملی جهت احراز هویت ثبت‌نام الزامی است.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // Generate tracking code
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `TSN-1405-${randomNum}`;
    setSubmittedTrackingCode(trackingCode);
  };

  const handleCopyTrackingCode = () => {
    if (submittedTrackingCode) {
      navigator.clipboard.writeText(submittedTrackingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setFullName('');
    setPhone('');
    setNationalCode('');
    setNotes('');
    setUploadedFiles([]);
    setErrors({});
    setSubmittedTrackingCode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          aria-label="بستن فرم درخواست"
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedTrackingCode ? (
          /* Success Screen */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              درخواست شما با موفقیت ثبت شد
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
              کارشناسان کافی‌نت توسن مدارک و اطلاعات شما را بررسی کرده و ظرف کمتر از یک ساعت جهت تایید نهایی و انجام ثبت‌نام با شما تماس خواهند گرفت.
            </p>

            {/* Tracking Code Box */}
            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 max-w-sm mx-auto mb-6 text-center">
              <span className="text-xs text-slate-400 block mb-1">کد پیگیری اختصاصی:</span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-mono font-black text-blue-600 dark:text-cyan-400 tracking-wider">
                  {submittedTrackingCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTrackingCode}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition"
                  title="کپی کد پیگیری"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Summary Info */}
            <div className="bg-blue-50/60 dark:bg-blue-950/30 rounded-xl p-3.5 text-xs text-right space-y-1.5 border border-blue-100 dark:border-blue-900/40 mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>متقاضی:</span>
                <span className="font-bold text-slate-900 dark:text-white">{fullName}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>خدمت درخواستی:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {registration ? registration.title : 'خدمات عمومی کافی‌نت توسن'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>شماره تماس:</span>
                <span className="font-mono text-slate-900 dark:text-white">{toPersianDigits(phone)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ رسید پیگیری</span>
              </button>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
              >
                بستن و بازگشت
              </button>
            </div>
          </div>
        ) : (
          /* Request Form */
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h3 id="service-modal-title" className="text-lg font-black text-slate-900 dark:text-white">
                  درخواست خدمات کافی‌نت توسن
                </h3>
                <p className="text-xs text-slate-500">
                  انجام غیرحضوری، دقیق و سریع امور اینترنتی و ثبت‌نام‌ها
                </p>
              </div>
            </div>

            {registration && (
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">عنوان ثبت‌نام:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{registration.title}</span>
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block">هزینه تقریبی:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {registration.estimatedFee}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نام و نام خانوادگی متقاضی <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: علی رضایی"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none dark:text-white"
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* National Code & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    کد ملی ۱۰ رقمی <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={nationalCode}
                    onChange={(e) => setNationalCode(e.target.value)}
                    placeholder="۰۰۸۰۱۱۴۵۹۸"
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none dark:text-white"
                  />
                  {errors.nationalCode && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.nationalCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شماره تلفن همراه <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={11}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none dark:text-white"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Priority Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  اولویت انجام کار:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs cursor-pointer transition ${
                      priority === 'normal'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value="normal"
                      checked={priority === 'normal'}
                      onChange={() => setPriority('normal')}
                      className="text-blue-600"
                    />
                    <span>انجام در روال عادی (ظرف ۲ تا ۴ ساعت)</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs cursor-pointer transition ${
                      priority === 'urgent'
                        ? 'border-rose-600 bg-rose-50/50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value="urgent"
                      checked={priority === 'urgent'}
                      onChange={() => setPriority('urgent')}
                      className="text-rose-600"
                    />
                    <span className="font-bold">فوری / آخرین روز مهلت (زیر ۳۰ دقیقه)</span>
                  </label>
                </div>
              </div>

              {/* Upload Documents (Simulated file attachment) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  پیوست مدارک و تصاویر (اختیاری):
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-blue-500 transition cursor-pointer relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    کلیک کنید یا مدارک (عکس پرسنلی، کارت ملی، مدرک تحصیلی) را به اینجا بکشید
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    فرمت‌های JPG, PNG, PDF تا سقف ۱۰ مگابایت
                  </span>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.map((file, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-center justify-between text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300"
                      >
                        <span className="truncate max-w-[200px]">{file.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{file.size}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(fIdx)}
                            className="text-red-500 hover:text-red-700 p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  توضیحات تکمیلی یا درخواست خاص:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="نکات خاص، انتخاب کدرشته‌ها، اولویت شعب بانکی یا هر توضیح ضروری دیگر..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none dark:text-white resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-98 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>ثبت و دریافت کد پیگیری</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
