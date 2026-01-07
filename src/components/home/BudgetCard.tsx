import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import { useResponsive } from '@/src/hooks/useResponsive';
import { formatCurrency } from '@/src/utils/currency';
import { useTranslation } from 'react-i18next';

import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface BudgetCardProps {
  budget: number;
  spent: number;
  children?: React.ReactNode;
  onEditBudget?: () => void;
}

export function BudgetCard({ budget, spent, children, onEditBudget }: BudgetCardProps) {
  const { t } = useTranslation();
  const { moderateScale, horizontalScale, verticalScale, isTablet, contentContainerStyle } = useResponsive();
  const percentage = Math.min(spent / budget, 1);
  const progressWidth = useSharedValue(0);
  
  // Dynamic color logic
  let progressColor = '#FFFFFF';
  let progressShadowColor = 'rgba(255, 255, 255, 0.5)';
  
  if (percentage > 0.85) {
      progressColor = '#FF8A8A'; // Softer Red
      progressShadowColor = 'rgba(255, 138, 138, 0.6)';
  } else if (percentage > 0.5) {
      progressColor = '#FFD93D'; // Yellow
      progressShadowColor = 'rgba(255, 217, 61, 0.6)';
  }

  useEffect(() => {
    progressWidth.value = withDelay(500, withSpring(percentage * 100, {
        mass: 1,
        damping: 15,
        stiffness: 100,
    }));
  }, [percentage]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
      backgroundColor: progressColor,
      shadowColor: progressShadowColor,
      shadowOpacity: 0.6,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 0 },
      elevation: 4, 
    };
  });

  return (
    <Animated.View 
        entering={FadeInDown.delay(100).springify()} 
        style={[styles.containerShadow, contentContainerStyle as any]} 
    >
      <Animated.View
        style={[
            styles.card, 
            { 
                backgroundColor: Layout.colors.primary,
                paddingHorizontal: moderateScale(20), 
                paddingVertical: moderateScale(18) 
            }
        ]}
      >
        {/* Premium Background Container */}
        <View style={styles.backgroundContainer}>
          <View style={styles.gradientOverlay} />
          
          {/* Mesh gradients - aligned with header */}
          <View style={[styles.meshGradient, styles.meshGradient1]} />
          <View style={[styles.meshGradient, styles.meshGradient2]} />
          
          {/* Grid pattern */}
          <View style={styles.gridPattern}>
            {Array.from({ length: 3 }).map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLine, styles.gridLineHorizontal, { top: `${(i + 1) * 33}%` }]} />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLine, styles.gridLineVertical, { left: `${(i + 1) * 20}%` }]} />
            ))}
          </View>
          
          {/* Glowing orbs */}
          <View style={[styles.glowOrb, styles.glowOrb1]} />
          <View style={[styles.glowOrb, styles.glowOrb2]} />
        </View>

        {/* Top Section: Title & Edit */}
        <View style={styles.topRow}>
          <View>
            <Animated.Text 
                entering={FadeInDown.delay(200).springify()} 
                style={[styles.label, { fontSize: moderateScale(11) }]}
            >
                {t('home.monthlyBudget')}
            </Animated.Text>
            <Animated.Text 
                entering={FadeInDown.delay(300).springify()} 
                style={[styles.budgetAmount, { fontSize: moderateScale(26) }]}
            >
                {formatCurrency(budget)}
            </Animated.Text>
          </View>
          <TouchableOpacity 
            style={[styles.walletButton, { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(12) }]} 
            onPress={onEditBudget}
            activeOpacity={0.8}
          >
             <IconSymbol 
              size={moderateScale(18)} 
              name="slider.horizontal.3" 
              color={Layout.colors.primary} 
             />
          </TouchableOpacity>
        </View>

        {/* Progress Section */}
        <View style={styles.progressContainer}>
          <View style={styles.infoRow}>
            <Animated.Text entering={FadeInDown.delay(400)} style={[styles.spentText, { fontSize: moderateScale(13) }]}>
                {t('home.totalSpent')} <Text style={styles.spentAmountHighlight}>{formatCurrency(spent)}</Text>
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(500)} style={[styles.percentageText, { fontSize: moderateScale(13) }]}>
                {Math.round(percentage * 100)}%
            </Animated.Text>
          </View>
          
          <View style={[styles.progressBarBg, { height: moderateScale(6), borderRadius: moderateScale(3) }]}>
            <Animated.View style={[styles.progressBarFill, progressStyle, { borderRadius: moderateScale(3) }]} />
          </View>
        </View>

        {children && (
             <Animated.View entering={FadeInDown.delay(600)} style={styles.childrenContainer}>
                {children}
             </Animated.View>
        )}
        
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  containerShadow: {
    // Margins should be handled by the parent container to prevent "widening" issues
    shadowColor: "#2A9D8F",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderRadius: 24,
    backgroundColor: 'transparent',
    width: '100%', // Ensure it takes available width from parent
  },
  card: {
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  // Premium Background Styles
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Layout.colors.primary,
  },
  meshGradient: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.65,
  },
  meshGradient1: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -60,
    left: -50,
  },
  meshGradient2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -60,
    right: -40,
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  gridLineHorizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineVertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  glowOrb1: {
    width: 110,
    height: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    top: -25,
    left: -35,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 35,
    elevation: 14,
  },
  glowOrb2: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    bottom: -20,
    right: -30,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    zIndex: 1,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  budgetAmount: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  walletButton: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "rgba(0,0,0,0.15)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  progressContainer: {
    zIndex: 1,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  spentText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  spentAmountHighlight: {
      fontWeight: '700',
      color: '#FFF',
  },
  percentageText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '700',
  },
  progressBarBg: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  childrenContainer: {
      marginTop: 10,
      zIndex: 1,
  }
});
