import React from 'react';
import { View } from 'react-native';
import { styles } from './OnboardingScreen.styles';
import { PaginationProps } from './OnboardingScreen.types';

export const OnboardingPagination: React.FC<PaginationProps> = ({ data, currentIndex }) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === currentIndex ? styles.dotActive : styles.dotInactive]}
        />
      ))}
    </View>
  );
};
