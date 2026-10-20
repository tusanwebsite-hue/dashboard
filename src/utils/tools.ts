/**
 * Pure utility functions for Tosan Internet Cafe & E-Services portal:
 * - Iranian National Code (کد ملی) modulo 11 validation
 * - Shamsi / Jalali calendar date calculations
 * - Registration timeline & deadline countdowns
 * - Exact age calculation for job tests & university admissions
 */

// Iranian National Code Validator (معتبرسازی کد ملی با الگوریتم کنترلی ده رقمی)
export function validateIranianNationalCode(code: string): {
  isValid: boolean;
  message: string;
} {
  const cleaned = code.trim().replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
  
  if (!cleaned) {
    return { isValid: false, message: 'لطفاً کد ملی را وارد نمایید.' };
  }
  
  if (!/^\d{10}$/.test(cleaned)) {
    return { isValid: false, message: 'کد ملی باید دقیقاً ۱۰ رقم باشد.' };
  }

  // Reject all repeated digits like 0000000000, 1111111111, etc.
  const allIdentical = /^(\d)\1{9}$/.test(cleaned);
  if (allIdentical) {
    return { isValid: false, message: 'کد ملی وارد شده نامعتبر است (ارقام یکسان).' };
  }

  const digits = cleaned.split('').map(Number);
  const checkDigit = digits[9];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }

  const remainder = sum % 11;
  const isValid =
    (remainder < 2 && checkDigit === remainder) ||
    (remainder >= 2 && checkDigit === 11 - remainder);

  if (isValid) {
    return { isValid: true, message: 'کد ملی معتبر و صحیح است.' };
  } else {
    return { isValid: false, message: 'رقم کنترلی کد ملی همخوانی ندارد (نامعتبر).' };
  }
}

// Registration Timeline Progress Calculator
export interface ProgressResult {
  percentage: number;
  isExpired: boolean;
  isNotStarted: boolean;
  daysRemaining: number;
  totalDays: number;
  statusText: string;
  badgeColor: 'emerald' | 'amber' | 'red' | 'gray';
}

export function calculateRegistrationProgress(
  startDateStr: string,
  endDateStr: string,
  currentDateStr?: string
): ProgressResult {
  const start = new Date(startDateStr).getTime();
  const end = new Date(endDateStr).getTime();
  const current = currentDateStr ? new Date(currentDateStr).getTime() : Date.now();

  if (isNaN(start) || isNaN(end)) {
    return {
      percentage: 0,
      isExpired: false,
      isNotStarted: false,
      daysRemaining: 0,
      totalDays: 0,
      statusText: 'تاریخ نامعتبر',
      badgeColor: 'gray',
    };
  }

  const totalDuration = end - start;
  const totalDays = Math.max(1, Math.round(totalDuration / (1000 * 60 * 60 * 24)));

  if (current < start) {
    const daysUntilStart = Math.ceil((start - current) / (1000 * 60 * 60 * 24));
    return {
      percentage: 0,
      isExpired: false,
      isNotStarted: true,
      daysRemaining: daysUntilStart,
      totalDays,
      statusText: `${daysUntilStart} روز تا شروع`,
      badgeColor: 'gray',
    };
  }

  if (current >= end) {
    return {
      percentage: 100,
      isExpired: true,
      isNotStarted: false,
      daysRemaining: 0,
      totalDays,
      statusText: 'مهلت به پایان رسیده',
      badgeColor: 'red',
    };
  }

  const elapsed = current - start;
  const rawPercentage = (elapsed / totalDuration) * 100;
  const percentage = Math.min(100, Math.max(0, Math.round(rawPercentage)));
  const daysRemaining = Math.max(0, Math.ceil((end - current) / (1000 * 60 * 60 * 24)));

  let statusText = '';
  let badgeColor: 'emerald' | 'amber' | 'red' = 'emerald';

  if (daysRemaining <= 2) {
    statusText = daysRemaining === 1 ? 'فوری: آخرین روز مهلت' : 'فوری: ۲ روز باقی‌مانده';
    badgeColor = 'red';
  } else if (daysRemaining <= 5) {
    statusText = `${daysRemaining} روز باقی‌مانده`;
    badgeColor = 'amber';
  } else {
    statusText = `${daysRemaining} روز باقی‌مانده`;
    badgeColor = 'emerald';
  }

  return {
    percentage,
    isExpired: false,
    isNotStarted: false,
    daysRemaining,
    totalDays,
    statusText,
    badgeColor,
  };
}

// Exact Age Calculator for Employment & Exam Conditions
export function calculateAge(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  refYear: number = 1404,
  refMonth: number = 7,
  refDay: number = 28
): { years: number; months: number; days: number; isEligible: (maxAge: number) => boolean } {
  let years = refYear - birthYear;
  let months = refMonth - birthMonth;
  let days = refDay - birthDay;

  if (days < 0) {
    months -= 1;
    // Assuming 30 days per Shamsi month for estimation
    days += (birthMonth <= 6 ? 31 : 30);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    isEligible: (maxAge: number) => years < maxAge || (years === maxAge && months === 0 && days === 0),
  };
}

// Convert English numbers to Persian digits for display
export function toPersianDigits(n: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}
