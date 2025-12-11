import { Layout } from '@/src/constants/Layout';
import { useResponsive } from '@/src/hooks/useResponsive';
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
  categories: { key: string; label: string }[];
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

const CategoryChip = ({ categoryKey, label, isSelected, onSelect, index }: { 
    categoryKey: string, 
    label: string,
    isSelected: boolean, 
    onSelect: (c: string) => void,
    index: number 
}) => {
    const { moderateScale } = useResponsive();
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

        return {
            backgroundColor,
            borderColor,
            elevation: withTiming(isSelected ? 4 : 1, { duration: 300 }),
            shadowOpacity: withTiming(isSelected ? 0.2 : 0.1, { duration: 300 }),
            shadowRadius: withTiming(isSelected ? 8 : 3, { duration: 300 }),
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

    return (
        <AnimatedTouchableOpacity
            activeOpacity={0.8}
            onPress={() => onSelect(categoryKey)}
            style={[
                styles.chip, 
                rStyle,
                {
                    paddingHorizontal: moderateScale(16),
                    paddingVertical: moderateScale(8),
                    borderRadius: moderateScale(20),
                }
            ]}
        >
            <MaterialIcons 
                name={getIcon(categoryKey)} 
                size={moderateScale(18)} 
                color={isSelected ? '#FFF' : '#666'} 
                style={{ marginRight: moderateScale(6) }}
            />
            <Animated.Text style={[styles.text, rTextStyle, { fontSize: moderateScale(14) }]}>
                {label}
            </Animated.Text>
        </AnimatedTouchableOpacity>
    );
};

export function CategorySlider({ categories, selectedCategory, onSelectCategory }: CategorySliderProps) {
  const { containerPadding, moderateScale } = useResponsive();

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
            styles.scrollContent, 
            { 
                paddingHorizontal: containerPadding, 
                gap: moderateScale(12) 
            }
        ]}
      >
        {categories.map((item, index) => (
             <Animated.View 
                key={item.key} 
                entering={FadeInRight.delay(index * 100).springify()}
            >
                <CategoryChip 
                    categoryKey={item.key}
                    label={item.label}
                    isSelected={selectedCategory === item.key}
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
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 12, 
    paddingTop: 4, 
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    fontWeight: '600',
  },
});
