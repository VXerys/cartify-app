import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import { formatCurrency } from '@/src/utils/currency';

import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring
} from 'react-native-reanimated';

interface BudgetCardProps {
  budget: number;
  spent: number;
  children?: React.ReactNode;
  onEditBudget?: () => void;
}

export function BudgetCard({ budget, spent, children, onEditBudget }: BudgetCardProps) {
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
      // Elevation for Android glow effect not supported directly on View consistently, but helpful
      elevation: 4, 
    };
  });

  return (
    <Animated.View 
        entering={FadeInDown.delay(100).springify()} 
        style={styles.containerShadow}
    >
      <Animated.View
        style={[styles.card, { backgroundColor: '#2A9D8F' }]}
      >
        {/* Decorative background elements for premium feel */}
        <View style={styles.decorativeCircle} />
        <View style={styles.decorativeCircleSmall} />

        <View style={styles.header}>
          <View>
            <Animated.Text 
                entering={FadeInDown.delay(200).springify()} 
                style={styles.label}
            >
                MONTHLY BUDGET
            </Animated.Text>
            <Animated.Text 
                entering={FadeInDown.delay(300).springify()} 
                style={styles.budgetAmount}
            >
                {formatCurrency(budget)}
            </Animated.Text>
          </View>
          <TouchableOpacity 
            style={styles.walletButton} 
            onPress={onEditBudget}
            activeOpacity={0.8}
          >
             <IconSymbol 
              size={20} 
              name="slider.horizontal.3" 
              color={Layout.colors.primary} 
             />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Animated.Text 
                entering={FadeInDown.delay(400)} 
                style={styles.spentLabel}
            >
                Total Spent
            </Animated.Text>
            <Animated.Text 
                entering={FadeInDown.delay(500)} 
                style={styles.spentAmount}
            >
                {formatCurrency(spent)}
            </Animated.Text>
          </View>
          
          <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBarFill, progressStyle]} />
          </View>
          
          <Animated.Text 
            entering={FadeInUp.delay(600)} 
            style={styles.percentageText}
          >
            {Math.round(percentage * 100)}% of your budget used
          </Animated.Text>
        </View>

        {children && (
             <Animated.View entering={FadeInDown.delay(700)} style={styles.childrenContainer}>
                {children}
             </Animated.View>
        )}
        
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  containerShadow: {
    marginHorizontal: 20,
    marginTop: 50,
    marginBottom: 12,
    shadowColor: "#2A9D8F", // Colored shadow
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
    borderRadius: 28,
    backgroundColor: 'transparent',
  },
  card: {
    borderRadius: 28,
    padding: 24,
    position: 'relative',
    overflow: 'hidden', 
  },
  decorativeCircle: {
      position: 'absolute',
      top: -60,
      right: -60,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      zIndex: 0,
  },
  decorativeCircleSmall: {
      position: 'absolute',
      bottom: -40,
      left: -40,
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    zIndex: 1,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12, 
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  budgetAmount: {
    color: '#FFFFFF',
    fontSize: 32, // Large and readable
    fontWeight: '800',
    letterSpacing: -1,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  walletButton: {
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  progressContainer: {
    zIndex: 1,
    marginBottom: 4,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  spentLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  spentAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  childrenContainer: {
      marginTop: 12,
      zIndex: 1,
  }
});
