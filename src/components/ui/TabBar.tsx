import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder, useTheme } from "@react-navigation/native";

import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  const insets = useSafeAreaInsets();

  // In release/EAS builds Android can report a larger bottom inset (gesture/nav bar).
  // We want a consistent "floating" margin without pushing the bar too far up.
  const bottomPadding = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.outer, { paddingBottom: bottomPadding + 10 }]}>
      <View style={[styles.container]}>
        <View
          style={[styles.blur, { backgroundColor: "rgba(255, 255, 255, 0.9)" }]}
        >
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
                  type: "tabPress",
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
                  type: "tabLongPress",
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
                  label={typeof label === "string" ? label : route.name}
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
  href,
}: {
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
  label: string;
  href: string | undefined;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 300 });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isFocused ? 1.1 : 1) }],
    };
  });

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused ? 1 : 0, { duration: 200 }),
      transform: [{ scale: withSpring(isFocused ? 1 : 0.5) }],
    };
  });

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
        <Animated.View
          style={[styles.activeIndicator, animatedIndicatorStyle]}
        />

        <Animated.View style={animatedIconStyle}>
          {/* We expect tabBarIcon to be a function provided in _layout that returns the IconSymbol */}
          {options.tabBarIcon
            ? options.tabBarIcon({
                focused: isFocused,
                color: isFocused ? "#FFFFFF" : "#8E8E93", // White when selected, gray when not
                size: 24,
              })
            : null}
        </Animated.View>
      </View>

      {/* Optional Label - uncomment if user wants labels */}
      {/* 
            <Text style={{ 
                color: isFocused ? '#1A1A1A' : '#8E8E93', 
                fontSize: 10,
                marginTop: 4,
                fontWeight: isFocused ? '600' : '400'
            }}>
                {label}
            </Text> 
            */}
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: "transparent",
    paddingTop: 10,
    paddingHorizontal: 80,
  },
  container: {
    width: "100%",
    // Provide shadow for depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderRadius: 35,
    overflow: "hidden", // Clip the BlurView
  },
  blur: {
    width: "100%",
    height: 70, // Fixed height for consistency
  },
  tabsContainer: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIndicator: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2A9D8F", // Active pill color (Black)
  },
});

export default TabBar;
