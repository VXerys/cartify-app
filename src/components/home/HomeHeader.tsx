import { Layout } from '@/src/constants/Layout';
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
      <View style={styles.contentContainer}>
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
           <Animated.Text 
            entering={FadeInDown.delay(300).springify()} 
            style={styles.date}
          >
            {dateStr}
          </Animated.Text>
        </View>

        <Animated.View 
            entering={FadeInDown.delay(400).springify()} 
            style={styles.rightSection}
        >


            <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8}>
                <Image 
                    source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} 
                    style={styles.avatar} 
                />
                <View style={styles.onlineIndicator} />
            </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.spacing.l,
    paddingBottom: Layout.spacing.m,
    backgroundColor: '#F8F9FA', // Keep light background
    zIndex: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginTop: 2,
    marginBottom: 4,
  },
  date: {
      fontSize: 13,
      fontWeight: '600',
      color: Layout.colors.primary, // Integrating brand color
      textTransform: 'uppercase',
      letterSpacing: 0.5,
  },
  rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 4, 
  },
  iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      // Subtle shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.03)',
  },
  badge: {
      position: 'absolute',
      top: 10,
      right: 12,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FF5252',
      borderWidth: 1.5,
      borderColor: '#FFF',
  },
  avatarContainer: {
    position: 'relative',
    padding: 3, // Create a border effect
    backgroundColor: 'rgba(255,255,255,0.8)', // Semi-transparent
    borderRadius: 18, // Squircle-ish
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E1E1E1',
  },
  onlineIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2ECC71',
    borderWidth: 2,
    borderColor: '#FFF',
  },
});
