// Types and interfaces for RegisterScreen

export interface RegisterScreenProps {
  onRegister: (fullName: string, email: string, password: string) => void;
  onGoogleRegister: () => void;
  onLogin: () => void;
  isLoading?: boolean;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// Password strength types
export type PasswordStrength = 'weak' | 'medium' | 'strong';

export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number;
  label: string;
  color: string;
  requirements: PasswordRequirements;
}
