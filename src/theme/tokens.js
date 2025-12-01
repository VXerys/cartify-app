/**
 * Raw Theme Tokens (CommonJS)
 * This file is shared between tailwind.config.js (Node) and the App (React Native/TS).
 */

const palette = {
  teal: {
    50: '#F2FBFB',
    100: '#E6F7F6',
    200: '#C0EBE9',
    300: '#9ADFDC',
    400: '#81BFBC', // DEFAULT BRAND COLOR
    500: '#5FA8A5',
    600: '#468C89',
    700: '#32706E',
    800: '#235553',
    900: '#183D3C',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  red: {
    400: '#F87171',
    500: '#EF4444',
  },
  green: {
    400: '#34D399',
    500: '#10B981',
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },
};

const colors = {
  primary: {
    DEFAULT: palette.teal[400],
    light: palette.teal[200],
    dark: palette.teal[600],
    inverse: palette.neutral.white,
  },
  background: {
    light: palette.slate[50],
    dark: palette.slate[900],
    surface: palette.neutral.white,
    surfaceDark: palette.slate[800],
  },
  text: {
    primary: palette.slate[900],
    primaryDark: palette.slate[50],
    secondary: palette.slate[500],
    secondaryDark: palette.slate[400],
    muted: palette.slate[300],
  },
  status: {
    danger: palette.red[400],
    success: palette.green[400],
    warning: '#FBBF24',
    info: '#60A5FA',
  },
  border: {
    light: palette.slate[200],
    dark: palette.slate[700],
  },
  ...palette,
};

const typography = {
  fontFamily: {
    sans: ['System', 'Roboto', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['Menlo', 'monospace'],
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
  },
  // Weights represented as strings for RN compatibility, but check if Tailwind needs numbers/strings.
  // Tailwind default theme uses strings like '400'.
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

const radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

const iconSizes = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

module.exports = {
  palette,
  colors,
  typography,
  spacing,
  radius,
  iconSizes,
};
