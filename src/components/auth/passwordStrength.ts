import { PasswordStrengthResult } from './RegisterScreen.types';

export const calculatePasswordStrength = (password: string): PasswordStrengthResult => {
  if (!password) {
    return {
      strength: 'weak',
      score: 0,
      label: 'Too short',
      color: '#EF4444',
      requirements: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
      },
    };
  }

  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let label = 'Weak';
  let color = '#EF4444';
  const score = metRequirements;

  if (metRequirements >= 4) {
    strength = 'strong';
    color = '#10B981';
    label = metRequirements === 5 ? 'Very Strong' : 'Strong';
  } else if (metRequirements >= 2) {
    strength = 'medium';
    label = 'Medium';
    color = '#F59E0B';
  }

  return { strength, score, label, color, requirements };
};
