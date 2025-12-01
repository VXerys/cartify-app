/**
 * Cartify Design System - Typography
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tokens = require('./tokens');

export const typography = {
  ...tokens.typography,
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;
