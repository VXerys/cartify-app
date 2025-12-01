/** @type {import('tailwindcss').Config} */
const { colors, typography, spacing, radius } = require('./src/theme/tokens');

module.exports = {
  // NOTE: Adjust content paths to match your actual project structure
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Semantic Mapping
        primary: {
          DEFAULT: colors.primary.DEFAULT,
          light: colors.primary.light,
          dark: colors.primary.dark,
          inverse: colors.primary.inverse,
        },
        background: {
          light: colors.background.light,
          dark: colors.background.dark,
          surface: colors.background.surface,
          surfaceDark: colors.background.surfaceDark,
        },
        text: {
          primary: colors.text.primary,
          primaryDark: colors.text.primaryDark,
          secondary: colors.text.secondary,
          secondaryDark: colors.text.secondaryDark,
          muted: colors.text.muted,
        },
        status: {
          danger: colors.status.danger,
          success: colors.status.success,
          warning: colors.status.warning,
          info: colors.status.info,
        },
        border: {
          light: colors.border.light,
          dark: colors.border.dark,
        },
        // Raw Palette Access (e.g., 'bg-teal-400')
        teal: colors.teal,
        slate: colors.slate,
        red: colors.red,
        green: colors.green,
      },
      fontFamily: {
        sans: typography.fontFamily.sans,
        serif: typography.fontFamily.serif,
        mono: typography.fontFamily.mono,
      },
      fontSize: {
        xs: [typography.fontSize.xs, { lineHeight: typography.fontSize.xs * 1.5 }],
        sm: [typography.fontSize.sm, { lineHeight: typography.fontSize.sm * 1.5 }],
        base: [typography.fontSize.base, { lineHeight: typography.fontSize.base * 1.5 }],
        lg: [typography.fontSize.lg, { lineHeight: typography.fontSize.lg * 1.5 }],
        xl: [typography.fontSize.xl, { lineHeight: typography.fontSize.xl * 1.25 }],
        '2xl': [typography.fontSize['2xl'], { lineHeight: typography.fontSize['2xl'] * 1.25 }],
        '3xl': [typography.fontSize['3xl'], { lineHeight: typography.fontSize['3xl'] * 1.25 }],
        '4xl': [typography.fontSize['4xl'], { lineHeight: typography.fontSize['4xl'] * 1.25 }],
      },
      spacing: {
        xs: spacing.xs,
        sm: spacing.sm,
        md: spacing.md,
        lg: spacing.lg,
        xl: spacing.xl,
        '2xl': spacing['2xl'],
        '3xl': spacing['3xl'],
      },
      borderRadius: {
        none: radius.none,
        sm: radius.sm,
        md: radius.md,
        lg: radius.lg,
        xl: radius.xl,
        full: radius.full,
      },
    },
  },
  plugins: [],
};
