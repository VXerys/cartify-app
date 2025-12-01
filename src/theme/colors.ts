/**
 * Cartify Design System - Color Palette
 * Re-exports tokens with Typescript definitions.
 */

// We use require here to ensure we get the exact runtime object as the config,
// but we cast it to types for the app usage.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tokens = require('./tokens');

export const palette = tokens.palette as typeof tokens.palette;
export const colors = tokens.colors as typeof tokens.colors;
