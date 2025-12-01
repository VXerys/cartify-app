/**
 * Cartify Design System - Layout Constants
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tokens = require('./tokens');

export const spacing = tokens.spacing as typeof tokens.spacing;
export const radius = tokens.radius as typeof tokens.radius;
export const iconSizes = tokens.iconSizes as typeof tokens.iconSizes;

export const layout = {
  spacing,
  radius,
  iconSizes,
} as const;
