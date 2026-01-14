import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useLinkBuilder } from '@react-navigation/native';

import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  
  // Calculate TabBar width - 80% of screen width, max 320px
  const tabBarWidth = Math.min(screenWidth * 0.80, 320);
  
  // Calculate bottom position
  const bottomPosition = Platform.select({
    android: Math.max(insets.bottom, 8) + 16,
    ios: insets.bottom + 16,
    default: 24,
  });

  return (
    <View style={styles.outerContainer}>
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
  const scale = useSharedValue(1);
  
  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 300 });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isFocused ? 1.15 : 1) }]
    }
  });

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused ? 1 : 0, { duration: 200 }),
      transform: [{ scale: withSpring(isFocused ? 1 : 0.5) }]
    }
  });

  // Colors for better contrast
  const iconColor = isFocused ? '#FFFFFF' : '#6B7280';

  return (
    <PlatformPressable
      href={href}
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
    >
      <View style={styles.iconContainer}>
        {/* Active Indicator Background */}
        <Animated.View style={[styles.activeIndicator, animatedIndicatorStyle]} />
        
        <Animated.View style={animatedIconStyle}>
          {options.tabBarIcon ? options.tabBarIcon({ 
            focused: isFocused, 
            color: iconColor,
            size: 26
          }) : null}
        </Animated.View>
      </View>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  // Outer container takes full width and uses flexbox to center
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center', // This centers the TabBar horizontally
    zIndex: 100,
  },
  container: {
    position: 'absolute',
    // width is set dynamically
    // bottom is set dynamically
  },
  tabBarBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 35,
    height: 70,
    width: '100%',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 15,
    // Border for better definition
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2A9D8F',
  }
});

export default TabBar;
