import { Dimensions, PixelRatio, Platform } from 'react-native';

const DEFAULT_WINDOW = { width: 375, height: 812 };
const windowSize = (() => {
  try {
    const dims = (Dimensions as any)?.get?.('window');
    if (dims && typeof dims.width === 'number' && typeof dims.height === 'number') {
      return dims as { width: number; height: number };
    }
  } catch {
    // ignore
  }
  return DEFAULT_WINDOW;
})();

const { width, height } = windowSize;

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  colors: {
    primary: '#2A9D8F',
    secondary: '#10B981',
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#1C1C1E',
    subtext: '#8E8E93',
    border: '#E5E5EA',
    danger: '#EF4444',
    success: '#34C759',
    placeholder: '#9CA3AF',
  },
  spacing: {
      xs: 4,
      s: 8,
      m: 16,
      l: 24,
      xl: 32,
      xxl: 40,
  },
  borderRadius: {
      s: 8,
      m: 16,
      l: 24,
      xl: 32,
  },
  shadows: {
      start: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
      },
      medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
      },
      float: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
      }
  },
  normalize: (size: number) => {
    const newSize = size * (width / 375); // based on iPhone X width
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
  },
  scale,
  verticalScale,
  moderateScale
};
