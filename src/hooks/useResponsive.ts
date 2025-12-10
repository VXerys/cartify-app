import { PixelRatio, Platform, useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  // Standard breakpoints
  const isSmallDevice = width < 375;
  const isTablet = width >= 768;
  const isLandscape = width > height;

  // Responsive scaling utility
  // Base width of 375 (iPhone X/11/12/13 Pro etc standard width)
  const scale = width / 375;
  
  const normalize = (size: number) => {
    const newSize = size * scale; 
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
  }

  // Clamped responsive sizing (good for font sizes so they don't get huge on tablets)
  const clampedNormalize = (size: number, factor = 0.5) => {
      // factor: 0.5 means it only scales half as much as the screen width increases
      // 0 means no scaling (fixed), 1 means full scaling
      if (width >= 768) {
          // On tablets, scale less aggressively or use a fixed "large phone" base
          return size * 1.5; 
      }
      return size + (normalize(size) - size) * factor;
  };

  const containerPadding = isTablet ? 48 : 24;
  const maxContentWidth = 800; // Constrain width on large screens

  return {
    width,
    height,
    isSmallDevice,
    isTablet,
    isLandscape,
    normalize,
    clampedNormalize,
    containerPadding,
    maxContentWidth,
    centerContentStyle: (isTablet ? {
        width: '100%',
        maxWidth: maxContentWidth,
        alignSelf: 'center',
    } : {
        width: '100%',
    }) as import('react-native').ViewStyle
  };
};
