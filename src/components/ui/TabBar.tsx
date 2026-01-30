import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useLinkBuilder } from '@react-navigation/native';

import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Theme constants
const COLORS = {
  primary: '#2A9D8F',
  background: '#FFFFFF',
  inactive: '#9CA3AF',
  white: '#FFFFFF',
  shadow: '#1F2937',
};

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  
  // Calculate TabBar width - responsive based on number of tabs
  // Smaller width for fewer tabs, larger for more
  const numTabs = state.routes.length;
  const baseWidth = numTabs <= 3 ? 220 : 280;
  const tabBarWidth = Math.min(screenWidth * 0.65, baseWidth);
  
  // Calculate bottom position - consistent spacing from bottom
  const bottomPosition = Platform.select({
    android: Math.max(insets.bottom, 16) + 24,
    ios: Math.max(insets.bottom, 16) + 16,
    default: 32,
  });

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View 
        style={[
          styles.container, 
          { 
            bottom: bottomPosition,
            width: tabBarWidth,
          }
        ]}
      >
        <View style={styles.tabBarBackground}>
          <View style={styles.tabsContainer}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate(route.name, route.params);
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };

              return (
                <TabItem
                  key={route.key}
                  isFocused={isFocused}
                  options={options}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  label={typeof label === 'string' ? label : route.name}
                  href={buildHref(route.name, route.params)}
                />
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

function TabItem({ 
  isFocused, 
  options, 
  onPress, 
  onLongPress, 
  label,
  href
}: { 
  isFocused: boolean, 
  options: any, 
  onPress: () => void, 
  onLongPress: () => void,
  label: string,
  href: string | undefined
}) {
  const progress = useSharedValue(isFocused ? 1 : 0);
  
  useEffect(() => {
    progress.value = withSpring(isFocused ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isFocused, progress]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      progress.value,
      [0, 1],
      [1, 1.1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale }]
    };
  });

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ 
        scale: interpolate(
          progress.value,
          [0, 1],
          [0.6, 1],
          Extrapolation.CLAMP
        )
      }],
    };
  });

  // Icon color based on focus state
  const iconColor = isFocused ? COLORS.white : COLORS.inactive;

  return (
    <PlatformPressable
      href={href}
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      android_ripple={{ color: 'transparent' }}
    >
      <View style={styles.iconContainer}>
        {/* Active Indicator Background - Circular with gradient effect */}
        <Animated.View style={[styles.activeIndicator, animatedIndicatorStyle]}>
          <View style={styles.activeIndicatorInner} />
        </Animated.View>
        
        {/* Icon */}
        <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
          {options.tabBarIcon ? options.tabBarIcon({ 
            focused: isFocused, 
            color: iconColor,
            size: 24
          }) : null}
        </Animated.View>
      </View>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  // Outer container - full width, centered
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  // Main container - positioned at bottom
  container: {
    position: 'absolute',
  },
  // TabBar background - pill shape with shadow
  tabBarBackground: {
    backgroundColor: COLORS.background,
    borderRadius: 32,
    height: 64,
    width: '100%',
    // Enhanced shadow for depth
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    // Android elevation
    elevation: 12,
    // Subtle border for definition
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  // Container for all tabs
  tabsContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 12,
  },
  // Individual tab item
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    maxWidth: 64,
  },
  // Icon container with fixed size
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Active indicator background circle
  activeIndicator: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    // Subtle inner shadow effect
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  // Inner circle for slight gradient effect
  activeIndicatorInner: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  // Icon wrapper for proper positioning
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabBar;