import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateIranianNationalCode,
  calculateRegistrationProgress,
  calculateAge,
  toPersianDigits,
} from './tools.ts';

test('validateIranianNationalCode handles valid and invalid national codes', () => {
  // Test invalid length
  assert.equal(validateIranianNationalCode('123').isValid, false);
  
  // Test repetitive invalid digits
  assert.equal(validateIranianNationalCode('1111111111').isValid, false);
  assert.equal(validateIranianNationalCode('0000000000').isValid, false);

  // Test known valid national codes (standard algorithmic examples)
  // E.g. '0010350810' -> sum check
  // Let's compute a valid code:
  // prefix '008011459' -> digits: 0,0,8,0,1,1,4,5,9
  // sum: 0*10 + 0*9 + 8*8 + 0*7 + 1*6 + 1*5 + 4*4 + 5*3 + 9*2 = 64 + 6 + 5 + 16 + 15 + 18 = 124
  // 124 % 11 = 3 -> remainder >= 2 -> check digit = 11 - 3 = 8
  // So '0080114598' is valid.
  assert.equal(validateIranianNationalCode('0080114598').isValid, true);

  // And an altered check digit should fail
  assert.equal(validateIranianNationalCode('0080114597').isValid, false);

  // Persian digits input conversion should work
  assert.equal(validateIranianNationalCode('۰۰۸۰۱۱۴۵۹۸').isValid, true);
});

test('calculateRegistrationProgress calculates accurate timeline and percentages', () => {
  const start = '2026-10-01T00:00:00Z';
  const end = '2026-10-31T00:00:00Z';
  const mid = '2026-10-16T00:00:00Z';

  const midResult = calculateRegistrationProgress(start, end, mid);
  assert.equal(midResult.isExpired, false);
  assert.equal(midResult.isNotStarted, false);
  assert.equal(midResult.percentage, 50);
  assert.equal(midResult.daysRemaining, 15);

  // Test expired
  const expiredResult = calculateRegistrationProgress(start, end, '2026-11-05T00:00:00Z');
  assert.equal(expiredResult.isExpired, true);
  assert.equal(expiredResult.percentage, 100);
  assert.equal(expiredResult.daysRemaining, 0);

  // Test not started
  const beforeStart = calculateRegistrationProgress('2026-11-01T00:00:00Z', '2026-11-10T00:00:00Z', '2026-10-15T00:00:00Z');
  assert.equal(beforeStart.isNotStarted, true);
  assert.equal(beforeStart.percentage, 0);
});

test('calculateAge computes exact year, month, and day', () => {
  const age = calculateAge(1375, 4, 15, 1404, 7, 28);
  assert.equal(age.years, 29);
  assert.equal(age.months, 3);
  assert.equal(age.days, 13);
  assert.equal(age.isEligible(30), true);
  assert.equal(age.isEligible(28), false);
});

test('toPersianDigits converts digits properly', () => {
  assert.equal(toPersianDigits('2026-10-28'), '۲۰۲۶-۱۰-۲۸');
  assert.equal(toPersianDigits(1404), '۱۴۰۴');
});
