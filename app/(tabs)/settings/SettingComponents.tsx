import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Layout } from '@/src/constants/Layout';
import React from 'react';
import { Pressable, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { styles } from './settings.styles';
import { SettingItemProps, SettingSectionProps } from './settings.types';

const COLORS = Layout.colors;

// Animated Pressable Component
export const AnimatedPressable = ({ onPress, style, children }: any) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.98, { duration: 100 });
        opacity.value = withTiming(0.7, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
        opacity.value = withTiming(1, { duration: 150 });
      }}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
};

// Setting Section Component
export const SettingSection: React.FC<SettingSectionProps> = ({ title, children, moderateScale }) => {
  return (
    <View style={[styles.section, { marginBottom: moderateScale(24) }]}>
      <Text
        style={[
          styles.sectionTitle,
          { fontSize: moderateScale(13), marginLeft: moderateScale(12), marginBottom: moderateScale(10) },
        ]}
      >
        {title}
      </Text>
      <View style={[styles.sectionContent, { borderRadius: moderateScale(20) }]}>{children}</View>
    </View>
  );
};

// Setting Item Component
export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  value,
  isSwitch,
  onPress,
  showChevron = true,
  textColor = COLORS.text,
  iconColor = COLORS.primary,
  moderateScale,
}) => (
  <TouchableOpacity
    style={[styles.item, { padding: moderateScale(18) }]}
    onPress={onPress}
    disabled={isSwitch}
    activeOpacity={0.7}
  >
    <View style={[styles.iconContainer, { marginRight: moderateScale(12) }]}>
      <IconSymbol name={icon} size={moderateScale(24)} color={iconColor} />
    </View>
    <View style={styles.itemContent}>
      <Text style={[styles.itemLabel, { fontSize: moderateScale(16), color: textColor }]}>{label}</Text>
      <View style={[styles.itemRight, { gap: moderateScale(8) }]}>
        {value && typeof value === 'string' && (
          <Text style={[styles.itemValue, { fontSize: moderateScale(15) }]}>{value}</Text>
        )}
        {isSwitch && (
          <Switch
            value={value as boolean}
            onValueChange={onPress}
            trackColor={{ false: '#767577', true: COLORS.primary }}
            thumbColor={'#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        )}
        {showChevron && !isSwitch && (
          <IconSymbol name="chevron.right" size={moderateScale(20)} color={COLORS.subtext} />
        )}
      </View>
    </View>
  </TouchableOpacity>
);
