import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Cartify Responsive Utils
 * Helps adapt UI elements to various screen sizes.
 */

// Based on standard iPhone 11/12/13 width (approx 375-414pt)
const BASE_WIDTH = 375;

/**
 * Width Percentage
 * Converts percentage of screen width to DP
 * @param percentage string or number (e.g. 50 or "50%")
 */
export const wp = (percentage: number | string): number => {
  const value = (typeof percentage === 'number' ? percentage : parseFloat(percentage));
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * value) / 100);
};

/**
 * Height Percentage
 * Converts percentage of screen height to DP
 * @param percentage string or number
 */
export const hp = (percentage: number | string): number => {
  const value = (typeof percentage === 'number' ? percentage : parseFloat(percentage));
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * value) / 100);
};

/**
 * Normalize Size
 * Scales a size based on the screen width relative to base width.
 * Useful for fonts and icons to ensure consistency across small vs large phones.
 */
export const normalize = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export const screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};
