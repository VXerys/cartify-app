/**
 * Auth Validation Tests
 *
 * Unit tests for authentication validation helpers.
 * These are pure functions that validate user input.
 */

import { validateEmail, validateFullName, validatePassword } from '../auth';

describe('Auth Validation Helpers', () => {
  // ============================================
  // validateEmail Tests
  // ============================================
  describe('validateEmail', () => {
    describe('valid emails', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user@subdomain.example.com',
        'user123@example.co.id',
        'test@test.org',
        'a@b.co',
      ];

      test.each(validEmails)('should return true for valid email: %s', (email) => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    describe('invalid emails', () => {
      const invalidEmails = [
        '',
        ' ',
        'invalid',
        'invalid@',
        '@example.com',
        'user@.com',
        'user@example',
        'user @example.com',
        'user@ example.com',
        'user@example .com',
        'user@@example.com',
      ];

      test.each(invalidEmails)('should return false for invalid email: "%s"', (email) => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  // ============================================
  // validatePassword Tests
  // ============================================
  describe('validatePassword', () => {
    describe('valid passwords', () => {
      const validPasswords = [
        'Password1',
        'MySecure123',
        'Test1234',
        'AbCdEf12',
        'StrongP@ss1',
        'ValidPassword123',
      ];

      test.each(validPasswords)('should validate password: %s', (password) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe('invalid passwords', () => {
      it('should fail for password shorter than 8 characters', () => {
        const result = validatePassword('Pass1');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Password must be at least 8 characters');
      });

      it('should fail for password without uppercase letter', () => {
        const result = validatePassword('password123');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Password must contain at least one uppercase letter');
      });

      it('should fail for password without lowercase letter', () => {
        const result = validatePassword('PASSWORD123');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Password must contain at least one lowercase letter');
      });

      it('should fail for password without number', () => {
        const result = validatePassword('PasswordOnly');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Password must contain at least one number');
      });

      it('should return multiple errors for password failing all criteria', () => {
        const result = validatePassword('abc');
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('should handle empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle exactly 8 character password', () => {
      const result = validatePassword('Abcdefg1');
      expect(result.isValid).toBe(true);
    });
  });

  // ============================================
  // validateFullName Tests
  // ============================================
  describe('validateFullName', () => {
    describe('valid names', () => {
      const validNames = [
        'John Doe',
        'Jo',
        'Alice',
        'Bob Smith Jr',
        'María García',
        'أحمد',
        '田中太郎',
      ];

      test.each(validNames)('should return true for valid name: "%s"', (name) => {
        expect(validateFullName(name)).toBe(true);
      });
    });

    describe('invalid names', () => {
      const invalidNames = [
        '',
        ' ',
        'A',
        '  ',
      ];

      test.each(invalidNames)('should return false for invalid name: "%s"', (name) => {
        expect(validateFullName(name)).toBe(false);
      });
    });

    it('should trim whitespace before validation', () => {
      expect(validateFullName('  Jo  ')).toBe(true);
      expect(validateFullName('   A   ')).toBe(false);
    });
  });
});
