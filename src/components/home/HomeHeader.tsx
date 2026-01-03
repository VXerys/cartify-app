import { Layout } from '@/src/constants/Layout';
import { useAuth } from '@/src/context/AuthContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { formatDate } from '@/src/utils/date';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeHeader() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { containerPadding, moderateScale, verticalScale, isTablet, contentContainerStyle } = useResponsive();
  const [greetingKey, setGreetingKey] = useState('home.goodMorning');
  
  // Get user data from auth context
  const { user } = useAuth();

  // Generate display name from user data
  const displayName = useMemo(() => {
    if (user?.fullName) {
      // Get first name only for header
      return user.fullName.split(' ')[0];
    }
    if (user?.email) {
      // Use email username as fallback
      return user.email.split('@')[0];
    }
    return 'User';
  }, [user]);

  // Generate avatar URL
  const avatarUrl = useMemo(() => {
    if (user?.avatarUrl) {
      return user.avatarUrl;
    }
    // Generate avatar from name
    const name = user?.fullName || user?.email?.split('@')[0] || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2A9D8F&color=fff&size=96`;
  }, [user]);
  
  // Dynamic greeting logic
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingKey('home.goodMorning');
    else if (hour < 18) setGreetingKey('home.goodAfternoon');
    else setGreetingKey('home.goodEvening');
  }, []);

  // Format date using shared utility
  const dateStr = formatDate(new Date(), i18n.language);

  // Dynamic Styles
  const avatarSize = moderateScale(48);
  const onlineSize = moderateScale(12);
  const iconSize = moderateScale(14);
  
  return (
    <View style={[styles.container, { paddingTop: insets.top + verticalScale(8) }]}>
      {/* Background Decor - Scaled */}
      <View style={isTablet ? styles.decorativeCircleTablet1 : styles.decorativeCircle1} />
      <View style={isTablet ? styles.decorativeCircleTablet2 : styles.decorativeCircle2} />

      <View style={[styles.contentRow, contentContainerStyle as import('react-native').ViewStyle, { paddingHorizontal: containerPadding }]}>
        <View style={styles.leftSection}>
            <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8}>
                <Image 
                    source={{ uri: avatarUrl }} 
                    style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]} 
                />
                <View style={[styles.onlineIndicator, { width: onlineSize, height: onlineSize, borderRadius: onlineSize / 2 }]} />
            </TouchableOpacity>
            
            <View style={styles.textContainer}>
                <Animated.Text 
                    entering={FadeInDown.delay(100).springify()} 
                    style={[styles.greeting, { fontSize: moderateScale(13) }]}
                >
                    {t(greetingKey)},
                </Animated.Text>
                <Animated.Text 
                    entering={FadeInDown.delay(200).springify()} 
                    style={[styles.name, { fontSize: moderateScale(18) }]}
                >
                    {displayName}
                </Animated.Text>
            </View>
        </View>

        <Animated.View 
            entering={FadeInDown.delay(300).springify()} 
            style={[styles.dateContainer, { paddingHorizontal: moderateScale(12), paddingVertical: moderateScale(6) }]}
        >
            <MaterialIcons name="event" size={iconSize} color="rgba(255,255,255,0.9)" />
            <Animated.Text style={[styles.date, { fontSize: moderateScale(12) }]}>
              {dateStr}
            </Animated.Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Layout.spacing.m,
    backgroundColor: Layout.colors.primary, 
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    zIndex: 10,
    overflow: 'hidden',
    width: '100%',
    ...Layout.shadows.medium,
  },
  contentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
  decorativeCircle1: {
      position: 'absolute',
      bottom: -30,
      left: -30,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorativeCircle2: {
      position: 'absolute',
      top: -60,
      right: -20, 
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  decorativeCircleTablet1: {
      position: 'absolute',
      bottom: -50,
      left: -50,
      width: 250,
      height: 250,
      borderRadius: 125,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorativeCircleTablet2: {
      position: 'absolute',
      top: -100,
      right: -40, 
      width: 350,
      height: 350,
      borderRadius: 175,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    padding: 3, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 50, 
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatar: {
    backgroundColor: '#E1E1E1',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#2ECC71',
    borderWidth: 2,
    borderColor: Layout.colors.primary,
  },
  textContainer: {
    justifyContent: 'center',
  },
  greeting: {
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)', 
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  name: {
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.15)', 
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      gap: 6,
  },
  date: {
      fontWeight: '600',
      color: '#FFF',
      letterSpacing: 0.5,
  },
});
