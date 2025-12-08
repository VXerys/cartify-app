import { Layout } from '@/src/constants/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeHeader() {
  const insets = useSafeAreaInsets();
  const [greeting, setGreeting] = useState('Good Morning');
  
  // Dynamic greeting logic
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Format date: "Mon, 12 Oct"
  const dateStr = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

      <View style={styles.contentContainer}>
        <View style={styles.leftSection}>
            <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8}>
                <Image 
                    source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} 
                    style={styles.avatar} 
                />
                <View style={styles.onlineIndicator} />
            </TouchableOpacity>
            
            <View style={styles.textContainer}>
                <Animated.Text 
                    entering={FadeInDown.delay(100).springify()} 
                    style={styles.greeting}
                >
                    {greeting},
                </Animated.Text>
                <Animated.Text 
                    entering={FadeInDown.delay(200).springify()} 
                    style={styles.name}
                >
                    Sarah Johnson
                </Animated.Text>
            </View>
        </View>

        <Animated.View 
            entering={FadeInDown.delay(300).springify()} 
            style={styles.dateContainer}
        >
            <MaterialIcons name="event" size={14} color="rgba(255,255,255,0.9)" />
            <Animated.Text style={styles.date}>
              {dateStr}
            </Animated.Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.spacing.m,
    paddingBottom: Layout.spacing.m,
    paddingTop: Layout.spacing.s, // Handled by inline style but good to have base
    backgroundColor: Layout.colors.primary, 
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    zIndex: 10,
    overflow: 'hidden',
    ...Layout.shadows.medium,
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
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E1E1E1',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2ECC71',
    borderWidth: 2,
    borderColor: Layout.colors.primary,
  },
  textContainer: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)', 
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.15)', 
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      gap: 6,
  },
  date: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFF',
      letterSpacing: 0.5,
  },
});
