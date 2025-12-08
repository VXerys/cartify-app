import { Layout } from '@/src/constants/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInRight,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface CategorySliderProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const getIcon = (category: string): keyof typeof MaterialIcons.glyphMap => {
    switch (category.toLowerCase()) {
        case 'food': return 'restaurant';
        case 'drink': return 'local-cafe';
        case 'fruit': return 'local-florist';
        case 'snacks': return 'fastfood'; 
        case 'household': return 'home';
        case 'other': return 'category';
        default: return 'apps';
    }
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CategoryChip = ({ category, isSelected, onSelect, index }: { 
    category: string, 
    isSelected: boolean, 
    onSelect: (c: string) => void,
    index: number 
}) => {
    const progress = useSharedValue(isSelected ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(isSelected ? 1 : 0, { duration: 300 });
    }, [isSelected]);

    const rStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ['#FFF', Layout.colors.primary]
        );

        const borderColor = interpolateColor(
            progress.value,
            [0, 1],
            ['rgba(0,0,0,0.05)', Layout.colors.primary]
        );

        // Animate elevation/shadow
        // shadowStart (elevation 1) -> shadowMedium (elevation 5)
        const elevation = isSelected ? 5 : 1; 

        return {
            backgroundColor,
            borderColor,
            // Reanimated might not interpolate elevation perfectly on all android versions
            // but toggling it here inside the hook ensures it syncs with other props.
            // For smoother shadow transition, we stick to standard props or simple logic.
            elevation: withTiming(elevation, { duration: 300 }),
            shadowOpacity: withTiming(isSelected ? 0.2 : 0.1, { duration: 300 }),
            shadowRadius: withTiming(isSelected ? 10 : 3, { duration: 300 }),
        };
    });

    const rTextStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            progress.value,
            [0, 1],
            ['#666', '#FFF']
        );
        return { color };
    });



    // We can't easily animate the icon color directly via style prop on the Icon component without a wrapper.
    // Instead, we will rely on the re-render for the icon color, or wrap it.
    // Since Icon color is a prop, not a style, we usually just swap it. 
    // However, to be "smooth", we can overlay two icons or just accept the quick color swap. 
    // Given usage, quick swap on icon color is usually acceptable if background transitions smoothly.
    // Let's stick to simple prop change for Icon color to avoid complexity, 
    // but the background/border/shadow MUST be smooth.

    return (
        <AnimatedTouchableOpacity
            activeOpacity={0.8}
            onPress={() => onSelect(category)}
            style={[styles.chip, rStyle]}
        >
             {/* 
                For perfect icon color transition, we would need an AnimatedIcon. 
                But passing interpolated string to color prop is tricky in vanilla Reanimated without createAnimatedComponent on the Icon.
                Let's use a simple conditional for now, the background swipe is the most important part.
             */}
            <MaterialIcons 
                name={getIcon(category)} 
                size={18} 
                color={isSelected ? '#FFF' : '#666'} 
                style={{ marginRight: 6 }}
            />
            <Animated.Text style={[styles.text, rTextStyle]}>
                {category}
            </Animated.Text>
        </AnimatedTouchableOpacity>
    );
};

export function CategorySlider({ categories, selectedCategory, onSelectCategory }: CategorySliderProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}

      >
        {categories.map((category, index) => (
             <Animated.View 
                key={category} 
                entering={FadeInRight.delay(index * 100).springify()}
            >
                <CategoryChip 
                    category={category}
                    isSelected={selectedCategory === category}
                    onSelect={onSelectCategory}
                    index={index}
                />
            </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.spacing.l,
    gap: 12,
    paddingBottom: 12, 
    paddingTop: 4, // Add top padding to avoid clipping top shadow
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    // Base shadow properties for iOS to be overridden by animated styles
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});
