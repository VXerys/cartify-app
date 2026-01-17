/**
 * Password Strength Tests
 *
 * Unit tests for the password strength calculation logic.
 */

import { calculatePasswordStrength } from '../passwordStrength';

describe('Password Strength Calculator', () => {
  // ============================================
  // Weak Passwords
  // ============================================
  describe('weak passwords', () => {
    it('should rate empty password as 0 strength', () => {
      const result = calculatePasswordStrength('');
      expect(result.score).toBe(0);
      expect(result.label).toBe('Too short');
    });

    it('should rate very short password as weak', () => {
      const result = calculatePasswordStrength('ab');
      expect(result.score).toBeLessThanOrEqual(1);
      expect(result.label).toBe('Weak');
    });

    it('should rate simple lowercase password as weak', () => {
      const result = calculatePasswordStrength('password');
      expect(result.score).toBeLessThan(3);
    });
  });

  // ============================================
  // Medium Strength Passwords
  // ============================================
  describe('medium strength passwords', () => {
    it('should rate password with letters and numbers as medium', () => {
      const result = calculatePasswordStrength('password1');
      expect(result.score).toBeGreaterThanOrEqual(2);
      expect(result.score).toBeLessThanOrEqual(3);
    });

    it('should rate password with mixed case as medium', () => {
      const result = calculatePasswordStrength('Password');
      expect(result.score).toBeGreaterThanOrEqual(2);
    });
  });

  // ============================================
  // Strong Passwords
  // ============================================
  describe('strong passwords', () => {
    it('should rate password with all criteria as strong', () => {
      const result = calculatePasswordStrength('MyP@ssw0rd!');
      expect(result.score).toBeGreaterThanOrEqual(4);
      expect(['Strong', 'Very Strong']).toContain(result.label);
    });

    it('should rate long complex password as very strong', () => {
      const result = calculatePasswordStrength('MyV3ryStr0ng!P@ssw0rd123');
      expect(result.score).toBe(5);
      expect(result.label).toBe('Very Strong');
    });
  });

  // ============================================
  // Requirements Checking
  // ============================================
  describe('requirements validation', () => {
    it('should detect length requirement', () => {
      const shortResult = calculatePasswordStrength('Ab1!');
      expect(shortResult.requirements.minLength).toBe(false);

      const longResult = calculatePasswordStrength('Abcdefg1!');
      expect(longResult.requirements.minLength).toBe(true);
    });

    it('should detect uppercase requirement', () => {
      const noUpperResult = calculatePasswordStrength('abcdefg1!');
      expect(noUpperResult.requirements.hasUppercase).toBe(false);

      const hasUpperResult = calculatePasswordStrength('Abcdefg1!');
      expect(hasUpperResult.requirements.hasUppercase).toBe(true);
    });

    it('should detect lowercase requirement', () => {
      const noLowerResult = calculatePasswordStrength('ABCDEFG1!');
      expect(noLowerResult.requirements.hasLowercase).toBe(false);

      const hasLowerResult = calculatePasswordStrength('Abcdefg1!');
      expect(hasLowerResult.requirements.hasLowercase).toBe(true);
    });

    it('should detect number requirement', () => {
      const noNumberResult = calculatePasswordStrength('Abcdefgh!');
      expect(noNumberResult.requirements.hasNumber).toBe(false);

      const hasNumberResult = calculatePasswordStrength('Abcdefg1!');
      expect(hasNumberResult.requirements.hasNumber).toBe(true);
    });

    it('should detect special character requirement', () => {
      const noSpecialResult = calculatePasswordStrength('Abcdefg1');
      expect(noSpecialResult.requirements.hasSpecial).toBe(false);

      const hasSpecialResult = calculatePasswordStrength('Abcdefg1!');
      expect(hasSpecialResult.requirements.hasSpecial).toBe(true);
    });
  });

  // ============================================
  // Color Coding
  // ============================================
  describe('color coding', () => {
    it('should return red color for weak passwords', () => {
      const result = calculatePasswordStrength('abc');
      expect(result.color).toBe('#EF4444');
    });

    it('should return orange color for fair passwords', () => {
      const result = calculatePasswordStrength('abcdefgh');
      expect(result.color).toBe('#F59E0B');
    });

    it('should return green color for strong passwords', () => {
      const result = calculatePasswordStrength('MyStr0ng!Pass');
      expect(['#10B981', '#059669']).toContain(result.color);
    });
  });

  // ============================================
  // Edge Cases
  // ============================================
  describe('edge cases', () => {
    it('should handle special characters correctly', () => {
      const result = calculatePasswordStrength('!@#$%^&*');
      expect(result.requirements.hasSpecial).toBe(true);
    });

    it('should handle unicode characters', () => {
      const result = calculatePasswordStrength('Pässwörd123!');
      expect(result.score).toBeGreaterThan(0);
    });

    it('should handle very long passwords', () => {
      const longPassword = 'A1!' + 'a'.repeat(100);
      const result = calculatePasswordStrength(longPassword);
      expect(result.requirements.minLength).toBe(true);
    });
  });
});
