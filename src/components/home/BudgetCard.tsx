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
  if (percentage > 0.85) progressColor = '#FF6B6B'; // Red warning
  else if (percentage > 0.5) progressColor = '#FFD93D'; // Yellow caution

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
        {/* Decorative background circle for premium feel */}
        <View style={styles.decorativeCircle} />

        <View style={styles.header}>
          <View>
            <Animated.Text 
                entering={FadeInDown.delay(200).springify()} 
                style={styles.label}
            >
                Monthly Budget
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
              size={22} 
              name="wallet.pass.fill" 
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
                Spent this month
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
            {Math.round(percentage * 100)}% of budget used
          </Animated.Text>
        </View>

        {/* Stats Row Container - handled by children but styled via prop containment if needed */}
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
    marginTop: 4, // Reduced top margin
    marginBottom: 12,
    ...Layout.shadows.float, 
    borderRadius: 24, // Slightly tighter radius
    backgroundColor: 'transparent', 
  },
  card: {
    borderRadius: 24,
    padding: 18, // Reduced padding
    position: 'relative',
    overflow: 'hidden', 
  },
  decorativeCircle: {
      position: 'absolute',
      top: -50,
      right: -50,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12, // Reduced margin
    zIndex: 1,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14, // Slightly smaller
    fontWeight: '500',
    marginBottom: 2, // Tighter
    letterSpacing: 0.5,
  },
  budgetAmount: {
    color: '#FFFFFF',
    fontSize: 28, // Reduced from 34
    fontWeight: '800',
    letterSpacing: -1,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  walletButton: {
    
    backgroundColor: '#FFFFFF',
    width: 38, // Smaller button
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 12, // Reduced padding
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6, // Reduced margin
  },
  spentLabel: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 13,
    fontWeight: '500',
  },
  spentAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  progressBarBg: {
    height: 6, // Slightly thinner
    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6, // Reduced margin
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentageText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  childrenContainer: {
      marginTop: 10, // Tighter spacing
      zIndex: 1,
  }
});
