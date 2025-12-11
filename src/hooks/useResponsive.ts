import { PixelRatio, Platform, useWindowDimensions } from 'react-native';

// Base dimensions for standard mobile design (iPhone 11 Pro / X reference)
const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  const isLandscape = width > height;
  const isTablet = width >= 768; 
  const isSmallDevice = width < 375; 

  // Width - Percentage to DP
  const wp = (percentage: number) => {
    const value = (percentage * width) / 100;
    return Math.round(value);
  };

  // Height - Percentage to DP
  const hp = (percentage: number) => {
    const value = (percentage * height) / 100;
    return Math.round(value);
  };

  // Horizontal Scale: Resizes linearly based on width
  const horizontalScale = (size: number) => {
    return (width / GUIDELINE_BASE_WIDTH) * size;
  };

  // Vertical Scale: Resizes linearly based on height
  const verticalScale = (size: number) => {
    return (height / GUIDELINE_BASE_HEIGHT) * size;
  };

  // Moderate Scale: Resizes with a damping factor.
  // factor 0.5 (default) allows some resizing but prevents elements from becoming too large/small.
  const moderateScale = (size: number, factor = 0.5) => {
    return size + (horizontalScale(size) - size) * factor;
  };

  // Responsive Font: Respects system font scale but clamps it for layout safety
  const responsiveFont = (size: number, factor = 0.5) => {
     const newSize = moderateScale(size, factor);
     const fontScale = PixelRatio.getFontScale();
     // Clamp max font scale to avoids layout breakage on devices with "Largest" accessibility text
     const maxScale = 1.35; 
     const effectiveScale = fontScale > maxScale ? maxScale : fontScale;
     
     // On Android, font scaling can differ, but dividing by fontScale and multiplying by effectiveScale 
     // helps normalize extreme cases while still respecting user intent locally.
     return newSize / fontScale * effectiveScale; 
  };
  
  // Standard padding for containers - Use a consistent value (e.g., 20 or 24)
  // We use wp for padding to keep it proportional on very small/large screens if needed, 
  // or just moderateScale for safety.
  const containerPadding = moderateScale(20);
  
  // Helper for tablet/wide screen layouts to center content
  // IMPORTANT: For mobile, we usually want width: '100%' but we DO NOT want to force it 
  // if we are using margins inside the component.
  const contentContainerStyle = isTablet ? {
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center' as const,
  } : {
      width: '100%'
  };

  return {
    width,
    height,
    isSmallDevice,
    isTablet,
    isLandscape,
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
    wp,
    hp,
    horizontalScale,
    verticalScale,
    moderateScale,
    responsiveFont,
    containerPadding,
    contentContainerStyle
  };
};
